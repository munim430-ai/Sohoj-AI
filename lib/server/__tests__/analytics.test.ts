import { describe, it, expect } from 'vitest'
import * as A from '../analytics'

const ms = (iso: string) => Date.parse(iso)

const records: A.Record[] = [
  { type: 'send_money_received', amountPaisa: A.toPaisa('20000.00'), feePaisa: 0, occurredAt: ms('2026-06-08T13:14:00+06:00') },
  { type: 'merchant_payment', amountPaisa: A.toPaisa('1545.26'), feePaisa: 0, occurredAt: ms('2026-06-08T21:27:00+06:00') },
  { type: 'cash_in', amountPaisa: A.toPaisa('2000.00'), feePaisa: 0, occurredAt: ms('2026-06-13T13:44:00+06:00') },
  { type: 'cash_out', amountPaisa: A.toPaisa('500.00'), feePaisa: A.toPaisa('9.00'), occurredAt: ms('2026-06-08T09:00:00+06:00') },
]

describe('analytics (deterministic, paisa)', () => {
  it('daily summary on 2026-06-08', () => {
    const s = A.daily(records, '2026-06-08')
    expect(s.totalReceivedPaisa).toBe(A.toPaisa('20000.00'))
    expect(s.totalSentPaisa).toBe(A.toPaisa('2045.26'))
    expect(s.feesPaisa).toBe(A.toPaisa('9.00'))
    expect(s.netPaisa).toBe(A.toPaisa('17945.74'))
    expect(s.count).toBe(3)
  })

  it('monthly rollup for 2026-06', () => {
    const m = A.monthly(records, '2026-06')
    expect(m.revenueEstimatePaisa).toBe(A.toPaisa('22000.00'))
    expect(m.expenseEstimatePaisa).toBe(A.toPaisa('2054.26'))
    expect(m.count).toBe(4)
  })

  it('formats taka', () => {
    expect(A.formatTaka(A.toPaisa('1260'))).toBe('৳1,260.00')
  })
})
