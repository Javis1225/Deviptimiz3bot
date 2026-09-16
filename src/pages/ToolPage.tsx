import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { TOOLS } from '../data/toolRegistry'
import { TOOL_COMPONENTS } from '../lib/toolComponents'
import { supabase } from '../lib/supabaseClient'
import { getTelegramUser } from '../lib/telegram'

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>()
  const tool = TOOLS.find((t) => t.slug === slug)

  useEffect(() => {
    if (!tool?.implemented || !supabase) return
    // Best-effort usage logging — never blocks rendering, never surfaces errors to the user.
    const telegramUser = getTelegramUser()
    supabase
      .from('tool_usage')
      .insert({
        metadata: { slug: tool.slug, telegram_id: telegramUser?.id ?? null },
      })
      .then(({ error }) => {
        if (error) console.warn('[tool_usage] not logged:', error.message)
      })
  }, [tool])

  return (
    <div>
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
        <ArrowLeft size={14} />
        All tools
      </Link>

      {!tool ? (
        <NotFound />
      ) : tool.implemented && tool.componentKey && TOOL_COMPONENTS[tool.componentKey] ? (
        (() => {
          const ToolComponent = TOOL_COMPONENTS[tool.componentKey]
          return <ToolComponent />
        })()
      ) : (
        <ComingSoon name={tool.name} description={tool.description} />
      )}
    </div>
  )
}

function NotFound() {
  return (
    <div className="rounded-card border border-white/10 bg-navy-900 p-6 text-sm text-white/60">
      We couldn't find that tool. It may have been renamed or removed — head back to the full list.
    </div>
  )
}

function ComingSoon({ name, description }: { name: string; description: string }) {
  return (
    <div className="rounded-card border border-white/10 bg-navy-900 p-6">
      <h1 className="font-display text-xl font-semibold text-white">{name}</h1>
      <p className="mt-2 text-sm text-white/60">{description}</p>
      <p className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
        This tool is on the roadmap and isn't built yet.
      </p>
    </div>
  )
}
