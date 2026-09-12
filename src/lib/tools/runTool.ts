/** Client-side implementations for DevOptimizeBot tools. */

export async function runTool(slug: string, input: string): Promise<string> {
  const text = input ?? ''
  const trim = text.trim()

  switch (slug) {
    // --- YouTube ---
    case 'youtube-video-title-generator':
      return generateTitles(trim)
    case 'youtube-description-generator':
      return generateYtDescription(trim)
    case 'youtube-embed-code-generator':
      return ytEmbed(trim)
    case 'youtube-timestamp-link-maker':
      return timestampLink(trim)
    case 'youtube-money-calculator':
      return ytMoney(trim)
    case 'youtube-shorts-script-timer':
      return shortsTimer(trim)
    case 'youtube-channel-audit-checklist':
      return CHANNEL_AUDIT
    case 'youtube-channel-id-finder':
      return `Paste a channel URL. Client extract:\n${extractYtId(trim)}\n\nFull channel ID lookup requires YouTube Data API via Edge Function.`
    case 'youtube-tag-extractor':
    case 'youtube-thumbnail-previewer':
    case 'youtube-region-restriction-checker':
    case 'youtube-comment-picker':
    case 'youtube-live-subscriber-counter':
    case 'youtube-search-trend-analyzer':
    case 'youtube-metadata-viewer':
      return apiHint(slug, trim, 'YouTube Data API (Edge Function)')

    // --- TikTok / Pinterest ---
    case 'tiktok-engagement-calculator':
      return tiktokEngagement(trim)
    case 'tiktok-caption-generator':
      return captions(trim, 'TikTok')
    case 'tiktok-bio-generator':
      return bios(trim)
    case 'tiktok-video-length-splitter':
      return `Split a ${trim || '60'}s video into clips of 15s, 30s, and 60s.\nSuggested cuts: 0-15, 15-30, 30-45, 45-60.`
    case 'pinterest-pin-title-optimizer':
      return generateTitles(trim).replace(/YouTube/g, 'Pinterest')
    case 'pinterest-description-builder':
      return `Pin description:\n${trim}\n\n#pinterest #ideas #inspo\nSave this pin for later.`
    case 'pinterest-board-cover-maker':
    case 'pinterest-multi-image-collage-layout':
      return `Layout helper.\nInput: ${trim || 'images'}\nSuggested grid: 2x2 or 1+2 collage. Export from your editor at 1000×1500.`

    // --- SEO ---
    case 'robots-txt-generator':
      return robots(trim)
    case 'xml-sitemap-generator':
      return sitemap(trim)
    case 'hreflang-tag-builder':
      return hreflang(trim)
    case 'meta-tag-generator':
      return metaTags(trim)
    case 'schema-markup-generator':
      return schema(trim)
    case 'keyword-density-analyzer':
      return keywordDensity(trim)
    case 'serp-preview-tool':
      return serpPreview(trim)
    case 'heading-tag-hierarchy-reviewer':
      return headingReview(trim)
    case 'text-to-html-ratio-calculator':
      return textHtmlRatio(trim)
    case 'canonical-tag-checker':
      return extractTag(trim, 'canonical')
    case 'security-txt-file-generator':
      return securityTxt(trim)
    case 'cors-configuration-generator':
      return corsConfig(trim)
    case 'lazy-load-image-code-generator':
      return `<img src="${trim || 'image.jpg'}" loading="lazy" alt="" width="" height="" />`
    case 'font-face-css-generator':
      return fontFace(trim)

    // --- Dev ---
    case 'json-formatter-validator':
      return formatJson(trim)
    case 'json-to-xml-converter':
      return jsonToXml(trim)
    case 'xml-to-json-converter':
      return xmlToJson(trim)
    case 'json-to-csv-converter':
      return jsonToCsv(trim)
    case 'base64-encoder-decoder':
      return b64(trim)
    case 'url-encoder-decoder':
      return urlEnc(trim)
    case 'javascript-minifier':
      return minifyJs(trim)
    case 'css-minifier':
      return minifyCss(trim)
    case 'html-minifier':
      return minifyHtml(trim)
    case 'sql-formatter':
      return formatSql(trim)
    case 'regex-tester':
      return regexTest(trim)
    case 'jwt-decoder':
      return decodeJwt(trim)
    case 'cron-expression-generator':
      return cronHelp(trim)
    case 'link-extraction-tool':
      return extractLinks(trim)
    case 'qr-code-generator':
      return `QR payload: ${trim}\nUse a QR library or Edge Function to render PNG. Data URI placeholder not generated client-side without a lib.`
    case 'api-key-password-generator':
      return genSecrets(trim)
    case 'xss-input-sanitizer':
      return sanitize(trim)
    case 'svg-compressor-optimizer':
      return minifyHtml(trim)
    case 'gzip-brotli-savings-calculator':
      return `Uncompressed: ${new Blob([trim]).size} bytes\nRough gzip estimate (~30%): ${Math.round(new Blob([trim]).size * 0.3)} bytes`
    case 'sha-256-generator':
      return hashHex(trim, 'SHA-256')
    case 'sha-1-hash-generator':
      return hashHex(trim, 'SHA-1')
    case 'sha-512-hash-generator':
      return hashHex(trim, 'SHA-512')
    case 'md5-hash-generator':
      return 'MD5 is not available in Web Crypto. Use the award-protected Edge Function in production.'
    case 'bcrypt-generator':
      return 'Bcrypt must run server-side. Call the Edge Function — never hash secrets only in the browser for auth.'
    case 'yaml-to-json-converter':
      return yamlLite(trim)
    case 'http-status-code-checker':
    case 'redirect-chain-auditing-tool':
    case 'sitemap-validator':
    case 'crawl-depth-map-generator':
    case 'image-alt-text-auditor':
    case 'rich-snippets-tester':
    case 'domain-authority-checker':
    case 'backlink-checker':
    case 'anchor-text-analyzer':
    case 'page-speed-performance-audit':
    case 'ssl-certificate-checker':
    case 'domain-age-checker':
    case 'domain-whois-lookup':
    case 'dns-record-finder':
    case 'google-cache-date-checker':
    case 'mobile-friendly-tester':
    case 'http-security-header-checker':
    case 'critical-css-generator':
    case 'keyword-position-tracker':
      return apiHint(slug, trim, 'server-side lookup (Edge Function)')

    case 'disavow-file-generator':
      return trim.split(/\n+/).filter(Boolean).map(l => l.startsWith('domain:') || l.startsWith('http') ? l : `domain:${l.replace(/^https?:\/\//,'')}`).join('\n')

    // --- Text ---
    case 'slug-generator':
      return slugify(trim)
    case 'word-counter-reading-time-estimator': {
      const words = trim ? trim.split(/\s+/).length : 0
      return `Words: ${words}\nCharacters: ${text.length}\nReading time: ${Math.max(1, Math.ceil(words / 200))} min`
    }
    case 'case-converter':
      return [
        `UPPER: ${text.toUpperCase()}`,
        `lower: ${text.toLowerCase()}`,
        `Title: ${toTitle(text)}`,
        `camelCase: ${toCamel(text)}`,
        `snake_case: ${slugify(text).replace(/-/g, '_')}`,
      ].join('\n')
    case 'remove-duplicate-lines':
      return [...new Set(text.split('\n'))].join('\n')
    case 'line-counter':
      return `Lines: ${text ? text.split('\n').length : 0}`
    case 'text-diff-checker':
      return simpleDiff(text)
    case 'random-string-generator':
      return randomString(parseInt(trim, 10) || 16)
    case 'lorem-ipsum-generator':
      return lorem(parseInt(trim, 10) || 3)
    case 'markdown-to-html-converter':
      return mdLite(text)
    case 'html-to-markdown-converter':
      return htmlToMdLite(text)
    case 'text-sorter':
      return text.split('\n').slice().sort((a,b)=>a.localeCompare(b)).join('\n')
    case 'find-and-replace-tool':
      return findReplace(text)
    case 'morse-code-converter':
      return toMorse(trim)
    case 'stripper-of-html-tags':
      return text.replace(/<[^>]+>/g, '')
    case 'word-frequency-counter':
      return wordFreq(trim)
    case 'reverse-text-generator':
      return [...text].reverse().join('')
    case 'whitespace-remover':
      return text.replace(/\s+/g, ' ').trim()

    // --- Design / math ---
    case 'hex-to-rgb-converter':
      return hexToRgb(trim)
    case 'rgb-to-hex-converter':
      return rgbToHex(trim)
    case 'color-palette-generator':
      return palette(trim)
    case 'css-gradient-generator':
      return `background: linear-gradient(135deg, ${trim || '#0a0f1c'}, #facc15);`
    case 'css-box-shadow-generator':
      return `box-shadow: 0 10px 30px rgba(0,0,0,0.35);`
    case 'css-border-radius-generator':
      return `border-radius: ${trim || '12px'};`
    case 'color-contrast-checker':
      return contrast(trim)
    case 'image-aspect-ratio-calculator':
      return aspect(trim)
    case 'percentage-calculator':
      return percent(trim)
    case 'age-calculator':
      return ageCalc(trim)
    case 'compound-interest-calculator':
      return compound(trim)
    case 'unix-timestamp-converter':
      return unixConv(trim)
    case 'date-difference-calculator':
      return dateDiff(trim)
    case 'password-strength-meter':
      return strength(trim)
    case 'random-number-picker':
      return randNum(trim)
    case 'placeholder-image-generator':
      return `https://placehold.co/${trim || '600x400'}/0a0f1c/facc15?text=DevOptimizeBot`
    case 'browser-cache-storage-cleaner':
      try {
        localStorage.clear()
        sessionStorage.clear()
        return 'Local and session storage cleared in this origin.'
      } catch {
        return 'Could not clear storage (restricted context).'
      }

    default:
      return `DevOptimizeBot · ${slug}\nReady.\nInput (${trim.length} chars) received.\nClient handler not specialized; use Edge Function if this tool needs live data.`
  }
}

function apiHint(slug: string, input: string, api: string) {
  return `This tool needs ${api}.\nCall POST /functions/v1/tool-proxy with { slug: "${slug}", input }.\nNever put API keys in the frontend.\nPreview input: ${input.slice(0, 120)}`
}

function generateTitles(topic: string) {
  const t = topic || 'your topic'
  return [
    `How to Master ${t} in 2026`,
    `${t}: The Complete Beginner Guide`,
    `I Tried ${t} for 30 Days`,
    `${t} Tips Nobody Talks About`,
    `Stop Doing ${t} Wrong`,
  ].join('\n')
}

function generateYtDescription(t: string) {
  return `${t || 'Video title'}\n\nIn this video you'll learn practical steps you can use today.\n\nTimestamps:\n0:00 Intro\n0:30 Overview\n\n#youtube #guide\nSubscribe for more DevOptimizeBot creator tools.`
}

function ytEmbed(url: string) {
  const id = extractYtId(url)
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" title="YouTube video" frameborder="0" allowfullscreen></iframe>`
}

function extractYtId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : (url.slice(0, 11) || 'VIDEO_ID')
}

function timestampLink(input: string) {
  const [url, time] = input.split(/[\s,]+/)
  const id = extractYtId(url || '')
  const secs = parseTime(time || '0')
  return `https://www.youtube.com/watch?v=${id}&t=${secs}s`
}

function parseTime(t: string) {
  if (/^\d+$/.test(t)) return +t
  const p = t.split(':').map(Number)
  if (p.length === 3) return p[0]*3600+p[1]*60+p[2]
  if (p.length === 2) return p[0]*60+p[1]
  return 0
}

function ytMoney(input: string) {
  const views = parseFloat(input.replace(/[^\d.]/g, '')) || 0
  const low = views * 0.0003
  const high = views * 0.005
  return `Views: ${views}\nEst. RPM range $0.30–$5.00\nEst. earnings: $${low.toFixed(2)} – $${high.toFixed(2)}\nEstimates only — not YouTube payouts.`
}

function shortsTimer(script: string) {
  const words = script.trim() ? script.trim().split(/\s+/).length : 0
  const sec = words / 2.5
  return `Words: ${words}\nSpoken duration ≈ ${sec.toFixed(1)}s\nShorts limit: 60s / 3 min depending on account.`
}

const CHANNEL_AUDIT = [
  '✓ Channel name + handle consistent',
  '✓ Banner 2560×1440',
  '✓ About + links + keywords',
  '✓ Upload defaults (category, license)',
  '✓ Playlists organized',
  '✓ End screens + cards',
  '✓ Community posts cadence',
  '✓ Analytics: CTR, AVD, traffic sources',
].join('\n')

function tiktokEngagement(input: string) {
  const nums = input.split(/[,\s]+/).map(Number).filter(n => !Number.isNaN(n))
  const [likes=0, comments=0, shares=0, views=1] = nums
  const rate = ((likes+comments+shares)/Math.max(views,1))*100
  return `Likes ${likes} · Comments ${comments} · Shares ${shares} · Views ${views}\nEngagement rate: ${rate.toFixed(2)}%`
}

function captions(topic: string, platform: string) {
  return [
    `${topic || 'New post'} 🔥`,
    `POV: you finally tried ${topic || 'this'}`,
    `${topic || 'Tip'} in 15 seconds`,
  ].map((c,i)=>`${platform} caption ${i+1}: ${c}`).join('\n')
}

function bios(topic: string) {
  return [
    `${topic || 'Creator'} | tools & tips`,
    `Building in public · ${topic || 'content'}`,
    `${topic || 'Helpful'} things daily ✨`,
  ].join('\n')
}

function robots(input: string) {
  const host = input || 'https://example.com'
  return `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${host.replace(/\/$/,'')}/sitemap.xml`
}

function sitemap(input: string) {
  const urls = input.split(/\s+/).filter(Boolean)
  const items = (urls.length ? urls : ['https://example.com/']).map(u =>
    `  <url><loc>${u}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`
}

function hreflang(input: string) {
  const url = input || 'https://example.com/page'
  return [
    `<link rel="alternate" hreflang="en" href="${url}" />`,
    `<link rel="alternate" hreflang="es" href="${url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
  ].join('\n')
}

function metaTags(input: string) {
  const [title, desc] = input.split('\n')
  const t = title || 'Page title'
  const d = desc || 'Page description'
  return `<title>${t}</title>\n<meta name="description" content="${d}" />\n<meta property="og:title" content="${t}" />\n<meta property="og:description" content="${d}" />`
}

function schema(input: string) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DevOptimizeBot',
    description: input || 'One workbench. Every tool you need.',
  }, null, 2)
}

function keywordDensity(text: string) {
  const words = text.toLowerCase().match(/[a-z0-9']+/g) || []
  const total = words.length || 1
  const map = new Map<string, number>()
  words.forEach(w => map.set(w, (map.get(w)||0)+1))
  return [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,15)
    .map(([w,c]) => `${w}: ${c} (${((c/total)*100).toFixed(1)}%)`).join('\n')
}

function serpPreview(input: string) {
  const [title, url, desc] = input.split('\n')
  return `Google-style preview\n${title || 'Title (50–60 chars)'}\n${url || 'https://example.com'}\n${desc || 'Meta description ~155 characters.'}`
}

function headingReview(html: string) {
  const hs = [...html.matchAll(/<(h[1-6])[^>]*>(.*?)<\/\1>/gi)]
  if (!hs.length) return 'No heading tags found. Paste HTML.'
  return hs.map(m => `${m[1].toUpperCase()}: ${m[2].replace(/<[^>]+>/g,'')}`).join('\n')
}

function textHtmlRatio(html: string) {
  const text = html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()
  const tr = html.length ? (text.length / html.length) * 100 : 0
  return `HTML bytes: ${html.length}\nText bytes: ${text.length}\nText-to-HTML ratio: ${tr.toFixed(1)}%`
}

function extractTag(html: string, rel: string) {
  const m = html.match(new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*>`, 'i'))
  return m ? m[0] : `No ${rel} tag found.`
}

function securityTxt(email: string) {
  return `Contact: mailto:${email || 'security@example.com'}\nExpires: 2027-12-31T23:59:59.000Z\nPreferred-Languages: en`
}

function corsConfig(origin: string) {
  return `Access-Control-Allow-Origin: ${origin || '*'}\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\nAccess-Control-Allow-Headers: Content-Type, Authorization`
}

function fontFace(family: string) {
  const f = family || 'Inter'
  return `@font-face {\n  font-family: '${f}';\n  src: url('/fonts/${f}.woff2') format('woff2');\n  font-weight: 400 700;\n  font-display: swap;\n}`
}

function formatJson(s: string) {
  try { return JSON.stringify(JSON.parse(s), null, 2) } catch (e: any) { return `Invalid JSON: ${e.message}` }
}

function jsonToXml(s: string) {
  try {
    const obj = JSON.parse(s)
    const conv = (v: any, k='root'): string => {
      if (v === null) return `<${k}/>`
      if (Array.isArray(v)) return v.map(i => conv(i, k)).join('')
      if (typeof v === 'object') return `<${k}>${Object.entries(v).map(([kk,vv])=>conv(vv,kk)).join('')}</${k}>`
      return `<${k}>${String(v)}</${k}>`
    }
    return '<?xml version="1.0"?>\n' + conv(obj)
  } catch (e: any) { return e.message }
}

function xmlToJson(s: string) {
  const tags = [...s.matchAll(/<([A-Za-z0-9_:-]+)>([^<]*)<\/\1>/g)]
  const o: Record<string,string> = {}
  tags.forEach(t => o[t[1]] = t[2])
  return JSON.stringify(o, null, 2)
}

function jsonToCsv(s: string) {
  try {
    const data = JSON.parse(s)
    const arr = Array.isArray(data) ? data : [data]
    const keys = [...new Set(arr.flatMap(o => Object.keys(o)))]
    const rows = arr.map(o => keys.map(k => JSON.stringify(o[k] ?? '')).join(','))
    return [keys.join(','), ...rows].join('\n')
  } catch (e: any) { return e.message }
}

function b64(s: string) {
  try { return `Decoded:\n${atob(s)}` } catch { return `Encoded:\n${btoa(s)}` }
}

function urlEnc(s: string) {
  const dec = decodeURIComponent(s)
  return dec !== s ? `Decoded:\n${dec}` : `Encoded:\n${encodeURIComponent(s)}`
}

function minifyJs(s: string) {
  return s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/.*$/gm,'').replace(/\s+/g,' ').trim()
}
function minifyCss(s: string) {
  return s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,])\s*/g,'$1').trim()
}
function minifyHtml(s: string) {
  return s.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><').replace(/\s+/g,' ').trim()
}
function formatSql(s: string) {
  return s.replace(/\s+/g,' ').replace(/\s*(SELECT|FROM|WHERE|AND|OR|JOIN|ON|GROUP BY|ORDER BY|LIMIT)\s+/gi, '\n$1 ').trim()
}

function regexTest(input: string) {
  const [pattern, ...rest] = input.split('\n')
  const sample = rest.join('\n')
  try {
    const re = new RegExp(pattern, 'g')
    const matches = sample.match(re)
    return matches ? `Matches (${matches.length}):\n${matches.join('\n')}` : 'No matches'
  } catch (e: any) { return e.message }
}

function decodeJwt(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return 'Not a JWT'
    const dec = (p: string) => JSON.parse(atob(p.replace(/-/g,'+').replace(/_/g,'/')))
    return JSON.stringify({ header: dec(parts[0]), payload: dec(parts[1]) }, null, 2)
  } catch (e: any) { return e.message }
}

function cronHelp(input: string) {
  return `Expression: ${input || '0 9 * * 1-5'}\nFields: minute hour day-of-month month day-of-week\nExample: 0 9 * * 1-5 → 09:00 weekdays`
}

function extractLinks(s: string) {
  const urls = s.match(/https?:\/\/[^\s"'<>]+/g) || []
  return urls.length ? [...new Set(urls)].join('\n') : 'No links found'
}

function genSecrets(input: string) {
  const len = Math.min(64, Math.max(8, parseInt(input,10) || 24))
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr, b => chars[b % chars.length]).join('')
}

function sanitize(s: string) {
  return s.replace(/[<>"'`]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c] as string))
}

function yamlLite(s: string) {
  const o: Record<string,string> = {}
  s.split('\n').forEach(line => {
    const i = line.indexOf(':')
    if (i>0) o[line.slice(0,i).trim()] = line.slice(i+1).trim()
  })
  return JSON.stringify(o, null, 2)
}

async function hashHex(s: string, algo: AlgorithmIdentifier) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('')
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g,'').replace(/[\s_-]+/g,'-').replace(/^-+|-+$/g,'')
}
function toTitle(s: string) {
  return s.replace(/\w\S*/g, t => t[0].toUpperCase()+t.slice(1).toLowerCase())
}
function toCamel(s: string) {
  return s.replace(/(?:^\w|[A-Z]|\b\w)/g, (w,i) => i===0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g,'')
}

function simpleDiff(text: string) {
  const parts = text.split(/\n---\n/)
  if (parts.length < 2) return 'Paste two texts separated by a line with only ---'
  const a = parts[0].split('\n')
  const b = parts[1].split('\n')
  const max = Math.max(a.length, b.length)
  const lines: string[] = []
  for (let i=0;i<max;i++) {
    if (a[i]===b[i]) lines.push('  '+ (a[i]??''))
    else {
      if (a[i]!==undefined) lines.push('- '+a[i])
      if (b[i]!==undefined) lines.push('+ '+b[i])
    }
  }
  return lines.join('\n')
}

function randomString(n: number) {
  return genSecrets(String(n))
}

function lorem(n: number) {
  const p = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  return Array(Math.min(20, Math.max(1,n))).fill(p).join('\n\n')
}

function mdLite(s: string) {
  return s
    .replace(/^### (.*)$/gm,'<h3>$1</h3>')
    .replace(/^## (.*)$/gm,'<h2>$1</h2>')
    .replace(/^# (.*)$/gm,'<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,'<em>$1</em>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
}

function htmlToMdLite(s: string) {
  return s
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi,'# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi,'## $1\n')
    .replace(/<strong>(.*?)<\/strong>/gi,'**$1**')
    .replace(/<em>(.*?)<\/em>/gi,'*$1*')
    .replace(/<[^>]+>/g,'')
}

function findReplace(text: string) {
  const [src, find, repl=''] = text.split('\n')
  if (!find) return 'Line 1: text\nLine 2: find\nLine 3: replace'
  return (src||'').split(find).join(repl)
}

const MORSE: Record<string,string> = {
  a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'
}
function toMorse(s: string) {
  return s.toLowerCase().split('').map(c => c===' ' ? ' / ' : (MORSE[c]||c)).join(' ')
}

function wordFreq(s: string) {
  const words = s.toLowerCase().match(/[a-z0-9']+/g) || []
  const map = new Map<string, number>()
  words.forEach(w => map.set(w, (map.get(w)||0)+1))
  return [...map.entries()].sort((a,b)=>b[1]-a[1]).map(([w,c])=>`${w}\t${c}`).join('\n')
}

function hexToRgb(hex: string) {
  const h = hex.replace('#','')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return 'Use #RRGGBB'
  const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16)
  return `rgb(${r}, ${g}, ${b})`
}
function rgbToHex(s: string) {
  const m = s.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!m) return 'Use 255, 128, 0'
  const hex = '#'+[m[1],m[2],m[3]].map(n => Math.min(255,+n).toString(16).padStart(2,'0')).join('')
  return hex
}
function palette(hex: string) {
  const base = hex.replace('#','') || 'facc15'
  return ['#0a0f1c','#1e293b','#'+base,'#eab308','#f8fafc'].join('\n')
}
function contrast(input: string) {
  const parts = input.split(/[\s,]+/).filter(Boolean)
  return `Foreground: ${parts[0]||'#f8fafc'}\nBackground: ${parts[1]||'#0a0f1c'}\nCheck WCAG AA 4.5:1 for body text (compute luminance in a dedicated component).`
}
function aspect(input: string) {
  const [w,h] = input.split(/[x×,/:\s]+/).map(Number)
  if (!w||!h) return 'Use width x height e.g. 1920x1080'
  const g = gcd(w,h)
  return `${w}×${h} → ${w/g}:${h/g}`
}
function gcd(a:number,b:number):number { return b?gcd(b,a%b):a }
function percent(input: string) {
  const p = input.split(/[,\s]+/).map(Number).filter(n=>!Number.isNaN(n))
  if (p.length<2) return 'Enter two numbers: 25 200'
  return `${p[0]} is ${((p[0]/p[1])*100).toFixed(2)}% of ${p[1]}\n${p[1]}% of ${p[0]} = ${((p[1]/100)*p[0]).toFixed(2)}`
}
function ageCalc(input: string) {
  const d = new Date(input)
  if (Number.isNaN(+d)) return 'Use YYYY-MM-DD'
  const now = new Date()
  let years = now.getFullYear()-d.getFullYear()
  const m = now.getMonth()-d.getMonth()
  if (m<0 || (m===0 && now.getDate()<d.getDate())) years--
  return `Age: ${years} years`
}
function compound(input: string) {
  const [p,r,t,n=1] = input.split(/[,\s]+/).map(Number)
  if ([p,r,t].some(x=>Number.isNaN(x))) return 'principal rate years [compoundsPerYear]\ne.g. 1000 0.05 10 12'
  const amt = p * Math.pow(1+r/n, n*t)
  return `Future value: ${amt.toFixed(2)}`
}
function unixConv(input: string) {
  if (/^\d+$/.test(input.trim())) {
    const n = parseInt(input,10)
    const ms = n < 1e12 ? n*1000 : n
    return new Date(ms).toISOString()
  }
  const d = input ? new Date(input) : new Date()
  if (Number.isNaN(+d)) return 'Invalid date'
  return String(Math.floor(d.getTime()/1000))
}
function dateDiff(input: string) {
  const [a,b] = input.split(/[,\s]+/)
  const d1 = new Date(a), d2 = new Date(b||Date.now())
  if (Number.isNaN(+d1)||Number.isNaN(+d2)) return 'Use YYYY-MM-DD YYYY-MM-DD'
  const days = Math.abs(+d2-+d1)/86400000
  return `${days.toFixed(0)} days`
}
function strength(pw: string) {
  let score = 0
  if (pw.length>=8) score++
  if (pw.length>=12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const label = ['Very weak','Weak','Fair','Good','Strong','Excellent'][score]
  return `Score: ${score}/5 · ${label}`
}
function randNum(input: string) {
  const [min=1,max=100] = input.split(/[,\s-]+/).map(Number)
  const lo = Number.isNaN(min)?1:min
  const hi = Number.isNaN(max)?100:max
  return String(Math.floor(Math.random()*(hi-lo+1))+lo)
}
