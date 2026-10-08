// Static SEO / AEO / GEO and consistency audit over the built pages.
// Usage: npm run build && node scripts/seo-check.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, sep } from 'node:path'

const ROOT = '.vercel/output/static'
const SITE = 'https://www.harbisonstandard.com'
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const pages = walk(ROOT).filter((f) => f.endsWith('.html'))
const route = (f) => f.slice(ROOT.length).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '') || '/'
const meta = (h, re) => (h.match(re) || [])[1]
const hash = (s) => createHash('md5').update(s).digest('hex').slice(0, 8)

const problems = []
const chrome = { header: {}, footer: {} }
const flag = (r, msg) => problems.push(`${r}  ${msg}`)

for (const f of pages) {
  const r = route(f)
  const h = readFileSync(f, 'utf8')
  const noindex = /name="robots"[^>]*noindex/.test(h)
  const title = meta(h, /<title>([^<]*)<\/title>/)
  const desc = meta(h, /<meta name="description" content="([^"]*)"/)
  const canon = meta(h, /<link rel="canonical" href="([^"]*)"/)
  if (!title) flag(r, 'no <title>')
  else if (title.length > 70) flag(r, `title ${title.length} chars (>70): ${title}`)
  if (!desc) flag(r, 'no meta description')
  else if (desc.length < 70 || desc.length > 165) flag(r, `description ${desc.length} chars`)
  const want = r === '/' ? SITE : SITE + r.replace(/\/$/, '')
  if (r !== '/404.html' && r !== '/404' && canon !== want) flag(r, `canonical ${canon} != ${want}`)
  if (!/<html[^>]*lang="en"/.test(h)) flag(r, 'missing lang')
  if (!/name="viewport"/.test(h)) flag(r, 'missing viewport')
  const h1 = (h.match(/<h1[\s>]/g) || []).length
  if (h1 !== 1) flag(r, `${h1} <h1>`)
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) if (!h.includes(`property="${p}"`)) flag(r, `missing ${p}`)
  if (!h.includes('name="twitter:card"')) flag(r, 'missing twitter:card')
  if (!/<main[\s>]/.test(h)) flag(r, 'no <main>')
  // images
  for (const img of h.match(/<img[^>]*>/g) || []) {
    if (!/\salt(=|\s|>)/.test(img)) flag(r, `img without alt: ${img.slice(0, 80)}`)
    if (!/\swidth=/.test(img) || !/\sheight=/.test(img)) if (!/absolute inset-0|fill/.test(img)) flag(r, `img without width/height: ${img.slice(0, 90)}`)
  }
  // heading order
  const levels = [...h.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1])
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) flag(r, `heading jumps h${levels[i - 1]} -> h${l}`) })
  // structured data
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  const types = []
  for (const m of ld) {
    try {
      const j = JSON.parse(m[1])
      for (const n of j['@graph'] || [j]) types.push([].concat(n['@type']).join('/'))
    } catch { flag(r, 'invalid JSON-LD') }
  }
  if (!noindex && !types.length) flag(r, 'no JSON-LD')
  if (!noindex && !types.includes('BreadcrumbList') && r !== '/' && r !== '/404.html') flag(r, 'no BreadcrumbList')
  // chrome consistency
  const hd = meta(h, /(<header[\s\S]*?<\/header>)/)
  const ft = meta(h, /(<footer[\s\S]*?<\/footer>)/)
  if (!hd) flag(r, 'no <header>'); else (chrome.header[hash(hd.replace(/\s(aria-current="page"|data-solid="")/g, ''))] ??= []).push(r)
  if (!ft) flag(r, 'no <footer>'); else (chrome.footer[hash(ft.replace(/\saria-current="page"/g, ''))] ??= []).push(r)
  console.log(`${r.padEnd(34)} h1:${h1} ld:[${[...new Set(types)].join(',')}]`)
}
for (const k of ['header', 'footer']) {
  const groups = Object.values(chrome[k])
  if (groups.length > 1) flag('*', `${k} differs: ${groups.map((g) => `${g.length} pages (${g.slice(0, 3).join(', ')}${g.length > 3 ? ', …' : ''})`).join(' | ')}`)
}
// sitemap coverage
try {
  const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8')
  for (const f of pages) {
    const r = route(f)
    if (r.includes('404') || r.startsWith('/hq')) continue
    const u = r === '/' ? SITE : SITE + r.replace(/\/$/, '')
    if (!sm.includes(`<loc>${u}</loc>`) && !sm.includes(`<loc>${u}/</loc>`)) flag(r, 'not in sitemap')
  }
} catch { flag('*', 'no static sitemap.xml (served dynamically?)') }
console.log(problems.length ? `\n${problems.length} problem(s):\n` + problems.join('\n') : '\nAll checks passed.')
process.exit(problems.length ? 1 : 0)
