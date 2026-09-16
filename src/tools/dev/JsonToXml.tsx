import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function isValidTagName(key: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_.-]*$/.test(key)
}

function toXml(value: unknown, tagName: string, depth: number): string {
  const indent = '  '.repeat(depth)
  const safeTag = isValidTagName(tagName) ? tagName : 'item'

  if (value === null || value === undefined) return `${indent}<${safeTag} />`

  if (Array.isArray(value)) {
    return value.map((item) => toXml(item, safeTag, depth)).join('\n')
  }

  if (typeof value === 'object') {
    const children = Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => toXml(val, key, depth + 1))
      .join('\n')
    return `${indent}<${safeTag}>\n${children}\n${indent}</${safeTag}>`
  }

  return `${indent}<${safeTag}>${escapeXml(String(value))}</${safeTag}>`
}

export default function JsonToXml() {
  const [input, setInput] = useState('{"tool":{"name":"DevOptimizeBot","tags":["fast","free"]}}')
  const [rootName, setRootName] = useState('root')

  const { xml, error } = useMemo(() => {
    if (!input.trim()) return { xml: '', error: null }
    try {
      const parsed = JSON.parse(input)
      const body = Object.entries(parsed as Record<string, unknown>)
        .map(([key, val]) => toXml(val, key, 1))
        .join('\n')
      return { xml: `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${body}\n</${rootName}>`, error: null }
    } catch (err) {
      return { xml: '', error: err instanceof Error ? err.message : 'Invalid JSON' }
    }
  }, [input, rootName])

  return (
    <ToolShell title="JSON to XML Converter" description="Convert a JSON object into XML.">
      <div className="flex items-center gap-2">
        <label className="text-xs text-white/50">Root element</label>
        <input value={rootName} onChange={(e) => setRootName(e.target.value || 'root')} className="field w-32" />
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={7} className="field mt-2 font-mono text-sm" />

      {error ? (
        <p className="mt-3 text-sm text-red-400">Invalid JSON: {error}</p>
      ) : (
        <>
          <div className="mt-3 flex justify-end">
            <CopyButton text={xml} />
          </div>
          <textarea value={xml} readOnly rows={9} className="field mt-1 font-mono text-sm" />
        </>
      )}
    </ToolShell>
  )
}
