import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthContext, audit } from '@/lib/server/auth'
import { getPaymentProvider, subscribe } from '@/lib/server/billing'
import { limitsFor, Plan } from '@/lib/server/plans'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const ctx = await getAuthContext(req)
  if (!ctx) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (ctx.role !== 'owner') return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const plan: Plan = body?.plan
  if (!['free', 'basic', 'pro'].includes(plan)) {
    return NextResponse.json({ error: 'invalid plan' }, { status: 400 })
  }

  // Mock payment (no live gateway).
  let checkout
  try {
    checkout = await getPaymentProvider().createCheckout(plan, ctx.orgId)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 501 })
  }

  const sub = subscribe(plan)
  const limits = limitsFor(plan)
  await supabaseAdmin.from('subscriptions').upsert(
    {
      organization_id: ctx.orgId,
      plan,
      status: sub.status,
      device_limit: limits.deviceLimit,
      monthly_txn_limit: limits.monthlyTxnLimit,
      auto_renew: sub.autoRenew,
      current_period_start: sub.currentPeriodStart,
      current_period_end: sub.currentPeriodEnd,
      provider: getPaymentProvider().name,
      provider_ref: checkout.reference,
    },
    { onConflict: 'organization_id' },
  )

  await audit(ctx.orgId, ctx.authId, 'billing.subscribe', 'subscriptions', { plan, ref: checkout.reference })
  return NextResponse.json({ plan, status: sub.status, checkout })
}
