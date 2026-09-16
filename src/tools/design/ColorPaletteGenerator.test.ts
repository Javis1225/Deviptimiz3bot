import { describe, expect, it } from 'vitest'
import { hexToHsl, hslToHex } from './ColorPaletteGenerator'

describe('hexToHsl / hslToHex round-trip', () => {
  const cases = ['#FFC531', '#182A52', '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF']

  it.each(cases)('round-trips %s back to the same hex', (hex) => {
    const { h, s, l } = hexToHsl(hex)
    expect(hslToHex(h, s, l).toUpperCase()).toBe(hex.toUpperCase())
  })
})

describe('hexToHsl', () => {
  it('identifies pure red as hue 0', () => {
    expect(hexToHsl('#FF0000').h).toBeCloseTo(0, 0)
  })

  it('identifies white as zero saturation, full lightness', () => {
    const { s, l } = hexToHsl('#FFFFFF')
    expect(s).toBeCloseTo(0, 5)
    expect(l).toBeCloseTo(1, 5)
  })
})
