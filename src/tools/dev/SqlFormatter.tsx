import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const BREAK_BEFORE = [
  'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT',
  'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'JOIN', 'ON',
  'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
]
const KEYWORDS = [...BREAK_BEFORE, 'AND', 'OR', 'AS', 'IN', 'NOT', 'NULL', 'IS', 'LIKE', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END']

/**
 * Heuristic formatter: breaks lines before major clauses and uppercases
 * keywords. It does not parse the query, so deeply nested subqueries or
 * unusual formatting may not indent perfectly — good enough for everyday
 * cleanup, not a full SQL parser.
 */
function formatSql(sql: string): string {
  let working = sql.replace(/\s+/g, ' ').trim()

  // Uppercase known keywords (word-boundary, case-insensitive), longest first
  // so multi-word keywords like "GROUP BY" match before "BY" alone would.
  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length)
  for (const kw of sorted) {
    const re = new RegExp(`\\b${kw.replace(' ', '\\s+')}\\b`, 'gi')
    working = working.replace(re, kw)
  }

  for (const kw of BREAK_BEFORE) {
    const re = new RegExp(`\\s+(${kw})\\b`, 'g')
    working = working.replace(re, `\n${kw}`)
  }
  working = working.replace(/\s+(AND|OR)\b/g, '\n  $1')
  working = working.replace(/,\s*/g, ',\n  ')

  return working
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
}

const SAMPLE = `select u.id, u.name, count(t.id) as tool_uses from users u left join tool_usage t on t.user_id = u.id where u.points_balance > 10 group by u.id, u.name order by tool_uses desc limit 20;`

export default function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE)
  const output = useMemo(() => formatSql(input), [input])

  return (
    <ToolShell title="SQL Formatter" description="Break a query onto readable lines with keywords capitalized. Heuristic, not a full parser.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="field font-mono text-sm" />

      <div className="mt-3 flex justify-end">
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={10} className="field mt-1 font-mono text-sm" />
    </ToolShell>
  )
}
