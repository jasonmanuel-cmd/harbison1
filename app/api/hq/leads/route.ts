import { NextResponse } from 'next/server'

import { isAuthenticated } from '@/lib/hq-auth'
import { listLeads, supabaseConfigured, updateLead } from '@/lib/supabase'

/** Every route in this file is admin-only. Deny by default if not signed in. */
async function guard() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }
  return null
}

export async function GET() {
  const denied = await guard()
  if (denied) return denied

  if (!supabaseConfigured) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const leads = await listLeads(200).catch((err: unknown) => {
    console.error('[hq] list leads failed:', err instanceof Error ? err.message : err)
    return null
  })

  if (!leads) {
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 502 })
  }
  return NextResponse.json({ leads })
}

export async function PATCH(request: Request) {
  const denied = await guard()
  if (denied) return denied

  let body: { id?: unknown; status?: unknown; notes?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (typeof body.id !== 'string' || !body.id) {
    return NextResponse.json({ error: 'A lead id is required' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {}
  if (typeof body.status === 'string') {
    if (!['new', 'contacted', 'qualified', 'closed'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    patch.status = body.status
  }
  if (typeof body.notes === 'string') {
    patch.notes = body.notes.slice(0, 4000)
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const rows = await updateLead(body.id, patch).catch((err: unknown) => {
    console.error('[hq] update lead failed:', err instanceof Error ? err.message : err)
    return null
  })

  if (!rows) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 502 })
  }
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }
  return NextResponse.json({ lead: rows[0] })
}
