import type { APIRoute } from 'astro'
import { checkPassword, grantAccess, hqConfigured } from '@/lib/server/hq-auth'
import { clientKey } from '@/lib/server/rate-limit'

export const prerender = false

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

/** Rate-limits password guessing. In-memory, so it resets on redeploy. */
const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 8

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!hqConfigured()) {
    return json({ error: 'HQ is not configured. Set HQ_PASSWORD on the server.' }, 503)
  }

  const ip = clientKey(request)

  const now = Date.now()
  const record = attempts.get(ip)
  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    const seconds = Math.ceil((record.resetAt - now) / 1000)
    return json({ error: `Too many attempts. Try again in ${Math.ceil(seconds / 60)} minutes.` }, 429)
  }

  let body: { password?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }

  const password = typeof body.password === 'string' ? body.password : ''
  if (!password) {
    return json({ error: 'Password required' }, 400)
  }

  if (!checkPassword(password)) {
    const next = record && record.resetAt > now
      ? { count: record.count + 1, resetAt: record.resetAt }
      : { count: 1, resetAt: now + WINDOW_MS }
    attempts.set(ip, next)
    // Same message and status whether the password was wrong or empty, so the
    // endpoint does not double as a probe for whether HQ is configured.
    return json({ error: 'Incorrect password' }, 401)
  }

  attempts.delete(ip)
  grantAccess(cookies)
  return json({ ok: true })
}
