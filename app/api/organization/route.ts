export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { requireAuth, AuthError } from '@/lib/auth-helpers'
import { createOrganizationCollection } from '@/lib/qdrant-server'
import { createOrgSchema, updateOrgSchema } from '@/lib/validation'

// POST creates an organization for the just-signed-up user. The user id comes
// from the authenticated session — not the request body.
export async function POST(request: NextRequest) {
  let auth
  try {
    const { createServerSupabase } = await import('@/lib/supabase-server')
    const supabase = createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    auth = { userId: user.id, email: user.email ?? '' }
  } catch {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const parsed = createOrgSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }

  const admin = supabaseAdmin()

  // Enforce one organization per user.
  const { data: existing } = await admin
    .from('users')
    .select('organization_id')
    .eq('auth_id', auth.userId)
    .maybeSingle()
  if (existing) {
    return NextResponse.json({ error: 'User already has an organization' }, { status: 409 })
  }

  const { data: org, error: orgError } = await admin
    .from('organizations')
    .insert({
      owner_id: auth.userId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      subscription_tier: 'starter',
      credit_balance: 500,
      billing_period_start: new Date().toISOString(),
    })
    .select()
    .single()

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 400 })
  }

  await admin.from('users').insert({
    auth_id: auth.userId,
    organization_id: org.id,
    email: auth.email,
    role: 'owner',
  })

  await createOrganizationCollection(org.id)
  return NextResponse.json(org)
}

export async function GET() {
  try {
    const auth = await requireAuth()
    const { data: org, error } = await supabaseAdmin()
      .from('organizations')
      .select('*')
      .eq('id', auth.organizationId)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(org)
  } catch (e) {
    const status = e instanceof AuthError ? e.status : 401
    return NextResponse.json({ error: 'Authentication required' }, { status })
  }
}

export async function PUT(request: NextRequest) {
  let auth
  try {
    auth = await requireAuth()
  } catch (e) {
    const status = e instanceof AuthError ? e.status : 401
    return NextResponse.json({ error: 'Authentication required' }, { status })
  }

  const parsed = updateOrgSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }

  // Custom domains are an Enterprise-only capability — enforce server-side.
  if (parsed.data.custom_domain) {
    const { data: org } = await supabaseAdmin()
      .from('organizations')
      .select('subscription_tier')
      .eq('id', auth.organizationId)
      .single()
    if (org?.subscription_tier !== 'enterprise') {
      return NextResponse.json(
        { error: 'Custom domains require the Enterprise plan' },
        { status: 403 },
      )
    }
  }

  const { data: updated, error } = await supabaseAdmin()
    .from('organizations')
    .update(parsed.data)
    .eq('id', auth.organizationId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(updated)
}
