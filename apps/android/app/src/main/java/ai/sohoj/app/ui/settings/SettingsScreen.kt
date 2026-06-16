package ai.sohoj.app.ui.settings

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import ai.sohoj.app.prefs.AppLanguage
import ai.sohoj.app.ui.AppViewModel
import ai.sohoj.app.ui.Routes
import ai.sohoj.app.ui.components.SectionCard
import ai.sohoj.app.ui.components.StatLine
import ai.sohoj.app.ui.theme.ThemeMode

@Composable
fun SettingsScreen(vm: AppViewModel, nav: NavHostController) {
    val context = LocalContext.current
    val settings by vm.settings.collectAsState()
    var deviceName by remember(settings.deviceName) { mutableStateOf(settings.deviceName) }
    var confirmDelete by remember { mutableStateOf(false) }
    var revokeShown by remember { mutableStateOf(false) }
    var updateShown by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxWidth().padding(horizontal = 16.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Text("Settings", style = MaterialTheme.typography.headlineSmall, modifier = Modifier.padding(vertical = 12.dp))

        SectionCard(title = "Profile") {
            StatLine("Name", settings.displayName.ifBlank { "Seller" })
            StatLine("Business", settings.orgName.ifBlank { "—" })
        }

        SectionCard(title = "Language") {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(settings.language == AppLanguage.BN, { vm.setLanguage(AppLanguage.BN) }, { Text("বাংলা") })
                FilterChip(settings.language == AppLanguage.EN, { vm.setLanguage(AppLanguage.EN) }, { Text("English") })
            }
        }

        SectionCard(title = "Theme") {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(settings.themeMode == ThemeMode.SYSTEM, { vm.setTheme(ThemeMode.SYSTEM) }, { Text("System") })
                FilterChip(settings.themeMode == ThemeMode.LIGHT, { vm.setTheme(ThemeMode.LIGHT) }, { Text("Light") })
                FilterChip(settings.themeMode == ThemeMode.DARK, { vm.setTheme(ThemeMode.DARK) }, { Text("Dark") })
            }
        }

        SectionCard(title = "Detection") {
            StatLine("Notification access", if (vm.isNotificationAccessGranted()) "Granted" else "Not granted")
            OutlinedButton(onClick = { runCatching { context.startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)) } }, modifier = Modifier.fillMaxWidth()) {
                Text("Open notification access settings")
            }
        }

        SectionCard(title = "This device") {
            OutlinedTextField(deviceName, { deviceName = it }, label = { Text("Device name") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = { vm.setDeviceName(deviceName) }, modifier = Modifier.weight(1f)) { Text("Save name") }
                OutlinedButton(onClick = { revokeShown = true }, modifier = Modifier.weight(1f)) { Text("Revoke device") }
            }
        }

        SectionCard(title = "Plan & usage") {
            StatLine("Plan", settings.plan.replaceFirstChar { it.uppercase() })
            Button(onClick = { nav.navigate(Routes.PLAN) }, modifier = Modifier.fillMaxWidth()) { Text("Manage subscription") }
        }

        SectionCard(title = "Your data") {
            OutlinedButton(onClick = { nav.navigate(Routes.REPORTS) }, modifier = Modifier.fillMaxWidth()) { Text("Export (in Reports)") }
            OutlinedButton(onClick = { confirmDelete = true }, modifier = Modifier.fillMaxWidth()) { Text("Delete all data") }
        }

        SectionCard(title = "About") {
            OutlinedButton(onClick = { openUrl(context, "https://sohoj-ai.vercel.app/privacy") }, modifier = Modifier.fillMaxWidth()) { Text("Privacy Policy") }
            OutlinedButton(onClick = { openUrl(context, "https://sohoj-ai.vercel.app/terms") }, modifier = Modifier.fillMaxWidth()) { Text("Terms & Conditions") }
            StatLine("App version", "0.1.0 (beta)")
            OutlinedButton(onClick = { updateShown = true }, modifier = Modifier.fillMaxWidth()) { Text("Check for updates") }
        }

        Button(onClick = { vm.signOut() }, modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) { Text("Sign out") }
    }

    if (confirmDelete) {
        AlertDialog(
            onDismissRequest = { confirmDelete = false },
            title = { Text("Delete all data?") },
            text = { Text("This permanently removes all transactions stored on this device.") },
            confirmButton = { TextButton(onClick = { vm.deleteAllData(); confirmDelete = false }) { Text("Delete") } },
            dismissButton = { TextButton(onClick = { confirmDelete = false }) { Text("Cancel") } },
        )
    }
    if (revokeShown) {
        AlertDialog(
            onDismissRequest = { revokeShown = false },
            title = { Text("Revoke device") },
            text = { Text("Revoking signs this device out and stops syncing. (Mock — wired to backend device revocation.)") },
            confirmButton = { TextButton(onClick = { vm.signOut(); revokeShown = false }) { Text("Revoke") } },
            dismissButton = { TextButton(onClick = { revokeShown = false }) { Text("Cancel") } },
        )
    }
    if (updateShown) {
        AlertDialog(
            onDismissRequest = { updateShown = false },
            title = { Text("Up to date") },
            text = { Text("You are on the latest beta (0.1.0).") },
            confirmButton = { TextButton(onClick = { updateShown = false }) { Text("OK") } },
        )
    }
}

private fun openUrl(context: android.content.Context, url: String) {
    runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) }
}
