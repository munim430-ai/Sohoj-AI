package ai.sohoj.app.ui.transactions

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import ai.sohoj.app.data.BkashTxnEntity
import ai.sohoj.app.data.occurredDateTime
import ai.sohoj.app.parser.ParsedTransaction
import ai.sohoj.app.parser.TxnType
import ai.sohoj.app.parser.Confidence
import ai.sohoj.app.ui.AppViewModel
import ai.sohoj.app.ui.Routes
import ai.sohoj.app.ui.components.ConfidenceChip
import ai.sohoj.app.ui.components.SectionCard
import ai.sohoj.app.ui.components.StatLine
import ai.sohoj.app.ui.components.emptyInboxIcon
import ai.sohoj.app.ui.components.EmptyState
import ai.sohoj.app.ui.components.fmtTaka
import ai.sohoj.app.ui.components.isReceived
import ai.sohoj.app.ui.components.txnTypeColor
import ai.sohoj.app.ui.components.txnTypeIcon
import ai.sohoj.app.ui.components.txnTypeLabel
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

private val dateFmt = DateTimeFormatter.ofPattern("dd MMM yyyy")
private val timeFmt = DateTimeFormatter.ofPattern("dd MMM, HH:mm")

@Composable
fun BackHeader(title: String, nav: NavHostController, actions: @Composable () -> Unit = {}) {
    Row(
        Modifier.fillMaxWidth().padding(horizontal = 4.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        IconButton(onClick = { nav.popBackStack() }) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") }
        Text(title, style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))
        actions()
    }
}

@Composable
fun TransactionRow(t: BkashTxnEntity, duplicate: Boolean = false, onClick: () -> Unit) {
    val color = txnTypeColor(t.type)
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 1.dp,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Surface(shape = RoundedCornerShape(12.dp), color = color.copy(alpha = 0.14f)) {
                Icon(txnTypeIcon(t.type), null, tint = color, modifier = Modifier.padding(8.dp).size(20.dp))
            }
            Column(Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(txnTypeLabel(t.type), fontWeight = FontWeight.SemiBold)
                    if (t.confidence == "LOW") ConfidenceChip(t.confidence)
                    if (duplicate) Text("• duplicate", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.error)
                }
                Text(
                    "${t.counterparty ?: "—"} · ${t.occurredDateTime()?.format(timeFmt) ?: "—"}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Text(
                (if (isReceived(t.type)) "+" else "−") + fmtTaka(t.amount),
                fontWeight = FontWeight.Bold,
                color = color,
            )
        }
    }
}

private enum class SortMode(val label: String) { NEWEST("Newest"), OLDEST("Oldest"), AMOUNT("Amount") }

@Composable
fun TransactionsScreen(vm: AppViewModel, nav: NavHostController) {
    val all by vm.transactions.collectAsState()
    var query by remember { mutableStateOf("") }
    var typeFilter by remember { mutableStateOf<String?>(null) }
    var sort by remember { mutableStateOf(SortMode.NEWEST) }

    val dupTrx = all.groupingBy { it.trxId }.eachCount().filter { it.key != null && it.value > 1 }.keys

    var filtered = all.filter { t ->
        (typeFilter == null || t.type == typeFilter) &&
            (query.isBlank() ||
                (t.counterparty?.contains(query, true) == true) ||
                (t.trxId?.contains(query, true) == true) ||
                t.amount.contains(query))
    }
    filtered = when (sort) {
        SortMode.NEWEST -> filtered.sortedByDescending { it.occurredAtMillis ?: 0 }
        SortMode.OLDEST -> filtered.sortedBy { it.occurredAtMillis ?: 0 }
        SortMode.AMOUNT -> filtered.sortedByDescending { runCatching { BigDecimal(it.amount) }.getOrDefault(BigDecimal.ZERO) }
    }
    val grouped = filtered.groupBy { it.occurredDateTime()?.toLocalDate() }

    Column(Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
        Text("Transactions", style = MaterialTheme.typography.headlineSmall, modifier = Modifier.padding(vertical = 12.dp))
        OutlinedTextField(
            query, { query = it },
            label = { Text("Search amount, number, TrxID") },
            leadingIcon = { Icon(Icons.Filled.Search, null) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
        )
        Row(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()).padding(vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(typeFilter == null, { typeFilter = null }, { Text("All") })
            TxnType.values().forEach { tt ->
                FilterChip(typeFilter == tt.name, { typeFilter = if (typeFilter == tt.name) null else tt.name }, { Text(txnTypeLabel(tt.name)) })
            }
        }
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            SortMode.values().forEach { m ->
                FilterChip(sort == m, { sort = m }, { Text(m.label) })
            }
        }

        if (filtered.isEmpty()) {
            EmptyState(emptyInboxIcon(), "No transactions", "Import a bKash SMS or enable notifications to see your money here.")
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp), contentPadding = PaddingValues(vertical = 12.dp)) {
                grouped.forEach { (date, list) ->
                    item(key = "h-${date}") {
                        Text(
                            date?.format(dateFmt) ?: "Undated",
                            style = MaterialTheme.typography.labelLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(top = 6.dp),
                        )
                    }
                    items(list, key = { it.id }) { t ->
                        TransactionRow(t, duplicate = t.trxId in dupTrx) { nav.navigate(Routes.detail(t.id)) }
                    }
                }
            }
        }
    }
}

@Composable
fun TransactionDetailScreen(vm: AppViewModel, nav: NavHostController, id: Long) {
    val all by vm.transactions.collectAsState()
    val t = all.firstOrNull { it.id == id }
    var tag by remember(t?.id) { mutableStateOf(t?.tag ?: "") }
    var amount by remember(t?.id) { mutableStateOf(t?.amount ?: "") }
    var counterparty by remember(t?.id) { mutableStateOf(t?.counterparty ?: "") }

    Column(Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
        BackHeader("Transaction", nav, actions = {
            if (t != null) IconButton(onClick = { vm.deleteTransaction(t); nav.popBackStack() }) {
                Icon(Icons.Filled.Delete, "Delete", tint = MaterialTheme.colorScheme.error)
            }
        })
        if (t == null) {
            EmptyState(emptyInboxIcon(), "Not found", "This transaction no longer exists.")
            return
        }
        val dup = all.count { it.trxId == t.trxId && t.trxId != null } > 1
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            SectionCard {
                StatLine("Type", txnTypeLabel(t.type))
                StatLine("Amount", fmtTaka(t.amount), txnTypeColor(t.type))
                StatLine("Fee", fmtTaka(t.fee))
                StatLine("Balance after", t.balanceAfter?.let { fmtTaka(it) } ?: "—")
                StatLine("Counterparty", t.counterparty ?: "—")
                StatLine("Transaction ID", t.trxId ?: "—")
                StatLine("Date / time", t.occurredDateTime()?.format(timeFmt) ?: "—")
                StatLine("Source", t.source)
                StatLine("Confidence", t.confidence)
                if (dup) Text("⚠ Possible duplicate (same TrxID exists)", color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodyMedium)
            }
            SectionCard(title = "Correct & tag") {
                OutlinedTextField(amount, { amount = it }, label = { Text("Amount") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
                OutlinedTextField(counterparty, { counterparty = it }, label = { Text("Counterparty") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
                OutlinedTextField(tag, { tag = it }, label = { Text("Tag / category") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
                Button(
                    onClick = {
                        vm.updateTransaction(t.copy(amount = amount.ifBlank { t.amount }, counterparty = counterparty.ifBlank { null }, tag = tag.ifBlank { null }))
                        nav.popBackStack()
                    },
                    modifier = Modifier.fillMaxWidth(),
                ) { Text("Save changes") }
            }
        }
    }
}

@Composable
fun ConfirmScreen(vm: AppViewModel, nav: NavHostController) {
    val pending = vm.pending
    if (pending == null) {
        Column(Modifier.fillMaxWidth().padding(16.dp)) {
            BackHeader("Confirm", nav)
            EmptyState(emptyInboxIcon(), "Nothing to confirm", "No bKash transaction was detected in the text.")
        }
        return
    }
    val p = pending.parsed
    var type by remember { mutableStateOf(p.type) }
    var amount by remember { mutableStateOf(p.amount.toPlainString()) }
    var fee by remember { mutableStateOf(p.fee.toPlainString()) }
    var counterparty by remember { mutableStateOf(p.counterparty ?: "") }
    var typeMenu by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
        BackHeader("Confirm transaction", nav)
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            if (p.confidence == Confidence.LOW) {
                Surface(color = MaterialTheme.colorScheme.errorContainer, shape = RoundedCornerShape(12.dp)) {
                    Text("Low confidence match — please review before saving.", Modifier.padding(12.dp), color = MaterialTheme.colorScheme.onErrorContainer)
                }
            }
            SectionCard(title = "Detected") {
                Box {
                    OutlinedButton(onClick = { typeMenu = true }, modifier = Modifier.fillMaxWidth()) { Text("Type: ${txnTypeLabel(type.name)}") }
                    DropdownMenu(typeMenu, { typeMenu = false }) {
                        TxnType.values().forEach { tt ->
                            DropdownMenuItem(text = { Text(txnTypeLabel(tt.name)) }, onClick = { type = tt; typeMenu = false })
                        }
                    }
                }
                OutlinedTextField(amount, { amount = it }, label = { Text("Amount") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
                OutlinedTextField(fee, { fee = it }, label = { Text("Fee") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
                OutlinedTextField(counterparty, { counterparty = it }, label = { Text("Counterparty") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
                StatLine("Transaction ID", p.trxId ?: "—")
                StatLine("Date / time", p.occurredAt?.format(timeFmt) ?: "now")
                StatLine("Balance", p.balanceAfter?.let { fmtTaka(it) } ?: "—")
            }
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(onClick = { vm.clearPending(); nav.popBackStack() }, modifier = Modifier.weight(1f)) { Text("Discard") }
                Button(
                    onClick = {
                        val edited = p.copy(
                            type = type,
                            amount = runCatching { BigDecimal(amount) }.getOrDefault(p.amount),
                            fee = runCatching { BigDecimal(fee) }.getOrDefault(p.fee),
                            counterparty = counterparty.ifBlank { null },
                        )
                        vm.confirmSave(edited, pending.source)
                        nav.popBackStack()
                    },
                    modifier = Modifier.weight(1f),
                ) { Text("Save") }
            }
        }
    }
}

@Composable
fun ManualEntryScreen(vm: AppViewModel, nav: NavHostController) {
    var type by remember { mutableStateOf(TxnType.CASH_IN) }
    var amount by remember { mutableStateOf("") }
    var fee by remember { mutableStateOf("0") }
    var counterparty by remember { mutableStateOf("") }
    var typeMenu by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
        BackHeader("Add transaction", nav)
        SectionCard(title = "Enter details") {
            Box {
                OutlinedButton(onClick = { typeMenu = true }, modifier = Modifier.fillMaxWidth()) { Text("Type: ${txnTypeLabel(type.name)}") }
                DropdownMenu(typeMenu, { typeMenu = false }) {
                    TxnType.values().forEach { tt ->
                        DropdownMenuItem(text = { Text(txnTypeLabel(tt.name)) }, onClick = { type = tt; typeMenu = false })
                    }
                }
            }
            OutlinedTextField(amount, { amount = it }, label = { Text("Amount") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
            OutlinedTextField(fee, { fee = it }, label = { Text("Fee") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
            OutlinedTextField(counterparty, { counterparty = it }, label = { Text("Counterparty (optional)") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
            Button(
                onClick = {
                    val parsed = ParsedTransaction(
                        type = type,
                        amount = runCatching { BigDecimal(amount) }.getOrDefault(BigDecimal.ZERO),
                        fee = runCatching { BigDecimal(fee) }.getOrDefault(BigDecimal.ZERO),
                        balanceAfter = null,
                        counterparty = counterparty.ifBlank { null },
                        trxId = null,
                        occurredAt = LocalDateTime.now(ai.sohoj.app.data.DHAKA),
                        confidence = Confidence.HIGH,
                    )
                    vm.confirmSave(parsed, "manual_entry")
                    nav.popBackStack()
                },
                enabled = amount.isNotBlank(),
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Save transaction") }
        }
    }
}
