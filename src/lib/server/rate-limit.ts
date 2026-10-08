/**
 * Best-effort request limiting, keyed by device address.
 *
 * Limits are held in memory, so each server instance keeps its own count. That
 * stops a single device hammering one instance, which is the common abuse case.
 * For a hard, global limit add a rule in the hosting firewall as well.
 *
 * The address comes from the LAST entry of X-Forwarded-For. The hosting proxy
 * appends the real client address there, so a visitor cannot forge it by
 * sending their own header. The first entry is client-controlled and is not used.
 */

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()
const MAX_KEYS = 10_000

export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length) return parts[parts.length - 1]
  }
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/** Counts a request and reports whether it is allowed within the window. */
export function hit(name: string, key: string, limit: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const id = `${name}:${key}`
  if (buckets.size > MAX_KEYS) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  }
  const current = buckets.get(id)
  if (!current || current.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }
  current.count += 1
  if (current.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  }
  return { allowed: true, retryAfter: 0 }
}
