/**
 * One-time Qdrant connectivity check + optional warm-up.
 * Usage: GROQ_API_KEY=... QDRANT_URL=... QDRANT_API_KEY=... npm run qdrant:init
 *
 * Collections are created per-organization on first upload, so this script just
 * verifies credentials and prints existing collections.
 */
import axios from 'axios'

async function main() {
  const url = process.env.QDRANT_URL
  const key = process.env.QDRANT_API_KEY
  if (!url || !key) {
    console.error('QDRANT_URL and QDRANT_API_KEY are required')
    process.exit(1)
  }

  const client = axios.create({
    baseURL: url,
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
  })

  try {
    const res = await client.get('/collections')
    const collections = res.data?.result?.collections ?? []
    console.log(`✓ Connected to Qdrant. ${collections.length} collection(s):`)
    collections.forEach((c: { name: string }) => console.log(`  - ${c.name}`))
  } catch (err: any) {
    console.error('✗ Failed to reach Qdrant:', err.message)
    process.exit(1)
  }
}

main()
