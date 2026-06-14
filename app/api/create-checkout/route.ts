export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createCheckout } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { organizationId, amount, creditsToAdd } = await request.json()

    if (!organizationId || !amount || !creditsToAdd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user has access to this organization
    const { data: userData } = await supabase
      .from('users')
      .select('organization_id')
      .eq('auth_id', user.id)
      .eq('organization_id', organizationId)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create checkout URL with aamarPay
    const checkoutUrl = await createCheckout({
      organizationId,
      amount,
      creditsToAdd,
    })

    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Checkout creation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create checkout' }, { status: 500 })
  }
}
