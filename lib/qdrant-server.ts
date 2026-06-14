import axios from 'axios'

const qdrantUrl = process.env.QDRANT_URL!
const qdrantApiKey = process.env.QDRANT_API_KEY!

const qdrantClient = axios.create({
  baseURL: qdrantUrl,
  headers: {
    'api-key': qdrantApiKey,
    'Content-Type': 'application/json',
  },
})

export async function getCollectionName(organizationId: string): Promise<string> {
  return `org_${organizationId.replace(/-/g, '_')}`
}

export async function createOrganizationCollection(organizationId: string): Promise<void> {
  const collectionName = await getCollectionName(organizationId)
  try {
    await qdrantClient.get(`/collections/${collectionName}`)
  } catch {
    await qdrantClient.put(`/collections/${collectionName}`, {
      vectors: { size: 1536, distance: 'Cosine' },
    })
  }
}

export async function upsertVector(
  organizationId: string,
  pointId: number,
  vector: number[],
  payload: Record<string, unknown>,
): Promise<void> {
  const collectionName = await getCollectionName(organizationId)
  await qdrantClient.put(`/collections/${collectionName}/points?wait=true`, {
    points: [{ id: pointId, vector, payload }],
  })
}

export async function searchVectors(
  organizationId: string,
  query: number[],
  limit: number = 3,
): Promise<Array<{ id: number; score: number; payload: Record<string, unknown> }>> {
  const collectionName = await getCollectionName(organizationId)
  const response = await qdrantClient.post(`/collections/${collectionName}/points/search`, {
    vector: query,
    limit,
    with_payload: true,
  })
  return (response.data.result || []).map((r: any) => ({
    id: r.id,
    score: r.score,
    payload: r.payload,
  }))
}
