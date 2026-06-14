/**
 * Server-side Supabase clients.
 *
 * - `createServerSupabase()` reads the user's session from request cookies, so
 *   Row Level Security applies and we can identify the authenticated user.
 * - `supabaseAdmin` uses the service-role key and bypasses RLS. It must ONLY be
 *   used after the caller's identity and authorization have been verified.
 */
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { serverEnv } from './env'

export function createServerSupabase() {
  const cookieStore = cookies()
  return createServerClient(serverEnv.supabaseUrl, serverEnv.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Called from a Server Component without a mutable cookie store —
          // safe to ignore when session refresh is handled by middleware.
        }
      },
    },
  })
}

let _admin: ReturnType<typeof createClient<any>> | null = null

/** Service-role client. Authorize the caller BEFORE using this. */
export function supabaseAdmin() {
  if (!_admin) {
    _admin = createClient<any>(serverEnv.supabaseUrl, serverEnv.supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _admin
}
