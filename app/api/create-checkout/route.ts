export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthError } from '@/lib/auth-helpers'
import { createCheckout } from '@/lib/payment'
import { checkoutSchema } from '@/lib/validation'
import { rateLimit, clientKey } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = rateLimit(clientKey(request, 'checkout'), 10, 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  let auth
  try {
    auth = await requireAuth()
  } catch (e) {
    const status = e instanceof AuthError ? e.status : 401
    return NextResponse.json({ error: 'Authentication required' }, { status })
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }

  try {
    // organizationId is taken from the session, never from the client.
    const url = await createCheckout({
      organizationId: auth.organizationId,
      amount: parsed.data.amount,
      creditsToAdd: parsed.data.creditsToAdd,
      customer: { name: 'Customer', email: auth.email, phone: '01700000000' },
    })
    return NextResponse.json({ url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to start checkout' }, { status: 500 })
  }
}
