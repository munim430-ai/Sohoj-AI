package ai.sohoj.app.ingest

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import ai.sohoj.app.data.AppDatabase
import ai.sohoj.app.data.TransactionRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/**
 * Reads notification text and hands it to the deterministic parser. The parser
 * returns null for anything that is not a bKash transaction, so unrelated
 * notifications are never persisted. We never store the raw notification.
 */
class BkashNotificationListenerService : NotificationListenerService() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val extras = sbn.notification?.extras ?: return
        val text = buildString {
            extras.getCharSequence(Notification.EXTRA_TEXT)?.let { append(it).append(' ') }
            extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.let { append(it) }
        }.trim()
        if (text.isBlank()) return

        val repo = TransactionRepository(AppDatabase.get(applicationContext).txnDao())
        scope.launch { repo.ingest(text, source = "notification") }
    }
}
