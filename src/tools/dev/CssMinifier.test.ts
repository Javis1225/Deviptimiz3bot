import { describe, expect, it } from 'vitest'
import { minifyCss } from './CssMinifier'

describe('minifyCss', () => {
  it('strips comments, whitespace, and the redundant semicolon before a closing brace', () => {
    const input = `.card {
  background: #182A52;
  border-radius: 12px;
  padding: 16px 20px;
}

.card:hover {
  border-color: #FFC531;
}`
    expect(minifyCss(input)).toBe('.card{background:#182A52;border-radius:12px;padding:16px 20px}.card:hover{border-color:#FFC531}')
  })

  it('removes block comments', () => {
    expect(minifyCss('/* header styles */\n.a { color: red; }')).toBe('.a{color:red}')
  })

  it('is idempotent — minifying already-minified CSS changes nothing', () => {
    const once = minifyCss('.a { color: red; margin: 0; }')
    expect(minifyCss(once)).toBe(once)
  })
})
