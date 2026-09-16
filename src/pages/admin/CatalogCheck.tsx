import { useEffect, useState } from 'react'
import { CATEGORIES, EXPECTED_CATEGORY_COUNT, EXPECTED_TOOL_COUNT, TOOLS } from '../../data/toolRegistry'
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'
import AdminGuard from '../../components/AdminGuard'

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

interface DbTool {
  slug: string
  name: string
  is_enabled: boolean
  is_implemented: boolean
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>()
  const dupes = new Set<string>()
  for (const v of values) {
    if (seen.has(v)) dupes.add(v)
    seen.add(v)
  }
  return [...dupes]
}

function CatalogCheckContent() {
  const [dbTools, setDbTools] = useState<DbTool[] | null>(null)
  const [dbError, setDbError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('tools')
      .select('slug, name, is_enabled, is_implemented')
      .then(({ data, error }) => {
        if (error) setDbError(error.message)
        else setDbTools(data)
      })
  }, [])

  // --- Registry validation (always available, no backend required) ---
  const registryNames = TOOLS.map((t) => t.name)
  const registrySlugs = TOOLS.map((t) => t.slug)
  const registryDuplicateNames = findDuplicates(registryNames)
  const registryDuplicateSlugs = findDuplicates(registrySlugs)
  const registryInvalidSlugs = TOOLS.filter((t) => !SLUG_PATTERN.test(t.slug)).map((t) => t.slug)
  const registryImplementedCount = TOOLS.filter((t) => t.implemented).length

  // --- Live DB validation (only when Supabase is connected) ---
  const dbNames = dbTools?.map((t) => t.name) ?? []
  const dbMissing = dbTools ? registryNames.filter((n) => !dbNames.includes(n)) : []
  const dbDuplicates = dbTools ? findDuplicates(dbNames) : []
  const dbDisabled = dbTools?.filter((t) => !t.is_enabled).map((t) => t.name) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Catalog check</h1>
        <p className="mt-1 text-sm text-white/60">
          Validates the tool catalog against the spec: {EXPECTED_TOOL_COUNT} named tools across {EXPECTED_CATEGORY_COUNT} categories.
        </p>
      </div>

      <Section title="Registry (bundled with this build)">
        <StatGrid
          stats={[
            { label: 'Expected named tools', value: EXPECTED_TOOL_COUNT },
            { label: 'Actual named tools', value: TOOLS.length, warn: TOOLS.length !== EXPECTED_TOOL_COUNT },
            { label: 'Categories', value: CATEGORIES.length, warn: CATEGORIES.length !== EXPECTED_CATEGORY_COUNT },
            { label: 'Implemented', value: `${registryImplementedCount} / ${TOOLS.length}` },
          ]}
        />
        <ListRow label="Duplicates (name)" items={registryDuplicateNames} />
        <ListRow label="Duplicates (slug)" items={registryDuplicateSlugs} />
        <ListRow label="Invalid slugs" items={registryInvalidSlugs} />
      </Section>

      <Section title="Live database">
        {!isSupabaseConfigured ? (
          <EmptyNote>Supabase isn't connected yet — set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY to see live validation.</EmptyNote>
        ) : dbError ? (
          <EmptyNote>Couldn't read the tools table: {dbError}</EmptyNote>
        ) : !dbTools ? (
          <EmptyNote>Loading…</EmptyNote>
        ) : (
          <>
            <StatGrid
              stats={[
                { label: 'Expected named tools', value: EXPECTED_TOOL_COUNT },
                { label: 'Actual named tools', value: dbTools.length, warn: dbTools.length !== EXPECTED_TOOL_COUNT },
                { label: 'Categories', value: EXPECTED_CATEGORY_COUNT },
              ]}
            />
            <ListRow label="Missing" items={dbMissing} />
            <ListRow label="Duplicates" items={dbDuplicates} />
            <ListRow label="Disabled tools" items={dbDisabled} />
          </>
        )}
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-white/10 bg-navy-900 p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white/70">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  )
}

function StatGrid({ stats }: { stats: { label: string; value: string | number; warn?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-white/10 bg-navy-950 p-3">
          <p className="text-[11px] text-white/40">{s.label}</p>
          <p className={`mt-1 font-display text-xl font-semibold ${s.warn ? 'text-red-400' : 'text-white'}`}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function ListRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium text-white/50">
        {label} ({items.length})
      </p>
      {items.length === 0 ? (
        <p className="mt-1 text-xs text-white/30">None</p>
      ) : (
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li key={item} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/60">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-white/40">{children}</p>
}

export default function CatalogCheck() {
  return (
    <AdminLayout>
      <AdminGuard>
        <CatalogCheckContent />
      </AdminGuard>
    </AdminLayout>
  )
}
