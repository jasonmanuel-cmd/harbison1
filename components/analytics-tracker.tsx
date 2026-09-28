'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { initAnalytics, trackPageView } from '@/lib/analytics'

/**
 * Mounted once in the root layout. Fires on every route change and flushes the
 * accumulated session on tab close or hide.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()
  // Admin views would pollute the visitor data, so HQ is never tracked.
  const isAdmin = pathname?.startsWith('/hq') ?? false

  useEffect(() => {
    if (!isAdmin) initAnalytics()
  }, [isAdmin])

  useEffect(() => {
    if (!isAdmin) trackPageView(document.title)
  }, [pathname, isAdmin])

  return null
}
