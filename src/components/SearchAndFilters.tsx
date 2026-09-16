import { Search } from 'lucide-react'
import type { Category } from '../types/tool'

export default function SearchAndFilters({
  categories,
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
}: {
  categories: Category[]
  query: string
  onQueryChange: (value: string) => void
  activeCategory: string | null
  onCategoryChange: (slug: string | null) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search tools..."
          className="field pl-9"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterChip label="All" active={activeCategory === null} onClick={() => onCategoryChange(null)} />
        {categories.map((category) => (
          <FilterChip
            key={category.slug}
            label={category.name}
            active={activeCategory === category.slug}
            onClick={() => onCategoryChange(category.slug)}
          />
        ))}
      </div>
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-accent-400 bg-accent-400 text-accent-ink'
          : 'border-white/15 text-white/70 hover:border-white/30 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}
