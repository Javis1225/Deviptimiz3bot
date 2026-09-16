import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function elementToObject(el: Element): unknown {
  const children = Array.from(el.children)

  if (children.length === 0) {
    const text = el.textContent?.trim() ?? ''
    if (el.attributes.length === 0) return text
    const obj: Record<string, unknown> = { '#text': text }
    for (const attr of Array.from(el.attributes)) obj[`@${attr.name}`] = attr.value
    return obj
  }

  const obj: Record<string, unknown> = {}
  for (const attr of Array.from(el.attributes)) obj[`@${attr.name}`] = attr.value

  for (const child of children) {
    const value = elementToObject(child)
    if (obj[child.tagName] !== undefined) {
      if (!Array.isArray(obj[child.tagName])) obj[child.tagName] = [obj[child.tagName]]
      ;(obj[child.tagName] as unknown[]).push(value)
    } else {
      obj[child.tagName] = value
    }
  }
  return obj
}

export default function XmlToJson() {
  const [input, setInput] = useState('<tool>\n  <name>DevOptimizeBot</name>\n  <tags>\n    <tag>fast</tag>\n    <tag>free</tag>\n  </tags>\n</tool>')

  const { json, error } = useMemo(() => {
    if (!input.trim()) return { json: '', error: null }
    const doc = new DOMParser().parseFromString(input, 'application/xml')
    const parserError = doc.querySelector('parsererror')
    if (parserError) return { json: '', error: 'Invalid XML — check tags are properly closed.' }
    const root = doc.documentElement
    const result = { [root.tagName]: elementToObject(root) }
    return { json: JSON.stringify(result, null, 2), error: null }
  }, [input])

  return (
    <ToolShell title="XML to JSON Converter" description="Convert XML into a JSON object.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="field font-mono text-sm" />

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
