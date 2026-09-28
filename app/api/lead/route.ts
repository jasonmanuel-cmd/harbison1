import { NextResponse } from 'next/server'

// Lead delivery.
//
// The previous Supabase backend was deleted (its hostname returns NXDOMAIN
// from public DNS), so server-side storage is unavailable. Inquiries are
// delivered by email through Formspree instead — the same endpoint the
// Harbison Standard site already uses.
//
// Set FORMSPREE_FORM_ID to override the form (defaults to the existing
// Harbison Standard form). Set NOTIFY_EMAIL to change the recipient.

const FORM_ID = process.env.FORMSPREE_FORM_ID || 'xqpkdwrp'
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'nate85.realtor@gmail.com'

const FIELD_LIMITS: Record<string, number> = {
  name: 100,
  email: 200,
  phone: 40,
  current_city: 120,
  desired_area: 200,
  budget: 100,
  property_type: 100,
  timeline: 100,
  financing_status: 120,
  goal: 100,
  interest: 200,
  message: 3000,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid inquiry', code: 'BAD_REQUEST' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid inquiry', code: 'BAD_REQUEST' }, { status: 400 })
  }

  const fields: Record<string, string> = {}
  for (const [key, max] of Object.entries(FIELD_LIMITS)) {
    const value = body[key]
    if (value === undefined || value === null) continue
    if (typeof value !== 'string') {
      return NextResponse.json({ error: `Invalid ${key}`, code: 'BAD_REQUEST' }, { status: 400 })
    }
    const trimmed = value.trim().slice(0, max)
    if (trimmed) fields[key] = trimmed
  }

  // Bedrooms is a numeric column in the buyer's profile; keep it optional.
  if (body.bedrooms !== undefined && body.bedrooms !== null && body.bedrooms !== '') {
    const v = String(body.bedrooms)
    if (/^[1-9][0-9]?$/.test(v)) {
      fields.bedrooms = v
    } else if (!/^[1-9]\+$/.test(v)) {
      return NextResponse.json({ error: 'Invalid bedrooms', code: 'BAD_REQUEST' }, { status: 400 })
    }
  }
  if (body.acreage_requirement !== undefined) {
    const v = body.acreage_requirement
    if (typeof v === 'string' && v.trim()) fields.acreage_requirement = v.trim().slice(0, 100)
  }

  if (!fields.name) {
    return NextResponse.json({ error: 'Name is required', code: 'BAD_REQUEST' }, { status: 400 })
  }
  if (!fields.email || !EMAIL_RE.test(fields.email)) {
    return NextResponse.json({ error: 'A valid email is required', code: 'BAD_REQUEST' }, { status: 400 })
  }
  fields.email = fields.email.toLowerCase()

  const goal = fields.goal || 'Something else'
  const interest = fields.interest || ''
  const source = 'harbison1-site'

  // Compose a readable body so the email is useful even if a field is missing.
  const lines = [
    `Goal: ${goal}`,
    interest && `Property of interest: ${interest}`,
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    fields.phone && `Phone: ${fields.phone}`,
    fields.current_city && `Current city: ${fields.current_city}`,
    fields.desired_area && `Desired area: ${fields.desired_area}`,
    fields.budget && `Budget: ${fields.budget}`,
    fields.bedrooms && `Bedrooms: ${fields.bedrooms}`,
    fields.acreage_requirement && `Acreage / lot: ${fields.acreage_requirement}`,
    fields.property_type && `Property type: ${fields.property_type}`,
    fields.timeline && `Timeline: ${fields.timeline}`,
    fields.financing_status && `Financing: ${fields.financing_status}`,
    '',
    fields.message || "I'd like to talk about my next steps.",
    '',
    `Sent from the Harbison Standard website (${source}).`,
  ].filter(Boolean)

  const payload = {
    _subject: `Harbison Standard — ${goal} inquiry (from ${source})`,
    _replyto: fields.email,
    _cc: NOTIFY_EMAIL,
    name: fields.name,
    email: fields.email,
    phone: fields.phone || 'Not provided',
    location: fields.desired_area || fields.current_city || 'Open to ideas',
    timing: fields.timeline || 'Not specified',
    budget: fields.budget || 'Not specified',
    goal,
    interest: interest || 'General inquiry',
    message: lines.join('\n'),
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    let response: Response
    try {
      response = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      console.error(`[lead] Formspree responded ${response.status}: ${text.slice(0, 300)}`)
      return NextResponse.json({ error: 'Failed to send inquiry', code: 'UPSTREAM_ERROR' }, { status: 502 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('[lead] Form delivery failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Lead service unavailable', code: 'SERVICE_UNAVAILABLE' }, { status: 503 })
  }
}
