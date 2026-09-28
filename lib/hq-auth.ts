import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE = 'hs_hq'
const MAX_AGE = 60 * 60 * 8 // 8 hours

function secret(): string {
  return process.env.HQ_SECRET || process.env.HQ_PASSWORD || 'harbison-hq-dev-secret'
}

export function hqConfigured(): boolean {
  return Boolean(process.env.HQ_PASSWORD)
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
  const expected = process.env.HQ_PASSWORD
  if (!expected) return false
  return safeEqual(candidate, expected)
}

export async function grantAccess() {
  const jar = await cookies()
  // payload is the expiry in ms; signature proves it was issued by this server.
  const payload = String(Date.now() + MAX_AGE * 1000)
  const token = `${payload}.${sign(payload)}`
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function revokeAccess() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  if (!hqConfigured()) return false
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return false

  const dot = token.lastIndexOf('.')
  if (dot < 1) return false

  const payload = token.slice(0, dot)
  const signature = token.slice(dot + 1)

  // Signature must match, and the token must not have expired.
  if (!safeEqual(signature, sign(payload))) return false

  const expiresAt = Number(payload)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false

  return true
}
