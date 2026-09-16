import { describe, expect, it } from 'vitest'
import { minifyHtml } from './HtmlMinifier'

describe('minifyHtml', () => {
  it('collapses whitespace between tags and strips comments', () => {
    const input = `<div class="card">
  <h2>Hello</h2>
  <p>
    This is a   paragraph.
  </p>
</div>
<!-- a comment -->`
    const output = minifyHtml(input)
    expect(output).not.toContain('<!--')
    expect(output).not.toMatch(/>\s+</)
    expect(output).toContain('<h2>Hello</h2>')
  })

  it('preserves exact whitespace inside <pre>', () => {
    const input = '<div><pre>  keep   this   spacing  </pre></div>'
    expect(minifyHtml(input)).toContain('<pre>  keep   this   spacing  </pre>')
  })

  it('preserves content inside <script> untouched', () => {
    const input = '<script>\n  const   x   =   1;\n</script>'
    expect(minifyHtml(input)).toBe(input.trim())
  })
})
