import { describe, expect, it } from 'vitest'
import { slugify } from './SlugGenerator'

describe('slugify', () => {
  it('lowercases and hyphenates by default', () => {
    expect(slugify('Ship it Friday!', '-', true)).toBe('ship-it-friday')
  })

  it('preserves case when lowercase is false', () => {
    expect(slugify('Ship it Friday!', '-', false)).toBe('Ship-it-Friday')
  })

  it('supports underscore as a separator', () => {
    expect(slugify('Ship it Friday!', '_', true)).toBe('ship_it_friday')
  })

  it('collapses repeated separators and trims leading/trailing ones', () => {
    expect(slugify('  --hello--world--  ', '-', true)).toBe('hello-world')
  })

  it('strips accents', () => {
    expect(slugify('café résumé', '-', true)).toBe('cafe-resume')
  })
})
