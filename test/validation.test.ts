import { describe, it, expect } from 'vitest'
import { chatSchema, checkoutSchema, updateOrgSchema, createOrgSchema } from '@/lib/validation'

describe('chatSchema', () => {
  it('accepts a valid message', () => {
    expect(chatSchema.safeParse({ message: 'hello' }).success).toBe(true)
  })
  it('rejects empty messages', () => {
    expect(chatSchema.safeParse({ message: '   ' }).success).toBe(false)
  })
  it('rejects overly long messages', () => {
    expect(chatSchema.safeParse({ message: 'x'.repeat(5000) }).success).toBe(false)
  })
})

describe('checkoutSchema', () => {
  it('enforces minimum 100 credits', () => {
    expect(checkoutSchema.safeParse({ amount: 50, creditsToAdd: 50 }).success).toBe(false)
    expect(checkoutSchema.safeParse({ amount: 100, creditsToAdd: 100 }).success).toBe(true)
  })
})

describe('updateOrgSchema', () => {
  it('rejects malformed colors', () => {
    expect(
      updateOrgSchema.safeParse({ branding: { primary_color: 'red' } }).success,
    ).toBe(false)
  })
  it('accepts a hex color', () => {
    expect(
      updateOrgSchema.safeParse({ branding: { primary_color: '#1a73e8' } }).success,
    ).toBe(true)
  })
})

describe('createOrgSchema', () => {
  it('rejects invalid slugs', () => {
    expect(createOrgSchema.safeParse({ name: 'X', slug: 'Bad Slug' }).success).toBe(false)
  })
  it('accepts a clean slug', () => {
    expect(createOrgSchema.safeParse({ name: 'X', slug: 'my-shop-123' }).success).toBe(true)
  })
})
