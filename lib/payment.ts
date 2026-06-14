/**
 * aamarPay integration.
 *
 * Security model:
 *  - We never trust amounts/status from the redirect query string.
 *  - On callback we re-verify the transaction server-to-server against aamarPay's
 *    transaction-status API using our store credentials.
 *  - Credits are applied exactly once (idempotency via payments.processed_at) and
 *    only for the amount recorded when checkout was created.
 */
import axios from 'axios'
import { supabaseAdmin } from './supabase-server'
import { serverEnv } from './env'

function endpoint(): string {
  return serverEnv.aamarpaySandbox
    ? 'https://sandbox.aamarpay.com'
    : 'https://secure.aamarpay.com'
}

export interface CheckoutPayload {
  organizationId: string
  amount: number
  creditsToAdd: number
  customer: { name: string; email: string; phone: string }
}

export async function createCheckout(payload: CheckoutPayload): Promise<string> {
  const tranId = `sa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const base = serverEnv.appUrl

  // Record the intended purchase up front; the webhook reconciles against this.
  const { error } = await supabaseAdmin().from('payments').insert({
    organization_id: payload.organizationId,
    amount: payload.amount,
    currency: 'BDT',
    status: 'pending',
    aamarpay_txn_id: tranId,
    credits_purchased: payload.creditsToAdd,
  })
  if (error) throw new Error(`Failed to create payment record: ${error.message}`)

  const form = {
    store_id: serverEnv.aamarpayStoreId,
    signature_key: serverEnv.aamarpaySignatureKey,
    tran_id: tranId,
    amount: String(payload.amount),
    currency: 'BDT',
    desc: `ShahojAI ${payload.creditsToAdd} credits`,
    cus_name: payload.customer.name,
    cus_email: payload.customer.email,
    cus_phone: payload.customer.phone,
    success_url: `${base}/api/payment-webhook`,
    fail_url: `${base}/billing?status=failed`,
    cancel_url: `${base}/billing?status=cancelled`,
    type: 'json',
  }

  const res = await axios.post(`${endpoint()}/jsonpost.php`, form, {
    headers: { 'Content-Type': 'application/json' },
  })
  const url = res.data?.payment_url
  if (!url) throw new Error('aamarPay did not return a payment URL')
  return url
}

interface VerifyResult {
  ok: boolean
  creditsAdded?: number
}

/** Verify and apply a callback exactly once. */
export async function verifyAndApply(tranId: string): Promise<VerifyResult> {
  const admin = supabaseAdmin()

  const { data: payment } = await admin
    .from('payments')
    .select('*')
    .eq('aamarpay_txn_id', tranId)
    .single()

  if (!payment) return { ok: false }
  // Idempotency: already applied.
  if (payment.processed_at) return { ok: true, creditsAdded: 0 }

  // Server-to-server verification with aamarPay.
  const verify = await axios.get(`${endpoint()}/api/v1/trxcheck/request.php`, {
    params: {
      request_id: tranId,
      store_id: serverEnv.aamarpayStoreId,
      signature_key: serverEnv.aamarpaySignatureKey,
      type: 'json',
    },
  })

  const data = verify.data ?? {}
  const success = data.pay_status === 'Successful'
  const amountMatches = Number(data.amount) === Number(payment.amount)

  if (!success || !amountMatches) {
    await admin
      .from('payments')
      .update({ status: 'failed', processed_at: new Date().toISOString() })
      .eq('id', payment.id)
    return { ok: false }
  }

  // Mark processed first (idempotency guard), then top up atomically.
  const { data: claimed } = await admin
    .from('payments')
    .update({ status: 'completed', processed_at: new Date().toISOString() })
    .eq('id', payment.id)
    .is('processed_at', null)
    .select()
    .single()

  if (!claimed) return { ok: true, creditsAdded: 0 } // raced; already applied

  await admin.rpc('add_credits', {
    p_org_id: payment.organization_id,
    p_amount: payment.credits_purchased,
  })

  return { ok: true, creditsAdded: payment.credits_purchased }
}
