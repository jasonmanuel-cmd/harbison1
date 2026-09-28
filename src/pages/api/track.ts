import { createHash } from 'node:crypto'
import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import { bumpSession, recordDwell, recordVisit, supabaseConfigured, upsertSession } from '@/lib/server/supabase'

export const prerender = false

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

/**
 * First-party analytics ingest.
 *
 * The edge supplies coarse geography headers. We keep country/region/city and
 * discard the IP after hashing it with a daily-rotating salt, so unique-visitor
 * counts work without retaining anything that identifies a person.
 */

type Body = {
  sid?: string
  type?: 'start' | 'pageview' | 'heartbeat' | 'end'
  path?: string
  title?: string
  referrerHost?: string | null
  referrerType?: string
  durationSeconds?: number
  pageToken?: string
  utm?: Record<string, string | undefined>
}

const UA_BROWSERS: Array<[RegExp, string]> = [
  [/edg\//i, 'Edge'],
  [/opr\/|opera/i, 'Opera'],
  [/samsungbrowser/i, 'Samsung Internet'],
  [/chrome|crios/i, 'Chrome'],
  [/firefox|fxios/i, 'Firefox'],
  [/safari/i, 'Safari'],
]

function parseUa(ua: string) {
  let device: 'desktop' | 'mobile' | 'tablet' | 'bot' | 'other' = 'other'
  if (/bot|crawler|spider|bingpreview|slurp|headlesschrome/i.test(ua)) device = 'bot'
  else if (/ipad|tablet|playbook|silk/i.test(ua)) device = 'tablet'
  else if (/mobi|iphone|android.*mobile|windows phone/i.test(ua)) device = 'mobile'
  else if (/windows|macintosh|x11|linux/i.test(ua)) device = 'desktop'

  let browser = 'Other'
  for (const [re, name] of UA_BROWSERS) {
    if (re.test(ua)) {
      browser = name
      break
    }
  }

  let os = 'Other'
  if (/windows/i.test(ua)) os = 'Windows'
  else if (/iphone|ipad|ios/i.test(ua)) os = 'iOS'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/mac os x|macintosh/i.test(ua)) os = 'macOS'
  else if (/linux/i.test(ua)) os = 'Linux'

  return { device, browser, os }
}

function geo(req: Request) {
  const h = req.headers
  const decode = (v: string | null) => {
    if (!v) return null
    try {
      return decodeURIComponent(v)
    } catch {
      return v
    }
  }
  return {
    country: decode(h.get('x-vercel-ip-country')),
    region: decode(h.get('x-vercel-ip-country-region')),
    city: decode(h.get('x-vercel-ip-city')),
  }
}

/** Unique-per-day, irreversible. Rotates daily so it cannot be tracked over time. */
function visitorHash(ip: string) {
  const day = new Date().toISOString().slice(0, 10)
  const salt = getSecret('ANALYTICS_SALT') || 'harbison-standard'
  return createHash('sha256').update(`${salt}:${day}:${ip}`).digest('hex').slice(0, 32)
}

function clientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || '0.0.0.0'
}

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined)

export const POST: APIRoute = async ({ request }) => {
  if (!supabaseConfigured) {
    // Analytics is best-effort: never block or error the visitor.
    return json({ ok: true, stored: false }, 202)
  }

  let body: Body
  try {
    body = await request.json()
  } catch {
    return json({ ok: false }, 400)
  }

  const sid = clean(body.sid, 64)
  const type = body.type
  if (!sid || !type) return json({ ok: false }, 400)

  const path = clean(body.path, 300) || '/'
  const pageToken = clean(body.pageToken, 64)
  const now = new Date().toISOString()

  try {
    if (type === 'start') {
      const { device, browser, os } = parseUa(request.headers.get('user-agent') || '')
      await upsertSession(sid, {
        created_at: now,
        last_seen_at: now,
        visitor_hash: visitorHash(clientIp(request)),
        referrer_host: clean(body.referrerHost, 120) ?? null,
        referrer_type: body.referrerType ?? 'direct',
        utm_source: clean(body.utm?.source, 100) ?? null,
        utm_medium: clean(body.utm?.medium, 100) ?? null,
        utm_campaign: clean(body.utm?.campaign, 100) ?? null,
        utm_term: clean(body.utm?.term, 100) ?? null,
        utm_content: clean(body.utm?.content, 100) ?? null,
        entry_path: path,
        device_type: device,
        browser,
        os,
        ...geo(request),
      })
    } else if (type === 'pageview') {
      // pageToken is what lets the later heartbeat update this same row.
      await recordVisit({
        session_id: sid,
        path,
        title: clean(body.title, 200) ?? null,
        page_token: pageToken ?? null,
      })
      await bumpSession(sid, { pageViews: 1, exitPath: path })
    } else if (type === 'heartbeat' || type === 'end') {
      // Both do the same thing: attribute the time just spent to the page view
      // that is now finished. Every earlier page sent its own heartbeat as the
      // visitor navigated away, so the client total is deliberately ignored —
      // adding it would count the same seconds twice.
      const dwell = Math.min(Math.max(Number(body.durationSeconds) || 0, 0), 1800)
      if (dwell > 0 && pageToken) {
        await recordDwell(pageToken, dwell)
      }
      if (dwell > 0) {
        await bumpSession(sid, { durationSeconds: dwell, exitPath: path })
      }
    }

    return json({ ok: true, stored: true })
  } catch (err) {
    console.error('[track] ingest failed:', err instanceof Error ? err.message : err)
    return json({ ok: false }, 202)
  }
}
