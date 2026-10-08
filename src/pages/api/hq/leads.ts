import type { APIRoute, AstroCookies } from 'astro'
import { isAuthenticated } from '@/lib/server/hq-auth'
import { deleteLead, listLeads, supabaseConfigured, updateLead } from '@/lib/server/supabase'

export const prerender = false

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

/** Every route in this file is admin-only. Deny by default if not signed in. */
function guard(cookies: AstroCookies) {
  if (!isAuthenticated(cookies)) {
    return json({ error: 'Not signed in' }, 401)
  }
  return null
}

export const GET: APIRoute = async ({ cookies }) => {
  const denied = guard(cookies)
  if (denied) return denied

  if (!supabaseConfigured) {
    return json({ error: 'Database not configured' }, 503)
  }

  const leads = await listLeads(200).catch((err: unknown) => {
    console.error('[hq] list leads failed:', err instanceof Error ? err.message : err)
    return null
  })

  if (!leads) {
    return json({ error: 'Failed to load leads' }, 502)
  }
  return json({ leads })
}

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const denied = guard(cookies)
  if (denied) return denied

  let body: { id?: unknown; status?: unknown; notes?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }

  if (typeof body.id !== 'string' || !body.id) {
    return json({ error: 'A lead id is required' }, 400)
  }

  const patch: Record<string, unknown> = {}
  if (typeof body.status === 'string') {
    if (!['new', 'contacted', 'qualified', 'closed'].includes(body.status)) {
      return json({ error: 'Invalid status' }, 400)
    }
    patch.status = body.status
  }
  if (typeof body.notes === 'string') {
    patch.notes = body.notes.slice(0, 4000)
  }

  if (Object.keys(patch).length === 0) {
    return json({ error: 'Nothing to update' }, 400)
  }

  const rows = await updateLead(body.id, patch).catch((err: unknown) => {
    console.error('[hq] update lead failed:', err instanceof Error ? err.message : err)
    return null
  })

  if (!rows) {
    return json({ error: 'Failed to update lead' }, 502)
  }
  if (rows.length === 0) {
    return json({ error: 'Lead not found' }, 404)
  }
  return json({ lead: rows[0] })
}

/** Permanently removes one lead. Admin-only; the dashboard asks for confirmation first. */
export const DELETE: APIRoute = async ({ request, cookies }) => {
  const denied = guard(cookies)
  if (denied) return denied

  let body: { id?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }
  if (typeof body.id !== 'string' || !body.id) {
    return json({ error: 'A lead id is required' }, 400)
  }

  const rows = await deleteLead(body.id).catch((err: unknown) => {
    console.error('[hq] delete lead failed:', err instanceof Error ? err.message : err)
    return null
  })
  if (!rows) {
    return json({ error: 'Failed to delete lead' }, 502)
  }
  if (rows.length === 0) {
    return json({ error: 'Lead not found' }, 404)
  }
  return json({ ok: true })
}
