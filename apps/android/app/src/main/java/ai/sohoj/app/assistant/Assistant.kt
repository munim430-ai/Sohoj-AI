package ai.sohoj.app.assistant

import ai.sohoj.app.analytics.AnalyticsEngine
import ai.sohoj.app.data.BkashTxnEntity
import ai.sohoj.app.data.DHAKA
import ai.sohoj.app.data.toRecord
import ai.sohoj.app.parser.TxnType
import java.math.BigDecimal
import java.text.DecimalFormat
import java.time.LocalDate

enum class Lang { BN, BANGLISH, EN }
enum class Period { TODAY, WEEK, MONTH }
enum class Metric { RECEIVED, SENT, CASH_IN, SEND_MONEY_SENT, FEES, NET, LARGEST }

data class AssistantResult(
    val answer: String,
    val sourceLabel: String,
    val rangeLabel: String,
)

object AssistantEngine {

    val suggestions = listOf(
        "আজ কত টাকা received হয়েছে?",
        "এই সপ্তাহে কত Send Money করেছি?",
        "গত মাসের fees কত?",
        "সবচেয়ে বড় transaction কোনটা?",
        "এই মাসে net movement কত?",
    )

    private val bengali = Regex("[\\u0980-\\u09FF]")
    private val df = DecimalFormat("#,##0.00")

    fun fmt(b: BigDecimal): String = "৳" + df.format(b)

    fun detectLang(q: String): Lang = when {
        bengali.containsMatchIn(q) -> Lang.BN
        Regex("(koto|hoyeche|korechi|received|pathiyechi|cash in|send money|aaj|soptaho|mash)", RegexOption.IGNORE_CASE).containsMatchIn(q) -> Lang.BANGLISH
        else -> Lang.EN
    }

    fun detectPeriod(q: String): Period = when {
        Regex("(month|মাস|mash|mas|এই মাস|গত মাস)", RegexOption.IGNORE_CASE).containsMatchIn(q) -> Period.MONTH
        Regex("(week|সপ্তাহ|soptaho|shoptaho|গত সপ্তাহ)", RegexOption.IGNORE_CASE).containsMatchIn(q) -> Period.WEEK
        else -> Period.TODAY
    }

    fun detectMetric(q: String): Metric = when {
        Regex("(বড়|largest|biggest|highest|সবচেয়ে)", RegexOption.IGNORE_CASE).containsMatchIn(q) -> Metric.LARGEST
        Regex("(cash ?in|ক্যাশ ?ইন)", RegexOption.IGNORE_CASE).containsMatchIn(q) -> Metric.CASH_IN
        Regex("(send ?money|পাঠ|pathiye)", RegexOption.IGNORE_CASE).containsMatchIn(q) -> Metric.SEND_MONEY_SENT
        Regex("(fee|charge|চার্জ)", RegexOption.IGNORE_CASE).containsMatchIn(q) -> Metric.FEES
        Regex("(net|নিট|movement)", RegexOption.IGNORE_CASE).containsMatchIn(q) -> Metric.NET
        Regex("(sent|খরচ|spent|send)", RegexOption.IGNORE_CASE).containsMatchIn(q) -> Metric.SENT
        else -> Metric.RECEIVED
    }

    fun answer(query: String, entities: List<BkashTxnEntity>, today: LocalDate = LocalDate.now(DHAKA)): AssistantResult {
        val lang = detectLang(query)
        val period = detectPeriod(query)
        val metric = detectMetric(query)
        val records = entities.map { it.toRecord() }

        val (from, to, rangeLabel) = when (period) {
            Period.TODAY -> Triple(today, today, if (lang == Lang.BN) "আজ" else "today")
            Period.WEEK -> Triple(today.minusDays(6), today, if (lang == Lang.BN) "এই সপ্তাহ" else "this week")
            Period.MONTH -> Triple(today.withDayOfMonth(1), today, if (lang == Lang.BN) "এই মাস" else "this month")
        }
        val scoped = records.filter {
            val d = it.occurredAt?.toLocalDate() ?: return@filter false
            !d.isBefore(from) && !d.isAfter(to)
        }
        val s = AnalyticsEngine.summarize(scoped)

        // Deterministic value; the phrasing below only formats it.
        val (label, valueText) = when (metric) {
            Metric.RECEIVED -> "received" to fmt(s.totalReceived)
            Metric.SENT -> "sent" to fmt(s.totalSent)
            Metric.CASH_IN -> "cash in" to fmt(AnalyticsEngine.summarize(scoped.filter { it.type == TxnType.CASH_IN }).totalReceived)
            Metric.SEND_MONEY_SENT -> "send money" to fmt(AnalyticsEngine.summarize(scoped.filter { it.type == TxnType.SEND_MONEY_SENT }).totalSent)
            Metric.FEES -> "fees" to fmt(s.fees)
            Metric.NET -> "net movement" to fmt(s.net)
            Metric.LARGEST -> {
                val largest = scoped.maxByOrNull { it.amount }
                "largest transaction" to (largest?.let { "${fmt(it.amount)} (${it.type.name.replace('_', ' ').lowercase()})" } ?: fmt(BigDecimal.ZERO))
            }
        }

        val answer = when (lang) {
            Lang.BN -> "$rangeLabel আপনার $label: $valueText।"
            Lang.BANGLISH -> "$rangeLabel apnar $label: $valueText."
            Lang.EN -> "Your $label for $rangeLabel was $valueText."
        }
        return AssistantResult(answer, "Computed on-device from ${scoped.size} transactions", rangeLabel)
    }
}
