package ai.sohoj.parser

import java.math.BigDecimal
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

class BkashParserTest {

    @Test fun parsesSendMoneyReceived_fromRealSample() {
        val p = BkashParser.parse(
            "You have received Tk 20,000.00 from 01521212022. Fee Tk 0.00. Balance Tk 21,461.84. TrxID DF883S5FRU at 08/06/2026 13:14"
        )
        assertNotNull(p)
        assertEquals(TxnType.SEND_MONEY_RECEIVED, p.type)
        assertEquals(BigDecimal("20000.00"), p.amount)
        assertEquals(BigDecimal("0.00"), p.fee)
        assertEquals(BigDecimal("21461.84"), p.balanceAfter)
        assertEquals("DF883S5FRU", p.trxId)
        assertEquals("015****022", p.counterparty)
        assertEquals(Confidence.HIGH, p.confidence)
        assertEquals(2026, p.occurredAt!!.year)
    }

    @Test fun parsesMerchantPayment_fromRealSample() {
        val p = BkashParser.parse(
            "Payment of Tk 1,545.26 to OPTIMUM SOLUTION AND SERVICES LTD-RM52936 is successful. Balance Tk 6,901.58. TrxID DF864DNJL6 at 08/06/2026 21:27"
        )
        assertNotNull(p)
        assertEquals(TxnType.MERCHANT_PAYMENT, p.type)
        assertEquals(BigDecimal("1545.26"), p.amount)
        assertEquals(BigDecimal("0"), p.fee)
        assertEquals(BigDecimal("6901.58"), p.balanceAfter)
        assertEquals("DF864DNJL6", p.trxId)
        assertEquals("OPTIMUM SOLUTION AND SERVICES LTD-RM52936", p.counterparty)
        assertEquals(Confidence.HIGH, p.confidence)
    }

    @Test fun parsesSecondReceiveSample() {
        val p = BkashParser.parse(
            "You have received Tk 1,500.00 from 01717710119. Fee Tk 0.00. Balance Tk 5,178.63. TrxID DF985L4Q8E at 09/06/2026 21:03"
        )
        assertNotNull(p)
        assertEquals(TxnType.SEND_MONEY_RECEIVED, p.type)
        assertEquals(BigDecimal("1500.00"), p.amount)
        assertEquals("DF985L4Q8E", p.trxId)
    }

    @Test fun parsesCashIn_withTrailingDownloadLink() {
        val p = BkashParser.parse(
            "Cash In Tk 2,000.00 from 01770606238 successful. Fee Tk 0.00. Balance Tk 4,565.23. TrxID DFD29YHPKM at 13/06/2026 13:44. Download App: https://bKa.sh/8app"
        )
        assertNotNull(p)
        assertEquals(TxnType.CASH_IN, p.type)
        assertEquals(BigDecimal("2000.00"), p.amount)
        assertEquals(BigDecimal("4565.23"), p.balanceAfter)
        assertEquals("DFD29YHPKM", p.trxId)
        assertEquals(Confidence.HIGH, p.confidence)
    }

    @Test fun inferredCashOut_parsesAtLowConfidence() {
        val p = BkashParser.parse(
            "Cash Out Tk 500.00 to 01890000000 successful. Fee Tk 9.00. Balance Tk 100.00. TrxID AB12CD34EF at 10/06/2026 09:00"
        )
        assertNotNull(p)
        assertEquals(TxnType.CASH_OUT, p.type)
        assertEquals(BigDecimal("9.00"), p.fee)
        assertEquals(Confidence.LOW, p.confidence) // flagged until a real sample confirms
    }

    @Test fun ignoresOtpMessage() {
        assertNull(BkashParser.parse("Your bKash OTP is 123456. Do not share it with anyone."))
    }

    @Test fun ignoresUnrelatedSms() {
        assertNull(BkashParser.parse("Congratulations! You won a free recharge. Reply YES."))
    }

    @Test fun neverRetainsRawMessage() {
        // ParsedTransaction exposes only structured fields — no raw-text property exists.
        val fields = ParsedTransaction::class.members.map { it.name }.toSet()
        assertTrue(fields.containsAll(setOf("type", "amount", "fee", "trxId")))
        assertTrue(fields.none { it.contains("raw", ignoreCase = true) || it.contains("message", ignoreCase = true) })
    }
}
