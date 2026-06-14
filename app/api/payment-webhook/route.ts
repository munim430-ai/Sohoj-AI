import { NextRequest, NextResponse } from 'next/server'
import { processPaymentWebhook } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // aamarPay sends data as query parameters
    const transactionId = searchParams.get('transactionId')
    const amount = searchParams.get('amount')
    const signature = searchParams.get('signature')

    if (!transactionId || !amount || !signature) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const result = await processPaymentWebhook({
      transactionId,
      amount,
      signature,
    })

    if (!result.success) {
      return NextResponse.json({ error: 'Payment processing failed' }, { status: 400 })
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/billing?success=true', request.url))
  } catch (error: any) {
    console.error('Payment webhook error:', error)
    return NextResponse.redirect(new URL('/billing?error=' + encodeURIComponent(error.message), request.url))
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // aamarPay sends data as query parameters
    const transactionId = searchParams.get('transactionId')
    const amount = searchParams.get('amount')
    const signature = searchParams.get('signature')
    const status = searchParams.get('status')

    if (status === 'failed') {
      return NextResponse.redirect(new URL('/billing?error=Payment failed', request.url))
    }

    if (status === 'cancelled') {
      return NextResponse.redirect(new URL('/billing?cancelled=true', request.url))
    }

    if (!transactionId || !amount || !signature) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const result = await processPaymentWebhook({
      transactionId,
      amount,
      signature,
    })

    if (!result.success) {
      return NextResponse.redirect(new URL('/billing?error=Payment verification failed', request.url))
    }

    return NextResponse.redirect(new URL('/billing?success=true', request.url))
  } catch (error: any) {
    console.error('Payment webhook error:', error)
    return NextResponse.redirect(new URL('/billing?error=' + encodeURIComponent(error.message), request.url))
  }
}
