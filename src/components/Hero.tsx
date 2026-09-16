export default function Hero() {
  return (
    <section className="flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-md">
        <h1 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
          One workbench.
          <br />
          Every tool you need.
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
          Fast browser tools for creators, bloggers, SEO, developers, text, design and calculations.
        </p>
      </div>

      {/* A small "terminal" panel — the most characteristic artifact in a dev-tool's world. */}
      <div className="w-full max-w-xs shrink-0 rounded-card border border-white/10 bg-navy-900 font-mono text-xs text-white/70 sm:w-72">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <pre className="overflow-x-auto px-3 py-3 leading-relaxed">
{`$ slugify "Ship it Friday"
ship-it-friday

$ sha256 "devoptimizebot"
9f1c2a…e7b4`}
        </pre>
      </div>
    </section>
  )
}
