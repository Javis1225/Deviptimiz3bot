import { categories } from '@/data/tools'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  active: number | null
  onChange: (id: number | null) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
          active === null
            ? "bg-accent text-navy-900"
            : "bg-navy-700 text-slate-300 hover:bg-navy-600"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
            active === cat.id
              ? "bg-accent text-navy-900"
              : "bg-navy-700 text-slate-300 hover:bg-navy-600"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
