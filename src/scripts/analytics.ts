/**
 * Lightweight first-party analytics.
 *
 * Privacy choices, deliberately:
 *   * No cookies, no cross-site identifiers, no Google Analytics.
 *   * No raw IP is ever sent or stored. The server derives a daily-rotating
 *     salted hash from the edge IP purely to count unique visitors.
 *   * No age or other personal characteristics are inferred.
 *   * Honours Do Not Track and Global Privacy Control.
 *   * Honours an explicit opt-out stored in localStorage.
 *
 * The session id lives in sessionStorage, so it clears when the tab closes —
 * a returning visitor is counted as new, which slightly overstates uniques.
 */

const SESSION_KEY = 'hs_sid'
const START_KEY = 'hs_t0'
const CONSENT_KEY = 'hs_analytics'
let optedOutOnThisPage = false
// Set once the acquisition 'start' event has been sent for this session. Kept
// separate from LAST_KEY, which flush() clears on tab-hide — keying 'start' off
// LAST_KEY re-sent it after every tab switch and overwrote the session's entry
// page, referrer and start time.
const STARTED_KEY = 'hs_started'

export type TrackPayload = {
  path: string
  title?: string
  referrerHost?: string | null
  referrerType?: string
  durationSeconds?: number
  pageToken?: string
}

export function analyticsAllowed(): boolean {
  if (optedOutOnThisPage) return false
  if (typeof window === 'undefined') return false
  const hostname = window.location?.hostname
  if (hostname && !['www.harbisonstandard.com', 'harbisonstandard.com'].includes(hostname)) return false
  if (/^\/(hq|api)(\/|$)/.test(window.location?.pathname || '')) return false
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean
    doNotTrack?: string | null
  }
  if (nav.doNotTrack === '1') return false
  if (nav.globalPrivacyControl === true) return false
  try {
    if (window.localStorage.getItem(CONSENT_KEY) === 'off') return false
  } catch {
    // Safari may deny storage in restricted browsing contexts. Skip analytics
    // rather than letting session storage access interrupt the page.
    return false
  }
  return true
}

export function optOutOfAnalytics() {
  optedOutOnThisPage = true
  try {
    window.localStorage.setItem(CONSENT_KEY, 'off')
    return true
  } catch {
    // The current page still honors the choice when persistence is blocked.
    return false
  }
}

/**
 * The current session id, or null when storage is blocked.
 *
 * Exported so a lead submission can be attributed back to the visit that
 * produced it. Analytics being opted out must NOT suppress this — the id is
 * just a random UUID in sessionStorage, and the server only uses it to join
 * the lead to its own sessions row.
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      window.sessionStorage.setItem(SESSION_KEY, id)
      window.sessionStorage.setItem(START_KEY, String(Date.now()))
    }
    return id
  } catch {
    return null
  }
}

function sessionId(): string {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    const started = Number(window.sessionStorage.getItem(START_KEY)) || 0
    if (!id || Date.now() - started > 30 * 60000 || new Date(started).getUTCDate() !== new Date().getUTCDate()) {
      id = crypto.randomUUID()
      window.sessionStorage.setItem(SESSION_KEY, id)
      window.sessionStorage.setItem(START_KEY, String(Date.now()))
      window.sessionStorage.removeItem(STARTED_KEY)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

let queue = Promise.resolve()
let page: { sid: string; token: string; path: string; seconds: number; activeAt: number | null } | null = null
function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload)
  // Session creation must finish before its first page view (foreign key).
  queue = queue.catch(() => {}).then(async () => {
    const response = await fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
    const result = await response.json()
    if (!response.ok || !result.stored) throw new Error('Analytics unavailable')
  }).catch(() => { try { window.sessionStorage.removeItem(STARTED_KEY) } catch {} })
}

function classifyReferrer(host: string | null): string {
  if (!host) return 'direct'
  const h = host.toLowerCase()
  if (/google|bing|duckduckgo|yahoo|baidu|yandex|ecosia|brave/.test(h)) return 'search'
  if (/facebook|instagram|twitter|x\.com|linkedin|tiktok|pinterest|reddit|youtube|threads|mastodon/.test(h)) return 'social'
  if (/mail|outlook|gmail|yahoo\.com/.test(h)) return 'email'
  return 'referral'
}

export function trackPageView(title?: string) {
  if (!analyticsAllowed()) return
  const sid = sessionId()
  const now = Date.now()
  flush()

  // First view of this session also captures the acquisition context.
  const isFirst = !window.sessionStorage.getItem(STARTED_KEY)
  if (isFirst) {
    window.sessionStorage.setItem(STARTED_KEY, '1')
    const params = new URLSearchParams(window.location.search)
    const referrerHost = document.referrer ? new URL(document.referrer).hostname : null
    send({
      sid,
      type: 'start',
      path: window.location.pathname,
      referrerHost,
      referrerType: classifyReferrer(referrerHost),
      utm: {
        source: params.get('utm_source') ?? undefined,
        medium: params.get('utm_medium') ?? undefined,
        campaign: params.get('utm_campaign') ?? undefined,
        term: params.get('utm_term') ?? undefined,
        content: params.get('utm_content') ?? undefined,
      },
    })
  }

  const pageToken = crypto.randomUUID()
  page = { sid, token: pageToken, path: window.location.pathname, seconds: 0, activeAt: document.hidden ? null : now }
  send({
    sid,
    type: 'pageview',
    path: window.location.pathname,
    title: title ?? document.title,
    pageToken,
  })
}

function flush() {
  if (!analyticsAllowed() || !page) return
  if (page.activeAt !== null) { page.seconds += Math.max(0, (Date.now() - page.activeAt) / 1000); page.activeAt = null }
  send({ sid: page.sid, type: 'heartbeat', path: page.path, pageToken: page.token, durationSeconds: Math.min(1800, Math.round(page.seconds)) })
}

let initialized = false

export function initAnalytics() {
  if (initialized || !analyticsAllowed()) return
  initialized = true
  window.addEventListener('pagehide', flush)
  // Safari/Chrome sometimes skip pagehide; backstop on visibility change.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
    else if (page) page.activeAt = Date.now()
  })
  setInterval(() => { if (!document.hidden && page) { flush(); page.activeAt = Date.now() } }, 15000)
}
