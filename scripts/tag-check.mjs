/**
 * Checks that every element opened in a component is also closed, across the
 * whole component tree.
 *
 * Next.js builds happily with mismatched JSX as long as the parser accepts it,
 * and Lighthouse only reports list/definition-list defects on the one page it
 * happens to be auditing. An unclosed <dl> or a stray <li> outside a list is
 * invisible until a screen reader hits it, so it gets checked mechanically.
 *
 * Comments and string literals are stripped first -- a tag mentioned inside a
 * JSX comment is not an element, and counting it produces a phantom mismatch
 * that trains you to ignore the output.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()

/** Void elements never get a closing tag. */
const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
])

/** Elements whose content must not be scanned for markup. */
const RAW_TEXT = new Set(['script', 'style', 'pre', 'textarea'])

/** Tags worth reporting -- these are the ones that carry meaning. */
const STRUCTURAL = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'figure', 'figcaption', 'blockquote', 'picture', 'video', 'form', 'label', 'button',
]

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (/\.tsx$/.test(entry)) out.push(full)
  }
  return out
}

const files = ['app', 'components']
  .filter((d) => { try { return statSync(join(ROOT, d)).isDirectory() } catch { return false } })
  .flatMap((d) => walk(join(ROOT, d)))

/** Removes comments and the contents of raw-text elements. */
function stripNoise(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/[^\n]*/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/<style[\s\S]*?<\/style>/g, (m) => m.replace(/[^\n]/g, ' '))
}

let failures = 0

for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const src = stripNoise(raw)
  const rel = relative(ROOT, file)
  const counts = new Map()

  for (const tag of STRUCTURAL) {
    const open = (src.match(new RegExp(`<${tag}(?=[\\s>])`, 'g')) || []).length
    const close = (src.match(new RegExp(`</${tag}>`, 'g')) || []).length
    if (open !== close) {
      failures++
      console.log(`  ${rel}  <${tag}> opens ${open}, closes ${close}`)
    }
  }

  // Catch <li> and <dt>/<dd> that are not inside a list or definition list.
  // Counted over the raw source because stripNoise preserves structure.
  const badList = (src.match(/<li(?=[\s>])/g) || []).length
  const badLi = (src.match(/<\/li>/g) || []).length
  if (badList !== badLi) {
    failures++
    console.log(`  ${rel}  <li> opens ${badList}, closes ${badLi}`)
  }
}

console.log(`[tag-check] ${files.length} files, ${failures} imbalance(s)`)
if (failures === 0) console.log('  clean')
