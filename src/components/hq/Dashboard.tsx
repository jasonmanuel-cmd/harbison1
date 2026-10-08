import { useCallback, useEffect, useMemo, useState } from 'react'
import { LogOut, RefreshCw, ExternalLink } from 'lucide-react'

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ')

// ---------------------------------------------------------------- types

type Lead = {
  id: string
  created_at: string
  name: string | null
  email: string | null
  phone: string | null
  goal: string | null
  interest: string | null
  current_city: string | null
  desired_area: string | null
  budget: string | null
  bedrooms: number | null
  acreage_requirement: string | null
  property_type: string | null
  timeline: string | null
  financing_status: string | null
  age_range: string | null
  status: string
  notes: string | null
  source: string | null
  message: string | null
}

type Bucket = { key: string; value: number }
type Day = { day: string; sessions: number; pageViews: number; duration: number }

type Analytics = {
  days: number
  totals: {
    sessions: number
    uniqueVisitors: number
    pageViews: number
    totalDurationSeconds: number
    avgDurationSeconds: number
    medianDurationSeconds: number
    pagesPerSession: number
  }
  daily: Day[]
  referrers: Bucket[]
  referrerHosts: Bucket[]
  campaigns: Bucket[]
  devices: Bucket[]
  browsers: Bucket[]
  operatingSystems: Bucket[]
  countries: Bucket[]
  regions: Bucket[]
  cities: Bucket[]
  entryPages: Bucket[]
  exitPages: Bucket[]
  topPages: Bucket[]
  hourlyUtc: Array<{ hour: number; value: number }>
}

const STATUSES = ['new', 'contacted', 'qualified', 'closed'] as const

// ---------------------------------------------------------------- helpers

function fmtDuration(seconds: number): string {
  if (!seconds) return '0s'
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// ---------------------------------------------------------------- chrome

function Card({
  title,
  hint,
  children,
  className,
}: {
  title: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('border border-ink-foreground/15 bg-ink-foreground/[0.02] p-5', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-sm uppercase tracking-[0.18em] text-ink-foreground/70">{title}</h2>
        {hint && <span className="text-xs text-ink-foreground/60">{hint}</span>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-ink-foreground/15 bg-ink-foreground/[0.02] p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-ink-foreground/60">{label}</p>
      <p className="mt-2 font-display text-3xl leading-none text-ink-foreground">{value}</p>
      {sub && <p className="mt-2 text-xs text-ink-foreground/60">{sub}</p>}
    </div>
  )
}

function BarList({ items, empty = 'No data yet' }: { items: Bucket[]; empty?: string }) {
  if (items.length === 0) return <p className="text-sm text-ink-foreground/60">{empty}</p>
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.key} className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm">
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-ink-foreground/85">{item.key}</span>
            </div>
            <div className="mt-1 h-1.5 w-full bg-ink-foreground/10">
              <div
                className="h-full bg-poppy/70"
                style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
              />
            </div>
          </div>
          <span className="tabular-nums text-ink-foreground/65">{item.value}</span>
        </li>
      ))}
    </ul>
  )
}

function TrafficChart({ daily }: { daily: Day[] }) {
  if (daily.length === 0) return <p className="text-sm text-ink-foreground/60">No data yet</p>
  const max = Math.max(...daily.map((d) => d.sessions), 1)
  return (
    <div>
      <div className="flex h-32 items-end gap-[2px]" role="img" aria-label="Sessions per day">
        {daily.map((d) => (
          <div
            key={d.day}
            title={`${d.day}: ${d.sessions} sessions, ${d.pageViews} page views, ${fmtDuration(d.duration)}`}
            className="flex-1 bg-poppy/60 transition-colors hover:bg-poppy"
            style={{ height: `${Math.max((d.sessions / max) * 100, 1)}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-ink-foreground/60">
        <span>{daily[0]?.day}</span>
        <span>{daily[daily.length - 1]?.day}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- leads

function LeadsPanel({ reloadKey, onSaved }: { reloadKey: number; onSaved: () => void }) {
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/hq/leads', { cache: 'no-store' })
      if (!res.ok) throw new Error(`Could not load leads (${res.status})`)
      const data = await res.json()
      setLeads(data.leads ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load leads')
      setLeads([])
    }
  }, [])

  // Reloads on mount and whenever the dashboard's refresh button is pressed.
  useEffect(() => {
    void load()
  }, [load, reloadKey])

  async function setStatus(lead: Lead, status: string) {
    setSavingId(lead.id)
    try {
      const res = await fetch('/api/hq/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status }),
      })
      if (!res.ok) throw new Error('Update failed')
      setLeads((current) =>
        current ? current.map((l) => (l.id === lead.id ? { ...l, status } : l)) : current,
      )
    } catch {
      setError('Could not update that lead. Reload and try again.')
    } finally {
      setSavingId(null)
    }
  }

  async function saveNotes(lead: Lead, notes: string) {
    setSavingId(lead.id)
    try {
      const res = await fetch('/api/hq/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, notes }),
      })
      if (!res.ok) throw new Error('Save failed')
      onSaved()
    } catch {
      setError('Could not save those notes.')
    } finally {
      setSavingId(null)
    }
  }

  const shown = useMemo(() => {
    if (!leads) return []
    return filter === 'all' ? leads : leads.filter((l) => l.status === filter)
  }, [leads, filter])

  if (error && !leads) {
    return <p className="text-sm text-poppy">{error}</p>
  }
  if (leads === null) {
    return <p className="text-sm text-ink-foreground/60">Loading leads…</p>
  }
  if (leads.length === 0) {
    return (
      <p className="text-sm text-ink-foreground/60">
        No leads yet. They appear here the moment someone submits a form on the site — and each one is also
        emailed, so nothing is trapped in this dashboard.
      </p>
    )
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-poppy">{error}</p>}

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              'px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors',
              filter === s
                ? 'bg-poppy text-ink'
                : 'border border-ink-foreground/20 text-ink-foreground/60 hover:border-ink-foreground/40',
            )}
          >
            {s}
            {s !== 'all' && ` (${leads.filter((l) => l.status === s).length})`}
          </button>
        ))}
      </div>

      <ul className="flex flex-col divide-y divide-ink-foreground/10 border border-ink-foreground/15">
        {shown.map((lead) => {
          const isOpen = expanded === lead.id
          return (
            <li key={lead.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-base text-ink-foreground">
                    {lead.name || 'Unnamed'}
                    {lead.goal && <span className="ml-2 text-xs text-poppy">{lead.goal}</span>}
                  </p>
                  <p className="mt-1 text-sm text-ink-foreground/60">
                    {fmtDate(lead.created_at)}
                    {lead.interest && ` · ${lead.interest}`}
                    {lead.desired_area && ` · ${lead.desired_area}`}
                  </p>
                  <p className="mt-1 text-sm">
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="text-ink-foreground/70 underline underline-offset-4 hover:text-poppy">
                        {lead.email}
                      </a>
                    )}
                    {lead.phone && (
                      <>
                        {' · '}
                        <a href={`tel:${lead.phone}`} className="text-ink-foreground/70 underline underline-offset-4 hover:text-poppy">
                          {lead.phone}
                        </a>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`status-${lead.id}`}>
                    Status for {lead.name}
                  </label>
                  <select
                    id={`status-${lead.id}`}
                    value={lead.status}
                    disabled={savingId === lead.id}
                    onChange={(e) => void setStatus(lead, e.target.value)}
                    className="appearance-none border border-ink-foreground/20 bg-transparent px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-ink-foreground/80 outline-none focus-visible:border-poppy disabled:opacity-50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : lead.id)}
                    className="border border-ink-foreground/20 px-3 py-1.5 text-xs text-ink-foreground/70 hover:border-ink-foreground/40"
                  >
                    {isOpen ? 'Less' : 'Details'}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="mt-4 border-l-2 border-ink-foreground/15 pl-4">
                  <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                    {(
                      [
                        ['Budget', lead.budget],
                        ['Bedrooms', lead.bedrooms ? `${lead.bedrooms}+` : null],
                        ['Property type', lead.property_type],
                        ['Acreage', lead.acreage_requirement],
                        ['Timeline', lead.timeline],
                        ['Financing', lead.financing_status],
                        ['Current city', lead.current_city],
                        ['Age range', lead.age_range],
                        ['Source', lead.source],
                      ] as Array<[string, string | number | null]>
                    )
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3 sm:col-span-1">
                          <dt className="text-ink-foreground/60">{k}</dt>
                          <dd className="text-right text-ink-foreground/85">{v}</dd>
                        </div>
                      ))}
                  </dl>

                  {lead.message && (
                    <p className="mt-3 whitespace-pre-wrap border border-ink-foreground/15 bg-ink-foreground/[0.03] p-3 text-sm leading-relaxed text-ink-foreground/80">
                      {lead.message}
                    </p>
                  )}

                  <label
                    htmlFor={`notes-${lead.id}`}
                    className="mt-4 block text-xs uppercase tracking-[0.14em] text-ink-foreground/60"
                  >
                    Internal notes
                  </label>
                  <textarea
                    id={`notes-${lead.id}`}
                    rows={3}
                    defaultValue={lead.notes ?? ''}
                    onBlur={(e) => {
                      if (e.target.value !== (lead.notes ?? '')) void saveNotes(lead, e.target.value)
                    }}
                    className="mt-2 w-full border border-ink-foreground/20 bg-transparent px-3 py-2 text-sm text-ink-foreground outline-none focus-visible:border-poppy"
                  />
                  <p className="mt-1 text-xs text-ink-foreground/60">
                    {savingId === lead.id ? 'Saving…' : 'Saved automatically when you click away.'}
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------- dashboard

export default function Dashboard() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState<Analytics | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  // Bumped by the refresh button so the leads panel reloads along with the analytics.
  const [reloadKey, setReloadKey] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/hq/analytics?days=${days}`, { cache: 'no-store' })
      if (res.status === 401) {
        window.location.replace('/hq')
        return
      }
      if (!res.ok) throw new Error(`Analytics unavailable (${res.status})`)
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analytics unavailable')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    void load()
  }, [load])

  async function signOut() {
    await fetch('/api/hq/logout', { method: 'POST' })
    window.location.replace('/hq')
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-ink-foreground/15 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="label text-poppy">Harbison Standard</p>
            <h1 className="font-display text-xl tracking-wide">HQ</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border border-ink-foreground/20">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={cn(
                    'px-3 py-1.5 text-xs uppercase tracking-[0.14em]',
                    days === d ? 'bg-poppy text-ink' : 'text-ink-foreground/60 hover:text-ink-foreground',
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setReloadKey((k) => k + 1)
                void load()
              }}
              className="border border-ink-foreground/20 p-2 text-ink-foreground/60 hover:border-ink-foreground/40"
              aria-label="Refresh"
            >
              <RefreshCw className={cn('size-4', loading && 'animate-spin')} aria-hidden="true" />
            </button>
            <a
              href="/"
              className="border border-ink-foreground/20 p-2 text-ink-foreground/60 hover:border-ink-foreground/40"
              aria-label="View public site"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => void signOut()}
              className="border border-ink-foreground/20 p-2 text-ink-foreground/60 hover:border-ink-foreground/40"
              aria-label="Sign out"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-8">
          <h2 className="font-display text-lg uppercase tracking-[0.18em] text-ink-foreground/70">Leads</h2>
          <div className="mt-4">
            <LeadsPanel reloadKey={reloadKey} onSaved={() => void load()} />
          </div>
        </section>

        <h2 className="mb-4 font-display text-lg uppercase tracking-[0.18em] text-ink-foreground/70">
          Site analytics
        </h2>

        {error && <p className="border border-poppy/50 px-4 py-3 text-sm text-poppy">{error}</p>}

        {!error && !data && loading && <p className="text-sm text-ink-foreground/60">Loading analytics…</p>}

        {data && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Sessions" value={data.totals.sessions.toLocaleString()} sub={`Last ${days} days`} />
              <Stat
                label="Unique visitors"
                value={data.totals.uniqueVisitors.toLocaleString()}
                sub="Daily-rotating hash, no IP stored"
              />
              <Stat
                label="Avg time on site"
                value={fmtDuration(data.totals.avgDurationSeconds)}
                sub={`Median ${fmtDuration(data.totals.medianDurationSeconds)}`}
              />
              <Stat
                label="Pages per session"
                value={data.totals.pagesPerSession.toFixed(2)}
                sub={`${data.totals.pageViews.toLocaleString()} page views`}
              />
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <Card title="Traffic" hint="Sessions per day" className="lg:col-span-2">
                <TrafficChart daily={data.daily} />
              </Card>
              <Card title="By hour" hint="UTC">
                <BarList items={data.hourlyUtc.map((h) => ({ key: `${h.hour}:00`, value: h.value }))} />
              </Card>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <Card title="How they arrived">
                <BarList items={data.referrers} />
              </Card>
              <Card title="Top referring sites">
                <BarList items={data.referrerHosts} />
              </Card>
              <Card title="Campaigns" hint="UTM">
                <BarList items={data.campaigns} empty="No tagged campaigns yet" />
              </Card>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <Card title="Countries">
                <BarList items={data.countries} />
              </Card>
              <Card title="States / regions">
                <BarList items={data.regions} />
              </Card>
              <Card title="Cities">
                <BarList items={data.cities} />
              </Card>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <Card title="Devices">
                <BarList items={data.devices} />
              </Card>
              <Card title="Browsers">
                <BarList items={data.browsers} />
              </Card>
              <Card title="Operating systems">
                <BarList items={data.operatingSystems} />
              </Card>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <Card title="Most viewed pages">
                <BarList items={data.topPages} />
              </Card>
              <Card title="Entry pages">
                <BarList items={data.entryPages} />
              </Card>
              <Card title="Exit pages">
                <BarList items={data.exitPages} />
              </Card>
            </div>
          </>
        )}

        <footer className="mt-12 border-t border-ink-foreground/10 pt-6 text-xs leading-relaxed text-ink-foreground/35">
          <p>
            First-party analytics. No cookies, no Google Analytics, no cross-site tracking. Raw IP addresses are
            never stored — repeat visitors are counted with a salted hash that rotates every day. Visitors who
            enable Do Not Track or Global Privacy Control, or who opt out, are not recorded. Age is never
            inferred; the only age data stored is what a visitor voluntarily selects on the contact form.
          </p>
        </footer>
      </main>
    </div>
  )
}
