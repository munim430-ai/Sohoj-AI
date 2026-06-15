package ai.sohoj.app

import android.app.Application
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import ai.sohoj.app.analytics.AnalyticsEngine
import ai.sohoj.app.analytics.Summary
import ai.sohoj.app.data.AppDatabase
import ai.sohoj.app.data.BkashTxnEntity
import ai.sohoj.app.data.DHAKA
import ai.sohoj.app.data.TransactionRepository
import ai.sohoj.app.data.toRecord
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.time.LocalDate

class DashboardViewModel(app: Application) : AndroidViewModel(app) {
    private val repo = TransactionRepository(AppDatabase.get(app).txnDao())

    val txns: StateFlow<List<BkashTxnEntity>> =
        repo.observeAll().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun ingest(text: String, source: String = "manual_paste") {
        viewModelScope.launch { repo.ingest(text, source) }
    }
}

class MainActivity : ComponentActivity() {
    private val vm: DashboardViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleShare(intent)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    DashboardScreen(vm)
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleShare(intent)
    }

    /** Handle bKash SMS shared from the Messaging app (no READ_SMS permission needed). */
    private fun handleShare(intent: Intent?) {
        if (intent?.action == Intent.ACTION_SEND && intent.type == "text/plain") {
            intent.getStringExtra(Intent.EXTRA_TEXT)?.let { vm.ingest(it, source = "sms_share") }
        }
    }
}

@Composable
fun DashboardScreen(vm: DashboardViewModel) {
    val txns by vm.txns.collectAsState()
    var pasted by remember { mutableStateOf("") }
    val today = LocalDate.now(DHAKA)
    val summary = AnalyticsEngine.daily(txns.map { it.toRecord() }, today)

    Scaffold { inner ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(inner)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text("sohojAI — bKash Intelligence", style = MaterialTheme.typography.titleLarge)
            TodayCard(summary)

            OutlinedTextField(
                value = pasted,
                onValueChange = { pasted = it },
                label = { Text("Paste a bKash SMS/notification") },
                modifier = Modifier.fillMaxWidth(),
            )
            Button(
                onClick = { if (pasted.isNotBlank()) { vm.ingest(pasted); pasted = "" } },
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Detect & Save") }

            Text("Recent transactions (${txns.size})", style = MaterialTheme.typography.titleMedium)
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(txns) { TxnRow(it) }
            }
        }
    }
}

@Composable
private fun TodayCard(s: Summary) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text("Today", style = MaterialTheme.typography.titleMedium)
            StatRow("Received", s.totalReceived.toPlainString())
            StatRow("Sent", s.totalSent.toPlainString())
            StatRow("Fees", s.fees.toPlainString())
            StatRow("Net", s.net.toPlainString())
        }
    }
}

@Composable
private fun StatRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label)
        Text("৳$value", style = MaterialTheme.typography.bodyLarge)
    }
}

@Composable
private fun TxnRow(t: BkashTxnEntity) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(12.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(t.type.replace('_', ' '), style = MaterialTheme.typography.bodyMedium)
                Text("৳${t.amount}", style = MaterialTheme.typography.bodyLarge)
            }
            Text(
                "${t.counterparty ?: "—"} · ${t.trxId ?: "—"} · ${t.source}",
                style = MaterialTheme.typography.bodySmall,
            )
        }
    }
}
