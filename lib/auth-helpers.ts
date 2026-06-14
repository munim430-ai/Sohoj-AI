/**
 * Authorization helpers for API routes.
 *
 * The golden rule enforced here: the organization a request operates on is
 * ALWAYS derived from the authenticated user's record — never accepted from the
 * request body, query string, or form data. This closes the IDOR class of bugs
 * where a caller could act on an arbitrary `organizationId`.
 */
import { createServerSupabase } from './supabase-server'

export class AuthError extends Error {
  status: number
  constructor(message: string, status = 401) {
    super(message)
    this.status = status
  }
}

export interface AuthContext {
  userId: string
  email: string
  organizationId: string
  role: 'owner' | 'admin'
}

/**
 * Resolve the authenticated user and their organization, or throw AuthError.
 * Use at the top of every authenticated API route.
 */
export async function requireAuth(): Promise<AuthContext> {
  const supabase = createServerSupabase()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new AuthError('Authentication required', 401)
  }

  const { data: membership, error: memberError } = await supabase
    .from('users')
    .select('organization_id, role, email')
    .eq('auth_id', user.id)
    .single()

  if (memberError || !membership) {
    throw new AuthError('No organization found for this user', 403)
  }

  return {
    userId: user.id,
    email: membership.email ?? user.email ?? '',
    organizationId: membership.organization_id,
    role: membership.role,
  }
}
