/**
 * Local sentence embeddings — the cheapest possible route.
 *
 * Uses `all-MiniLM-L6-v2` (384-dim) running in-process via
 * @huggingface/transformers. No API key, no per-token cost. The model is
 * downloaded once and cached on disk, then loaded lazily as a singleton.
 */
import { pipeline } from '@huggingface/transformers'

export const EMBEDDING_DIM = 384
const MODEL = 'Xenova/all-MiniLM-L6-v2'

// The pipeline() overload union is too large for tsc to represent, so the
// extractor is intentionally typed loosely.
let extractorPromise: Promise<any> | null = null

function getExtractor(): Promise<any> {
  if (!extractorPromise) {
    extractorPromise = (pipeline as any)('feature-extraction', MODEL)
  }
  return extractorPromise!
}

export async function embedText(text: string): Promise<number[]> {
  const extractor = await getExtractor()
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data as Float32Array)
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []
  const extractor = await getExtractor()
  const output = await extractor(texts, { pooling: 'mean', normalize: true })
  // The pipeline returns a [n, dim] tensor flattened in output.data.
  const data = output.data as Float32Array
  const dim = output.dims[output.dims.length - 1]
  const result: number[][] = []
  for (let i = 0; i < texts.length; i++) {
    result.push(Array.from(data.slice(i * dim, (i + 1) * dim)))
  }
  return result
}
