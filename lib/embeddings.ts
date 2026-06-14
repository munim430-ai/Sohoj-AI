/**
 * Embeddings via a lightweight HTTP call — keeps the serverless bundle small
 * (no native onnxruntime) while staying on a free tier.
 *
 * Default provider: Jina AI (free tier, no card) — `jina-embeddings-v2-base-en`,
 * 768 dimensions. The request/response shape is OpenAI-compatible, so any
 * OpenAI-style embeddings endpoint works by overriding EMBEDDINGS_API_URL/MODEL.
 */
import { serverEnv } from './env'

export const EMBEDDING_DIM = Number(process.env.EMBEDDING_DIM || 768)

async function callApi(input: string[]): Promise<number[][]> {
  const res = await fetch(serverEnv.embeddingsApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serverEnv.embeddingsApiKey}`,
    },
    body: JSON.stringify({ model: serverEnv.embeddingsModel, input }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Embeddings API error ${res.status}: ${detail.slice(0, 200)}`)
  }

  const json = (await res.json()) as { data: Array<{ embedding: number[] }> }
  return json.data.map((d) => d.embedding)
}

export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await callApi([text])
  return embedding
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []
  // Most providers cap batch size; chunk to stay safe and cheap.
  const BATCH = 64
  const out: number[][] = []
  for (let i = 0; i < texts.length; i += BATCH) {
    out.push(...(await callApi(texts.slice(i, i + BATCH))))
  }
  return out
}
