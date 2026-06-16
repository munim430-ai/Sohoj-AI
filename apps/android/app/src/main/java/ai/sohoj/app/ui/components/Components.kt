package ai.sohoj.app.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.CallMade
import androidx.compose.material.icons.automirrored.filled.CallReceived
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Inbox
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material.icons.filled.SwapHoriz
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import ai.sohoj.app.parser.TxnType
import ai.sohoj.app.ui.theme.NegativeRed
import ai.sohoj.app.ui.theme.PositiveGreen
import ai.sohoj.app.ui.theme.WarnAmber
import java.math.BigDecimal
import java.text.DecimalFormat

private val df = DecimalFormat("#,##0.00")
fun fmtTaka(b: BigDecimal): String = "৳" + df.format(b)
fun fmtTaka(s: String): String = runCatching { fmtTaka(BigDecimal(s)) }.getOrDefault("৳$s")

fun txnTypeLabel(type: String): String = when (type) {
    "CASH_IN" -> "Cash In"
    "CASH_OUT" -> "Cash Out"
    "SEND_MONEY_SENT" -> "Send Money"
    "SEND_MONEY_RECEIVED" -> "Received"
    "MERCHANT_PAYMENT" -> "Payment"
    "CHARGE" -> "Charge"
    "BALANCE_UPDATE" -> "Balance"
    else -> type
}

fun txnTypeIcon(type: String): ImageVector = when (type) {
    "CASH_IN" -> Icons.AutoMirrored.Filled.CallReceived
    "SEND_MONEY_RECEIVED" -> Icons.AutoMirrored.Filled.CallReceived
    "CASH_OUT" -> Icons.AutoMirrored.Filled.CallMade
    "SEND_MONEY_SENT" -> Icons.Filled.SwapHoriz
    "MERCHANT_PAYMENT" -> Icons.Filled.Storefront
    "CHARGE" -> Icons.Filled.Receipt
    "BALANCE_UPDATE" -> Icons.Filled.AccountBalanceWallet
    else -> Icons.Filled.Bolt
}

@Composable
fun txnTypeColor(type: String): Color = when (type) {
    "CASH_IN", "SEND_MONEY_RECEIVED" -> PositiveGreen
    "CASH_OUT", "SEND_MONEY_SENT", "MERCHANT_PAYMENT" -> NegativeRed
    "CHARGE" -> WarnAmber
    else -> MaterialTheme.colorScheme.onSurfaceVariant
}

fun isReceived(type: String) = type == "CASH_IN" || type == "SEND_MONEY_RECEIVED"

@Composable
fun SectionCard(
    modifier: Modifier = Modifier,
    title: String? = null,
    content: @Composable () -> Unit,
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 1.dp,
        shadowElevation = 1.dp,
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            if (title != null) {
                Text(title, style = MaterialTheme.typography.titleMedium)
            }
            content()
        }
    }
}

@Composable
fun StatTile(label: String, value: String, accent: Color = MaterialTheme.colorScheme.onSurface, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
    ) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(value, style = MaterialTheme.typography.titleLarge, color = accent, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun StatLine(label: String, value: String, accent: Color = MaterialTheme.colorScheme.onSurface) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, fontWeight = FontWeight.SemiBold, color = accent)
    }
}

@Composable
fun ConfidenceChip(confidence: String) {
    if (confidence == "LOW") {
        Surface(shape = RoundedCornerShape(8.dp), color = WarnAmber.copy(alpha = 0.16f)) {
            Text(
                "Needs review",
                color = WarnAmber,
                style = MaterialTheme.typography.labelMedium,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
            )
        }
    }
}

@Composable
fun EmptyState(icon: ImageVector, title: String, subtitle: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.fillMaxWidth().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Surface(shape = RoundedCornerShape(50), color = MaterialTheme.colorScheme.surfaceVariant) {
            Icon(icon, null, modifier = Modifier.padding(18.dp).size(28.dp), tint = MaterialTheme.colorScheme.primary)
        }
        Text(title, style = MaterialTheme.typography.titleMedium)
        Text(subtitle, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun LoadingState(modifier: Modifier = Modifier) {
    Box(modifier.fillMaxSize().padding(32.dp), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
fun UsageBar(used: Int, limit: Int) {
    val fraction = if (limit <= 0) 0f else (used.toFloat() / limit).coerceIn(0f, 1f)
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        StatLine("Usage", if (limit <= 0) "$used (manual)" else "$used / $limit")
        LinearProgressIndicator(
            progress = { fraction },
            modifier = Modifier.fillMaxWidth(),
        )
    }
}

fun emptyInboxIcon(): ImageVector = Icons.Filled.Inbox
