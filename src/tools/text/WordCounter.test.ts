import { describe, expect, it } from 'vitest'
import { countStats } from './WordCounter'

describe('countStats', () => {
  it('counts words by whitespace splitting', () => {
    expect(countStats('the quick brown fox').words).toBe(4)
  })

  it('returns zero words for empty or whitespace-only input', () => {
    expect(countStats('').words).toBe(0)
    expect(countStats('   ').words).toBe(0)
  })

  it('counts characters with and without spaces', () => {
    const stats = countStats('a b')
    expect(stats.charsWithSpaces).toBe(3)
    expect(stats.charsNoSpaces).toBe(2)
  })

  it('counts sentences by terminal punctuation', () => {
    expect(countStats('One. Two! Three?').sentences).toBe(3)
  })

  it('counts paragraphs by blank-line separation', () => {
    expect(countStats('First para.\n\nSecond para.').paragraphs).toBe(2)
  })

  it('estimates reading time at 200 words per minute', () => {
    const twoHundredWords = Array(200).fill('word').join(' ')
    expect(countStats(twoHundredWords).readingMinutes).toBeCloseTo(1, 5)
  })
})
