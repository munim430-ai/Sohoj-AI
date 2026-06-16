import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthContext } from '@/lib/server/auth'
import { getAiProvider } from '@/lib/server/ai/provider'
import { answer } from '@/lib/server/ai/assistant'
import { toPaisa, TxnType, Record as ARecord } from '@/lib/server/analytics'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const ctx = await getAuthContext(req)
  if (!ctx) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const question: string = body?.question ?? ''
  if (!question.trim()) return NextResponse.json({ error: 'question required' }, { status: 400 })

  const { data: rows } = await supabaseAdmin
    .from('bkash_transactions')
    .select('type, amount, fee, occurred_at')
    .eq('organization_id', ctx.orgId)

  const records: ARecord[] = (rows ?? []).map((r) => ({
    type: r.type as TxnType,
    amountPaisa: toPaisa(r.amount as string),
    feePaisa: toPaisa(r.fee as string),
    occurredAt: r.occurred_at ? Date.parse(r.occurred_at as string) : null,
  }))

  // The figure is computed deterministically; the LLM only phrases it.
  const result = await answer(question, records, getAiProvider())
  return NextResponse.json(result)
}
