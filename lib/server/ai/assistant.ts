// AI Business Assistant. Detects intent (Bangla / Banglish / English), computes
// the answer DETERMINISTICALLY via the analytics engine, then asks the LLM only
// to phrase the pre-computed figure. The LLM never sees raw transactions.

import * as A from '../analytics'
import { AiProvider, GroundedFacts } from './provider'

export type Period = 'today' | 'week' | 'month'
export type Metric = 'received' | 'sent' | 'cash_in' | 'send_money_sent' | 'fees' | 'net'

export interface Intent {
  period: Period
  metric: Metric
  language: 'bn' | 'en' | 'banglish'
}

const BENGALI = /[ঀ-৿]/

export function detectLanguage(q: string): 'bn' | 'en' | 'banglish' {
  if (BENGALI.test(q)) return 'bn'
  const banglish = /\b(koto|hoyeche|korechi|received|pathiyechi|cash in|send money|aaj|ajke|soptaho|shoptaho|mash|mas)\b/i
  return banglish.test(q) ? 'banglish' : 'en'
}

export function detectIntent(q: string): Intent {
  const s = q.toLowerCase()
  const period: Period =
    /(this month|month|মাস|mash\b|mas\b|এই মাস)/i.test(q) ? 'month'
    : /(week|সপ্তাহ|soptaho|shoptaho|গত সপ্তাহ|last week)/i.test(q) ? 'week'
    : 'today'

  const metric: Metric =
    /(cash ?in|ক্যাশ ?ইন)/i.test(q) ? 'cash_in'
    : /(send ?money|পাঠ|pathiye|sent)/i.test(q) ? 'send_money_sent'
    : /(fee|charge|চার্জ|fees)/i.test(q) ? 'fees'
    : /(net|নিট)/i.test(q) ? 'net'
    : /(sent|খরচ|spent|out)/i.test(q) ? 'sent'
    : 'received' // received / পেয়েছি / total received default

  return { period, metric, language: detectLanguage(q) }
}

const METRIC_LABEL: Record<Metric, string> = {
  received: 'total received',
  sent: 'total sent',
  cash_in: 'cash in',
  send_money_sent: 'send money sent',
  fees: 'fees',
  net: 'net cash flow',
}
const PERIOD_LABEL: Record<Period, string> = { today: 'today', week: 'this week', month: 'this month' }

/** Pull the requested metric out of a deterministic summary (in paisa). */
function metricValuePaisa(records: A.Record[], intent: Intent, nowMs: number): number {
  const recs = periodRecords(records, intent.period, nowMs)
  const s = A.summarize(recs)
  switch (intent.metric) {
    case 'received': return s.totalReceivedPaisa
    case 'sent': return s.totalSentPaisa
    case 'fees': return s.feesPaisa
    case 'net': return s.netPaisa
    case 'cash_in':
      return A.summarize(recs.filter((r) => r.type === 'cash_in')).totalReceivedPaisa
    case 'send_money_sent':
      return A.summarize(recs.filter((r) => r.type === 'send_money_sent')).totalSentPaisa
  }
}

function periodRecords(records: A.Record[], period: Period, nowMs: number): A.Record[] {
  if (period === 'today') {
    const k = dayKeyOf(nowMs)
    return records.filter((r) => r.occurredAt != null && dayKeyOf(r.occurredAt) === k)
  }
  if (period === 'week') {
    const start = weekStartOf(nowMs); const end = start + 7 * 86400000
    return records.filter((r) => r.occurredAt != null && r.occurredAt >= start && r.occurredAt < end)
  }
  const k = monthKeyOf(nowMs)
  return records.filter((r) => r.occurredAt != null && monthKeyOf(r.occurredAt) === k)
}

const DHAKA = 6 * 3600000
const dayKeyOf = (ms: number) => new Date(ms + DHAKA).toISOString().slice(0, 10)
const monthKeyOf = (ms: number) => new Date(ms + DHAKA).toISOString().slice(0, 7)
const weekStartOf = (ms: number) => ms - 6 * 86400000 // trailing 7-day window

export interface AssistantAnswer {
  answer: string
  metric: Metric
  period: Period
  valueText: string
  /** Proof the figure came from the deterministic engine, not the LLM. */
  computedBy: 'deterministic-engine'
}

export async function answer(
  question: string,
  records: A.Record[],
  provider: AiProvider,
  nowMs: number = Date.now(),
): Promise<AssistantAnswer> {
  const intent = detectIntent(question)
  const valuePaisa = metricValuePaisa(records, intent, nowMs)
  const valueText = A.formatTaka(valuePaisa)

  const facts: GroundedFacts = {
    question,
    language: intent.language,
    metricLabel: METRIC_LABEL[intent.metric],
    valueText,
    period: PERIOD_LABEL[intent.period],
  }
  const answer = await provider.explain(facts)
  return { answer, metric: intent.metric, period: intent.period, valueText, computedBy: 'deterministic-engine' }
}
