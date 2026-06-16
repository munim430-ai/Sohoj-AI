package ai.sohoj.app.prefs

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import ai.sohoj.app.ui.theme.ThemeMode
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "sohoj_settings")

enum class AppLanguage { BN, EN }

data class AppSettings(
    val onboardingComplete: Boolean = false,
    val signedIn: Boolean = false,
    val language: AppLanguage = AppLanguage.EN,
    val themeMode: ThemeMode = ThemeMode.SYSTEM,
    val plan: String = "free",
    val displayName: String = "",
    val orgName: String = "",
    val deviceName: String = "My Phone",
    val notificationAccess: Boolean = false,
)

class AppPreferences(private val context: Context) {
    private object Keys {
        val ONBOARDED = booleanPreferencesKey("onboarded")
        val SIGNED_IN = booleanPreferencesKey("signed_in")
        val LANG = stringPreferencesKey("language")
        val THEME = stringPreferencesKey("theme")
        val PLAN = stringPreferencesKey("plan")
        val NAME = stringPreferencesKey("display_name")
        val ORG = stringPreferencesKey("org_name")
        val DEVICE = stringPreferencesKey("device_name")
        val NOTIF = booleanPreferencesKey("notif_access")
    }

    val settings: Flow<AppSettings> = context.dataStore.data.map { p ->
        AppSettings(
            onboardingComplete = p[Keys.ONBOARDED] ?: false,
            signedIn = p[Keys.SIGNED_IN] ?: false,
            language = runCatching { AppLanguage.valueOf(p[Keys.LANG] ?: "EN") }.getOrDefault(AppLanguage.EN),
            themeMode = runCatching { ThemeMode.valueOf(p[Keys.THEME] ?: "SYSTEM") }.getOrDefault(ThemeMode.SYSTEM),
            plan = p[Keys.PLAN] ?: "free",
            displayName = p[Keys.NAME] ?: "",
            orgName = p[Keys.ORG] ?: "",
            deviceName = p[Keys.DEVICE] ?: "My Phone",
            notificationAccess = p[Keys.NOTIF] ?: false,
        )
    }

    suspend fun setLanguage(l: AppLanguage) = context.dataStore.edit { it[Keys.LANG] = l.name }
    suspend fun setTheme(t: ThemeMode) = context.dataStore.edit { it[Keys.THEME] = t.name }
    suspend fun setPlan(plan: String) = context.dataStore.edit { it[Keys.PLAN] = plan }
    suspend fun setNotificationAccess(v: Boolean) = context.dataStore.edit { it[Keys.NOTIF] = v }
    suspend fun setDeviceName(v: String) = context.dataStore.edit { it[Keys.DEVICE] = v }

    suspend fun completeOnboarding(name: String, org: String, plan: String, lang: AppLanguage) =
        context.dataStore.edit {
            it[Keys.ONBOARDED] = true
            it[Keys.SIGNED_IN] = true
            it[Keys.NAME] = name
            it[Keys.ORG] = org
            it[Keys.PLAN] = plan
            it[Keys.LANG] = lang.name
        }

    suspend fun signOut() = context.dataStore.edit {
        it[Keys.SIGNED_IN] = false
        it[Keys.ONBOARDED] = false
    }
}
