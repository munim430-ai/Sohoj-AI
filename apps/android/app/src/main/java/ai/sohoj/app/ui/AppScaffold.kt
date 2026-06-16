package ai.sohoj.app.ui

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.ReceiptLong
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import ai.sohoj.app.ui.assistant.AssistantScreen
import ai.sohoj.app.ui.home.HomeScreen
import ai.sohoj.app.ui.reports.ReportsScreen
import ai.sohoj.app.ui.settings.SettingsScreen
import ai.sohoj.app.ui.transactions.ConfirmScreen
import ai.sohoj.app.ui.transactions.ManualEntryScreen
import ai.sohoj.app.ui.transactions.TransactionDetailScreen
import ai.sohoj.app.ui.transactions.TransactionsScreen
import ai.sohoj.app.ui.subscription.PlanScreen

object Routes {
    const val HOME = "home"
    const val TRANSACTIONS = "transactions"
    const val ASSISTANT = "assistant"
    const val REPORTS = "reports"
    const val SETTINGS = "settings"
    const val DETAIL = "detail/{id}"
    const val CONFIRM = "confirm"
    const val MANUAL = "manual_entry"
    const val PLAN = "plan"
    fun detail(id: Long) = "detail/$id"
}

private data class Tab(val route: String, val label: String, val icon: ImageVector)

private val tabs = listOf(
    Tab(Routes.HOME, "Home", Icons.Filled.Home),
    Tab(Routes.TRANSACTIONS, "Transactions", Icons.Filled.ReceiptLong),
    Tab(Routes.ASSISTANT, "Assistant", Icons.Filled.AutoAwesome),
    Tab(Routes.REPORTS, "Reports", Icons.Filled.BarChart),
    Tab(Routes.SETTINGS, "Settings", Icons.Filled.Settings),
)

@Composable
fun AppScaffold(vm: AppViewModel) {
    val nav = rememberNavController()

    // Route a freshly parsed (shared/pasted) transaction to the confirmation screen.
    LaunchedEffect(vm.pending) {
        if (vm.pending != null) nav.navigate(Routes.CONFIRM)
    }

    val backStackEntry by nav.currentBackStackEntryAsState()
    val current = backStackEntry?.destination?.route
    val showBar = current in tabs.map { it.route }

    Scaffold(
        bottomBar = {
            if (showBar) {
                NavigationBar {
                    tabs.forEach { tab ->
                        NavigationBarItem(
                            selected = current == tab.route,
                            onClick = {
                                if (current != tab.route) {
                                    nav.navigate(tab.route) {
                                        popUpTo(Routes.HOME) { saveState = true }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            },
                            icon = { Icon(tab.icon, contentDescription = tab.label) },
                            label = { Text(tab.label) },
                        )
                    }
                }
            }
        },
    ) { inner ->
        NavHost(nav, startDestination = Routes.HOME, modifier = Modifier.padding(inner)) {
            tabGraph(vm, nav)
        }
    }
}

private fun NavGraphBuilder.tabGraph(vm: AppViewModel, nav: androidx.navigation.NavHostController) {
    composable(Routes.HOME) { HomeScreen(vm, nav) }
    composable(Routes.TRANSACTIONS) { TransactionsScreen(vm, nav) }
    composable(Routes.ASSISTANT) { AssistantScreen(vm) }
    composable(Routes.REPORTS) { ReportsScreen(vm) }
    composable(Routes.SETTINGS) { SettingsScreen(vm, nav) }
    composable(Routes.CONFIRM) { ConfirmScreen(vm, nav) }
    composable(Routes.MANUAL) { ManualEntryScreen(vm, nav) }
    composable(Routes.PLAN) { PlanScreen(vm, nav) }
    composable(Routes.DETAIL) { entry ->
        val id = entry.arguments?.getString("id")?.toLongOrNull() ?: 0L
        TransactionDetailScreen(vm, nav, id)
    }
}
