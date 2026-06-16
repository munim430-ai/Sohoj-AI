package ai.sohoj.app.analytics

import ai.sohoj.app.parser.TxnType
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.YearMonth

/** Minimal domain record the engine operates on (decoupled from Room/parser). */
data class FinanceRecord(
    val type: TxnType,
    val amount: BigDecimal,
    val fee: BigDecimal,
    val occurredAt: LocalDateTime?,
)

data class Summary(
    val totalReceived: BigDecimal,
    val totalSent: BigDecimal,
    val fees: BigDecimal,
    val net: BigDecimal,
    val count: Int,
)

data class MonthlySummary(
    val revenueEstimate: BigDecimal,
    val expenseEstimate: BigDecimal,
    val netMovement: BigDecimal,
    val count: Int,
)

/**
 * Deterministic financial calculations. The AI assistant reads these numbers;
 * the LLM only phrases them and never computes balances itself.
 */
object AnalyticsEngine {

    private val RECEIVED = setOf(TxnType.CASH_IN, TxnType.SEND_MONEY_RECEIVED)
    private val SENT = setOf(TxnType.CASH_OUT, TxnType.SEND_MONEY_SENT, TxnType.MERCHANT_PAYMENT)
    private val ZERO: BigDecimal = BigDecimal.ZERO.setScale(2)

    fun summarize(records: List<FinanceRecord>): Summary {
        var received = ZERO; var sent = ZERO; var fees = ZERO
        for (r in records) {
            if (r.type in RECEIVED) received += r.amount
            if (r.type in SENT) sent += r.amount
            fees += r.fee
        }
        return Summary(received, sent, fees, received - sent - fees, records.size)
    }

    fun daily(records: List<FinanceRecord>, day: LocalDate): Summary =
        summarize(records.filter { it.occurredAt?.toLocalDate() == day })

    /** Week is the 7-day window [weekStart, weekStart+7). */
    fun weekly(records: List<FinanceRecord>, weekStart: LocalDate): Summary {
        val end = weekStart.plusDays(7)
        return summarize(records.filter {
            val d = it.occurredAt?.toLocalDate() ?: return@filter false
            !d.isBefore(weekStart) && d.isBefore(end)
        })
    }

    fun monthly(records: List<FinanceRecord>, ym: YearMonth): MonthlySummary {
        val s = summarize(records.filter {
            val d = it.occurredAt?.toLocalDate() ?: return@filter false
            YearMonth.from(d) == ym
        })
        return MonthlySummary(
            revenueEstimate = s.totalReceived,
            expenseEstimate = s.totalSent + s.fees,
            netMovement = s.totalReceived - s.totalSent - s.fees,
            count = s.count,
        )
    }

    fun search(
        records: List<FinanceRecord>,
        amount: BigDecimal? = null,
        type: TxnType? = null,
        from: LocalDate? = null,
        to: LocalDate? = null,
    ): List<FinanceRecord> = records.filter { r ->
        (amount == null || r.amount.compareTo(amount) == 0) &&
            (type == null || r.type == type) &&
            (from == null || (r.occurredAt?.toLocalDate()?.isBefore(from) == false)) &&
            (to == null || (r.occurredAt?.toLocalDate()?.isAfter(to) == false))
    }

    fun largest(records: List<FinanceRecord>): FinanceRecord? = records.maxByOrNull { it.amount }

    fun typeBreakdown(records: List<FinanceRecord>): Map<TxnType, BigDecimal> =
        records.groupBy { it.type }.mapValues { (_, v) -> v.fold(ZERO) { a, r -> a + r.amount } }

    fun inRange(records: List<FinanceRecord>, from: LocalDate, to: LocalDate): Summary =
        summarize(records.filter {
            val d = it.occurredAt?.toLocalDate() ?: return@filter false
            !d.isBefore(from) && !d.isAfter(to)
        })
}
