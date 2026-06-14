export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { withCors, preflight } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return preflight(request)
}

/**
 * Public, read-only branding for the embeddable widget. Returns only the
 * fields needed to render the widget chrome — never credits, domains, or PII.
 */
export async function GET(request: NextRequest) {
  const orgId = new URL(request.url).searchParams.get('org_id')
  if (!orgId) {
    return withCors(request, NextResponse.json({ error: 'org_id required' }, { status: 400 }))
  }

  const { data, error } = await supabaseAdmin()
    .from('organizations')
    .select('branding')
    .eq('id', orgId)
    .single()

  if (error || !data) {
    return withCors(request, NextResponse.json({ error: 'Not found' }, { status: 404 }))
  }

  return withCors(request, NextResponse.json({ branding: data.branding }))
}
