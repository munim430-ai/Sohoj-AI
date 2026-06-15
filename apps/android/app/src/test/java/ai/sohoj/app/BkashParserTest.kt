package ai.sohoj.app

import ai.sohoj.app.parser.BkashParser
import ai.sohoj.app.parser.Confidence
import ai.sohoj.app.parser.TxnType
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Test
import java.math.BigDecimal

class BkashParserTest {

    @Test fun sendMoneyReceived() {
        val p = BkashParser.parse(
            "You have received Tk 20,000.00 from 01521212022. Fee Tk 0.00. Balance Tk 21,461.84. TrxID DF883S5FRU at 08/06/2026 13:14"
        )!!
        assertEquals(TxnType.SEND_MONEY_RECEIVED, p.type)
        assertEquals(BigDecimal("20000.00"), p.amount)
        assertEquals(BigDecimal("21461.84"), p.balanceAfter)
        assertEquals("DF883S5FRU", p.trxId)
        assertEquals("015****022", p.counterparty)
        assertEquals(Confidence.HIGH, p.confidence)
    }

    @Test fun merchantPayment() {
        val p = BkashParser.parse(
            "Payment of Tk 1,545.26 to OPTIMUM SOLUTION AND SERVICES LTD-RM52936 is successful. Balance Tk 6,901.58. TrxID DF864DNJL6 at 08/06/2026 21:27"
        )!!
        assertEquals(TxnType.MERCHANT_PAYMENT, p.type)
        assertEquals(BigDecimal("1545.26"), p.amount)
        assertEquals("OPTIMUM SOLUTION AND SERVICES LTD-RM52936", p.counterparty)
    }

    @Test fun cashInWithTrailingLink() {
        val p = BkashParser.parse(
            "Cash In Tk 2,000.00 from 01770606238 successful. Fee Tk 0.00. Balance Tk 4,565.23. TrxID DFD29YHPKM at 13/06/2026 13:44. Download App: https://bKa.sh/8app"
        )!!
        assertEquals(TxnType.CASH_IN, p.type)
        assertEquals(BigDecimal("2000.00"), p.amount)
    }

    @Test fun ignoresOtp() {
        assertNull(BkashParser.parse("Your bKash OTP is 123456. Do not share it."))
    }

    @Test fun ignoresUnrelated() {
        assertNull(BkashParser.parse("Congratulations! You won a free recharge."))
    }
}
