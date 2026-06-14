import { QdrantClient } from '@qdrant/js-client-rest'

const qdrantUrl = process.env.QDRANT_URL!
const qdrantApiKey = process.env.QDRANT_API_KEY!

export const qdrant = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
})

export async function getCollectionName(organizationId: string): Promise<string> {
  return `org_${organizationId.replace(/-/g, '_')}`
}

export async function createOrganizationCollection(organizationId: string): Promise<void> {
  const collectionName = await getCollectionName(organizationId)

  try {
    await qdrant.getCollection(collectionName)
  } catch {
    // Collection doesn't exist, create it
    await qdrant.createCollection(collectionName, {
      vectors: {
        size: 384, // all-MiniLM-L6-v2 embedding size
        distance: 'Cosine',
      },
    })
  }
}

export async function deleteOrganizationCollection(organizationId: string): Promise<void> {
  const collectionName = await getCollectionName(organizationId)
  try {
    await qdrant.deleteCollection(collectionName)
  } catch (error) {
    console.error('Error deleting collection:', error)
  }
}

export async function upsertVector(
  organizationId: string,
  pointId: number,
  vector: number[],
  payload: Record<string, unknown>,
): Promise<void> {
  const collectionName = await getCollectionName(organizationId)

  await qdrant.upsert(collectionName, {
    points: [
      {
        id: pointId,
        vector,
        payload,
      },
    ],
  })
}

export async function searchVectors(
  organizationId: string,
  query: number[],
  limit: number = 3,
): Promise<Array<{ id: number; score: number; payload: Record<string, unknown> }>> {
  const collectionName = await getCollectionName(organizationId)

  const results = await qdrant.search(collectionName, {
    vector: query,
    limit,
    with_payload: true,
  })

  return results.map((r: any) => ({
    id: r.id,
    score: r.score,
    payload: r.payload,
  }))
}
