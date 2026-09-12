import { useState, useMemo } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { ToolCard } from '@/components/ToolCard'
import { tools, categories } from '@/data/tools'

export function Home() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      if (!tool.enabled) return false
      if (categoryId && tool.category_id !== categoryId) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, categoryId])

  const grouped = useMemo(() => {
    if (categoryId || search) return null
    return categories.map((cat) => ({
      category: cat,
      tools: tools.filter((t) => t.category_id === cat.id && t.enabled),
    }))
  }, [categoryId, search])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {/* Hero */}
        <section className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            One workbench.
            <br />
            <span className="text-accent">Every tool you need.</span>
          </h1>
          <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto">
            Fast browser tools for creators, bloggers, SEO, developers, text, design and calculations.
          </p>
        </section>

        {/* Search & Filters */}
        <div className="space-y-3 mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter active={categoryId} onChange={setCategoryId} />
        </div>

        {/* Ad placeholder */}
        <div className="mb-6 p-4 rounded-xl border border-dashed border-navy-600 bg-navy-800/40 text-center text-xs text-slate-500">
          Advertisement area · Monetag rewarded ads
        </div>

        {/* Tools */}
        {grouped ? (
          <div className="space-y-8">
            {grouped.map(({ category, tools: catTools }) => (
              <section key={category.id}>
                <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {category.name}
                  <span className="text-slate-500 font-normal">({catTools.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-400 mb-3">
              {filtered.length} tool{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-slate-500 py-12">No tools match your search.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
