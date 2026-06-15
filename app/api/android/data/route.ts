import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthContext, audit } from '@/lib/server/auth'

export const dynamic = 'force-dynamic'

/** Data export — returns all of the org's transactions (data-portability right). */
export async function GET(req: Request) {
  const ctx = await getAuthContext(req)
  if (!ctx) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data } = await supabaseAdmin
    .from('bkash_transactions')
    .select('*')
    .eq('organization_id', ctx.orgId)
    .order('occurred_at', { ascending: false })

  await audit(ctx.orgId, ctx.authId, 'data.export', 'bkash_transactions', { rows: data?.length ?? 0 })
  return NextResponse.json({ organizationId: ctx.orgId, exportedAt: new Date().toISOString(), transactions: data ?? [] })
}

/** Data deletion — owner only. Removes the org's transactions and devices. */
export async function DELETE(req: Request) {
  const ctx = await getAuthContext(req)
  if (!ctx) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (ctx.role !== 'owner') return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  await supabaseAdmin.from('bkash_transactions').delete().eq('organization_id', ctx.orgId)
  await supabaseAdmin.from('android_devices').delete().eq('organization_id', ctx.orgId)
  await audit(ctx.orgId, ctx.authId, 'data.delete', 'organization', { scope: 'transactions+devices' })
  return NextResponse.json({ deleted: true })
}
