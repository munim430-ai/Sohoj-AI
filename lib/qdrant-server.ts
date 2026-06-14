import axios from 'axios'
import { createHash } from 'crypto'
import { serverEnv } from './env'
import { EMBEDDING_DIM } from './embeddings'

let _client: ReturnType<typeof axios.create> | null = null
function client() {
  if (!_client) {
    _client = axios.create({
      baseURL: serverEnv.qdrantUrl,
      headers: { 'api-key': serverEnv.qdrantApiKey, 'Content-Type': 'application/json' },
    })
  }
  return _client
}

export function getCollectionName(organizationId: string): string {
  return `org_${organizationId.replace(/-/g, '_')}`
}

/**
 * Deterministic 63-bit point ID derived from document + chunk index, so
 * re-uploading the same document overwrites its own points instead of colliding
 * with random IDs from other documents.
 */
export function pointId(documentId: string, chunkIndex: number): number {
  const hash = createHash('sha1').update(`${documentId}:${chunkIndex}`).digest('hex')
  return parseInt(hash.slice(0, 13), 16) // 52 bits — within Number.MAX_SAFE_INTEGER
}

export async function createOrganizationCollection(organizationId: string): Promise<void> {
  const collectionName = getCollectionName(organizationId)
  try {
    await client().get(`/collections/${collectionName}`)
  } catch {
    await client().put(`/collections/${collectionName}`, {
      vectors: { size: EMBEDDING_DIM, distance: 'Cosine' },
    })
  }
}

export interface VectorPoint {
  id: number
  vector: number[]
  payload: Record<string, unknown>
}

/** Batch upsert — one network round-trip instead of one per chunk. */
export async function upsertVectors(
  organizationId: string,
  points: VectorPoint[],
): Promise<void> {
  if (points.length === 0) return
  const collectionName = getCollectionName(organizationId)
  await client().put(`/collections/${collectionName}/points?wait=true`, { points })
}

export async function searchVectors(
  organizationId: string,
  query: number[],
  limit = 3,
): Promise<Array<{ id: number; score: number; payload: Record<string, unknown> }>> {
  const collectionName = getCollectionName(organizationId)
  try {
    const response = await client().post(`/collections/${collectionName}/points/search`, {
      vector: query,
      limit,
      with_payload: true,
    })
    return (response.data.result || []).map((r: any) => ({
      id: r.id,
      score: r.score,
      payload: r.payload,
    }))
  } catch {
    // Collection may not exist yet (no documents uploaded) — return no context.
    return []
  }
}
