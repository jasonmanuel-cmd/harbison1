/**
 * One-shot: adds the `trail` prop to each page's PageHero / ContentPage call
 * so every route has a visible breadcrumb and matching BreadcrumbList markup.
 *
 * Auditable, and idempotent -- a page that already has a trail does not match
 * the pattern, so re-running changes nothing.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const PAGES = {
  'properties': [{ name: 'Home', path: '/' }],
  'about': [{ name: 'Home', path: '/' }],
  'contact': [{ name: 'Home', path: '/' }],
  'guides': [{ name: 'Home', path: '/' }],
  'land': [{ name: 'Home', path: '/' }],
  'private-sale': [{ name: 'Home', path: '/' }],
  'off-market-deals': [{ name: 'Home', path: '/' }],
  'relocate': [{ name: 'Home', path: '/' }],
  'why-tehachapi': [{ name: 'Home', path: '/' }],
}

for (const [dir, trail] of Object.entries(PAGES)) {
  const file = join(ROOT, 'app', '(site)', dir, 'page.tsx')
  let src = readFileSync(file, 'utf8')

  if (/trail=\{/.test(src)) {
    console.log(`  ${dir}: already has a trail`)
    continue
  }

  // Insert after the last attribute of the PageHero or ContentPage call. The
  // close is either a self-closing "/>" (PageHero) or ">" (ContentPage, which
  // takes children), so both forms are handled.
  const re = /(<(?:PageHero|ContentPage)\b[\s\S]*?)(\n\s*(?:\/>|>))/
  const m = src.match(re)
  if (!m) {
    console.log(`  ${dir}: NO PageHero/ContentPage call found`)
    continue
  }

  const label = {
    properties: 'Properties',
    about: 'About',
    contact: 'Contact',
    guides: 'Guides & Resources',
    land: 'Land',
    'private-sale': 'Private Sale',
    'off-market-deals': 'Off-Market Deals',
    relocate: 'Relocating to Kern County',
    'why-tehachapi': 'Why Tehachapi',
  }[dir]

  const selfPath = dir === 'relocate' ? '/relocate' : `/${dir}`

  src = src.replace(re, (_all, head, close) => {
    // Match the indentation of the attributes already on the call.
    const indent = (head.match(/\n(\s*)\S/) || [, '  '])[1]
    const body = [
      `trail={[`,
      `  { name: 'Home', path: '/' },`,
      `  { name: '${label}', path: '${selfPath}' },`,
      `]}`,
    ]
      .map((l, i) => (i === 0 ? l : `${indent}  ${l}`))
      .join(`\n${indent}`)
    return `${head}\n${indent}${body}${close}`
  })

  writeFileSync(file, src, 'utf8')
  console.log(`  ${dir}: trail added`)
}
