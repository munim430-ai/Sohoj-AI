package ai.sohoj.app

import ai.sohoj.app.analytics.AnalyticsEngine
import ai.sohoj.app.analytics.FinanceRecord
import ai.sohoj.app.parser.TxnType
import org.junit.Assert.assertEquals
import org.junit.Test
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.YearMonth

class AnalyticsEngineTest {

    private fun rec(type: TxnType, amt: String, fee: String, at: LocalDateTime) =
        FinanceRecord(type, BigDecimal(amt), BigDecimal(fee), at)

    private val day = LocalDate.of(2026, 6, 8)
    private val records = listOf(
        rec(TxnType.SEND_MONEY_RECEIVED, "20000.00", "0.00", day.atTime(13, 14)),
        rec(TxnType.MERCHANT_PAYMENT, "1545.26", "0.00", day.atTime(21, 27)),
        rec(TxnType.CASH_IN, "2000.00", "0.00", day.plusDays(5).atTime(13, 44)),
        rec(TxnType.CASH_OUT, "500.00", "9.00", day.atTime(9, 0)),
    )

    @Test fun dailySummaryIsDeterministic() {
        val s = AnalyticsEngine.daily(records, day) // excludes the +5 day cash_in
        assertEquals(BigDecimal("20000.00"), s.totalReceived)        // received money
        assertEquals(BigDecimal("2045.26"), s.totalSent)             // 1545.26 + 500.00
        assertEquals(BigDecimal("9.00"), s.fees)
        assertEquals(BigDecimal("17945.74"), s.net)                  // 20000 - 2045.26 - 9
        assertEquals(3, s.count)
    }

    @Test fun monthlyRollup() {
        val m = AnalyticsEngine.monthly(records, YearMonth.of(2026, 6))
        assertEquals(BigDecimal("22000.00"), m.revenueEstimate)      // 20000 + 2000 cash_in
        assertEquals(BigDecimal("2054.26"), m.expenseEstimate)       // 1545.26 + 500 + 9 fees
        assertEquals(4, m.count)
    }

    @Test fun searchByType() {
        val r = AnalyticsEngine.search(records, type = TxnType.CASH_IN)
        assertEquals(1, r.size)
        assertEquals(BigDecimal("2000.00"), r.first().amount)
    }
}
