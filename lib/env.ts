/**
 * Centralized, validated environment access.
 *
 * Server secrets are read lazily through getters so that a missing variable
 * fails loudly the first time it is actually needed at runtime — never silently
 * falling back to a placeholder that would point production at a fake backend.
 *
 * Public (NEXT_PUBLIC_*) values are inlined by Next at build time and are safe
 * to read directly in the browser.
 */

function required(name: string): string {
  const value = process.env[name]
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set it in your environment (.env.local or your host's config).`,
    )
  }
  return value
}

function optional(name: string, fallback = ''): string {
  return process.env[name]?.trim() || fallback
}

/** Public values — safe in the browser, inlined at build time. */
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
}

/** Server-only secrets — never import this object into client components. */
export const serverEnv = {
  get supabaseUrl() {
    return required('NEXT_PUBLIC_SUPABASE_URL')
  },
  get supabaseAnonKey() {
    return required('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  },
  get supabaseServiceKey() {
    return required('SUPABASE_SERVICE_ROLE_KEY')
  },
  get qdrantUrl() {
    return required('QDRANT_URL')
  },
  get qdrantApiKey() {
    return required('QDRANT_API_KEY')
  },
  // LLM provider — Groq (OpenAI-compatible, free tier) is the cheapest default.
  get llmApiKey() {
    return required('GROQ_API_KEY')
  },
  get llmBaseUrl() {
    return optional('LLM_BASE_URL', 'https://api.groq.com/openai/v1')
  },
  get llmModel() {
    return optional('LLM_MODEL', 'llama-3.3-70b-versatile')
  },
  get aamarpayStoreId() {
    return required('AAMARPAY_STORE_ID')
  },
  get aamarpaySignatureKey() {
    return required('AAMARPAY_SIGNATURE_KEY')
  },
  get aamarpaySandbox() {
    return optional('AAMARPAY_SANDBOX', 'true') === 'true'
  },
  get appUrl() {
    return optional('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')
  },
}

/**
 * Comma-separated allow-list of origins permitted to embed the chat widget and
 * call the public chat API cross-origin. Empty = same-origin only.
 */
export function allowedWidgetOrigins(): string[] {
  return optional('WIDGET_ALLOWED_ORIGINS')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
}
