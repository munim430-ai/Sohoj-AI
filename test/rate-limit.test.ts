import { describe, it, expect } from 'vitest'
import { rateLimit } from '@/lib/rate-limit'

describe('rateLimit', () => {
  it('allows up to the limit then blocks', () => {
    const key = `t-${Math.random()}`
    expect(rateLimit(key, 3, 1000).allowed).toBe(true)
    expect(rateLimit(key, 3, 1000).allowed).toBe(true)
    expect(rateLimit(key, 3, 1000).allowed).toBe(true)
    const blocked = rateLimit(key, 3, 1000)
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('resets after the window elapses', async () => {
    const key = `t-${Math.random()}`
    expect(rateLimit(key, 1, 30).allowed).toBe(true)
    expect(rateLimit(key, 1, 30).allowed).toBe(false)
    await new Promise((r) => setTimeout(r, 40))
    expect(rateLimit(key, 1, 30).allowed).toBe(true)
  })
})
