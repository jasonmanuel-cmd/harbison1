/**
 * One-shot migration: rewrites each page's hand-rolled `export const metadata`
 * to call pageMetadata() from lib/seo.ts.
 *
 * Kept in the repo because the transformation is auditable -- you can see
 * exactly what each page's metadata became -- rather than having to trust that
 * nine separate hand edits were consistent. Running it again is a no-op: the
 * pages that already call pageMetadata do not match the pattern.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const PAGES = {
  'land': { path: '/land', image: '/images/property/chalet-tehachapi-1.webp' },
  'private-sale': { path: '/private-sale' },
  'off-market-deals': { path: '/off-market-deals' },
  'relocate': { path: '/relocate' },
  'why-tehachapi': { path: '/why-tehachapi' },
  'about': { path: '/about', image: '/images/headshot.webp' },
  'contact': { path: '/contact' },
  'guides': { path: '/guides' },
  'properties': { path: '/properties', image: '/images/property/2300-weybridge-dr-1.webp' },
}

for (const [dir, cfg] of Object.entries(PAGES)) {
  const file = join(ROOT, 'app', '(site)', dir, 'page.tsx')
  let src = readFileSync(file, 'utf8')

  if (src.includes('pageMetadata(')) {
    console.log(`  ${dir}: already migrated`)
    continue
  }

  const re = /export const metadata: Metadata = \{\s*title:\s*'([^']*)',\s*description:\s*\n?\s*'([^']*)',\s*\}/
  const m = src.match(re)
  if (!m) {
    console.log(`  ${dir}: NO MATCH (left alone)`)
    continue
  }

  // The root layout's title template appends the brand, so the suffix that
  // used to live in each page is dropped here and added exactly once.
  const title = m[1].replace(/\s*\|\s*Harbison Standard\s*$/, '')
  const description = m[2]

  const body = [
    `export const metadata: Metadata = pageMetadata({`,
    `  title: '${title}',`,
    `  description:`,
    `    '${description}',`,
    `  path: '${cfg.path}',`,
    ...(cfg.image ? [`  image: '${cfg.image}',`] : []),
    `})`,
  ].join('\n')

  src = src.replace(re, body)

  // Add the import after the last existing import line.
  if (!/@\/lib\/seo/.test(src)) {
    const lines = src.split(/\r?\n/)
    let last = -1
    for (let i = 0; i < lines.length; i++) {
      if (/^import /.test(lines[i])) last = i
    }
    lines.splice(last + 1, 0, `import { pageMetadata } from '@/lib/seo'`)
    src = lines.join('\n')
  }

  writeFileSync(file, src, 'utf8')
  console.log(`  ${dir}: -> pageMetadata({ title: '${title}', path: '${cfg.path}' })`)
}
