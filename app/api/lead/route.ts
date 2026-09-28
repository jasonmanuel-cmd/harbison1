import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const FIELD_LIMITS: Record<string, number> = {
  name: 100,
  email: 200,
  phone: 40,
  current_city: 120,
  desired_area: 200,
  budget: 100,
  acreage_requirement: 100,
  property_type: 100,
  timeline: 100,
  financing_status: 120,
  notes: 5000,
  goal: 100,
  interest: 200,
  location: 200,
  timing: 100,
  message: 3000,
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: 'Lead service not configured', code: 'SERVICE_UNCONFIGURED' }, 503)
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid inquiry' }, 400)
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'Invalid inquiry' }, 400)
  }

  const fields: Record<string, string> = {}
  for (const [key, max] of Object.entries(FIELD_LIMITS)) {
    const value = body[key]
    if (value === undefined || value === null) continue
    if (typeof value !== 'string') return json({ error: `Invalid ${key}` }, 400)
    fields[key] = value.trim().slice(0, max)
  }

  if (!fields.name) return json({ error: 'Name is required' }, 400)
  if (fields.email !== undefined) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      return json({ error: 'A valid email is required' }, 400)
    }
    fields.email = fields.email.toLowerCase()
  }

  if (body.bedrooms !== undefined) {
    const v = body.bedrooms
    if (v === '' || v === null) {
      // no bedroom preference — omit
    } else if (/^(?:0|[1-9][0-9]?)$/.test(String(v))) {
      fields.bedrooms = Number(v)
    } else {
      return json({ error: 'Bedrooms must be a whole number from 0 to 99' }, 400)
    }
  }

  const lead = {
    ...fields,
    goal: fields.goal || 'Something else',
    brand: 'harbison_standard',
    source: 'harbison1-site',
    status: 'new',
  }

  try {
    const response = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(lead),
    })
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      return json({ error: 'Failed to save inquiry', detail: text.slice(0, 300) }, 502)
    }
    const rows = await response.json()
    return json({ ok: true, id: rows[0]?.id ?? null }, 201)
  } catch (err) {
    return json({ error: 'Failed to save inquiry', detail: String(err).slice(0, 300) }, 502)
  }
}
