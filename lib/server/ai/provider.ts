// AI provider abstraction. The provider only PHRASES a pre-computed figure.
// It is never given raw transactions and never computes financial values.

export interface GroundedFacts {
  question: string
  language: 'bn' | 'en' | 'banglish'
  metricLabel: string
  /** The deterministically-computed answer, already formatted (e.g. "৳20,000.00"). */
  valueText: string
  period: string
}

export interface AiProvider {
  readonly name: string
  explain(facts: GroundedFacts): Promise<string>
}

/** Deterministic, offline provider. Used when no LLM key is configured. */
export class MockAiProvider implements AiProvider {
  readonly name = 'mock'
  async explain(f: GroundedFacts): Promise<string> {
    const lead =
      f.language === 'bn' ? `${f.period} আপনার ${f.metricLabel}`
      : f.language === 'banglish' ? `${f.period} apnar ${f.metricLabel}`
      : `Your ${f.metricLabel} for ${f.period}`
    return `${lead}: ${f.valueText}.`
  }
}

/** ppq.ai (OpenAI-compatible) provider. Phrases the figure; must not recompute. */
export class PpqAiProvider implements AiProvider {
  readonly name = 'ppq'
  constructor(
    private apiKey: string,
    private model: string,
    private baseUrl: string,
  ) {}

  async explain(f: GroundedFacts): Promise<string> {
    const system =
      'You are a Bangladeshi business assistant. You will be given a metric and an ' +
      'ALREADY-CALCULATED value. Reply in one short sentence in the user\'s language ' +
      '(Bangla/Banglish/English). Use the provided value EXACTLY as given. Never ' +
      'recalculate, add, or change any number.'
    const user = `Question: ${f.question}\nMetric: ${f.metricLabel}\nPeriod: ${f.period}\nValue: ${f.valueText}`

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        temperature: 0,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    })
    if (!res.ok) throw new Error(`ppq.ai error ${res.status}`)
    const json = await res.json()
    return json.choices?.[0]?.message?.content?.trim() || `${f.metricLabel}: ${f.valueText}`
  }
}

export function getAiProvider(): AiProvider {
  const provider = process.env.AI_PROVIDER || 'mock'
  if (provider === 'ppq' && process.env.PPQ_API_KEY) {
    return new PpqAiProvider(
      process.env.PPQ_API_KEY,
      process.env.AI_MODEL || 'gpt-4o-mini',
      process.env.PPQ_BASE_URL || 'https://api.ppq.ai/v1',
    )
  }
  return new MockAiProvider()
}
