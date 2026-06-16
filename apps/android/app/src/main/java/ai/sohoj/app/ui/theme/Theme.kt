package ai.sohoj.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

private val Electric = Color(0xFF274DFE)
private val Azure = Color(0xFF518CFF)
private val Navy = Color(0xFF1A1D54)
private val Slate = Color(0xFFF6F8FC)
private val Emerald = Color(0xFF12A150)
private val Rose = Color(0xFFE5484D)
private val Amber = Color(0xFFE9A23B)

val PositiveGreen = Emerald
val NegativeRed = Rose
val WarnAmber = Amber

private val LightColors = lightColorScheme(
    primary = Electric,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFDCE3FF),
    onPrimaryContainer = Navy,
    secondary = Azure,
    onSecondary = Color.White,
    tertiary = Emerald,
    background = Slate,
    onBackground = Navy,
    surface = Color.White,
    onSurface = Navy,
    surfaceVariant = Color(0xFFEEF1F8),
    onSurfaceVariant = Color(0xFF53607A),
    outline = Color(0xFFCAD2E3),
    error = Rose,
)

private val DarkColors = darkColorScheme(
    primary = Azure,
    onPrimary = Color(0xFF0A1030),
    primaryContainer = Color(0xFF22305E),
    onPrimaryContainer = Color(0xFFDCE3FF),
    secondary = Azure,
    onSecondary = Color(0xFF0A1030),
    tertiary = Color(0xFF49D98A),
    background = Color(0xFF0C0F1A),
    onBackground = Color(0xFFE6E9F2),
    surface = Color(0xFF141828),
    onSurface = Color(0xFFE6E9F2),
    surfaceVariant = Color(0xFF1E2334),
    onSurfaceVariant = Color(0xFF9AA4BE),
    outline = Color(0xFF2C3450),
    error = Color(0xFFFF6B6F),
)

private val AppTypography = Typography(
    headlineLarge = TextStyle(fontWeight = FontWeight.Bold, fontSize = 30.sp, lineHeight = 36.sp),
    headlineSmall = TextStyle(fontWeight = FontWeight.Bold, fontSize = 22.sp, lineHeight = 28.sp),
    titleLarge = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 20.sp, lineHeight = 26.sp),
    titleMedium = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 16.sp, lineHeight = 22.sp),
    bodyLarge = TextStyle(fontWeight = FontWeight.Normal, fontSize = 16.sp, lineHeight = 22.sp),
    bodyMedium = TextStyle(fontWeight = FontWeight.Normal, fontSize = 14.sp, lineHeight = 20.sp),
    labelLarge = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 14.sp, lineHeight = 18.sp),
    labelMedium = TextStyle(fontWeight = FontWeight.Medium, fontSize = 12.sp, lineHeight = 16.sp),
)

enum class ThemeMode { SYSTEM, LIGHT, DARK }

@Composable
fun SohojTheme(themeMode: ThemeMode = ThemeMode.SYSTEM, content: @Composable () -> Unit) {
    val dark = when (themeMode) {
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
    }
    MaterialTheme(
        colorScheme = if (dark) DarkColors else LightColors,
        typography = AppTypography,
        content = content,
    )
}
