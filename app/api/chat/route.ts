export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { requireAuth, AuthError } from '@/lib/auth-helpers'
import { embedText } from '@/lib/embeddings'
import { retrieveContext, generateAnswer, deductCredits } from '@/lib/rag'
import { detectLanguage } from '@/lib/language'
import { chatSchema } from '@/lib/validation'
import { rateLimit, clientKey } from '@/lib/rate-limit'
import { withCors, preflight, corsHeaders } from '@/lib/cors'
import { allowedWidgetOrigins } from '@/lib/env'

export async function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function POST(request: NextRequest) {
  // Per-IP rate limit (cheap abuse protection before any expensive work).
  const rl = rateLimit(clientKey(request, 'chat'), 20, 60_000)
  if (!rl.allowed) {
    return withCors(
      request,
      NextResponse.json({ error: 'Rate limit exceeded. Try again shortly.' }, { status: 429 }),
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = chatSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }
  const { message } = parsed.data

  // Resolve the organization securely:
  //  - Authenticated dashboard call  -> org derived from the session.
  //  - Cross-origin widget call       -> org from body, but ONLY if the request
  //    comes from an allow-listed origin (prevents arbitrary org targeting).
  let organizationId: string
  const origin = request.headers.get('origin')
  const isWidget = !!origin && allowedWidgetOrigins().some((o) => o === '*' || o === origin)

  if (isWidget) {
    if (!parsed.data.organizationId) {
      return withCors(
        request,
        NextResponse.json({ error: 'organizationId required for widget' }, { status: 400 }),
      )
    }
    organizationId = parsed.data.organizationId
  } else {
    try {
      const auth = await requireAuth()
      organizationId = auth.organizationId
    } catch (e) {
      const status = e instanceof AuthError ? e.status : 401
      return NextResponse.json({ error: 'Authentication required' }, { status })
    }
  }

  const admin = supabaseAdmin()

  // Atomic credit check + deduction (1 credit per turn). Blocks at zero.
  const deduction = await deductCredits(organizationId, 1)
  if (!deduction.ok) {
    const status = deduction.reason === 'not_found' ? 404 : 402
    const error = deduction.reason === 'not_found' ? 'Organization not found' : 'Insufficient credits'
    return withCors(request, NextResponse.json({ error }, { status }))
  }

  try {
    const language = detectLanguage(message)
    const embedding = await embedText(message)
    const context = await retrieveContext(organizationId, message, embedding)
    const answer = await generateAnswer(message, context, language)

    await admin.from('conversations').insert({
      organization_id: organizationId,
      user_message: message,
      ai_response: answer,
      tokens_used: Math.ceil(answer.length / 4),
      language,
    })

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ content: answer, remaining: deduction.remaining })}\n\n`,
          ),
        )
        controller.close()
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        ...corsHeaders(request),
      },
    })
  } catch (error) {
    // Refund the credit if generation failed — the user got no answer.
    await admin.rpc('add_credits', { p_org_id: organizationId, p_amount: 1 })
    console.error('Chat generation error:', error)
    return withCors(
      request,
      NextResponse.json({ error: 'Failed to generate a response' }, { status: 500 }),
    )
  }
}
