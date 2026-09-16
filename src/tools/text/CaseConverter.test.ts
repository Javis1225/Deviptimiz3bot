import { describe, expect, it } from 'vitest'
import { CONVERTERS, capitalize, toWords } from './CaseConverter'

describe('toWords', () => {
  it('splits on spaces', () => {
    expect(toWords('the quick fox')).toEqual(['the', 'quick', 'fox'])
  })

  it('splits camelCase and PascalCase into words', () => {
    expect(toWords('theQuickFox')).toEqual(['the', 'quick', 'fox'])
    expect(toWords('TheQuickFox')).toEqual(['the', 'quick', 'fox'])
  })

  it('splits snake_case and kebab-case', () => {
    expect(toWords('the_quick_fox')).toEqual(['the', 'quick', 'fox'])
    expect(toWords('the-quick-fox')).toEqual(['the', 'quick', 'fox'])
  })

  it('keeps acronym runs together up to the last capital before a new word', () => {
    expect(toWords('parseHTMLString')).toEqual(['parse', 'html', 'string'])
  })

  it('ignores empty/whitespace-only input', () => {
    expect(toWords('   ')).toEqual([])
  })
})

describe('capitalize', () => {
  it('uppercases only the first letter', () => {
    expect(capitalize('fox')).toBe('Fox')
    expect(capitalize('FOX')).toBe('FOX')
  })
})

function convert(key: string, input: string): string {
  const converter = CONVERTERS.find((c) => c.key === key)
  if (!converter) throw new Error(`No converter registered for "${key}"`)
  return converter.convert(input)
}

describe('CONVERTERS', () => {
  const input = 'The Quick Brown Fox'

  it('upper', () => expect(convert('upper', input)).toBe('THE QUICK BROWN FOX'))
  it('lower', () => expect(convert('lower', input)).toBe('the quick brown fox'))
  it('title', () => expect(convert('title', input)).toBe('The Quick Brown Fox'))
  it('camel', () => expect(convert('camel', input)).toBe('theQuickBrownFox'))
  it('pascal', () => expect(convert('pascal', input)).toBe('TheQuickBrownFox'))
  it('snake', () => expect(convert('snake', input)).toBe('the_quick_brown_fox'))
  it('kebab', () => expect(convert('kebab', input)).toBe('the-quick-brown-fox'))
  it('constant', () => expect(convert('constant', input)).toBe('THE_QUICK_BROWN_FOX'))

  it('sentence case lowercases everything then capitalizes sentence starts', () => {
    expect(convert('sentence', 'HELLO world. HOW are you?')).toBe('Hello world. How are you?')
  })
})
