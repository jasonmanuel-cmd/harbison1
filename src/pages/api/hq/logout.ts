import type { APIRoute } from 'astro'
import { revokeAccess } from '@/lib/server/hq-auth'

export const prerender = false

export const POST: APIRoute = ({ cookies }) => {
  revokeAccess(cookies)
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
}
