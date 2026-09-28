import { createHmac, timingSafeEqual } from 'node:crypto'
import type { AstroCookies } from 'astro'
import { getSecret } from 'astro:env/server'

const COOKIE = 'hs_hq'
const MAX_AGE = 60 * 60 * 8 // 8 hours

export function hqConfigured(): boolean {
  return Boolean(getSecret('HQ_PASSWORD'))
}

function secret(): string {
  // Only reachable when HQ_PASSWORD is set (every entry point checks hqConfigured
  // first), so there is always a real secret to sign with — never a default.
  return getSecret('HQ_SECRET') || getSecret('HQ_PASSWORD')!
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

export function checkPassword(candidate: string): boolean {
  const expected = getSecret('HQ_PASSWORD')
  if (!expected) return false
  return safeEqual(candidate, expected)
}

export function grantAccess(cookies: AstroCookies) {
  // Payload is the expiry in ms; the signature proves this server issued it.
  const payload = String(Date.now() + MAX_AGE * 1000)
  cookies.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function revokeAccess(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' })
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  if (!hqConfigured()) return false
  const token = cookies.get(COOKIE)?.value
  if (!token) return false

  const dot = token.lastIndexOf('.')
  if (dot < 1) return false
  const payload = token.slice(0, dot)
  const signature = token.slice(dot + 1)

  if (!safeEqual(signature, sign(payload))) return false
  const expiresAt = Number(payload)
  return Number.isFinite(expiresAt) && Date.now() <= expiresAt
}
