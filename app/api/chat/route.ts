import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { embedText } from '@/lib/embeddings'
import { retrieveContext, generateAnswer, deductCredits } from '@/lib/rag'
import { detectLanguage } from '@/lib/language'

export async function POST(request: NextRequest) {
  try {
    const { message, organizationId } = await request.json()

    if (!message || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check organization exists and has credits
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('credit_balance, subscription_tier')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Check credit balance (enterprise has unlimited)
    if (org.subscription_tier !== 'enterprise' && org.credit_balance <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // Detect language
    const language = detectLanguage(message)

    // Embed the message
    const embedding = await embedText(message)

    // Retrieve context from Qdrant
    const context = await retrieveContext(organizationId, message, embedding)

    // Generate response
    const response = await generateAnswer(message, context, language)

    // Save conversation
    const { data: conversation, error: saveError } = await supabase
      .from('conversations')
      .insert({
        organization_id: organizationId,
        user_message: message,
        ai_response: response,
        tokens_used: Math.ceil(response.length / 4), // Rough token estimate
        language,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving conversation:', saveError)
    }

    // Deduct credits
    await deductCredits(organizationId, conversation?.tokens_used || 100)

    // Return streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              id: conversation?.id,
              content: response,
              tokens_used: conversation?.tokens_used,
            })}\n\n`,
          ),
        )
        controller.close()
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: error.message || 'Chat failed' }, { status: 500 })
  }
}
