import axios from 'axios'
import crypto from 'crypto'
import { supabase } from './supabase'

const AAMARPAY_STORE_ID = process.env.AAMARPAY_STORE_ID!
const AAMARPAY_SIGNATURE_KEY = process.env.AAMARPAY_SIGNATURE_KEY!
const AAMARPAY_SANDBOX = process.env.AAMARPAY_SANDBOX === 'true'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

const AAMARPAY_ENDPOINT = AAMARPAY_SANDBOX
  ? 'https://sandbox.aamarpay.com'
  : 'https://api.aamarpay.com'

export interface CheckoutPayload {
  organizationId: string
  amount: number
  creditsToAdd: number
}

export async function createCheckout(payload: CheckoutPayload): Promise<string> {
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`

  const checkoutData = {
    store_id: AAMARPAY_STORE_ID,
    amount: payload.amount,
    payment_type: 'webstore',
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${APP_URL}/api/payment-webhook?status=success`,
    fail_url: `${APP_URL}/api/payment-webhook?status=failed`,
    cancel_url: `${APP_URL}/billing?cancelled=true`,
    desc: `ShahojAI Credits Purchase - ${payload.creditsToAdd} credits`,
    cus_name: 'Customer',
    cus_email: 'customer@example.com',
    cus_add1: 'Bangladesh',
    cus_phone: '8801700000000',
  }

  // Store payment record
  const { error } = await supabase.from('payments').insert({
    organization_id: payload.organizationId,
    amount: payload.amount,
    currency: 'BDT',
    status: 'pending',
    aamarpay_txn_id: transactionId,
    credits_purchased: payload.creditsToAdd,
  })

  if (error) {
    throw new Error(`Failed to create payment record: ${error.message}`)
  }

  // Return payment link
  const checkoutUrl = `${AAMARPAY_ENDPOINT}/request.php`

  return `${checkoutUrl}?${new URLSearchParams(checkoutData as any).toString()}`
}

export function verifyPaymentSignature(
  transactionId: string,
  amount: string,
  signature: string,
): boolean {
  const signatureString = `${AAMARPAY_STORE_ID}${transactionId}${amount}${AAMARPAY_SIGNATURE_KEY}`
  const expectedSignature = crypto
    .createHash('md5')
    .update(signatureString)
    .digest('hex')

  return signature === expectedSignature
}

export async function processPaymentWebhook(params: {
  transactionId: string
  amount: string
  signature: string
}): Promise<{ success: boolean; creditsAdded?: number }> {
  if (!verifyPaymentSignature(params.transactionId, params.amount, params.signature)) {
    throw new Error('Invalid payment signature')
  }

  // Fetch payment record
  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('*')
    .eq('aamarpay_txn_id', params.transactionId)
    .single()

  if (fetchError || !payment) {
    throw new Error('Payment record not found')
  }

  if (payment.status !== 'pending') {
    return { success: false }
  }

  // Update payment status
  const { error: updateError } = await supabase
    .from('payments')
    .update({
      status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', payment.id)

  if (updateError) {
    throw new Error(`Failed to update payment: ${updateError.message}`)
  }

  // Add credits to organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('credit_balance, subscription_tier')
    .eq('id', payment.organization_id)
    .single()

  if (orgError || !org) {
    throw new Error('Organization not found')
  }

  const newBalance =
    org.subscription_tier === 'enterprise' ? -1 : org.credit_balance + payment.credits_purchased

  await supabase
    .from('organizations')
    .update({
      credit_balance: newBalance,
    })
    .eq('id', payment.organization_id)

  return {
    success: true,
    creditsAdded: payment.credits_purchased,
  }
}
