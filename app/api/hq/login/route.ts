import { NextResponse } from 'next/server'

import { checkPassword, grantAccess, hqConfigured } from '@/lib/hq-auth'

/** Rate-limits password guessing. In-memory, so it resets on redeploy. */
const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 8

export async function POST(request: Request) {
  if (!hqConfigured()) {
    return NextResponse.json(
      { error: 'HQ is not configured. Set HQ_PASSWORD on the server.' },
      { status: 503 },
    )
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const now = Date.now()
  const record = attempts.get(ip)
  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    const seconds = Math.ceil((record.resetAt - now) / 1000)
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(seconds / 60)} minutes.` },
      { status: 429 },
    )
  }

  let body: { password?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const password = typeof body.password === 'string' ? body.password : ''
  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  if (!checkPassword(password)) {
    const next = record && record.resetAt > now
      ? { count: record.count + 1, resetAt: record.resetAt }
      : { count: 1, resetAt: now + WINDOW_MS }
    attempts.set(ip, next)
    // Same message and status whether the password was wrong or empty, so the
    // endpoint does not double as a probe for whether HQ is configured.
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  attempts.delete(ip)
  await grantAccess()
  return NextResponse.json({ ok: true })
}
