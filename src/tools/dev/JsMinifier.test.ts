import { describe, expect, it } from 'vitest'
import { minifyJs } from './JsMinifier'

describe('minifyJs', () => {
  it('strips line comments and collapses whitespace while producing valid, equivalent code', () => {
    const input = `// Sum an array of numbers
function sum(numbers) {
  let total = 0;
  for (const n of numbers) {
    total += n; // running total
  }
  return total;
}`
    const output = minifyJs(input)
    expect(output).not.toContain('//')
    // The real test: minified code must still run and produce the same result.
    // eslint-disable-next-line no-new-func
    const fn = new Function(`${output}\nreturn sum([1, 2, 3]);`)
    expect(fn()).toBe(6)
  })

  it('does not mangle a regex literal that looks like a comment opener', () => {
    const output = minifyJs("const re = /ab\\/c/gi; const x = 10 / 2; // comment")
    expect(output).toContain('/ab\\/c/gi')
    expect(output).not.toContain('comment')
  })

  it('preserves string contents even if they contain // or /* */', () => {
    const output = minifyJs('const s = "not // a comment"; const t = "also /* not */ a comment";')
    expect(output).toContain('not // a comment')
    expect(output).toContain('also /* not */ a comment')
  })

  it('removes block comments', () => {
    const output = minifyJs('/* license header */\nconst x = 1;')
    expect(output).not.toContain('license header')
    expect(output).toContain('const x=1;')
  })
})
