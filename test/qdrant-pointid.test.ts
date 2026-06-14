import { describe, it, expect } from 'vitest'
import { pointId, getCollectionName } from '@/lib/qdrant-server'

describe('pointId', () => {
  it('is deterministic for the same document + chunk', () => {
    const a = pointId('doc-123', 4)
    const b = pointId('doc-123', 4)
    expect(a).toBe(b)
  })

  it('differs across chunks and documents', () => {
    expect(pointId('doc-123', 0)).not.toBe(pointId('doc-123', 1))
    expect(pointId('doc-123', 0)).not.toBe(pointId('doc-456', 0))
  })

  it('stays within safe integer range', () => {
    expect(pointId('doc-xyz', 99)).toBeLessThan(Number.MAX_SAFE_INTEGER)
  })
})

describe('getCollectionName', () => {
  it('namespaces per organization', () => {
    expect(getCollectionName('11111111-2222-3333-4444-555555555555')).toBe(
      'org_11111111_2222_3333_4444_555555555555',
    )
  })
})
