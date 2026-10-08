import type { APIRoute } from 'astro'
import { getSecret } from 'astro:env/server'
import { saveLead } from '@/lib/server/supabase'

export const prerender = false

// Lead delivery.
//
// Inquiries are emailed through Formspree (the same form the Harbison Standard
// site has always used) and, when Supabase is configured, mirrored into the CRM
// on a best-effort basis. Set FORMSPREE_FORM_ID / NOTIFY_EMAIL to override.

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
  age_range: 40,
  acreage_requirement: 100,
  message: 3000,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export const POST: APIRoute = async ({ request }) => {
  const FORM_ID = getSecret('FORMSPREE_FORM_ID') || 'xqpkdwrp'
  const NOTIFY_EMAIL = getSecret('NOTIFY_EMAIL') || 'nate85.realtor@gmail.com'

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid inquiry', code: 'BAD_REQUEST' }, 400)
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'Invalid inquiry', code: 'BAD_REQUEST' }, 400)
  }

  // Honeypot: a real visitor never sees or fills this field. Report success so
  // the bot moves on, but deliver nothing.
  if (typeof body.company === 'string' && body.company.trim()) {
    return json({ ok: true }, 201)
  }

  const fields: Record<string, string> = {}
  for (const [key, max] of Object.entries(FIELD_LIMITS)) {
    const value = body[key]
    if (value === undefined || value === null) continue
    if (typeof value !== 'string') return json({ error: `Invalid ${key}`, code: 'BAD_REQUEST' }, 400)
    const trimmed = value.trim().slice(0, max)
    if (trimmed) fields[key] = trimmed
  }

  // The form offers "1+", "2+" … — keep the number, which is how the CRM column is typed.
  if (body.bedrooms !== undefined && body.bedrooms !== null && body.bedrooms !== '') {
    const match = /^([1-9][0-9]?)\+?$/.exec(String(body.bedrooms).trim())
    if (!match) return json({ error: 'Invalid bedrooms', code: 'BAD_REQUEST' }, 400)
    fields.bedrooms = match[1]
  }

  if (!fields.name) return json({ error: 'Please add your name.', code: 'BAD_REQUEST' }, 400)
  if (!fields.email || !EMAIL_RE.test(fields.email)) {
    return json({ error: 'Please enter a valid email address.', code: 'BAD_REQUEST' }, 400)
  }
  fields.email = fields.email.toLowerCase()
  if (fields.age_range === 'Prefer not to say') delete fields.age_range

  const goal = fields.goal || 'Something else'
  const interest = fields.interest || ''
  const source = 'harbison-astro-site'
  const sessionId = typeof body.session_id === 'string' ? body.session_id.slice(0, 64) : undefined

  // Store in the CRM before answering. Awaited, not fire-and-forget: on serverless
  // hosting the function can be frozen once the response is sent, so an unawaited
  // write may never finish and the visitor would be told "sent" with nothing stored.
  // A CRM failure does not block the email, so the inquiry is never lost.
  let stored = false
  try {
    const row = await saveLead({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      goal,
      interest: interest || undefined,
      current_city: fields.current_city,
      desired_area: fields.desired_area,
      budget: fields.budget,
      bedrooms: fields.bedrooms ? parseInt(fields.bedrooms, 10) : undefined,
      acreage_requirement: fields.acreage_requirement,
      property_type: fields.property_type,
      timeline: fields.timeline,
      financing_status: fields.financing_status,
      age_range: fields.age_range,
      // The visitor's own words. /hq renders this, so it has to persist.
      message: fields.message,
      source,
      session_id: sessionId,
    })
    stored = row !== null
  } catch (err: unknown) {
    console.error('[lead] CRM storage failed:', err instanceof Error ? err.message : err)
  }
  if (!stored) console.error('[lead] inquiry from', fields.email, 'was not stored in the CRM; delivering by email only')

  // `null` drops a line; empty strings are intentional blank lines.
  const opt = (value: string | undefined, text: string) => (value ? text : null)
  const lines = [
    `Goal: ${goal}`,
    opt(interest, `Property of interest: ${interest}`),
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    opt(fields.phone, `Phone: ${fields.phone}`),
    opt(fields.current_city, `Current city: ${fields.current_city}`),
    opt(fields.desired_area, `Desired area: ${fields.desired_area}`),
    opt(fields.budget, `Budget: ${fields.budget}`),
    opt(fields.bedrooms, `Bedrooms: ${fields.bedrooms}+`),
    opt(fields.acreage_requirement, `Acreage / lot: ${fields.acreage_requirement}`),
    opt(fields.property_type, `Property type: ${fields.property_type}`),
    opt(fields.timeline, `Timeline: ${fields.timeline}`),
    opt(fields.financing_status, `Financing: ${fields.financing_status}`),
    opt(fields.age_range, `Age range: ${fields.age_range}`),
    '',
    fields.message || 'I’d like to talk about my next steps.',
    '',
    `Sent from the Harbison Standard website (${source}).`,
  ].filter((l): l is string => l !== null)

  const payload = {
    _subject: `Harbison Standard — ${goal} inquiry${interest ? ` — ${interest}` : ''}`,
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
    const response = await fetch(`https://formspree.io/f/${FORM_ID}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      console.error(`[lead] Formspree responded ${response.status}: ${text.slice(0, 300)}`)
      return json({ error: 'Failed to send inquiry', code: 'UPSTREAM_ERROR' }, 502)
    }
    return json({ ok: true }, 201)
  } catch (err) {
    console.error('[lead] Form delivery failed:', err instanceof Error ? err.message : err)
    return json({ error: 'Lead service unavailable', code: 'SERVICE_UNAVAILABLE' }, 503)
  }
}
