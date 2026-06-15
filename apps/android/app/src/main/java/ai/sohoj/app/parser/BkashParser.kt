package ai.sohoj.app.parser

import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

enum class TxnType {
    CASH_IN, CASH_OUT, SEND_MONEY_SENT, SEND_MONEY_RECEIVED,
    MERCHANT_PAYMENT, CHARGE, BALANCE_UPDATE
}

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

/**
 * Deterministic bKash parser. Pure, side-effect free, no network, no LLM.
 * Returns only structured fields — never the raw message, OTP, or PIN.
 * Returns null for anything that is not a recognised bKash transaction.
 */
object BkashParser {

    private val DATE_FMT: DateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")

    private const val AMT = """([\d,]+\.\d{2})"""
    private const val ID = """([A-Z0-9]+)"""
    private const val DT = """(\d{2}/\d{2}/\d{4} \d{2}:\d{2})"""
    private const val PARTY = """(\d{6,15})"""

    private data class Rule(val regex: Regex, val build: (MatchResult) -> ParsedTransaction)

    private val rules: List<Rule> = listOf(
        Rule(Regex("""You have received Tk $AMT from $PARTY\. Fee Tk $AMT\. Balance Tk $AMT\. TrxID $ID at $DT""")) { m ->
            tx(TxnType.SEND_MONEY_RECEIVED, m[1], m[3], m[4], m[2], m[5], m[6], Confidence.HIGH)
        },
        Rule(Regex("""Payment of Tk $AMT to (.+?) is successful\. Balance Tk $AMT\. TrxID $ID at $DT""")) { m ->
            tx(TxnType.MERCHANT_PAYMENT, m[1], "0", m[3], m[2].trim(), m[4], m[5], Confidence.HIGH)
        },
        Rule(Regex("""Cash In Tk $AMT from $PARTY successful\. Fee Tk $AMT\. Balance Tk $AMT\. TrxID $ID at $DT""")) { m ->
            tx(TxnType.CASH_IN, m[1], m[3], m[4], m[2], m[5], m[6], Confidence.HIGH)
        },
        // Inferred (LOW) — awaiting confirming samples
        Rule(Regex("""Cash Out Tk $AMT to $PARTY successful\. Fee Tk $AMT\. Balance Tk $AMT\. TrxID $ID at $DT""")) { m ->
            tx(TxnType.CASH_OUT, m[1], m[3], m[4], m[2], m[5], m[6], Confidence.LOW)
        },
        Rule(Regex("""(?:Send Money|You have sent) Tk $AMT to $PARTY\.? (?:is )?successful\.? Fee Tk $AMT\. Balance Tk $AMT\. TrxID $ID at $DT""")) { m ->
            tx(TxnType.SEND_MONEY_SENT, m[1], m[3], m[4], m[2], m[5], m[6], Confidence.LOW)
        },
    )

    fun parse(message: String): ParsedTransaction? {
        val text = message.trim()
        if (text.contains("OTP", true) || text.contains("PIN", true) ||
            text.contains("verification code", true)
        ) return null
        for (rule in rules) {
            val m = rule.regex.find(text) ?: continue
            return rule.build(m)
        }
        return null
    }

    private operator fun MatchResult.get(i: Int): String = groupValues[i]

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
