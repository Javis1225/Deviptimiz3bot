import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { ToolMeta } from '../types/tool'

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  if (!tool.implemented) {
    return (
      <div className="flex flex-col justify-between rounded-card border border-white/10 bg-navy-900/60 p-4 opacity-60">
        <div>
          <p className="text-sm font-medium text-white">{tool.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/50">{tool.description}</p>
        </div>
        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/50">
          <Clock size={11} />
          Coming soon
        </span>
      </div>
    )
  }

  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="group flex flex-col justify-between rounded-card border border-white/10 bg-navy-900 p-4 transition-colors hover:border-accent-400/60"
    >
      <div>
        <p className="text-sm font-medium text-white">{tool.name}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">{tool.description}</p>
      </div>
      <span className="mt-3 inline-flex w-fit items-center gap-1 text-[11px] font-medium text-accent-400">
        Open
        <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}
