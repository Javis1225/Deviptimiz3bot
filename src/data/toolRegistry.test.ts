import { describe, expect, it } from 'vitest'
import { CATEGORIES, EXPECTED_CATEGORY_COUNT, EXPECTED_TOOL_COUNT, TOOLS } from './toolRegistry'
import { TOOL_COMPONENTS } from '../lib/toolComponents'

describe('toolRegistry', () => {
  it('has exactly the expected number of categories and tools', () => {
    expect(CATEGORIES).toHaveLength(EXPECTED_CATEGORY_COUNT)
    expect(TOOLS).toHaveLength(EXPECTED_TOOL_COUNT)
  })

  it('has no duplicate tool names or slugs', () => {
    const names = TOOLS.map((t) => t.name)
    const slugs = TOOLS.map((t) => t.slug)
    expect(new Set(names).size).toBe(names.length)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has no duplicate category slugs', () => {
    const slugs = CATEGORIES.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('gives every tool a valid, lowercase-hyphenated slug', () => {
    for (const tool of TOOLS) {
      expect(tool.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('points every tool at a category that actually exists', () => {
    const categorySlugs = new Set(CATEGORIES.map((c) => c.slug))
    for (const tool of TOOLS) {
      expect(categorySlugs.has(tool.categorySlug)).toBe(true)
    }
  })

  it('has a real registered component for every tool marked implemented', () => {
    for (const tool of TOOLS) {
      if (!tool.implemented) continue
      expect(tool.componentKey).not.toBeNull()
      expect(TOOL_COMPONENTS[tool.componentKey as string]).toBeDefined()
    }
  })

  it('does not mark a tool implemented without giving it a componentKey, or vice versa', () => {
    for (const tool of TOOLS) {
      expect(tool.implemented).toBe(tool.componentKey !== null)
    }
  })
})
