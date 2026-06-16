import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthContext, audit } from '@/lib/server/auth'
import { evaluateDeviceRegistration } from '@/lib/server/entitlements'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const ctx = await getAuthContext(req)
  if (!ctx) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const deviceHash: string | undefined = body?.deviceHash
  const deviceLabel: string | undefined = body?.deviceLabel
  if (!deviceHash) return NextResponse.json({ error: 'deviceHash required' }, { status: 400 })

  const { count } = await supabaseAdmin
    .from('android_devices')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', ctx.orgId)
    .eq('status', 'active')

  const decision = evaluateDeviceRegistration(ctx.plan, count ?? 0)
  if (!decision.allowed) {
    return NextResponse.json({ error: decision.code, reason: decision.reason }, { status: 402 })
  }

  const { data, error } = await supabaseAdmin
    .from('android_devices')
    .upsert(
      { organization_id: ctx.orgId, auth_id: ctx.authId, device_hash: deviceHash, device_label: deviceLabel ?? null, status: 'active' },
      { onConflict: 'organization_id,device_hash' },
    )
    .select('id')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await audit(ctx.orgId, ctx.authId, 'device.register', 'android_devices', { deviceId: data?.id })
  return NextResponse.json({ deviceId: data?.id })
}

/** Device revocation (owner/admin). */
export async function DELETE(req: Request) {
  const ctx = await getAuthContext(req)
  if (!ctx) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (ctx.role !== 'owner' && ctx.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const deviceId = new URL(req.url).searchParams.get('deviceId')
  if (!deviceId) return NextResponse.json({ error: 'deviceId required' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('android_devices')
    .update({ status: 'revoked', revoked_at: new Date().toISOString() })
    .eq('id', deviceId)
    .eq('organization_id', ctx.orgId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await audit(ctx.orgId, ctx.authId, 'device.revoke', 'android_devices', { deviceId })
  return NextResponse.json({ revoked: true })
}
