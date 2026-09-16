import { describe, expect, it } from 'vitest'
import { contrastRatio, relativeLuminance } from './ColorContrastChecker'

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5)
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5)
  })
})

describe('contrastRatio', () => {
  it('is exactly 21:1 for black on white (the maximum possible ratio)', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1)
  })

  it('is 1:1 for identical colors', () => {
    expect(contrastRatio('#182A52', '#182A52')).toBeCloseTo(1, 5)
  })

  it('is symmetric regardless of argument order', () => {
    expect(contrastRatio('#182A52', '#FFC531')).toBeCloseTo(contrastRatio('#FFC531', '#182A52'), 10)
  })

  it('white text on this brand navy passes WCAG AA for normal text', () => {
    expect(contrastRatio('#FFFFFF', '#182A52')).toBeGreaterThanOrEqual(4.5)
  })
})
