import { Tool } from '@/data/tools'
import { runTool } from '@/lib/tools/runTool'
import { useState } from 'react'

interface Props {
  tool: Tool
}

export function ToolPlaceholder({ tool }: Props) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    setLoading(true)
    setOutput('')
    try {
      const result = await runTool(tool.slug, input)
      setOutput(result)
    } catch (err: any) {
      setOutput(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder="Enter your input here..."
          className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-navy-600 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none resize-y"
        />
      </div>

      <button
        onClick={handleRun}
        disabled={loading}
        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-accent text-navy-900 font-semibold text-sm hover:bg-accent-hover disabled:opacity-50 transition-colors"
      >
        {loading ? 'Processing...' : 'Run Tool'}
      </button>

      {output && (
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Output</label>
          <pre className="w-full px-3 py-2.5 rounded-lg bg-navy-900 border border-navy-600 text-sm text-slate-100 whitespace-pre-wrap break-words overflow-x-auto">
            {output}
          </pre>
          <button
            onClick={() => navigator.clipboard?.writeText(output)}
            className="mt-2 text-xs text-accent hover:underline"
          >
            Copy to clipboard
          </button>
        </div>
      )}

      <p className="text-xs text-slate-500 pt-2 border-t border-navy-700">
        DevOptimizeBot · {tool.name}
      </p>
    </div>
  )
}
