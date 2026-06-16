// Subscription state machine + payment provider interface.
// Payments are MOCKED. SSLCommerz is a scaffold only — no live gateway.

import { Plan } from './plans'

export type SubStatus = 'trialing' | 'active' | 'past_due' | 'cancelled'

export interface Subscription {
  plan: Plan
  status: SubStatus
  autoRenew: boolean
  /** Plan to apply at next renewal (downgrades are deferred to period end). */
  pendingPlan?: Plan
  currentPeriodStart: string // ISO date
  currentPeriodEnd: string   // ISO date
}

function addMonth(isoDate: string): string {
  const d = new Date(isoDate)
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 10)
}

export function subscribe(plan: Plan, today = new Date().toISOString().slice(0, 10)): Subscription {
  return {
    plan,
    status: plan === 'free' ? 'active' : 'active',
    autoRenew: plan !== 'free',
    currentPeriodStart: today,
    currentPeriodEnd: addMonth(today),
  }
}

/** Upgrades take effect immediately. */
export function upgrade(sub: Subscription, to: Plan): Subscription {
  return { ...sub, plan: to, status: 'active', autoRenew: true, pendingPlan: undefined }
}

/** Downgrades are deferred to the end of the paid period. */
export function downgrade(sub: Subscription, to: Plan): Subscription {
  return { ...sub, pendingPlan: to }
}

export function cancel(sub: Subscription): Subscription {
  // Access continues until period end; auto-renew is turned off.
  return { ...sub, autoRenew: false, pendingPlan: 'free' }
}

/** Renewal at period end. */
export function renew(sub: Subscription, paymentSucceeded: boolean): Subscription {
  if (!sub.autoRenew && !sub.pendingPlan) return { ...sub, status: 'cancelled' }
  if (!paymentSucceeded) return { ...sub, status: 'past_due' }
  const nextPlan = sub.pendingPlan ?? sub.plan
  const start = sub.currentPeriodEnd
  return {
    plan: nextPlan,
    status: 'active',
    autoRenew: nextPlan !== 'free',
    pendingPlan: undefined,
    currentPeriodStart: start,
    currentPeriodEnd: addMonth(start),
  }
}

// ── Payment providers (mock + SSLCommerz scaffold) ──────────────────────────
export interface CheckoutResult {
  provider: string
  reference: string
  status: 'created' | 'succeeded' | 'failed'
  redirectUrl?: string
}

export interface PaymentProvider {
  readonly name: string
  createCheckout(plan: Plan, orgId: string): Promise<CheckoutResult>
}

export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock'
  async createCheckout(plan: Plan, orgId: string): Promise<CheckoutResult> {
    return {
      provider: 'mock',
      reference: `mock_${orgId}_${plan}_${Date.now()}`,
      status: 'succeeded', // mock auto-approves so flows can be exercised
    }
  }
}

/** Scaffold only — intentionally not wired to a live gateway. */
export class SslcommerzPaymentProvider implements PaymentProvider {
  readonly name = 'sslcommerz'
  constructor(private storeId?: string, private storePasswd?: string, private sandbox = true) {}
  async createCheckout(): Promise<CheckoutResult> {
    throw new Error('SSLCommerz integration is a scaffold only and is not enabled.')
  }
}

export function getPaymentProvider(): PaymentProvider {
  if ((process.env.PAYMENT_PROVIDER || 'mock') === 'sslcommerz') {
    return new SslcommerzPaymentProvider(
      process.env.SSLCOMMERZ_STORE_ID,
      process.env.SSLCOMMERZ_STORE_PASSWD,
      process.env.SSLCOMMERZ_SANDBOX !== 'false',
    )
  }
  return new MockPaymentProvider()
}
