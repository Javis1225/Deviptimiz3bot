import { describe, expect, it } from 'vitest'
import { diffLines } from './TextDiffChecker'

describe('diffLines', () => {
  it('reports no changes for identical text', () => {
    const result = diffLines('a\nb\nc', 'a\nb\nc')
    expect(result.every((d) => d.type === 'same')).toBe(true)
    expect(result.map((d) => d.text)).toEqual(['a', 'b', 'c'])
  })

  it('detects a single added line', () => {
    const result = diffLines('a\nb', 'a\nb\nc')
    expect(result).toEqual([
      { type: 'same', text: 'a' },
      { type: 'same', text: 'b' },
      { type: 'added', text: 'c' },
    ])
  })

  it('detects a single removed line', () => {
    const result = diffLines('a\nb\nc', 'a\nc')
    expect(result).toEqual([
      { type: 'same', text: 'a' },
      { type: 'removed', text: 'b' },
      { type: 'same', text: 'c' },
    ])
  })

  it('detects a changed line as a remove+add pair', () => {
    const result = diffLines('hello world', 'hello there')
    expect(result).toEqual([
      { type: 'removed', text: 'hello world' },
      { type: 'added', text: 'hello there' },
    ])
  })

  it('handles a completely empty original', () => {
    const result = diffLines('', 'new content')
    expect(result).toEqual([
      { type: 'removed', text: '' },
      { type: 'added', text: 'new content' },
    ])
  })
})
