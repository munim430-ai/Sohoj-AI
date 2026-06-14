import { describe, it, expect } from 'vitest'
import { detectLanguage } from '@/lib/language'

describe('detectLanguage', () => {
  it('detects English', () => {
    expect(detectLanguage('Where is my order?')).toBe('en')
  })

  it('detects Bengali', () => {
    expect(detectLanguage('আমার অর্ডার কোথায়?')).toBe('bn')
  })

  it('detects Bengali in mixed text above threshold', () => {
    expect(detectLanguage('আমার product এর দাম কত?')).toBe('bn')
  })

  it('defaults to English for empty-ish input', () => {
    expect(detectLanguage('123 456')).toBe('en')
  })
})
