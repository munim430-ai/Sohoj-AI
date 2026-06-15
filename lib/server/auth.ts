import { supabaseAdmin } from '@/lib/supabase'
import { Plan } from './plans'

export interface AuthContext {
  authId: string
  orgId: string
  role: string
  plan: Plan
}

/** Resolves the caller's org + plan from a Supabase access token (Bearer). */
export async function getAuthContext(req: Request): Promise<AuthContext | null> {
  const header = req.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return null

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  const authId = data.user.id

  const { data: member } = await supabaseAdmin
    .from('organization_members')
    .select('organization_id, role')
    .eq('auth_id', authId)
    .single()
  if (!member) return null

  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('plan')
    .eq('organization_id', member.organization_id)
    .single()

  return {
    authId,
    orgId: member.organization_id as string,
    role: member.role as string,
    plan: ((sub?.plan as Plan) || 'free'),
  }
}

export async function audit(
  orgId: string | null,
  actorAuthId: string | null,
  action: string,
  entity?: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  await supabaseAdmin.from('audit_logs').insert({
    organization_id: orgId,
    actor_auth_id: actorAuthId,
    action,
    entity,
    metadata,
  })
}
