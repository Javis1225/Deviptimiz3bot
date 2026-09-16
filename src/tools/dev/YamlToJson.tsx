import { useMemo, useState } from 'react'
import { load } from 'js-yaml'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const SAMPLE = `name: DevOptimizeBot
tagline: One workbench. Every tool you need.
categories:
  - YouTube Creator Tools
  - Developer & Link Utilities
active: true
tool_count: 121`

export default function YamlToJson() {
  const [input, setInput] = useState(SAMPLE)

  const { json, error } = useMemo(() => {
    if (!input.trim()) return { json: '', error: null as string | null }
    try {
      return { json: JSON.stringify(load(input), null, 2), error: null }
    } catch (err) {
      return { json: '', error: err instanceof Error ? err.message : 'Invalid YAML' }
    }
  }, [input])

  return (
    <ToolShell title="YAML to JSON Converter" description="Convert YAML into JSON.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={9} className="field font-mono text-sm" />

      {error ? (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      ) : (
        <>
          <div className="mt-3 flex justify-end">
            <CopyButton text={json} />
          </div>
          <textarea value={json} readOnly rows={9} className="field mt-1 font-mono text-sm" />
        </>
      )}
    </ToolShell>
  )
}
