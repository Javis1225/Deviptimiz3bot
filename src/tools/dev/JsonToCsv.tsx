import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function jsonToCsv(json: unknown): string {
  const rows = Array.isArray(json) ? json : [json]
  if (rows.length === 0) return ''

  const headers = [...new Set(rows.flatMap((row) => (row && typeof row === 'object' ? Object.keys(row) : ['value'])))]
  const lines = [headers.map(csvEscape).join(',')]

  for (const row of rows) {
    const record = row && typeof row === 'object' ? (row as Record<string, unknown>) : { value: row }
    lines.push(headers.map((h) => csvEscape(record[h])).join(','))
  }
  return lines.join('\n')
}

const SAMPLE = `[
  { "tool": "Slug Generator", "category": "Text & Writing Utilities", "implemented": true },
  { "tool": "YouTube Metadata Viewer", "category": "YouTube Creator Tools", "implemented": true }
]`

export default function JsonToCsv() {
  const [input, setInput] = useState(SAMPLE)

  const { csv, error } = useMemo(() => {
    if (!input.trim()) return { csv: '', error: null as string | null }
    try {
      return { csv: jsonToCsv(JSON.parse(input)), error: null }
    } catch (err) {
      return { csv: '', error: err instanceof Error ? err.message : 'Invalid JSON' }
    }
  }, [input])

  return (
    <ToolShell title="JSON to CSV Converter" description="Convert an array of JSON objects into CSV.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={7} className="field font-mono text-sm" />

      {error ? (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      ) : (
        <>
          <div className="mt-3 flex justify-end">
            <CopyButton text={csv} />
          </div>
          <textarea value={csv} readOnly rows={6} className="field mt-1 font-mono text-sm" />
        </>
      )}
    </ToolShell>
  )
}
