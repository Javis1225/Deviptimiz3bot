import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { tools, categories } from '@/data/tools'
import { ToolPlaceholder } from '@/components/tools/ToolPlaceholder'

export function ToolPage() {
  const { slug } = useParams<{ slug: string }>()
  const tool = tools.find((t) => t.slug === slug)
  const category = tool ? categories.find((c) => c.id === tool.category_id) : null

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Tool not found</h1>
            <Link to="/" className="text-accent text-sm mt-2 inline-block">← Back to tools</Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-accent mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All tools
        </Link>

        <div className="mb-6">
          <p className="text-xs text-accent font-medium mb-1">{category?.name}</p>
          <h1 className="text-xl font-semibold">{tool.name}</h1>
          <p className="text-sm text-slate-400 mt-1">{tool.description}</p>
        </div>

        {/* Tool interface - placeholder for now, each tool gets its own component */}
        <div className="rounded-xl border border-navy-600 bg-navy-800/60 p-4 sm:p-6">
          <ToolPlaceholder tool={tool} />
        </div>

        {/* Ad area */}
        <div className="mt-6 p-4 rounded-xl border border-dashed border-navy-600 bg-navy-800/40 text-center text-xs text-slate-500">
          Advertisement · Watch ad for +1 DevOptimizeBot Point
        </div>
      </main>

      <Footer />
    </div>
  )
}
