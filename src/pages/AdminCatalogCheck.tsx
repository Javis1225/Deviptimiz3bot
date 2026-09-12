import { Header } from '@/components/Header'
import { validateCatalog, tools, categories } from '@/data/tools'

export function AdminCatalogCheck() {
  const result = validateCatalog()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-xl font-semibold mb-6">Catalog Validation</h1>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between p-3 rounded-lg bg-navy-800 border border-navy-600">
            <span>Expected named tools</span>
            <span className="text-accent">{result.expectedNamedTools}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-navy-800 border border-navy-600">
            <span>Actual named tools</span>
            <span className={result.actualNamedTools === 121 ? 'text-green-400' : 'text-red-400'}>
              {result.actualNamedTools}
            </span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-navy-800 border border-navy-600">
            <span>Categories</span>
            <span className={result.categories === 7 ? 'text-green-400' : 'text-red-400'}>
              {result.categories}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-navy-800 border border-navy-600">
            <span className="block mb-1">Missing</span>
            <span className="text-slate-400">
              {result.missing.length === 0 ? '[]' : JSON.stringify(result.missing)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-navy-800 border border-navy-600">
            <span className="block mb-1">Duplicates</span>
            <span className="text-slate-400">
              {result.duplicates.length === 0 ? '[]' : JSON.stringify(result.duplicates)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-navy-800 border border-navy-600">
            <span className="block mb-1">Invalid slugs</span>
            <span className="text-slate-400">
              {result.invalidSlugs.length === 0 ? '[]' : JSON.stringify(result.invalidSlugs)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-navy-800 border border-navy-600">
            <span className="block mb-1">Disabled tools</span>
            <span className="text-slate-400">
              {result.disabledTools.length === 0 ? '[]' : JSON.stringify(result.disabledTools)}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-3">All tools by category</h2>
          {categories.map((cat) => (
            <div key={cat.id} className="mb-4">
              <h3 className="text-xs text-accent mb-1">{cat.name}</h3>
              <ul className="text-xs text-slate-400 space-y-0.5">
                {tools
                  .filter((t) => t.category_id === cat.id)
                  .map((t) => (
                    <li key={t.id}>
                      {t.id}. {t.name} <span className="text-slate-600">({t.slug})</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
