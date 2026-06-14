import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { createOrganizationCollection } from '@/lib/qdrant-server'

export async function POST(request: NextRequest) {
  try {
    const { userId, name, slug } = await request.json()

    if (!userId || !name || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        owner_id: userId,
        name,
        slug,
        subscription_tier: 'starter',
        credit_balance: 500,
        billing_period_start: new Date().toISOString(),
      })
      .select()
      .single()

    if (orgError) {
      return NextResponse.json({ error: orgError.message }, { status: 400 })
    }

    // Create user record
    const { error: userError } = await supabase.from('users').insert({
      auth_id: userId,
      organization_id: org.id,
      email: 'pending',
      role: 'owner',
    })

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    // Create Qdrant collection
    await createOrganizationCollection(org.id)

    return NextResponse.json(org)
  } catch (error: any) {
    console.error('Organization creation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create organization' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('organization_id')
      .eq('auth_id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    const { data: org, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', userData.organization_id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(org)
  } catch (error: any) {
    console.error('Organization fetch error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch organization' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('organization_id')
      .eq('auth_id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    const body = await request.json()

    const { data: org, error } = await supabase
      .from('organizations')
      .update(body)
      .eq('id', userData.organization_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(org)
  } catch (error: any) {
    console.error('Organization update error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update organization' }, { status: 500 })
  }
}
