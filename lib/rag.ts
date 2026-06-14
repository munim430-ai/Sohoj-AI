import { OpenAI } from 'openai'
import { searchVectors } from './qdrant-server'
import { supabase } from './supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-openai-key',
})

export interface RAGContext {
  chunks: Array<{
    content: string
    score: number
  }>
}

export async function retrieveContext(
  organizationId: string,
  query: string,
  embedding: number[],
): Promise<RAGContext> {
  const results = await searchVectors(organizationId, embedding, 3)

  const chunks = results.map((result: any) => ({
    content: result.payload?.text || '',
    score: result.score,
  }))

  return { chunks }
}

export async function generateAnswer(
  query: string,
  context: RAGContext,
  language: 'en' | 'bn',
): Promise<string> {
  const systemPrompt =
    language === 'bn'
      ? `আপনি একটি সহায়ক বাংলাদেশী ই-কমার্স গ্রাহক সেবা এজেন্ট।
প্রদত্ত তথ্যের উপর ভিত্তি করে সংক্ষিপ্ত, পেশাদার উত্তর প্রদান করুন।
যদি প্রদত্ত তথ্যে উত্তর না থাকে, তাহলে সৎভাবে বলুন যে আপনি জানেন না।`
      : `You are a helpful customer support agent for Bangladeshi e-commerce sellers.
Provide concise, professional answers based on the provided information.
If the information doesn't contain the answer, honestly say you don't know.`

  const contextText =
    context.chunks.length > 0
      ? `Based on the following information:\n\n${context.chunks.map((c) => c.content).join('\n\n')}`
      : 'No relevant information found in the knowledge base.'

  const messages = [
    {
      role: 'system' as const,
      content: systemPrompt,
    },
    {
      role: 'user' as const,
      content: `${contextText}\n\nQuestion: ${query}`,
    },
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    max_tokens: 500,
  })

  return response.choices[0].message.content || 'Unable to generate response'
}

export async function deductCredits(organizationId: string, tokensUsed: number): Promise<boolean> {
  const creditsToDeduct = Math.ceil(tokensUsed / 1000) // 1 credit per ~1000 tokens

  const { data: org, error: fetchError } = await supabase
    .from('organizations')
    .select('credit_balance, subscription_tier')
    .eq('id', organizationId)
    .single()

  if (fetchError || !org) {
    return false
  }

  // Enterprise tier has unlimited credits (-1)
  if (org.subscription_tier === 'enterprise') {
    return true
  }

  if (org.credit_balance < creditsToDeduct) {
    return false
  }

  const { error: updateError } = await supabase
    .from('organizations')
    .update({
      credit_balance: org.credit_balance - creditsToDeduct,
    })
    .eq('id', organizationId)

  return !updateError
}
