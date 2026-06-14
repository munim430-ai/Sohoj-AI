import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { embedBatch } from '@/lib/embeddings'
import { createOrganizationCollection, upsertVector } from '@/lib/qdrant-server'
import { createReadStream } from 'fs'
import { parse } from 'csv-parse/sync'
import * as pdfjsLib from 'pdfjs-dist'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

async function parseCSV(content: string): Promise<string[]> {
  const records = parse(content, { columns: false })
  return records.flat().filter((r: any) => r && typeof r === 'string')
}

async function parsePDF(buffer: Buffer): Promise<string[]> {
  const pdf = await pdfjsLib.getDocument(buffer).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const text = textContent.items.map((item: any) => item.str).join(' ')
    pages.push(text)
  }

  return pages
}

function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const chunks: string[] = []
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

  let currentChunk = ''

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = currentChunk.slice(-overlap) + sentence
    } else {
      currentChunk += sentence
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks.filter((c) => c.length > 50)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const organizationId = formData.get('organizationId') as string

    if (!file || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate organization exists
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Create Qdrant collection for organization
    await createOrganizationCollection(organizationId)

    // Parse file
    const buffer = await file.arrayBuffer()
    const text = Buffer.from(buffer).toString('utf-8')
    let chunks: string[] = []

    if (file.type === 'text/csv') {
      const rows = await parseCSV(text)
      chunks = rows.flatMap((row) => chunkText(row))
    } else if (file.type === 'application/pdf') {
      const pages = await parsePDF(Buffer.from(buffer))
      chunks = pages.flatMap((page) => chunkText(page))
    } else {
      chunks = chunkText(text)
    }

    if (chunks.length === 0) {
      return NextResponse.json({ error: 'No valid content in file' }, { status: 400 })
    }

    // Save document record
    const { data: document, error: docError } = await supabase
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
      return NextResponse.json({ error: 'Failed to save document' }, { status: 500 })
    }

    // Embed chunks
    const embeddings = await embedBatch(chunks)

    // Store chunks and embeddings in Qdrant
    let pointId = Math.floor(Math.random() * 1000000)

    for (let i = 0; i < chunks.length; i++) {
      const chunkRecord = {
        organization_id: organizationId,
        document_id: document.id,
        chunk_text: chunks[i],
        chunk_index: i,
        qdrant_point_id: pointId + i,
      }

      // Save to Supabase for metadata
      await supabase.from('vector_chunks').insert(chunkRecord)

      // Save to Qdrant
      await upsertVector(organizationId, pointId + i, embeddings[i], {
        text: chunks[i],
        document_id: document.id,
        chunk_index: i,
      })
    }

    return NextResponse.json({
      message: 'Document uploaded successfully',
      documentId: document.id,
      chunksCreated: chunks.length,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}
