package ai.sohoj.app.data

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import ai.sohoj.app.analytics.FinanceRecord
import ai.sohoj.app.parser.BkashParser
import ai.sohoj.app.parser.ParsedTransaction
import ai.sohoj.app.parser.TxnType
import kotlinx.coroutines.flow.Flow
import java.math.BigDecimal
import java.security.MessageDigest
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

val DHAKA: ZoneId = ZoneId.of("Asia/Dhaka")

@Entity(tableName = "bkash_transactions")
data class BkashTxnEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val type: String,
    val amount: String,
    val fee: String,
    val balanceAfter: String?,
    val counterparty: String?,
    val trxId: String?,
    val occurredAtMillis: Long?,
    val source: String,
    val dedupeHash: String,
    val synced: Boolean = false,
    val createdAtMillis: Long = System.currentTimeMillis(),
)

@Dao
interface TxnDao {
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insert(e: BkashTxnEntity): Long

    @Query("SELECT * FROM bkash_transactions ORDER BY occurredAtMillis DESC")
    fun observeAll(): Flow<List<BkashTxnEntity>>

    @Query("SELECT * FROM bkash_transactions ORDER BY occurredAtMillis DESC")
    suspend fun all(): List<BkashTxnEntity>

    @Query("SELECT * FROM bkash_transactions WHERE synced = 0")
    suspend fun unsynced(): List<BkashTxnEntity>

    @Query("UPDATE bkash_transactions SET synced = 1 WHERE id IN (:ids)")
    suspend fun markSynced(ids: List<Long>)

    @Query("SELECT COUNT(*) FROM bkash_transactions WHERE occurredAtMillis >= :sinceMillis")
    suspend fun countSince(sinceMillis: Long): Int
}

@Database(entities = [BkashTxnEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun txnDao(): TxnDao

    companion object {
        @Volatile private var instance: AppDatabase? = null
        fun get(context: Context): AppDatabase = instance ?: synchronized(this) {
            instance ?: Room.databaseBuilder(
                context.applicationContext, AppDatabase::class.java, "sohojai.db"
            ).build().also { instance = it }
        }
    }
}

/** Bridges parser → storage → analytics. */
class TransactionRepository(private val dao: TxnDao) {

    /** Parse a raw message and persist if it is a recognised bKash transaction. */
    suspend fun ingest(message: String, source: String): ParsedTransaction? {
        val parsed = BkashParser.parse(message) ?: return null
        dao.insert(parsed.toEntity(source))
        return parsed
    }

    fun observeAll(): Flow<List<BkashTxnEntity>> = dao.observeAll()
    suspend fun unsynced(): List<BkashTxnEntity> = dao.unsynced()
    suspend fun markSynced(ids: List<Long>) = dao.markSynced(ids)

    suspend fun financeRecords(): List<FinanceRecord> = dao.all().map { it.toRecord() }
}

fun ParsedTransaction.toEntity(source: String): BkashTxnEntity {
    val occurredMillis = occurredAt?.atZone(DHAKA)?.toInstant()?.toEpochMilli()
    val dedupe = sha256("${trxId ?: ""}|${amount.toPlainString()}|${occurredMillis ?: 0}")
    return BkashTxnEntity(
        type = type.name,
        amount = amount.toPlainString(),
        fee = fee.toPlainString(),
        balanceAfter = balanceAfter?.toPlainString(),
        counterparty = counterparty,
        trxId = trxId,
        occurredAtMillis = occurredMillis,
        source = source,
        dedupeHash = dedupe,
    )
}

fun BkashTxnEntity.toRecord(): FinanceRecord = FinanceRecord(
    type = runCatching { TxnType.valueOf(type) }.getOrDefault(TxnType.BALANCE_UPDATE),
    amount = BigDecimal(amount),
    fee = BigDecimal(fee),
    occurredAt = occurredAtMillis?.let {
        LocalDateTime.ofInstant(Instant.ofEpochMilli(it), DHAKA)
    },
)

private fun sha256(s: String): String =
    MessageDigest.getInstance("SHA-256").digest(s.toByteArray())
        .joinToString("") { "%02x".format(it) }
