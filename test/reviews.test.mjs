import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// The placeholder testimonials were not from verified clients and have been deleted. Real testimonials may return
// later with the client's permission and approved wording; this only keeps the old invented quotes from coming back.
const PLACEHOLDER_QUOTES = [
  'honest, responsive, and easy to work with from start to finish',
  'never made us feel pressured',
  'That straight talk is exactly what we needed',
  'Our inherited home felt overwhelming',
  'Coming from Los Angeles, we didn',
  'calm, clarity, and practical advice throughout the sale',
]

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

test('no placeholder testimonial text remains in the source', () => {
  for (const file of walk('src').filter((f) => /\.(astro|ts|tsx|js|mjs|json|md|css)$/.test(f))) {
    const text = readFileSync(file, 'utf8')
    for (const quote of PLACEHOLDER_QUOTES) assert.equal(text.includes(quote), false, `${file} contains a placeholder testimonial: "${quote}"`)
  }
})

test('the Zillow reviews link is a text-only button in both languages', async () => {
  const { contact } = await import('../src/lib/site.ts')
  const { t } = await import('../src/i18n/index.ts')
  assert.equal(contact.zillowReviews, 'https://www.zillow.com/profile/nate85%20realtor')
  assert.equal(t('en').connect.zillow, 'Read Nathanael’s reviews on Zillow')
  assert.ok(t('es').connect.zillow.length > 0)
  assert.notEqual(t('es').connect.zillow, t('en').connect.zillow)

  const source = readFileSync('src/components/ProfileLinks.astro', 'utf8')
  const link = source.match(/<a [^>]*href=\{contact\.zillowReviews\}[^>]*>[\s\S]*?<\/a>/)
  assert.ok(link, 'ProfileLinks should render the Zillow link')
  assert.match(link[0], /target="_blank"/)
  assert.match(link[0], /rel="noopener noreferrer"/)
  // Zillow's terms bar copying its reviews, ratings or logo, so the link carries only text and an arrow icon.
  assert.doesNotMatch(link[0], /<img|<Image|zillow-logo/i)
})
