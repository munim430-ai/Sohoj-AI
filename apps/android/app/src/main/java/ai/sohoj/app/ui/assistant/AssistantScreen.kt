package ai.sohoj.app.ui.assistant

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import ai.sohoj.app.assistant.AssistantEngine
import ai.sohoj.app.ui.AppViewModel

@Composable
fun AssistantScreen(vm: AppViewModel) {
    var input by remember { mutableStateOf("") }
    val history = vm.assistantHistory

    Column(Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
        Text("AI Assistant", style = MaterialTheme.typography.headlineSmall, modifier = Modifier.padding(vertical = 12.dp))

        if (history.isEmpty()) {
            Text(
                "Ask about your bKash money in Bangla, Banglish, or English. Every number is computed on-device.",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                style = MaterialTheme.typography.bodyMedium,
            )
            Row(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()).padding(vertical = 10.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                AssistantEngine.suggestions.take(3).forEach { q ->
                    AssistChip(onClick = { vm.ask(q) }, label = { Text(q) })
                }
            }
        }

        LazyColumn(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(history) { (q, r) ->
                Column(horizontalAlignment = Alignment.End, modifier = Modifier.fillMaxWidth()) {
                    Bubble(q, user = true)
                    Bubble(r.answer, user = false, source = "${r.sourceLabel} · ${r.rangeLabel}")
                }
            }
            if (history.isNotEmpty()) {
                item {
                    Row(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        AssistantEngine.suggestions.forEach { q -> AssistChip(onClick = { vm.ask(q) }, label = { Text(q) }) }
                    }
                }
            }
        }

        Row(Modifier.fillMaxWidth().padding(vertical = 10.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(
                input, { input = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("আজ কত received হয়েছে?") },
                singleLine = true,
            )
            IconButton(onClick = { if (input.isNotBlank()) { vm.ask(input); input = "" } }) {
                Icon(Icons.AutoMirrored.Filled.Send, "Send", tint = MaterialTheme.colorScheme.primary)
            }
        }
    }
}

@Composable
private fun Bubble(text: String, user: Boolean, source: String? = null) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = if (user) Arrangement.End else Arrangement.Start) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = if (user) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
            modifier = Modifier.fillMaxWidth(0.86f),
        ) {
            Column(Modifier.padding(12.dp)) {
                Text(text, color = if (user) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface)
                if (source != null) {
                    Text(source, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant, fontWeight = FontWeight.Medium, modifier = Modifier.padding(top = 4.dp))
                }
            }
        }
    }
}
