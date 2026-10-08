/**
 * Static sweep for text colours that are readable on one background and
 * invisible on another.
 *
 * The brand has two golds: #d4a845 (text-poppy), tuned for the navy sections
 * where it scores 7.75:1, and #896c2d (text-gold), which clears 4.5:1 on white
 * and on the --secondary card tint. Using the wrong one is the single most
 * common defect in this codebase, and Lighthouse only reports it for the
 * pages it happens to be run against.
 *
 * This walks every component, tracks the background of the enclosing <section>
 * or element as it descends, and reports any light-background text using a
 * dark-only colour. It is a heuristic, not a substitute for a rendered audit —
 * it only understands the light/dark class names this project actually uses.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const DIRS = ['src']

/** Colours that only clear contrast on the dark navy surfaces. */
const DARK_ONLY = [
  { token: 'text-poppy', hex: '#d4a845' },
  { token: 'text-ink-foreground', hex: '#fbfcfd' },
]

/** Background classes that mean "this subtree is on a light surface". */
const LIGHT_BG = /bg-(background|white|card|secondary|muted)\b/

/** Background classes that mean "this subtree is on a dark surface". */
const DARK_BG = /bg-(ink|primary|poppy|accent)\b/

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (/\.(astro|tsx)$/.test(entry)) out.push(full)
  }
  return out
}

const files = DIRS.filter((d) => {
  try {
    return statSync(join(ROOT, d)).isDirectory()
  } catch {
    return false
  }
}).flatMap((d) => walk(join(ROOT, d)))

const findings = []
let checked = 0

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  // Stack of background kinds, one entry per open tag we tracked.
  const stack = []
  const rel = relative(ROOT, file)

  lines.forEach((line, i) => {
    // If the element carries its own dark background it is correct by
    // definition, whatever colour its text is. The brand uses this constantly
    // (bg-ink text-ink-foreground pills on light pages).
    const selfDark = DARK_BG.test(line)

    for (const { token, hex } of DARK_ONLY) {
      if (!line.includes(token)) continue
      if (selfDark) continue

      const m = line.match(new RegExp(`${token}(?:/(\\d+))?`))
      const opacity = m && m[1] ? Number(m[1]) / 100 : 1
      if (opacity < 0.6) continue // dimmed enough to be intentional either way

      const onLight = stack.some((kind) => kind === 'light')
      const onDark = stack.some((kind) => kind === 'dark')
      if (!onLight || onDark) continue
      // A dark ancestor wins: text on a dark card is fine even if an outer
      // section is nominally light.
      checked++
      findings.push({
        file: rel,
        line: i + 1,
        token,
        hex,
        hover: /hover:/.test(line) && !new RegExp(`(?<!hover:)${token}`).test(line),
        text: line.trim().slice(0, 96),
      })
    }

    // Track the nearest background. Opening a tag pushes, closing pops.
    const opens = (line.match(/<(section|div|li|article|header|footer|main)\b/g) || []).length
    const closes = (line.match(/<\/(section|div|li|article|header|footer|main)>/g) || []).length
    if (opens > closes && /(class(Name)?=)/.test(line)) {
      let kind = null
      if (DARK_BG.test(line)) kind = 'dark'
      else if (LIGHT_BG.test(line)) kind = 'light'
      for (let k = 0; k < opens - closes; k++) stack.push(kind)
    } else {
      for (let k = 0; k < closes; k++) stack.pop()
    }
  })
}

console.log(`[contrast-scan] ${files.length} files, ${findings.length} likely dark-only-on-light`)
for (const f of findings) {
  const state = f.hover ? 'hover-state' : 'steady-state'
  console.log(`  ${f.file}:${f.line}  ${f.token} (${f.hex}) on light — ${state}`)
  console.log(`     ${f.text}`)
}
if (findings.length === 0) console.log('  clean')
