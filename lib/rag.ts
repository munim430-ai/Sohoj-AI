/**
 * Retrieval-Augmented Generation core.
 *
 * Chat completions run on Groq (OpenAI-compatible, free tier) — the cheapest
 * route. Credit accounting is atomic (see `deductCredits`).
 */
import { OpenAI } from 'openai'
import { searchVectors } from './qdrant-server'
import { supabaseAdmin } from './supabase-server'
import { serverEnv } from './env'

let _llm: OpenAI | null = null
function llm(): OpenAI {
  if (!_llm) {
    _llm = new OpenAI({ apiKey: serverEnv.llmApiKey, baseURL: serverEnv.llmBaseUrl })
  }
  return _llm
}

export interface RAGContext {
  chunks: Array<{ content: string; score: number }>
}

export async function retrieveContext(
  organizationId: string,
  query: string,
  embedding: number[],
): Promise<RAGContext> {
  const results = await searchVectors(organizationId, embedding, 3)
  const chunks = results.map((result: any) => ({
    content: result.payload?.text || '',
    score: result.score,
  }))
  return { chunks }
}

export async function generateAnswer(
  query: string,
  context: RAGContext,
  language: 'en' | 'bn',
): Promise<string> {
  const systemPrompt =
    language === 'bn'
      ? `আপনি একটি সহায়ক বাংলাদেশী ই-কমার্স গ্রাহক সেবা এজেন্ট।
প্রদত্ত তথ্যের উপর ভিত্তি করে সংক্ষিপ্ত, পেশাদার উত্তর প্রদান করুন।
যদি প্রদত্ত তথ্যে উত্তর না থাকে, তাহলে সৎভাবে বলুন যে আপনি জানেন না।`
      : `You are a helpful customer support agent for Bangladeshi e-commerce sellers.
Provide concise, professional answers based on the provided information.
If the information doesn't contain the answer, honestly say you don't know.`

  const contextText =
    context.chunks.length > 0
      ? `Based on the following information:\n\n${context.chunks.map((c) => c.content).join('\n\n')}`
      : 'No relevant information found in the knowledge base.'

  const response = await llm().chat.completions.create({
    model: serverEnv.llmModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${contextText}\n\nQuestion: ${query}` },
    ],
    temperature: 0.4,
    max_tokens: 500,
  })

  return response.choices[0]?.message?.content || 'Unable to generate response'
}

export interface DeductResult {
  ok: boolean
  reason?: 'insufficient_credits' | 'not_found'
  remaining?: number
}

/**
 * Atomically deduct credits using a Postgres function that decrements only when
 * the balance is sufficient (or the org is on the unlimited Enterprise tier).
 * This avoids the read-then-write race where concurrent requests overspend.
 */
export async function deductCredits(
  organizationId: string,
  creditsToDeduct = 1,
): Promise<DeductResult> {
  const { data, error } = await supabaseAdmin().rpc('deduct_credits', {
    p_org_id: organizationId,
    p_amount: creditsToDeduct,
  })

  if (error) {
    return { ok: false, reason: 'not_found' }
  }

  const row = Array.isArray(data) ? data[0] : data
  if (!row || row.success === false) {
    return { ok: false, reason: 'insufficient_credits', remaining: row?.remaining }
  }
  return { ok: true, remaining: row.remaining }
}
