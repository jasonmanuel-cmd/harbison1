import type { APIRoute } from 'astro'
import { randomUUID } from 'node:crypto'
import { getSecret } from 'astro:env/server'
import { saveLead } from '@/lib/server/supabase'
import { clientKey, hit } from '@/lib/server/rate-limit'
import { authorizedCrmCheck, saveToSharedCrm, sharedCrmConfigured, verifySharedCrm } from '@/lib/server/shared-crm'
import { readJsonBody, BodyError } from '@/lib/server/request-body'

export const prerender = false

// Lead delivery.
//
// Inquiries are emailed through Formspree (the same form the Harbison Standard
// site has always used) and saved through the private Call Harbison CRM bridge
// when configured. Legacy local storage remains available before cutover.

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
  utm_source: 200,
  utm_medium: 200,
  utm_campaign: 200,
  utm_term: 200,
  utm_content: 200,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CHOICES: Record<string, readonly string[]> = {
  goal: ['Buying', 'Selling', 'Investing', 'Something else'],
  timeline: ['As soon as possible', 'Within 3 months', '3-6 months', '6-12 months', 'Just researching'],
  financing_status: ['Pre-approved', 'Talking with a lender', 'Cash buyer', 'Need a lender introduction', 'Not sure yet'],
  property_type: ['Single-family home', 'Land / acreage', 'Condo / townhome', 'Investment property', 'Open to options'],
  acreage_requirement: ['Standard lot', 'Large lot', '0.5+ acre', '1+ acre', '2+ acres', '5+ acres', '10+ acres', 'Not sure'],
  age_range: ['Under 25', '25-34', '35-44', '45-54', '55-64', '65+', 'Prefer not to say'],
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export const POST: APIRoute = async ({ request }) => {
  // Best-effort instance-local limit, not a deployment-wide abuse quota.
  const limited = hit('lead', clientKey(request), 5, 10 * 60_000)
  if (!limited.allowed) {
    return new Response(JSON.stringify({ error: 'Too many messages from this device. Please try again later, or call or text directly.', code: 'RATE_LIMITED' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(limited.retryAfter) },
    })
  }

  const FORM_ID = getSecret('FORMSPREE_FORM_ID') || 'xqpkdwrp'
  const NOTIFY_EMAIL = getSecret('NOTIFY_EMAIL') || 'nate85.realtor@gmail.com'

  let body: Record<string, unknown>
  try {
    body = await readJsonBody(request) as Record<string, unknown>
  } catch (err) {
    if (err instanceof BodyError) return json({ error: err.message, code: 'BAD_REQUEST' }, err.status)
    return json({ error: 'Invalid inquiry', code: 'BAD_REQUEST' }, 400)
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'Invalid inquiry', code: 'BAD_REQUEST' }, 400)
  }

  const sharedConfig = { url: getSecret('SHARED_CRM_URL'), secret: getSecret('SHARED_CRM_SECRET') }
  if (body.kind === 'verify') {
    if (!authorizedCrmCheck(request.headers.get('authorization'), sharedConfig.secret)) return json({ ok: false }, 401)
    try {
      await verifySharedCrm(sharedConfig)
      return json({ ok: true, verified: true, cleaned: true }, 200)
    } catch { return json({ ok: false, error: 'Shared CRM verification failed' }, 502) }
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
    const trimmed = value.trim()
    if (trimmed.length > max) return json({ error: `${key} is too long`, code: 'BAD_REQUEST' }, 400)
    if (trimmed) fields[key] = trimmed
  }

  // The form offers "1+", "2+" … — keep the number, which is how the CRM column is typed.
  if (body.bedrooms !== undefined && body.bedrooms !== null && body.bedrooms !== '') {
    if (typeof body.bedrooms !== 'string' && typeof body.bedrooms !== 'number') {
      return json({ error: 'Invalid bedrooms', code: 'BAD_REQUEST' }, 400)
    }
    const match = /^([1-5])\+?$/.exec(String(body.bedrooms).trim())
    if (!match) return json({ error: 'Invalid bedrooms', code: 'BAD_REQUEST' }, 400)
    fields.bedrooms = match[1]
  }

  for (const [key, choices] of Object.entries(CHOICES)) {
    if (fields[key] && !choices.includes(fields[key])) return json({ error: `Invalid ${key}`, code: 'BAD_REQUEST' }, 400)
  }
  if (!fields.name) return json({ error: 'Please add your name.', code: 'BAD_REQUEST' }, 400)
  if (!fields.email || !EMAIL_RE.test(fields.email)) {
    return json({ error: 'Please enter a valid email address.', code: 'BAD_REQUEST' }, 400)
  }
  fields.email = fields.email.toLowerCase()
  if (!fields.phone || !/^[+()\d\s.-]+$/.test(fields.phone) || !/^\d{7,15}$/.test(fields.phone.replace(/\D/g, ''))) {
    return json({ error: 'Please enter a valid phone number.', code: 'BAD_REQUEST' }, 400)
  }
  if (fields.age_range === 'Prefer not to say') delete fields.age_range

  const goal = fields.goal || 'Something else'
  const interest = fields.interest || ''
  const source = 'harbison-astro-site'
  const sessionId = typeof body.session_id === 'string' ? body.session_id.slice(0, 64) : undefined
  const useShared = sharedCrmConfigured(sharedConfig)
  const submissionId = typeof body.submission_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submission_id)
    ? body.submission_id : randomUUID()
  let sourcePage = 'https://www.harbisonstandard.com'
  try {
    const page = new URL(typeof body.source === 'string' ? body.source : request.headers.get('referer') || sourcePage)
    if (page.hostname === 'www.harbisonstandard.com' || page.hostname === 'harbisonstandard.com') sourcePage += page.pathname.slice(0, 300)
  } catch { /* retain the known site origin */ }
  let referrer: string | undefined
  try { if (typeof body.referrer === 'string' && body.referrer) referrer = new URL(body.referrer).origin } catch { /* ignore malformed attribution */ }

  // Store in the CRM before answering. Awaited, not fire-and-forget: on serverless
  // hosting the function can be frozen once the response is sent, so an unawaited
  // write may never finish and the visitor would be told "sent" with nothing stored.
  // A CRM failure does not block the email attempt. Either service can fail.
  let stored = false
  let duplicate = false
  try {
    if (useShared) {
      const result = await saveToSharedCrm({ ...fields, goal, source: sourcePage, referrer, session_id: sessionId }, submissionId, sharedConfig)
      stored = true
      duplicate = result.duplicate
    } else {
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
        message: fields.message,
        source,
        session_id: sessionId,
      })
      stored = row !== null
    }
  } catch (err: unknown) {
    console.error('[lead] CRM storage failed')
  }
  // Never log the visitor's details here; the inquiry itself is in the email and the CRM.
  if (!stored) console.error('[lead] inquiry was not stored in the CRM; delivering by email only')
  // A duplicate proves persistence only, not notification. Without a durable
  // delivery receipt, neither resend blindly nor claim an email was accepted.
  if (duplicate) return json({ ok: true, stored: true, duplicate: true, notification: 'unknown' }, 202)

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
      console.error(`[lead] Formspree responded ${response.status}`)
      // `stored` tells the form whether the lead already exists, so it never asks the visitor to resend.
      return json({ ok: false, stored, error: 'Failed to send inquiry', code: 'UPSTREAM_ERROR' }, 502)
    }
    return json({ ok: true, stored, notification: 'accepted' }, 201)
  } catch (err) {
    console.error('[lead] Form delivery outcome unknown')
    return json({ ok: false, stored, error: 'Lead service unavailable', code: 'SERVICE_UNAVAILABLE' }, 503)
  }
}
