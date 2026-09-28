/**
 * Crawls the deployed site and reports any link or image that does not return
 * 200.
 *
 * This runs against the live deployment rather than the local build, so it
 * catches what a build cannot: a route that compiles but 404s in production, a
 * redirect loop, an asset path that differs between dev and prod. It was the
 * only check that would have caught the inner pages shipping with no
 * navigation, because a crawler following links from the homepage would find
 * nothing to follow.
 */
const BASE = process.argv[2] || 'https://harbison1.vercel.app'
const MAX_PAGES = 60

// Vercel rejects requests with Node's default user-agent, which shows up as a
// 403 on assets that are plainly fine in a browser. Sent explicitly so the
// report reflects the site rather than the crawler's fingerprint.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const HEADERS = {
  'user-agent': UA,
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const seen = new Map()
const queue = ['/']
const external = new Set()
const bad = []
const assets = new Set()
let checkedAssets = 0

const norm = (u) => {
  try {
    const url = new URL(u, BASE)
    if (url.origin !== new URL(BASE).origin) return null // external
    return url.pathname
  } catch {
    return null
  }
}

/**
 * Vercel puts a bot-protection interstitial in front of the site when it sees
 * a burst of requests. It comes back with HTTP 200 and a page titled "Vercel
 * Security Checkpoint", so a status-code check alone reports the site as
 * healthy while actually having crawled nothing. Detected by title and
 * retried after a pause, and the crawl is serialised with a small delay so it
 * does not trip the threshold in the first place.
 */
const CHALLENGE = /Vercel Security Checkpoint/i

async function get(path, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(BASE + path, { headers: HEADERS, redirect: 'follow' })
    const text = await res.text()
    if (!CHALLENGE.test(text)) return { status: res.status, text }
    await sleep(1500 * (i + 1))
  }
  return { status: 429, text: '' }
}

async function head(path) {
  let res = await fetch(BASE + path, { method: 'HEAD', redirect: 'follow', headers: HEADERS })
  if (res.status === 405 || res.status === 501) {
    res = await fetch(BASE + path, { method: 'GET', redirect: 'follow', headers: HEADERS })
  }
  await res.arrayBuffer()
  return res
}

while (queue.length && seen.size < MAX_PAGES) {
  const path = queue.shift()
  if (seen.has(path)) continue

  // One request per page: get() returns both the status and the body, so the
  // page is not fetched twice.
  const { status, text: html } = await get(path)
  seen.set(path, status)
  await sleep(120)

  if (status !== 200) {
    bad.push(`  ${status}  ${path}`)
    continue
  }

  if (process.env.CRAWL_DEBUG) {
    const t = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '(no title)'
    console.log(`  [debug] ${path}  html=${html.length}  queue=${queue.length}  title=${t}`)
  }

  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const p = norm(m[1].replace(/&amp;/g, '&'))
    if (p) {
      if (!seen.has(p) && !queue.includes(p) && !p.startsWith('/api/')) queue.push(p)
    } else if (/^https?:/.test(m[1])) {
      external.add(m[1])
    }
  }

  // Deduplicated: the same hero image appears on many pages, and re-checking
  // it 20 times is both slow and the thing that trips the bot protection.
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const p = norm(m[1].replace(/&amp;/g, '&'))
    if (!p) continue
    if (assets.has(p)) continue
    assets.add(p)
    const r = await head(p)
    checkedAssets++
    await sleep(60)
    if (r.status !== 200) bad.push(`  ${r.status}  asset ${p}  (on ${path})`)
  }
}

const codes = {}
for (const s of seen.values()) codes[s] = (codes[s] || 0) + 1

console.log(`[crawl] ${seen.size} pages, ${checkedAssets} unique assets, ${external.size} external links`)
console.log(`[crawl] status codes: ${JSON.stringify(codes)}`)
console.log('[crawl] problems:')
if (bad.length === 0) console.log('  none')
else for (const b of bad) console.log(b)
