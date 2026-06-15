// Deterministic financial analytics (server mirror of the Android AnalyticsEngine).
// All money math is done in integer paisa to avoid floating-point drift.
// The AI assistant reads these numbers; the LLM never computes them.

export type TxnType =
  | 'cash_in' | 'cash_out'
  | 'send_money_sent' | 'send_money_received'
  | 'merchant_payment' | 'charge' | 'balance_update'

export interface Record {
  type: TxnType
  /** amount in paisa (integer) */
  amountPaisa: number
  /** fee in paisa (integer) */
  feePaisa: number
  /** epoch millis (Asia/Dhaka assumed by callers) or null */
  occurredAt: number | null
}

export interface Summary {
  totalReceivedPaisa: number
  totalSentPaisa: number
  feesPaisa: number
  netPaisa: number
  count: number
}

const RECEIVED: TxnType[] = ['cash_in', 'send_money_received']
const SENT: TxnType[] = ['cash_out', 'send_money_sent', 'merchant_payment']

export function toPaisa(amount: string | number): number {
  const n = typeof amount === 'string' ? Number(amount) : amount
  return Math.round(n * 100)
}
export function formatTaka(paisa: number): string {
  const sign = paisa < 0 ? '-' : ''
  const abs = Math.abs(paisa)
  return `${sign}৳${(abs / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function summarize(records: Record[]): Summary {
  let received = 0, sent = 0, fees = 0
  for (const r of records) {
    if (RECEIVED.includes(r.type)) received += r.amountPaisa
    if (SENT.includes(r.type)) sent += r.amountPaisa
    fees += r.feePaisa
  }
  return {
    totalReceivedPaisa: received,
    totalSentPaisa: sent,
    feesPaisa: fees,
    netPaisa: received - sent - fees,
    count: records.length,
  }
}

// Date bucketing in Asia/Dhaka (UTC+6, no DST) — deterministic without TZ libs.
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000
function dhakaDayKey(ms: number): string {
  return new Date(ms + DHAKA_OFFSET_MS).toISOString().slice(0, 10) // YYYY-MM-DD
}
function dhakaMonthKey(ms: number): string {
  return new Date(ms + DHAKA_OFFSET_MS).toISOString().slice(0, 7) // YYYY-MM
}

export function daily(records: Record[], dayKey: string): Summary {
  return summarize(records.filter((r) => r.occurredAt != null && dhakaDayKey(r.occurredAt) === dayKey))
}

export function weekly(records: Record[], startMs: number): Summary {
  const end = startMs + 7 * 24 * 60 * 60 * 1000
  return summarize(records.filter((r) => r.occurredAt != null && r.occurredAt >= startMs && r.occurredAt < end))
}

export interface MonthlySummary {
  revenueEstimatePaisa: number
  expenseEstimatePaisa: number
  netMovementPaisa: number
  count: number
}
export function monthly(records: Record[], monthKey: string): MonthlySummary {
  const s = summarize(records.filter((r) => r.occurredAt != null && dhakaMonthKey(r.occurredAt) === monthKey))
  return {
    revenueEstimatePaisa: s.totalReceivedPaisa,
    expenseEstimatePaisa: s.totalSentPaisa + s.feesPaisa,
    netMovementPaisa: s.totalReceivedPaisa - s.totalSentPaisa - s.feesPaisa,
    count: s.count,
  }
}

export function search(
  records: Record[],
  opts: { amountPaisa?: number; type?: TxnType; fromMs?: number; toMs?: number },
): Record[] {
  return records.filter((r) =>
    (opts.amountPaisa == null || r.amountPaisa === opts.amountPaisa) &&
    (opts.type == null || r.type === opts.type) &&
    (opts.fromMs == null || (r.occurredAt != null && r.occurredAt >= opts.fromMs)) &&
    (opts.toMs == null || (r.occurredAt != null && r.occurredAt <= opts.toMs)),
  )
}
