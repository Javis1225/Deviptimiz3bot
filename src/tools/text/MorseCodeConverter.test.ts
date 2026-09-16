import { describe, expect, it } from 'vitest'
import { morseToText, textToMorse } from './MorseCodeConverter'

describe('textToMorse', () => {
  it('encodes SOS correctly', () => {
    expect(textToMorse('SOS')).toBe('... --- ...')
  })

  it('separates words with a slash', () => {
    expect(textToMorse('HI THERE')).toBe(textToMorse('HI') + ' / ' + textToMorse('THERE'))
  })

  it('is case-insensitive', () => {
    expect(textToMorse('sos')).toBe(textToMorse('SOS'))
  })
})

describe('morseToText round-trip', () => {
  it('recovers the original text for a simple phrase', () => {
    const original = 'HELLO WORLD'
    expect(morseToText(textToMorse(original))).toBe(original)
  })

  it('recovers digits and letters together', () => {
    const original = 'AGENT 007'
    expect(morseToText(textToMorse(original))).toBe(original)
  })
})
