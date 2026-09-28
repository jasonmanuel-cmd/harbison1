/**
 * Finds the minimum opacity of white over the site's dark surfaces that still
 * clears WCAG AA (4.5:1) for small text. Everything darker than this must be
 * raised, which is what caused the footer and form-label contrast failures.
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
const toHex = ([r, g, b]) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

/** Composites white at `alpha` over `bg`, which is what Tailwind's /NN does. */
function whiteOver(bg, alpha) {
  return bg.map((c) => Math.round(c + (255 - c) * alpha))
}

const surfaces = {
  'ink #0c1a3a (footer, hero)': hex('#0c1a3a'),
  'ink alt #132140 (panels)': hex('#132140'),
  'ink 80% #33415c-ish (cards)': hex('#33415c'),
}

console.log('opacity of white over each dark surface\n')
for (const [name, bg] of Object.entries(surfaces)) {
  console.log(name)
  for (const alpha of [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7]) {
    const blended = whiteOver(bg, alpha)
    const r = contrast(blended, bg)
    console.log(
      `   /${String(Math.round(alpha * 100)).padEnd(3)} ${toHex(blended)}  ${r.toFixed(2)}:1  ${r >= 4.5 ? 'PASS' : 'fail'}`,
    )
  }
  // Report the smallest step that passes.
  let minStep = null
  for (let step = 30; step <= 100; step += 1) {
    const alpha = step / 100
    if (contrast(whiteOver(bg, alpha), bg) >= 4.5) {
      minStep = step
      break
    }
  }
  console.log(`   -> minimum passing opacity: /${minStep}\n`)
}
