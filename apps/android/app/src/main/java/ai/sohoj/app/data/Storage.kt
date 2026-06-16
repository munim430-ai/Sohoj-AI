package ai.sohoj.app.data

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Delete
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.Update
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
    val confidence: String = "HIGH",
    val tag: String? = null,
    val synced: Boolean = false,
    val createdAtMillis: Long = System.currentTimeMillis(),
)

@Dao
interface TxnDao {
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insert(e: BkashTxnEntity): Long

    @Update suspend fun update(e: BkashTxnEntity)
    @Delete suspend fun delete(e: BkashTxnEntity)

    @Query("SELECT * FROM bkash_transactions ORDER BY occurredAtMillis DESC, id DESC")
    fun observeAll(): Flow<List<BkashTxnEntity>>

    @Query("SELECT * FROM bkash_transactions WHERE id = :id")
    suspend fun byId(id: Long): BkashTxnEntity?

    @Query("SELECT * FROM bkash_transactions ORDER BY occurredAtMillis DESC")
    suspend fun all(): List<BkashTxnEntity>

    @Query("SELECT * FROM bkash_transactions WHERE synced = 0")
    suspend fun unsynced(): List<BkashTxnEntity>

    @Query("UPDATE bkash_transactions SET synced = 1 WHERE id IN (:ids)")
    suspend fun markSynced(ids: List<Long>)

    @Query("SELECT COUNT(*) FROM bkash_transactions WHERE trxId = :trxId AND trxId IS NOT NULL")
    suspend fun countByTrxId(trxId: String): Int
}

@Database(entities = [BkashTxnEntity::class], version = 2, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun txnDao(): TxnDao

    companion object {
        @Volatile private var instance: AppDatabase? = null
        fun get(context: Context): AppDatabase = instance ?: synchronized(this) {
            instance ?: Room.databaseBuilder(
                context.applicationContext, AppDatabase::class.java, "sohojai.db",
            ).fallbackToDestructiveMigration().build().also { instance = it }
        }
    }
}

class TransactionRepository(private val dao: TxnDao) {

    /** Parse only — does NOT save. Used by confirmation flows. */
    fun parse(message: String): ParsedTransaction? = BkashParser.parse(message)

    /** Parse + persist (used by automatic ingestion that needs no confirmation). */
    suspend fun ingest(message: String, source: String): ParsedTransaction? {
        val parsed = BkashParser.parse(message) ?: return null
        save(parsed, source)
        return parsed
    }

    suspend fun save(parsed: ParsedTransaction, source: String): Long = dao.insert(parsed.toEntity(source))

    fun observeAll(): Flow<List<BkashTxnEntity>> = dao.observeAll()
    suspend fun byId(id: Long): BkashTxnEntity? = dao.byId(id)
    suspend fun update(e: BkashTxnEntity) = dao.update(e)
    suspend fun delete(e: BkashTxnEntity) = dao.delete(e)
    suspend fun unsynced(): List<BkashTxnEntity> = dao.unsynced()
    suspend fun markSynced(ids: List<Long>) = dao.markSynced(ids)
    suspend fun isDuplicateTrx(trxId: String?): Boolean = trxId != null && dao.countByTrxId(trxId) > 1
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
        confidence = confidence.name,
    )
}

fun BkashTxnEntity.toRecord(): FinanceRecord = FinanceRecord(
    type = runCatching { TxnType.valueOf(type) }.getOrDefault(TxnType.BALANCE_UPDATE),
    amount = BigDecimal(amount),
    fee = BigDecimal(fee),
    occurredAt = occurredAtMillis?.let { LocalDateTime.ofInstant(Instant.ofEpochMilli(it), DHAKA) },
)

fun BkashTxnEntity.occurredDateTime(): LocalDateTime? =
    occurredAtMillis?.let { LocalDateTime.ofInstant(Instant.ofEpochMilli(it), DHAKA) }

private fun sha256(s: String): String =
    MessageDigest.getInstance("SHA-256").digest(s.toByteArray()).joinToString("") { "%02x".format(it) }
