export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAndApply } from '@/lib/payment'
import { serverEnv } from '@/lib/env'

/**
 * aamarPay posts the transaction result here on completion. We only read the
 * transaction id from the callback and then verify everything server-to-server;
 * amounts and status from the request body are never trusted.
 */
export async function POST(request: NextRequest) {
  let tranId: string | null = null
  try {
    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      tranId = body.mer_txnid || body.tran_id || null
    } else {
      const form = await request.formData()
      tranId = (form.get('mer_txnid') as string) || (form.get('tran_id') as string) || null
    }
  } catch {
    tranId = null
  }

  const base = serverEnv.appUrl
  if (!tranId) {
    return NextResponse.redirect(new URL('/billing?status=error', base), 303)
  }

  try {
    const result = await verifyAndApply(tranId)
    const status = result.ok ? 'success' : 'failed'
    return NextResponse.redirect(new URL(`/billing?status=${status}`, base), 303)
  } catch (error) {
    console.error('Payment webhook error:', error)
    return NextResponse.redirect(new URL('/billing?status=error', base), 303)
  }
}
