/**
 * WCAG contrast checker + palette solver.
 * Run: node scripts/contrast.mjs
 *
 * The brand gold (#d4a845) reads well on the dark navy but fails on white, so
 * this finds the darkest-on-brand gold that clears 4.5:1 on a light surface,
 * and the lightest neutral that clears 4.5:1 on the navy.
 */

function srgbToLinear(c) {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function luminance([r, g, b]) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

function contrast(fg, bg) {
  const a = luminance(fg)
  const b = luminance(bg)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

const hex = (h) => {
  const s = h.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16))
}

const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

const WHITE = hex('#ffffff')
const NAVY = hex('#0c1a3a')
const NAVY_ALT = hex('#132140')
const GOLD = hex('#d4a845')

console.log('--- current state ---')
const checks = [
  ['gold #d4a845', 'on white', GOLD, WHITE, 4.5],
  ['gold 50% (#ead3a2 approx)', 'on white', hex('#ead3a2'), WHITE, 4.5],
  ['footer grey #6d7689', 'on navy', hex('#6d7689'), NAVY, 4.5],
  ['label grey #7d8596', 'on navy alt #132140', hex('#7d8596'), NAVY_ALT, 4.5],
  ['gold #d4a845', 'on navy', GOLD, NAVY, 4.5],
]
for (const [name, on, fg, bg, need] of checks) {
  const r = contrast(fg, bg)
  console.log(`  ${r >= need ? 'PASS' : 'FAIL'}  ${name.padEnd(28)} ${on.padEnd(26)} ${r.toFixed(2)}:1 (need ${need})`)
}

/** Scales a colour toward black until it clears the target ratio on bg. */
function darkenUntil(fg, bg, target) {
  let best = fg
  for (let step = 0; step <= 100; step++) {
    const k = 1 - step / 100
    const candidate = fg.map((c) => Math.round(c * k))
    if (contrast(candidate, bg) >= target) {
      best = candidate
      break
    }
  }
  return best
}

/** Lightens a colour toward white until it clears the target ratio on bg. */
function lightenUntil(fg, bg, target) {
  let best = fg
  for (let step = 0; step <= 100; step++) {
    const k = step / 100
    const candidate = fg.map((c) => Math.round(c + (255 - c) * k))
    if (contrast(candidate, bg) >= target) {
      best = candidate
      break
    }
  }
  return best
}

console.log('\n--- solutions ---')

// A light-surface gold that keeps the brand hue but is dark enough to read.
const lightGold = darkenUntil(GOLD, WHITE, 4.5)
console.log(`  gold on white, 4.5:1  ->  ${toHex(lightGold)}  (${contrast(lightGold, WHITE).toFixed(2)}:1)`)
console.log(`    large text variant 3:1 -> ${toHex(darkenUntil(GOLD, WHITE, 3))}`)

// Neutral that clears 4.5:1 on the two dark surfaces used in the site.
const footerGrey = lightenUntil(hex('#6d7689'), NAVY, 4.5)
console.log(`  footer grey on navy 4.5:1 -> ${toHex(footerGrey)}  (${contrast(footerGrey, NAVY).toFixed(2)}:1)`)
const labelGrey = lightenUntil(hex('#7d8596'), NAVY_ALT, 4.5)
console.log(`  label grey on #132140 4.5:1 -> ${toHex(labelGrey)}  (${contrast(labelGrey, NAVY_ALT).toFixed(2)}:1)`)

// The muted-foreground token used on white.
const muted = hex('#7d8596')
console.log(`  muted #7d8596 on white 4.5:1 -> ${toHex(darkenUntil(muted, WHITE, 4.5))}`)
