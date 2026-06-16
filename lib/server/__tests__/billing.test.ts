import { describe, it, expect } from 'vitest'
import {
  subscribe, upgrade, downgrade, cancel, renew,
  MockPaymentProvider, SslcommerzPaymentProvider, getPaymentProvider,
} from '../billing'

describe('subscription state machine', () => {
  it('subscribe activates a paid plan with auto-renew', () => {
    const s = subscribe('basic', '2026-06-01')
    expect(s.plan).toBe('basic')
    expect(s.status).toBe('active')
    expect(s.autoRenew).toBe(true)
    expect(s.currentPeriodEnd).toBe('2026-07-01')
  })

  it('upgrade is immediate; downgrade defers to period end', () => {
    const s = subscribe('basic', '2026-06-01')
    expect(upgrade(s, 'pro').plan).toBe('pro')
    expect(downgrade(s, 'free').pendingPlan).toBe('free')
    expect(downgrade(s, 'free').plan).toBe('basic') // unchanged until renewal
  })

  it('renew applies pending plan on success, past_due on failure', () => {
    const s = downgrade(subscribe('pro', '2026-06-01'), 'basic')
    expect(renew(s, true).plan).toBe('basic')
    expect(renew(s, false).status).toBe('past_due')
  })

  it('cancel stops auto-renew and schedules downgrade to free', () => {
    const s = cancel(subscribe('pro', '2026-06-01'))
    expect(s.autoRenew).toBe(false)
    expect(s.pendingPlan).toBe('free')
    expect(renew(s, true).plan).toBe('free')
  })
})

describe('payment providers', () => {
  it('mock provider auto-succeeds', async () => {
    const r = await new MockPaymentProvider().createCheckout('basic', 'org1')
    expect(r.status).toBe('succeeded')
  })
  it('sslcommerz is a scaffold only and throws', async () => {
    await expect(new SslcommerzPaymentProvider().createCheckout()).rejects.toThrow(/scaffold/i)
  })
  it('factory defaults to mock', () => {
    expect(getPaymentProvider().name).toBe('mock')
  })
})
