package ai.sohoj.app

import ai.sohoj.app.assistant.AssistantEngine
import ai.sohoj.app.assistant.Lang
import ai.sohoj.app.assistant.Metric
import ai.sohoj.app.assistant.Period
import ai.sohoj.app.data.BkashTxnEntity
import ai.sohoj.app.data.DHAKA
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate

class AssistantEngineTest {

    private val today = LocalDate.of(2026, 6, 8)
    private fun millis(hour: Int) = today.atTime(hour, 0).atZone(DHAKA).toInstant().toEpochMilli()
    private fun e(type: String, amt: String, hour: Int) = BkashTxnEntity(
        type = type, amount = amt, fee = "0.00", balanceAfter = null, counterparty = null,
        trxId = null, occurredAtMillis = millis(hour), source = "test", dedupeHash = "$type-$amt-$hour",
    )

    @Test fun detectsBanglaIntent() {
        assertEquals(Lang.BN, AssistantEngine.detectLang("আজ কত cash in হয়েছে?"))
        assertEquals(Period.TODAY, AssistantEngine.detectPeriod("আজ কত cash in হয়েছে?"))
        assertEquals(Metric.CASH_IN, AssistantEngine.detectMetric("আজ কত cash in হয়েছে?"))
    }

    @Test fun detectsMonthlySendMoney() {
        assertEquals(Period.MONTH, AssistantEngine.detectPeriod("এই মাসে কত send money করেছি?"))
        assertEquals(Metric.SEND_MONEY_SENT, AssistantEngine.detectMetric("এই মাসে কত send money করেছি?"))
    }

    @Test fun computesDeterministicCashIn() {
        val txns = listOf(e("CASH_IN", "2000.00", 10), e("CASH_IN", "500.00", 12))
        val r = AssistantEngine.answer("আজ কত cash in হয়েছে?", txns, today)
        assertTrue(r.answer.contains("৳2,500.00"))
        assertTrue(r.sourceLabel.contains("on-device"))
    }
}
