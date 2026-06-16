package ai.sohoj.app.ui.onboarding

import android.content.Intent
import android.provider.Settings
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import ai.sohoj.app.prefs.AppLanguage
import ai.sohoj.app.ui.AppViewModel
import ai.sohoj.app.ui.components.SectionCard

@Composable
fun OnboardingScreen(vm: AppViewModel) {
    val context = LocalContext.current
    var step by remember { mutableIntStateOf(0) }
    var lang by remember { mutableStateOf(AppLanguage.EN) }
    var name by remember { mutableStateOf("") }
    var org by remember { mutableStateOf("") }
    var plan by remember { mutableStateOf("free") }
    val lastStep = 4

    Column(Modifier.fillMaxSize().padding(20.dp)) {
        LinearProgressIndicator(
            progress = { (step + 1f) / (lastStep + 1) },
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.weight(0.04f))

        Column(
            Modifier.weight(1f).verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            when (step) {
                0 -> {
                    Text("sohojAI", style = MaterialTheme.typography.headlineLarge, color = MaterialTheme.colorScheme.primary)
                    Text("Your bKash money, organised.", style = MaterialTheme.typography.titleLarge)
                    Text(
                        "Automatic transaction intelligence and a Bangla AI assistant for Bangladeshi Facebook & F-commerce sellers.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                1 -> {
                    Text("Choose language / ভাষা নির্বাচন করুন", style = MaterialTheme.typography.titleLarge)
                    ChoiceRow("বাংলা", lang == AppLanguage.BN) { lang = AppLanguage.BN }
                    ChoiceRow("English", lang == AppLanguage.EN) { lang = AppLanguage.EN }
                }
                2 -> {
                    Text("Privacy first", style = MaterialTheme.typography.titleLarge)
                    InfoRow(Icons.Filled.Notifications, "Notification access", "Reads only bKash notifications to detect transactions automatically.")
                    InfoRow(Icons.Filled.Share, "SMS share import", "Share a bKash SMS from your Messaging app — no SMS-reading permission needed.")
                    InfoRow(Icons.Filled.Lock, "Never stored", "OTP, PIN, and unrelated messages are never read or saved. Only structured transaction fields are kept.")
                    OutlinedButton(
                        onClick = {
                            runCatching { context.startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)) }
                            vm.setNotificationAccess(true)
                        },
                        modifier = Modifier.fillMaxWidth(),
                    ) { Text("Grant notification access") }
                }
                3 -> {
                    Text("Create your account", style = MaterialTheme.typography.titleLarge)
                    OutlinedTextField(name, { name = it }, label = { Text("Your name") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(org, { org = it }, label = { Text("Business name") }, modifier = Modifier.fillMaxWidth())
                    Text("This device will be registered to your account.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                4 -> {
                    Text("Choose your plan", style = MaterialTheme.typography.titleLarge)
                    PlanChoice("Free", "৳0 · Manual imports only", plan == "free") { plan = "free" }
                    PlanChoice("Basic", "৳1,999/mo · 1 device · 3,000 txns", plan == "basic") { plan = "basic" }
                    PlanChoice("Pro", "৳4,999/mo · 3 devices · 15,000 txns", plan == "pro") { plan = "pro" }
                }
            }
        }

        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            if (step > 0) TextButton(onClick = { step-- }) { Text("Back") } else Spacer(Modifier)
            Button(onClick = {
                if (step < lastStep) step++
                else vm.completeOnboarding(name.ifBlank { "Seller" }, org.ifBlank { "My Business" }, plan, lang)
            }) { Text(if (step < lastStep) "Continue" else "Finish setup") }
        }
    }
}

@Composable
private fun ChoiceRow(label: String, selected: Boolean, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = if (selected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Text(label, Modifier.padding(18.dp), fontWeight = FontWeight.SemiBold)
    }
}

@Composable
private fun PlanChoice(title: String, subtitle: String, selected: Boolean, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = if (selected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(title, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
            Text(subtitle, color = MaterialTheme.colorScheme.onSurfaceVariant, style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
private fun InfoRow(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, body: String) {
    SectionCard {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Icon(icon, null, tint = MaterialTheme.colorScheme.primary)
            Column {
                Text(title, fontWeight = FontWeight.SemiBold)
                Text(body, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}
