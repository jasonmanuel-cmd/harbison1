import { NextResponse } from 'next/server'

import { isAuthenticated } from '@/lib/hq-auth'
import { fetchSessions, fetchVisits, supabaseConfigured } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Session = {
  session_id: string
  created_at: string
  last_seen_at: string
  visitor_hash: string | null
  referrer_host: string | null
  referrer_type: string | null
  utm_source: string | null
  utm_campaign: string | null
  entry_path: string | null
  exit_path: string | null
  page_views: number | null
  device_type: string | null
  browser: string | null
  os: string | null
  country: string | null
  region: string | null
  city: string | null
  duration_seconds: number | null
}

type Visit = {
  session_id: string
  path: string
  title: string | null
  duration_seconds: number | null
}

function tally<T extends string | null>(items: T[]): Array<[string, number]> {
  const counts = new Map<string, number>()
  for (const value of items) {
    const key = value || 'unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid]
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }
  if (!supabaseConfigured) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const days = Math.min(Math.max(Number(new URL(request.url).searchParams.get('days')) || 30, 1), 365)

  let sessions: Session[]
  let visits: Visit[]
  try {
    const [rawSessions, rawVisits] = await Promise.all([fetchSessions(days), fetchVisits(days)])
    sessions = rawSessions as Session[]
    visits = rawVisits as Visit[]
  } catch (err) {
    console.error('[hq] analytics fetch failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 502 })
  }

  const durations = sessions.map((s) => s.duration_seconds ?? 0).filter((d) => d > 0)
  const totalDuration = durations.reduce((a, b) => a + b, 0)
  const pageViews = sessions.reduce((a, s) => a + (s.page_views ?? 0), 0)
  const uniqueVisitors = new Set(sessions.map((s) => s.visitor_hash).filter(Boolean)).size

  // Daily series, oldest first, one bucket per calendar day in the window.
  const daily = new Map<string, { day: string; sessions: number; pageViews: number; duration: number }>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)
    daily.set(d, { day: d, sessions: 0, pageViews: 0, duration: 0 })
  }
  for (const s of sessions) {
    const bucket = daily.get(s.created_at.slice(0, 10))
    if (!bucket) continue
    bucket.sessions += 1
    bucket.pageViews += s.page_views ?? 0
    bucket.duration += s.duration_seconds ?? 0
  }

  const topPages = tally(visits.map((v) => v.path)).slice(0, 15)

  // Time of day in the visitor's own clock is not available, so buckets are UTC
  // and the HQ UI labels them as such.
  const hourly = new Array(24).fill(0) as number[]
  for (const s of sessions) {
    hourly[new Date(s.created_at).getUTCHours()] += 1
  }

  return NextResponse.json({
    days,
    totals: {
      sessions: sessions.length,
      uniqueVisitors,
      pageViews,
      totalDurationSeconds: totalDuration,
      avgDurationSeconds: sessions.length ? Math.round(totalDuration / sessions.length) : 0,
      medianDurationSeconds: median(durations),
      pagesPerSession: sessions.length ? Number((pageViews / sessions.length).toFixed(2)) : 0,
      leads: 0,
    },
    daily: [...daily.values()],
    referrers: tally(sessions.map((s) => s.referrer_type)).map(([key, value]) => ({ key, value })),
    referrerHosts: tally(sessions.map((s) => s.referrer_host)).slice(0, 10).map(([key, value]) => ({ key, value })),
    campaigns: tally(sessions.map((s) => s.utm_campaign))
      .slice(0, 10)
      .map(([key, value]) => ({ key, value })),
    devices: tally(sessions.map((s) => s.device_type)).map(([key, value]) => ({ key, value })),
    browsers: tally(sessions.map((s) => s.browser)).map(([key, value]) => ({ key, value })),
    operatingSystems: tally(sessions.map((s) => s.os)).map(([key, value]) => ({ key, value })),
    countries: tally(sessions.map((s) => s.country)).slice(0, 15).map(([key, value]) => ({ key, value })),
    regions: tally(sessions.map((s) => s.region)).slice(0, 15).map(([key, value]) => ({ key, value })),
    cities: tally(sessions.map((s) => s.city)).slice(0, 20).map(([key, value]) => ({ key, value })),
    entryPages: tally(sessions.map((s) => s.entry_path)).slice(0, 10).map(([key, value]) => ({ key, value })),
    exitPages: tally(sessions.map((s) => s.exit_path)).slice(0, 10).map(([key, value]) => ({ key, value })),
    topPages: topPages.map(([key, value]) => ({ key, value })),
    hourlyUtc: hourly.map((value, hour) => ({ hour, value })),
  })
}
