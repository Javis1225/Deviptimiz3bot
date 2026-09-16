import { describe, expect, it } from 'vitest'
import { md5 } from './Md5Generator'

describe('md5', () => {
  it('matches the standard empty-string vector', () => {
    expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
  })

  it('matches the standard "abc" vector', () => {
    expect(md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72')
  })

  it('matches the standard pangram vector', () => {
    expect(md5('The quick brown fox jumps over the lazy dog')).toBe('9e107d9d372bb6826bd81d3542a419d6')
  })

  it('produces a 32-character lowercase hex string for arbitrary input', () => {
    const hash = md5('DevOptimizeBot')
    expect(hash).toMatch(/^[0-9a-f]{32}$/)
  })

  it('handles input lengths that straddle the padding block boundary', () => {
    // 55 bytes + the required 0x80 padding byte lands exactly at 56, fitting
    // in one 64-byte block; 56 bytes pushes padding into a second block.
    // Both should still produce valid, well-formed output.
    expect(md5('a'.repeat(55))).toMatch(/^[0-9a-f]{32}$/)
    expect(md5('a'.repeat(56))).toMatch(/^[0-9a-f]{32}$/)
    expect(md5('a'.repeat(55))).not.toBe(md5('a'.repeat(56)))
  })
})
