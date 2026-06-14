'use client'

/**
 * Browser Supabase client.
 *
 * Uses @supabase/ssr so the auth session is persisted in cookies and shared
 * with the server (middleware + route handlers). Never put the service-role key
 * here — server-only access lives in lib/supabase-server.ts.
 */
import { createBrowserClient } from '@supabase/ssr'

// Fallbacks keep static prerendering from throwing when env vars are absent at
// build time. The anon key is a public value; real NEXT_PUBLIC_* values are
// inlined at runtime in the browser. Server secrets still fail loud (lib/env.ts).
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
)
