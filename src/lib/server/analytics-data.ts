// A session is counted only when a matching, public page-view record exists.
// The trusted collector reserves canonical absolute URLs for Call Harbison.
export function recordedTraffic<
  S extends { session_id: string; entry_path: string | null; device_type: string | null },
  V extends { session_id: string; path: string }
>(rawSessions: S[], rawVisits: V[], site: string) {
  const prefix = 'https://www.callharbison.com/'
  const belongs = (path: string | null) => site === 'call_harbison' ? Boolean(path?.startsWith(prefix)) : !path || path.startsWith('/') && !path.startsWith('//')
  const publicPath = (path: string | null) => !/^\/(hq|api)(\/|$)/.test((path || '/').replace('https://www.callharbison.com', ''))
  let sessions = rawSessions.filter(s => s.device_type !== 'bot' && belongs(s.entry_path) && publicPath(s.entry_path))
  const ids = new Set(sessions.map(s => s.session_id))
  const visits = rawVisits.filter(v => ids.has(v.session_id) && belongs(v.path) && publicPath(v.path))
  const viewed = new Set(visits.map(v => v.session_id))
  sessions = sessions.filter(s => viewed.has(s.session_id))
  return { sessions, visits }
}
