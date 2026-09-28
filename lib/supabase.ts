import 'server-only'

/**
 * Server-side Supabase access for the CRM and analytics.
 *
 * Uses PostgREST directly with the service_role key. Never import this from a
 * client component — the service role bypasses row-level security, so leaking
 * it to the browser would expose every lead.
 *
 * If the environment variables are absent the helpers return null and callers
 * degrade gracefully (forms still deliver by email; analytics is skipped).
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY)

type Row = Record<string, unknown>

function headers(): Record<string, string> {
  return {
    apikey: SUPABASE_KEY as string,
    Authorization: `Bearer ${SUPABASE_KEY as string}`,
    'Content-Type': 'application/json',
  }
}

async function rest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${(SUPABASE_URL as string).replace(/\/$/, '')}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers(), ...(init.headers as Record<string, string> | undefined) },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 200)}`)
  }
  if (res.status === 204) return null as T
  return (await res.json()) as T
}

// ---------------------------------------------------------------- leads

export type LeadInsert = {
  name?: string
  email?: string
  phone?: string
  goal?: string
  interest?: string
  current_city?: string
  desired_area?: string
  budget?: string
  bedrooms?: number
  acreage_requirement?: string
  property_type?: string
  timeline?: string
  financing_status?: string
  age_range?: string
  source?: string
  session_id?: string
  status?: string
  brand?: string
}

export function saveLead(lead: LeadInsert): Promise<Row | null> {
  if (!supabaseConfigured) return Promise.resolve(null)
  return rest<Row[]>('leads', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ ...lead, brand: lead.brand ?? 'harbison_standard' }),
  }).then((rows) => rows[0] ?? null)
}

export function updateLead(id: string, patch: Row): Promise<Row[]> {
  return rest<Row[]>(`leads?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(patch),
  })
}

export function listLeads(limit = 100): Promise<Row[]> {
  return rest<Row[]>(`leads?select=*&order=created_at.desc&limit=${Math.min(Math.max(limit, 1), 500)}`)
}

// ---------------------------------------------------------------- sessions

export function upsertSession(sessionId: string, patch: Row): Promise<Row[]> {
  return rest<Row[]>(`sessions?on_conflict=session_id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ ...patch, session_id: sessionId }),
  })
}

/** Appends time spent + page count without clobbering other columns. */
export function bumpSession(
  sessionId: string,
  patch: { pageViews?: number; durationSeconds?: number; exitPath?: string }
): Promise<Row[]> {
  // Supabase RPC would be cleaner, but a small SQL expression via PATCH keeps
  // this dependency-free. The client sends deltas, so additivity is preserved.
  const body: Row = { last_seen_at: new Date().toISOString() }
  if (patch.pageViews) body.page_views = `sessions.page_views+${Number(patch.pageViews)}`
  if (patch.durationSeconds) body.duration_seconds = `sessions.duration_seconds+${Number(patch.durationSeconds)}`
  if (patch.exitPath) body.exit_path = patch.exitPath
  return rest<Row[]>(`sessions?session_id=eq.${encodeURIComponent(sessionId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(body),
  })
}

export function recordVisit(visit: Row): Promise<Row[]> {
  return rest<Row[]>('visits', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(visit),
  })
}

// ---------------------------------------------------------------- reads for /hq

export function fetchSessions(days: number): Promise<Row[]> {
  const since = new Date(Date.now() - days * 864e5).toISOString()
  return rest<Row[]>(
    `sessions?select=*&created_at=gte.${since}&order=created_at.desc&limit=20000`,
  )
}

export function fetchVisits(days: number): Promise<Row[]> {
  const since = new Date(Date.now() - days * 864e5).toISOString()
  return rest<Row[]>(
    `visits?select=id,session_id,path,title,duration_seconds&created_at=gte.${since}&order=created_at.desc&limit=100000`,
  )
}
