import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function LazyLoadGenerator() {
  const [src, setSrc] = useState('/images/hero.jpg')
  const [alt, setAlt] = useState('Descriptive alt text')
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(450)
  const [strategy, setStrategy] = useState<'native' | 'observer'>('native')

  const code = useMemo(() => {
    if (strategy === 'native') {
      return `<img
  src="${src}"
  alt="${alt}"
  width="${width}"
  height="${height}"
  loading="lazy"
  decoding="async"
/>`
    }
    return `<img
  data-src="${src}"
  alt="${alt}"
  width="${width}"
  height="${height}"
  class="lazy-img"
/>

<script>
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy-img');
        observer.unobserve(img);
      }
    }
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
</script>`
  }, [src, alt, width, height, strategy])

  return (
    <ToolShell title="Lazy Load Image Code Generator" description="Generate HTML for lazy-loaded images — native loading=lazy or an IntersectionObserver fallback.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Image src" value={src} onChange={setSrc} />
        <Field label="Alt text" value={alt} onChange={setAlt} />
        <NumberField label="Width" value={width} onChange={setWidth} />
        <NumberField label="Height" value={height} onChange={setHeight} />
      </div>

      <div className="mt-3 flex gap-2">
        <TabButton label="Native loading=lazy" active={strategy === 'native'} onClick={() => setStrategy('native')} />
        <TabButton label="IntersectionObserver" active={strategy === 'observer'} onClick={() => setStrategy('observer')} />
      </div>

      <div className="mt-3 flex justify-end">
        <CopyButton text={code} />
      </div>
      <pre className="field mt-1 overflow-x-auto whitespace-pre font-mono text-xs">{code}</pre>
    </ToolShell>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="field mt-1" />
    </div>
  )
}
function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="field mt-1" />
    </div>
  )
}
function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
        active ? 'border-accent-400 bg-accent-400 text-accent-ink' : 'border-white/15 text-white/70 hover:border-white/30'
      }`}
    >
      {label}
    </button>
  )
}
