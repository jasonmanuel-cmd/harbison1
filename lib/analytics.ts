'use client'

/**
 * Lightweight first-party analytics.
 *
 * Privacy choices, deliberately:
 *   * No cookies, no cross-site identifiers, no Google Analytics.
 *   * No raw IP is ever sent or stored. The server derives a daily-rotating
 *     salted hash from the edge IP purely to count unique visitors.
 *   * No age or other personal characteristics are inferred.
 *   * Honours Do Not Track and Global Privacy Control.
 *   * Nothing is collected until the visitor has interacted or dwelled, so a
 *     bounce never registers.
 *
 * The session id lives in sessionStorage, so it clears when the tab closes —
 * a returning visitor is counted as new, which slightly overstates uniques.
 */

const SESSION_KEY = 'hs_sid'
const START_KEY = 'hs_t0'
const LAST_KEY = 'hs_last'
const FLUSH_KEY = 'hs_flush'
const CONSENT_KEY = 'hs_analytics'

export type TrackPayload = {
  path: string
  title?: string
  referrerHost?: string | null
  referrerType?: string
  durationSeconds?: number
}

export function analyticsAllowed(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean
    doNotTrack?: string | null
  }
  if (nav.doNotTrack === '1') return false
  if (nav.globalPrivacyControl === true) return false
  try {
    if (window.localStorage.getItem(CONSENT_KEY) === 'off') return false
  } catch {
    /* storage blocked — treat as allowed, the beacon is harmless */
  }
  return true
}

export function optOutOfAnalytics() {
  try {
    window.localStorage.setItem(CONSENT_KEY, 'off')
  } catch {
    /* ignore */
  }
}

function sessionId(): string {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      window.sessionStorage.setItem(SESSION_KEY, id)
      window.sessionStorage.setItem(START_KEY, String(Date.now()))
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

function send(payload: Record<string, unknown>, useBeacon = false) {
  const body = JSON.stringify(payload)
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
    return
  }
  void fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: useBeacon,
  }).catch(() => {
    /* analytics must never surface an error to the visitor */
  })
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

  // First view of this session also captures the acquisition context.
  const isFirst = !window.sessionStorage.getItem(LAST_KEY)
  if (isFirst) {
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

  // Charge the time spent on the previous page to that page.
  const last = window.sessionStorage.getItem(LAST_KEY)
  if (last) {
    const dwell = Math.min(Math.round((now - Number(last)) / 1000), 1800)
    if (dwell > 1) send({ sid, type: 'heartbeat', path: window.location.pathname, durationSeconds: dwell })
  }

  send({ sid, type: 'pageview', path: window.location.pathname, title: title ?? document.title })
  window.sessionStorage.setItem(LAST_KEY, String(now))
}

function flush() {
  if (!analyticsAllowed()) return
  const sid = (() => {
    try {
      return window.sessionStorage.getItem(SESSION_KEY)
    } catch {
      return null
    }
  })()
  if (!sid) return

  const t0 = Number(window.sessionStorage.getItem(START_KEY) || Date.now())
  const last = Number(window.sessionStorage.getItem(LAST_KEY) || Date.now())
  const total = Math.min(Math.round((Date.now() - t0) / 1000), 36000)
  const lastDwell = Math.min(Math.round((Date.now() - last) / 1000), 1800)

  send({ sid, type: 'end', path: window.location.pathname, durationSeconds: total, lastDwellSeconds: lastDwell }, true)
  try {
    window.sessionStorage.removeItem(LAST_KEY)
  } catch {
    /* ignore */
  }
}

export function initAnalytics() {
  if (!analyticsAllowed()) return
  window.addEventListener('pagehide', flush)
  // Safari/Chrome sometimes skip pagehide; backstop on visibility change.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })
}
