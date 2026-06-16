package ai.sohoj.app.ui.reports

import android.content.Intent
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.horizontalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import ai.sohoj.app.analytics.AnalyticsEngine
import ai.sohoj.app.data.DHAKA
import ai.sohoj.app.data.toRecord
import ai.sohoj.app.parser.TxnType
import ai.sohoj.app.ui.AppViewModel
import ai.sohoj.app.ui.components.SectionCard
import ai.sohoj.app.ui.components.StatLine
import ai.sohoj.app.ui.components.fmtTaka
import ai.sohoj.app.ui.components.txnTypeLabel
import ai.sohoj.app.ui.theme.NegativeRed
import ai.sohoj.app.ui.theme.PositiveGreen
import java.time.LocalDate

private enum class Range(val label: String) { DAILY("Today"), WEEKLY("Week"), MONTHLY("Month"), LAST30("Last 30d") }

@Composable
fun ReportsScreen(vm: AppViewModel) {
    val context = LocalContext.current
    val txns by vm.transactions.collectAsState()
    val records = txns.map { it.toRecord() }
    var range by remember { mutableStateOf(Range.MONTHLY) }
    val today = LocalDate.now(DHAKA)

    val (from, to) = when (range) {
        Range.DAILY -> today to today
        Range.WEEKLY -> today.minusDays(6) to today
        Range.MONTHLY -> today.withDayOfMonth(1) to today
        Range.LAST30 -> today.minusDays(29) to today
    }
    val summary = AnalyticsEngine.inRange(records, from, to)
    val breakdown = AnalyticsEngine.typeBreakdown(records.filter {
        val d = it.occurredAt?.toLocalDate() ?: return@filter false
        !d.isBefore(from) && !d.isAfter(to)
    })
    val largest = txns.filter {
        val d = it.toRecord().occurredAt?.toLocalDate() ?: return@filter false
        !d.isBefore(from) && !d.isAfter(to)
    }.sortedByDescending { runCatching { it.amount.toBigDecimal() }.getOrDefault(java.math.BigDecimal.ZERO) }.take(5)

    LazyColumn(Modifier.fillMaxWidth().padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item { Text("Reports", style = MaterialTheme.typography.headlineSmall, modifier = Modifier.padding(vertical = 12.dp)) }
        item {
            Row(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Range.values().forEach { r -> FilterChip(range == r, { range = r }, { Text(r.label) }) }
            }
        }
        item {
            SectionCard(title = "${range.label} summary") {
                StatLine("Received", fmtTaka(summary.totalReceived), PositiveGreen)
                StatLine("Sent", fmtTaka(summary.totalSent), NegativeRed)
                StatLine("Fees", fmtTaka(summary.fees))
                StatLine("Net movement", fmtTaka(summary.net))
                StatLine("Transactions", summary.count.toString())
            }
        }
        item { SectionCard(title = "Last 7 days") { WeekTrendChart(records, today) } }
        item {
            SectionCard(title = "By type") {
                if (breakdown.isEmpty()) Text("No data in range.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                breakdown.entries.sortedByDescending { it.value }.forEach { (t, amt) ->
                    StatLine(txnTypeLabel(t.name), fmtTaka(amt))
                }
            }
        }
        item {
            SectionCard(title = "Largest transactions") {
                if (largest.isEmpty()) Text("No transactions in range.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                largest.forEach { t -> StatLine("${txnTypeLabel(t.type)} · ${t.counterparty ?: "—"}", fmtTaka(t.amount)) }
            }
        }
        item {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(onClick = { share(context, summaryText(range.label, summary)) }, modifier = Modifier.weight(1f)) { Text("Share summary") }
                Button(onClick = { share(context, csv(txns)) }, modifier = Modifier.weight(1f)) { Text("Export CSV") }
            }
        }
    }
}

@Composable
private fun WeekTrendChart(records: List<ai.sohoj.app.analytics.FinanceRecord>, today: LocalDate) {
    val received = PositiveGreen
    val sent = NegativeRed
    val days = (6 downTo 0).map { today.minusDays(it.toLong()) }
    val data = days.map { d ->
        val s = AnalyticsEngine.daily(records, d)
        s.totalReceived.toFloat() to s.totalSent.toFloat()
    }
    val maxV = (data.flatMap { listOf(it.first, it.second) }.maxOrNull() ?: 1f).coerceAtLeast(1f)
    Canvas(Modifier.fillMaxWidth().height(140.dp)) {
        val n = data.size
        val slot = size.width / n
        val barW = slot * 0.28f
        data.forEachIndexed { i, (r, s) ->
            val cx = i * slot + slot / 2
            val rh = (r / maxV) * size.height
            val sh = (s / maxV) * size.height
            drawRect(received, topLeft = Offset(cx - barW - 2, size.height - rh), size = Size(barW, rh))
            drawRect(sent, topLeft = Offset(cx + 2, size.height - sh), size = Size(barW, sh))
        }
    }
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
        Legend("Received", received); Legend("Sent", sent)
    }
}

@Composable
private fun Legend(label: String, color: Color) {
    Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        Canvas(Modifier.height(10.dp).width(10.dp)) { drawRect(color) }
        Text(label, style = MaterialTheme.typography.labelMedium)
    }
}

private fun summaryText(label: String, s: ai.sohoj.app.analytics.Summary): String =
    "sohojAI $label report\nReceived: ${fmtTaka(s.totalReceived)}\nSent: ${fmtTaka(s.totalSent)}\nFees: ${fmtTaka(s.fees)}\nNet: ${fmtTaka(s.net)}\nTransactions: ${s.count}"

private fun csv(txns: List<ai.sohoj.app.data.BkashTxnEntity>): String {
    val sb = StringBuilder("type,amount,fee,balance,counterparty,trxId,occurredAtMillis,source,confidence\n")
    txns.forEach {
        sb.append("${it.type},${it.amount},${it.fee},${it.balanceAfter ?: ""},${it.counterparty ?: ""},${it.trxId ?: ""},${it.occurredAtMillis ?: ""},${it.source},${it.confidence}\n")
    }
    return sb.toString()
}

private fun share(context: android.content.Context, text: String) {
    val intent = Intent(Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(Intent.EXTRA_TEXT, text)
    }
    runCatching { context.startActivity(Intent.createChooser(intent, "Share")) }
}
