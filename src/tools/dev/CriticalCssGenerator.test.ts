import { describe, expect, it } from 'vitest'
import { extractCritical } from './CriticalCssGenerator'

const CSS = `.header { background: #182A52; padding: 16px; }
.hero { font-size: 32px; }
.footer { color: #888; padding: 24px; }
.modal { display: none; }`

describe('extractCritical', () => {
  it('keeps only rules matching the given selectors', () => {
    const result = extractCritical(CSS, '.header\n.hero')
    expect(result).toContain('.header')
    expect(result).toContain('.hero')
    expect(result).not.toContain('.footer')
    expect(result).not.toContain('.modal')
  })

  it('accepts comma-separated selectors as well as newline-separated', () => {
    const byNewline = extractCritical(CSS, '.header\n.footer')
    const byComma = extractCritical(CSS, '.header, .footer')
    expect(byComma).toBe(byNewline)
  })

  it('returns nothing when no selectors are given', () => {
    expect(extractCritical(CSS, '')).toBe('')
  })

  it('returns nothing when no rules match', () => {
    expect(extractCritical(CSS, '.does-not-exist')).toBe('')
  })
})
