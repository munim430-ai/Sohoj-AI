import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthContext, audit } from '@/lib/server/auth'
import { evaluateSyncBatch, SyncItem, TxnSource } from '@/lib/server/entitlements'

export const dynamic = 'force-dynamic'

interface IncomingTxn {
  type: string
  amount: string
  fee: string
  balanceAfter?: string | null
  counterparty?: string | null
  trxId?: string | null
  occurredAtMillis?: number | null
  source: TxnSource
  dedupeHash: string
}

export async function POST(req: Request) {
  const ctx = await getAuthContext(req)
  if (!ctx) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const items: IncomingTxn[] = body?.items ?? []
  const deviceId: string | undefined = body?.deviceId

  // Device must belong to the org and be active.
  if (deviceId) {
    const { data: dev } = await supabaseAdmin
      .from('android_devices')
      .select('id, status, organization_id')
      .eq('id', deviceId)
      .single()
    if (!dev || dev.organization_id !== ctx.orgId || dev.status !== 'active') {
      return NextResponse.json({ error: 'device_invalid_or_revoked' }, { status: 403 })
    }
  }

  // Idempotency: which dedupe hashes already exist for this org?
  const hashes = items.map((i) => i.dedupeHash)
  const { data: existing } = await supabaseAdmin
    .from('bkash_transactions')
    .select('dedupe_hash')
    .eq('organization_id', ctx.orgId)
    .in('dedupe_hash', hashes.length ? hashes : ['__none__'])
  const known = new Set((existing ?? []).map((r) => r.dedupe_hash as string))

  // Current-month usage for limit enforcement.
  const period = new Date().toISOString().slice(0, 7) + '-01'
  const { count: usedCount } = await supabaseAdmin
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', ctx.orgId)
    .gte('period', period)

  const evalItems: SyncItem[] = items.map((i) => ({ dedupeHash: i.dedupeHash, source: i.source }))
  const result = evaluateSyncBatch(ctx.plan, usedCount ?? 0, known, evalItems)
  const acceptedHashes = new Set(result.accepted.map((a) => a.dedupeHash))

  const rows = items
    .filter((i) => acceptedHashes.has(i.dedupeHash))
    .map((i) => ({
      organization_id: ctx.orgId,
      device_id: deviceId ?? null,
      type: i.type,
      amount: i.amount,
      fee: i.fee,
      balance_after: i.balanceAfter ?? null,
      counterparty: i.counterparty ?? null,
      trx_id: i.trxId ?? null,
      occurred_at: i.occurredAtMillis ? new Date(i.occurredAtMillis).toISOString() : null,
      source: i.source,
      dedupe_hash: i.dedupeHash,
    }))

  if (rows.length) {
    await supabaseAdmin.from('bkash_transactions').upsert(rows, { onConflict: 'organization_id,dedupe_hash' })
    await supabaseAdmin.from('usage_events').insert(
      rows.map(() => ({ organization_id: ctx.orgId, kind: 'txn_ingested', quantity: 1 })),
    )
  }

  await supabaseAdmin.from('sync_batches').insert({
    organization_id: ctx.orgId,
    device_id: deviceId ?? null,
    item_count: items.length,
    accepted_count: result.accepted.length,
    rejected_count: result.rejected.length,
    status: 'completed',
  })
  await audit(ctx.orgId, ctx.authId, 'sync', 'bkash_transactions', {
    accepted: result.accepted.length,
    rejected: result.rejected.length,
  })

  return NextResponse.json({
    accepted: result.accepted.length,
    rejected: result.rejected.map((r) => ({ dedupeHash: r.item.dedupeHash, code: r.code, reason: r.reason })),
  })
}
