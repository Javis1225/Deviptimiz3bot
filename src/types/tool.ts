export interface Category {
  slug: string
  name: string
  sortOrder: number
}

export interface ToolMeta {
  slug: string
  name: string
  categorySlug: string
  description: string
  /** Whether a real, working component exists for this tool yet. */
  implemented: boolean
  /** Key into TOOL_COMPONENTS (src/lib/toolComponents.tsx) when implemented. */
  componentKey: string | null
  sortOrder: number
}
