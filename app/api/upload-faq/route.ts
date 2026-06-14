export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { requireAuth, AuthError } from '@/lib/auth-helpers'
import { embedBatch } from '@/lib/embeddings'
import {
  createOrganizationCollection,
  upsertVectors,
  pointId,
  type VectorPoint,
} from '@/lib/qdrant-server'
import { rateLimit, clientKey } from '@/lib/rate-limit'
import { parse } from 'csv-parse/sync'

const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_CHUNKS = 2000

function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = []
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  let current = ''
  for (const sentence of sentences) {
    if ((current + sentence).length > chunkSize && current) {
      chunks.push(current.trim())
      current = current.slice(-overlap) + sentence
    } else {
      current += sentence
    }
  }
  if (current) chunks.push(current.trim())
  return chunks.filter((c) => c.length > 50)
}

async function parseCsv(content: string): Promise<string[]> {
  const records = parse(content, { columns: false, skip_empty_lines: true }) as string[][]
  return records.flat().filter((r) => r && typeof r === 'string')
}

export async function POST(request: NextRequest) {
  const rl = rateLimit(clientKey(request, 'upload'), 10, 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // Authenticated only — org derived from session, never from the form.
  let organizationId: string
  try {
    organizationId = (await requireAuth()).organizationId
  } catch (e) {
    const status = e instanceof AuthError ? e.status : 401
    return NextResponse.json({ error: 'Authentication required' }, { status })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'A file is required' }, { status: 400 })
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5 MB limit' }, { status: 413 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const isCsv = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')

  let chunks: string[]
  if (isCsv) {
    const rows = await parseCsv(buffer.toString('utf-8'))
    chunks = rows.flatMap((row) => chunkText(row))
  } else {
    chunks = chunkText(buffer.toString('utf-8'))
  }

  if (chunks.length === 0) {
    return NextResponse.json({ error: 'No usable content found in file' }, { status: 400 })
  }
  chunks = chunks.slice(0, MAX_CHUNKS)

  const admin = supabaseAdmin()
  await createOrganizationCollection(organizationId)

  const { data: document, error: docError } = await admin
    .from('faq_documents')
    .insert({
      organization_id: organizationId,
      file_name: file.name,
      file_size: file.size,
      chunk_count: chunks.length,
    })
    .select()
    .single()

  if (docError || !document) {
    return NextResponse.json({ error: 'Failed to record document' }, { status: 500 })
  }

  // Embed all chunks locally (free), then a single batched upsert to Qdrant.
  const embeddings = await embedBatch(chunks)
  const points: VectorPoint[] = chunks.map((text, i) => ({
    id: pointId(document.id, i),
    vector: embeddings[i],
    payload: { text, document_id: document.id, chunk_index: i },
  }))

  await upsertVectors(organizationId, points)

  return NextResponse.json({
    message: 'Document uploaded',
    documentId: document.id,
    chunksCreated: chunks.length,
  })
}
