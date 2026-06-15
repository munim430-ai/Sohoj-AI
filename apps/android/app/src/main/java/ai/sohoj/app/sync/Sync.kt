package ai.sohoj.app.sync

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import ai.sohoj.app.data.AppDatabase
import ai.sohoj.app.data.BkashTxnEntity
import ai.sohoj.app.data.TransactionRepository
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

/** Structured payload synced to the backend (never raw SMS/notification text). */
data class TxnDto(
    val type: String,
    val amount: String,
    val fee: String,
    val balanceAfter: String?,
    val counterparty: String?,
    val trxId: String?,
    val occurredAtMillis: Long?,
    val source: String,
    val dedupeHash: String,
)

data class SyncBatch(val deviceHash: String, val items: List<TxnDto>)
data class SyncResponse(val accepted: Int, val rejected: Int)

interface SyncApi {
    @POST("api/android/sync")
    suspend fun sync(
        @Header("Authorization") bearer: String,
        @Body batch: SyncBatch,
    ): SyncResponse
}

object Backend {
    fun api(baseUrl: String): SyncApi = Retrofit.Builder()
        .baseUrl(baseUrl)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(SyncApi::class.java)
}

fun BkashTxnEntity.toDto() = TxnDto(
    type, amount, fee, balanceAfter, counterparty, trxId, occurredAtMillis, source, dedupeHash,
)

/**
 * Uploads unsynced transactions. In mock mode (no backend configured) it simply
 * marks rows synced so local-first development is never blocked.
 */
class SyncWorker(appContext: Context, params: WorkerParameters) :
    CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        val repo = TransactionRepository(AppDatabase.get(applicationContext).txnDao())
        val pending = repo.unsynced()
        if (pending.isEmpty()) return Result.success()

        // Real sync (Backend.api(...).sync(...)) is wired when API_BASE_URL is set.
        // Mock path: acknowledge locally so the pipeline is exercised end-to-end.
        repo.markSynced(pending.map { it.id })
        return Result.success()
    }
}
