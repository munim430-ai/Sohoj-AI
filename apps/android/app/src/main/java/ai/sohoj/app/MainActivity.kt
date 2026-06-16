package ai.sohoj.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import ai.sohoj.app.ui.AppScaffold
import ai.sohoj.app.ui.AppViewModel
import ai.sohoj.app.ui.onboarding.OnboardingScreen
import ai.sohoj.app.ui.theme.SohojTheme

class MainActivity : ComponentActivity() {
    private val vm: AppViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleShare(intent)
        setContent {
            val settings by vm.settings.collectAsState()
            SohojTheme(settings.themeMode) {
                Surface(modifier = Modifier.fillMaxSize()) {
                    if (!settings.onboardingComplete) {
                        OnboardingScreen(vm)
                    } else {
                        AppScaffold(vm)
                    }
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleShare(intent)
    }

    /** Receive a bKash SMS shared from Messaging → route to the confirmation flow. */
    private fun handleShare(intent: Intent?) {
        if (intent?.action == Intent.ACTION_SEND && intent.type == "text/plain") {
            intent.getStringExtra(Intent.EXTRA_TEXT)?.let { vm.parseToPending(it, source = "sms_share") }
        }
    }
}
