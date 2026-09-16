import { useMemo, useState } from 'react'
import Hero from '../components/Hero'
import SearchAndFilters from '../components/SearchAndFilters'
import ToolCard from '../components/ToolCard'
import AdSlot from '../components/AdSlot'
import { CATEGORIES, TOOLS } from '../data/toolRegistry'

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TOOLS.filter((tool) => {
      const matchesCategory = !activeCategory || tool.categorySlug === activeCategory
      const matchesQuery = !q || tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  const sortedCategories = useMemo(() => [...CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder), [])

  return (
    <div className="flex flex-col gap-8">
      <Hero />

      <SearchAndFilters
        categories={sortedCategories}
        query={query}
        onQueryChange={setQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {filteredTools.length === 0 ? (
        <p className="rounded-card border border-white/10 bg-navy-900 p-6 text-center text-sm text-white/50">
          No tools match "{query}". Try a different search or category.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredTools
            .slice()
            .sort((a, b) => Number(b.implemented) - Number(a.implemented))
            .map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
        </div>
      )}

      <AdSlot />
    </div>
  )
}
