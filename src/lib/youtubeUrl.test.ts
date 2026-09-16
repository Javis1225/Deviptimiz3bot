import { describe, expect, it } from 'vitest'
import { extractChannelRef, extractVideoId } from './youtubeUrl'

describe('extractVideoId', () => {
  it('extracts from a standard watch URL', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts from a youtu.be short link', () => {
    expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts from a Shorts URL', () => {
    expect(extractVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts from an embed URL', () => {
    expect(extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('accepts a bare 11-character ID', () => {
    expect(extractVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('returns null for garbage input', () => {
    expect(extractVideoId('not a url at all')).toBeNull()
    expect(extractVideoId('https://example.com/')).toBeNull()
  })
})

describe('extractChannelRef', () => {
  it('recognizes a bare channel ID', () => {
    expect(extractChannelRef('UCuAXFkgsw1L7xaCfnd5JJOw')).toEqual({ type: 'id', value: 'UCuAXFkgsw1L7xaCfnd5JJOw' })
  })

  it('recognizes an @handle', () => {
    expect(extractChannelRef('@mkbhd')).toEqual({ type: 'handle', value: 'mkbhd' })
  })

  it('recognizes a /channel/ URL', () => {
    expect(extractChannelRef('https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw')).toEqual({
      type: 'id',
      value: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    })
  })

  it('recognizes an @handle URL', () => {
    expect(extractChannelRef('https://www.youtube.com/@mkbhd')).toEqual({ type: 'handle', value: 'mkbhd' })
  })
})
