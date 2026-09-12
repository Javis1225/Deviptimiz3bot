import { Link } from 'react-router-dom'
import { Tool } from '@/data/tools'
import { cn } from '@/lib/utils'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      to={`/tool/${tool.slug}`}
      className={cn(
        "tool-card block p-4 rounded-xl border border-navy-600 bg-navy-800/60",
        "hover:bg-navy-800 transition-all"
      )}
    >
      <h3 className="font-medium text-sm text-slate-100 leading-snug">
        {tool.name}
      </h3>
      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
        {tool.description}
      </p>
    </Link>
  )
}
