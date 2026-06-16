package ai.sohoj.app.ui.home

import android.content.Intent
import android.provider.Settings
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.ContentPaste
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import ai.sohoj.app.analytics.AnalyticsEngine
import ai.sohoj.app.data.DHAKA
import ai.sohoj.app.data.toRecord
import ai.sohoj.app.ui.AppViewModel
import ai.sohoj.app.ui.Routes
import ai.sohoj.app.ui.components.SectionCard
import ai.sohoj.app.ui.components.StatLine
import ai.sohoj.app.ui.components.StatTile
import ai.sohoj.app.ui.components.UsageBar
import ai.sohoj.app.ui.components.fmtTaka
import ai.sohoj.app.ui.theme.NegativeRed
import ai.sohoj.app.ui.theme.PositiveGreen
import ai.sohoj.app.ui.transactions.TransactionRow
import java.time.LocalDate
import java.time.YearMonth

@Composable
fun HomeScreen(vm: AppViewModel, nav: NavHostController) {
    val context = LocalContext.current
    val settings by vm.settings.collectAsState()
    val txns by vm.transactions.collectAsState()
    var showPaste by remember { mutableStateOf(false) }
    var pasteText by remember { mutableStateOf("") }

    val records = txns.map { it.toRecord() }
    val today = LocalDate.now(DHAKA)
    val daily = AnalyticsEngine.daily(records, today)
    val weekly = AnalyticsEngine.weekly(records, today.minusDays(6))
    val monthly = AnalyticsEngine.monthly(records, YearMonth.from(today))
    val limit = when (settings.plan) { "basic" -> 3000; "pro" -> 15000; else -> 0 }

    LazyColumn(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
    ) {
        item {
            Column {
                Text("Assalamu Alaikum,", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(settings.displayName.ifBlank { "Seller" }, style = MaterialTheme.typography.headlineSmall)
            }
        }
        item {
            SectionCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Column {
                        Text("Current plan", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(settings.plan.replaceFirstChar { it.uppercase() }, style = MaterialTheme.typography.titleMedium)
                    }
                    StatusPill(if (settings.notificationAccess) "Auto-detect on" else "Manual mode", settings.notificationAccess)
                }
            }
        }
        item {
            SectionCard(title = "Today") {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    StatTile("Received", fmtTaka(daily.totalReceived), PositiveGreen, Modifier.weight(1f))
                    StatTile("Sent", fmtTaka(daily.totalSent), NegativeRed, Modifier.weight(1f))
                }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    StatTile("Fees", fmtTaka(daily.fees), modifier = Modifier.weight(1f))
                    StatTile("Net", fmtTaka(daily.net), if (daily.net.signum() >= 0) PositiveGreen else NegativeRed, Modifier.weight(1f))
                }
                Text("${daily.count} transactions today", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        item {
            SectionCard(title = "This week") {
                StatLine("Received", fmtTaka(weekly.totalReceived), PositiveGreen)
                StatLine("Sent", fmtTaka(weekly.totalSent), NegativeRed)
                StatLine("Fees", fmtTaka(weekly.fees))
                StatLine("Net movement", fmtTaka(weekly.net))
                StatLine("Transactions", weekly.count.toString())
            }
        }
        item {
            SectionCard(title = "This month") {
                StatLine("Revenue (est.)", fmtTaka(monthly.revenueEstimate), PositiveGreen)
                StatLine("Expense (est.)", fmtTaka(monthly.expenseEstimate), NegativeRed)
                StatLine("Net movement", fmtTaka(monthly.netMovement))
                UsageBar(monthly.count, limit)
                if (settings.plan == "free") AssistChip(onClick = { nav.navigate(Routes.PLAN) }, label = { Text("Upgrade for automatic detection →") })
            }
        }
        item {
            SectionCard(title = "Quick actions") {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    QuickAction("Paste", Icons.Filled.ContentPaste, Modifier.weight(1f)) { showPaste = true }
                    QuickAction("Manual", Icons.Filled.Edit, Modifier.weight(1f)) { nav.navigate(Routes.MANUAL) }
                }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    QuickAction("Notifications", Icons.Filled.NotificationsActive, Modifier.weight(1f)) {
                        runCatching { context.startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)) }
                    }
                    QuickAction("Ask AI", Icons.Filled.AutoAwesome, Modifier.weight(1f)) { nav.navigate(Routes.ASSISTANT) }
                }
            }
        }
        item { Text("Recent transactions", style = MaterialTheme.typography.titleMedium) }
        if (txns.isEmpty()) {
            item {
                Text(
                    "No transactions yet. Paste a bKash SMS or enable notifications to get started.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        } else {
            items(txns.take(5), key = { it.id }) { t ->
                TransactionRow(t) { nav.navigate(Routes.detail(t.id)) }
            }
            item { TextButton(onClick = { nav.navigate(Routes.TRANSACTIONS) }) { Text("See all transactions") } }
        }
    }

    if (showPaste) {
        AlertDialog(
            onDismissRequest = { showPaste = false },
            title = { Text("Paste bKash message") },
            text = { OutlinedTextField(pasteText, { pasteText = it }, label = { Text("Message text") }, modifier = Modifier.fillMaxWidth()) },
            confirmButton = {
                TextButton(onClick = {
                    vm.parseToPending(pasteText, "manual_paste"); showPaste = false; pasteText = ""
                }) { Text("Detect") }
            },
            dismissButton = { TextButton(onClick = { showPaste = false }) { Text("Cancel") } },
        )
    }
}

@Composable
private fun StatusPill(text: String, ok: Boolean) {
    val c = if (ok) PositiveGreen else MaterialTheme.colorScheme.onSurfaceVariant
    Surface(shape = RoundedCornerShape(50), color = c.copy(alpha = 0.14f)) {
        Text(text, color = c, style = MaterialTheme.typography.labelMedium, modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp))
    }
}

@Composable
private fun QuickAction(label: String, icon: ImageVector, modifier: Modifier, onClick: () -> Unit) {
    Surface(onClick = onClick, shape = RoundedCornerShape(16.dp), color = MaterialTheme.colorScheme.surfaceVariant, modifier = modifier) {
        Column(Modifier.padding(14.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Icon(icon, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(22.dp))
            Text(label, style = MaterialTheme.typography.labelMedium)
        }
    }
}
