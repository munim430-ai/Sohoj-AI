import { describe, it, expect } from 'vitest'
import { detectIntent, detectLanguage, answer } from '../ai/assistant'
import { MockAiProvider } from '../ai/provider'
import * as A from '../analytics'

describe('assistant intent detection (bn / banglish / en)', () => {
  it('Bangla: আজ কত cash in হয়েছে', () => {
    const i = detectIntent('আজ কত cash in হয়েছে')
    expect(i.period).toBe('today')
    expect(i.metric).toBe('cash_in')
    expect(i.language).toBe('bn')
  })
  it('Bangla: এই মাসে কত send money করেছি', () => {
    const i = detectIntent('এই মাসে কত send money করেছি')
    expect(i.period).toBe('month')
    expect(i.metric).toBe('send_money_sent')
  })
  it('Banglish: gsoto soptaho koto received hoyeche', () => {
    const i = detectIntent('gsoto soptaho koto received hoyeche')
    expect(i.period).toBe('week')
    expect(detectLanguage('koto received hoyeche')).toBe('banglish')
  })
})

describe('assistant grounding (LLM must NOT compute)', () => {
  it('returns the deterministic figure; provider only phrases it', async () => {
    const now = Date.parse('2026-06-08T23:00:00+06:00')
    const records: A.Record[] = [
      { type: 'cash_in', amountPaisa: A.toPaisa('2000.00'), feePaisa: 0, occurredAt: Date.parse('2026-06-08T10:00:00+06:00') },
      { type: 'cash_in', amountPaisa: A.toPaisa('500.00'), feePaisa: 0, occurredAt: Date.parse('2026-06-08T12:00:00+06:00') },
    ]
    const res = await answer('আজ কত cash in হয়েছে', records, new MockAiProvider(), now)
    expect(res.computedBy).toBe('deterministic-engine')
    expect(res.valueText).toBe('৳2,500.00') // 2000 + 500, computed by the engine
    expect(res.answer).toContain('৳2,500.00')
  })
})
