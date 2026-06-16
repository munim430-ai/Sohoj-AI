import { describe, it, expect } from 'vitest'
import {
  evaluateTransaction,
  evaluateDeviceRegistration,
  evaluateSyncBatch,
} from '../entitlements'

describe('entitlements', () => {
  it('free plan rejects automatic detection but allows manual', () => {
    expect(evaluateTransaction('free', 'notification', 0).code).toBe('PLAN_NO_AUTO')
    expect(evaluateTransaction('free', 'manual_paste', 0).allowed).toBe(true)
    expect(evaluateTransaction('free', 'sms_share', 0).allowed).toBe(true)
  })

  it('basic enforces the 3000/month cap', () => {
    expect(evaluateTransaction('basic', 'notification', 2999).allowed).toBe(true)
    expect(evaluateTransaction('basic', 'notification', 3000).code).toBe('TXN_LIMIT')
  })

  it('pro enforces 15000/month and 3 devices', () => {
    expect(evaluateTransaction('pro', 'notification', 14999).allowed).toBe(true)
    expect(evaluateTransaction('pro', 'notification', 15000).code).toBe('TXN_LIMIT')
    expect(evaluateDeviceRegistration('pro', 2).allowed).toBe(true)
    expect(evaluateDeviceRegistration('pro', 3).code).toBe('DEVICE_LIMIT')
  })

  it('basic allows exactly 1 device', () => {
    expect(evaluateDeviceRegistration('basic', 0).allowed).toBe(true)
    expect(evaluateDeviceRegistration('basic', 1).code).toBe('DEVICE_LIMIT')
  })

  it('sync batch is idempotent and limit-aware (no silent failure)', () => {
    const known = new Set(['a'])
    const res = evaluateSyncBatch('basic', 2999, known, [
      { dedupeHash: 'a', source: 'notification' }, // already known -> skipped
      { dedupeHash: 'b', source: 'notification' }, // accepted (usage 2999 -> 3000 boundary)
      { dedupeHash: 'c', source: 'notification' }, // rejected: limit reached
    ])
    expect(res.accepted.map((i) => i.dedupeHash)).toEqual(['b'])
    expect(res.rejected[0].code).toBe('TXN_LIMIT')
  })
})
