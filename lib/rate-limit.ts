/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * Cheapest route: no external store (no Redis/Upstash bill). Per-instance state
 * is acceptable for the free/hobby tier — it bounds abuse per warm function
 * instance. Swap `check` for a Postgres/Upstash-backed version when scaling
 * horizontally.
 */
interface Window {
  count: number
  resetAt: number
}

const buckets = new Map<string, Window>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt }
}

/** Best-effort client identifier from proxy headers. */
export function clientKey(request: Request, scope: string): string {
  const fwd = request.headers.get('x-forwarded-for') || ''
  const ip = fwd.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
  return `${scope}:${ip}`
}
