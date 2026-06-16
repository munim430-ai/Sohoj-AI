package ai.sohoj.app.ui

import android.app.Application
import android.provider.Settings
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import ai.sohoj.app.assistant.AssistantEngine
import ai.sohoj.app.assistant.AssistantResult
import ai.sohoj.app.data.AppDatabase
import ai.sohoj.app.data.BkashTxnEntity
import ai.sohoj.app.data.TransactionRepository
import ai.sohoj.app.data.toEntity
import ai.sohoj.app.parser.ParsedTransaction
import ai.sohoj.app.prefs.AppLanguage
import ai.sohoj.app.prefs.AppPreferences
import ai.sohoj.app.prefs.AppSettings
import ai.sohoj.app.ui.theme.ThemeMode
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class PendingParse(val parsed: ParsedTransaction, val source: String)

class AppViewModel(app: Application) : AndroidViewModel(app) {
    private val prefs = AppPreferences(app)
    private val repo = TransactionRepository(AppDatabase.get(app).txnDao())

    val settings: StateFlow<AppSettings> =
        prefs.settings.stateIn(viewModelScope, SharingStarted.Eagerly, AppSettings())

    val transactions: StateFlow<List<BkashTxnEntity>> =
        repo.observeAll().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    /** Transient parsed result awaiting user confirmation. */
    var pending by mutableStateOf<PendingParse?>(null)
        private set

    /** Recent assistant queries (local, in-memory + simple). */
    var assistantHistory by mutableStateOf<List<Pair<String, AssistantResult>>>(emptyList())
        private set

    fun parseToPending(text: String, source: String): Boolean {
        val p = repo.parse(text) ?: run { pending = null; return false }
        pending = PendingParse(p, source)
        return true
    }

    fun clearPending() { pending = null }

    fun confirmSave(parsed: ParsedTransaction, source: String) {
        viewModelScope.launch { repo.save(parsed, source); pending = null }
    }

    fun updateTransaction(e: BkashTxnEntity) = viewModelScope.launch { repo.update(e) }
    fun deleteTransaction(e: BkashTxnEntity) = viewModelScope.launch { repo.delete(e) }
    fun deleteAllData() = viewModelScope.launch { transactions.value.forEach { repo.delete(it) } }

    fun ask(query: String): AssistantResult {
        val result = AssistantEngine.answer(query, transactions.value)
        assistantHistory = (listOf(query to result) + assistantHistory).take(20)
        return result
    }

    fun setTheme(t: ThemeMode) = viewModelScope.launch { prefs.setTheme(t) }
    fun setLanguage(l: AppLanguage) = viewModelScope.launch { prefs.setLanguage(l) }
    fun setPlan(plan: String) = viewModelScope.launch { prefs.setPlan(plan) }
    fun setDeviceName(name: String) = viewModelScope.launch { prefs.setDeviceName(name) }
    fun setNotificationAccess(v: Boolean) = viewModelScope.launch { prefs.setNotificationAccess(v) }

    fun completeOnboarding(name: String, org: String, plan: String, lang: AppLanguage) =
        viewModelScope.launch { prefs.completeOnboarding(name, org, plan, lang) }

    fun signOut() = viewModelScope.launch { prefs.signOut() }

    fun isNotificationAccessGranted(): Boolean {
        val ctx = getApplication<Application>()
        val flat = Settings.Secure.getString(ctx.contentResolver, "enabled_notification_listeners") ?: return false
        return flat.contains(ctx.packageName)
    }
}
