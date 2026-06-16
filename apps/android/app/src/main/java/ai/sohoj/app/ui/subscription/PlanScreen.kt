package ai.sohoj.app.ui.subscription

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import ai.sohoj.app.analytics.AnalyticsEngine
import ai.sohoj.app.data.DHAKA
import ai.sohoj.app.data.toRecord
import ai.sohoj.app.ui.AppViewModel
import ai.sohoj.app.ui.components.SectionCard
import ai.sohoj.app.ui.components.StatLine
import ai.sohoj.app.ui.components.UsageBar
import ai.sohoj.app.ui.transactions.BackHeader
import java.time.LocalDate
import java.time.YearMonth

private data class PlanInfo(val id: String, val title: String, val price: String, val features: List<String>, val limit: Int)

private val plans = listOf(
    PlanInfo("free", "Free", "৳0", listOf("Manual imports only", "Dashboard ads + branding", "No automatic detection"), 0),
    PlanInfo("basic", "Basic", "৳1,999/mo", listOf("1 device", "3,000 transactions/month", "Automatic detection", "No branding"), 3000),
    PlanInfo("pro", "Pro", "৳4,999/mo", listOf("3 devices", "15,000 transactions/month", "Advanced analytics", "No branding"), 15000),
)

@Composable
fun PlanScreen(vm: AppViewModel, nav: NavHostController) {
    val settings by vm.settings.collectAsState()
    val txns by vm.transactions.collectAsState()
    val today = LocalDate.now(DHAKA)
    val monthCount = AnalyticsEngine.monthly(txns.map { it.toRecord() }, YearMonth.from(today)).count
    val current = settings.plan
    val currentLimit = plans.firstOrNull { it.id == current }?.limit ?: 0
    val renewal = today.withDayOfMonth(1).plusMonths(1)
    var pendingPlan by remember { mutableStateOf<String?>(null) }

    Column(Modifier.fillMaxWidth().padding(horizontal = 16.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        BackHeader("Subscription", nav)

        SectionCard(title = "Current plan") {
            StatLine("Plan", current.replaceFirstChar { it.uppercase() })
            StatLine("Renews", if (current == "free") "—" else renewal.toString())
            UsageBar(monthCount, currentLimit)
        }

        plans.forEach { p ->
            Surface(shape = RoundedCornerShape(20.dp), color = MaterialTheme.colorScheme.surface, tonalElevation = 1.dp, modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(p.title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Text(p.price, color = MaterialTheme.colorScheme.primary, style = MaterialTheme.typography.titleMedium)
                    p.features.forEach { Text("• $it", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant) }
                    if (p.id == current) {
                        OutlinedButton(onClick = {}, enabled = false, modifier = Modifier.fillMaxWidth()) { Text("Current plan") }
                    } else {
                        Button(onClick = { pendingPlan = p.id }, modifier = Modifier.fillMaxWidth()) {
                            Text(if (rank(p.id) > rank(current)) "Upgrade to ${p.title}" else "Switch to ${p.title}")
                        }
                    }
                }
            }
        }

        Text(
            "Payments are mocked for beta. SSLCommerz is scaffolded but disabled. No API/webhook features are exposed.",
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 24.dp),
        )
    }

    if (pendingPlan != null) {
        val target = plans.first { it.id == pendingPlan }
        AlertDialog(
            onDismissRequest = { pendingPlan = null },
            title = { Text("Confirm ${target.title}") },
            text = { Text("Mock payment of ${target.price}. No real charge is made. Continue?") },
            confirmButton = { TextButton(onClick = { vm.setPlan(target.id); pendingPlan = null }) { Text("Confirm (mock)") } },
            dismissButton = { TextButton(onClick = { pendingPlan = null }) { Text("Cancel") } },
        )
    }
}

private fun rank(plan: String) = when (plan) { "pro" -> 2; "basic" -> 1; else -> 0 }
