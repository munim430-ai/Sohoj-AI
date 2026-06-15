package ai.sohoj.parser

import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * Deterministic bKash transaction parser.
 *
 * Hard rules:
 *  - Pure, side-effect-free, no network, no LLM. Same input -> same output.
 *  - Returns ONLY structured fields. Never retains the raw message, OTP, or PIN.
 *  - Returns null for anything that is not a recognised bKash transaction
 *    (OTP codes, promos, unrelated SMS) so unrelated messages are never ingested.
 */
enum class TxnType {
    CASH_IN, CASH_OUT, SEND_MONEY_SENT, SEND_MONEY_RECEIVED,
    MERCHANT_PAYMENT, CHARGE, BALANCE_UPDATE
}

/** HIGH = format confirmed from real samples. LOW = pattern inferred, awaiting a confirming sample. */
enum class Confidence { HIGH, LOW }

data class ParsedTransaction(
    val type: TxnType,
    val amount: BigDecimal,
    val fee: BigDecimal,
    val balanceAfter: BigDecimal?,
    val counterparty: String?,
    val trxId: String?,
    val occurredAt: LocalDateTime?,
    val confidence: Confidence,
)

object BkashParser {

    private val DATE_FMT: DateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")

    // Reusable fragments
    private const val AMT = """([\d,]+\.\d{2})"""
    private const val ID = """([A-Z0-9]+)"""
    private const val DT = """(\d{2}/\d{2}/\d{4} \d{2}:\d{2})"""
    private const val PARTY = """(\d{6,15})"""

    private data class Rule(
        val regex: Regex,
        val type: TxnType,
        val confidence: Confidence,
        val build: (MatchResult) -> ParsedTransaction,
    )

    private val rules: List<Rule> = listOf(
        // ── Confirmed from samples ──────────────────────────────────────────
        // "You have received Tk 20,000.00 from 015... . Fee Tk 0.00. Balance Tk 21,461.84. TrxID DF.. at 08/06/2026 13:14"
        Rule(
            Regex("""You have received Tk $AMT from $PARTY\. Fee Tk $AMT\. Balance Tk $AMT\. TrxID $ID at $DT"""),
            TxnType.SEND_MONEY_RECEIVED, Confidence.HIGH,
        ) { m ->
            tx(TxnType.SEND_MONEY_RECEIVED, m.g(1), m.g(3), m.g(4), m.s(2), m.s(5), m.s(6), Confidence.HIGH)
        },
        // "Payment of Tk 1,545.26 to OPTIMUM... is successful. Balance Tk 6,901.58. TrxID DF.. at .."
        Rule(
            Regex("""Payment of Tk $AMT to (.+?) is successful\. Balance Tk $AMT\. TrxID $ID at $DT"""),
            TxnType.MERCHANT_PAYMENT, Confidence.HIGH,
        ) { m ->
            tx(TxnType.MERCHANT_PAYMENT, m.g(1), "0", m.g(3), m.s(2).trim(), m.s(4), m.s(5), Confidence.HIGH)
        },
        // "Cash In Tk 2,000.00 from 017.. successful. Fee Tk 0.00. Balance Tk 4,565.23. TrxID DF.. at .."
        Rule(
            Regex("""Cash In Tk $AMT from $PARTY successful\. Fee Tk $AMT\. Balance Tk $AMT\. TrxID $ID at $DT"""),
            TxnType.CASH_IN, Confidence.HIGH,
        ) { m ->
            tx(TxnType.CASH_IN, m.g(1), m.g(3), m.g(4), m.s(2), m.s(5), m.s(6), Confidence.HIGH)
        },

        // ── Inferred (LOW) — awaiting confirming samples from owner ──────────
        // Cash Out to agent
        Rule(
            Regex("""Cash Out Tk $AMT to $PARTY successful\. Fee Tk $AMT\. Balance Tk $AMT\. TrxID $ID at $DT"""),
            TxnType.CASH_OUT, Confidence.LOW,
        ) { m -> tx(TxnType.CASH_OUT, m.g(1), m.g(3), m.g(4), m.s(2), m.s(5), m.s(6), Confidence.LOW) },
        // Send Money sent
        Rule(
            Regex("""(?:Send Money|You have sent) Tk $AMT to $PARTY\.? (?:is )?successful\.? Fee Tk $AMT\. Balance Tk $AMT\. TrxID $ID at $DT"""),
            TxnType.SEND_MONEY_SENT, Confidence.LOW,
        ) { m -> tx(TxnType.SEND_MONEY_SENT, m.g(1), m.g(3), m.g(4), m.s(2), m.s(5), m.s(6), Confidence.LOW) },
    )

    fun parse(message: String): ParsedTransaction? {
        val text = message.trim()
        // Reject obvious non-transaction / sensitive messages up front.
        if (text.contains("OTP", ignoreCase = true) ||
            text.contains("PIN", ignoreCase = true) ||
            text.contains("verification code", ignoreCase = true)
        ) return null

        for (rule in rules) {
            val m = rule.regex.find(text) ?: continue
            return rule.build(m)
        }
        return null
    }

    // ── helpers ──────────────────────────────────────────────────────────────
    private fun MatchResult.g(i: Int): String = groupValues[i]
    private fun MatchResult.s(i: Int): String = groupValues[i]

    private fun amount(raw: String): BigDecimal = BigDecimal(raw.replace(",", ""))

    private fun maskParty(p: String): String =
        if (p.length >= 7 && p.all { it.isDigit() }) "${p.take(3)}****${p.takeLast(3)}" else p

    private fun tx(
        type: TxnType, amt: String, fee: String, bal: String,
        party: String, trx: String, dt: String, conf: Confidence,
    ) = ParsedTransaction(
        type = type,
        amount = amount(amt),
        fee = amount(fee),
        balanceAfter = bal.takeIf { it.isNotBlank() }?.let { amount(it) },
        counterparty = maskParty(party),
        trxId = trx,
        occurredAt = runCatching { LocalDateTime.parse(dt, DATE_FMT) }.getOrNull(),
        confidence = conf,
    )
}
