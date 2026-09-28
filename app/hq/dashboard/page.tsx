import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/lib/hq-auth'

import { Dashboard } from './dashboard'

export const dynamic = 'force-dynamic'

export default async function HqDashboardPage() {
  // Guarded on the server as well as in the API, so the page shell never renders
  // for an unauthenticated request.
  if (!(await isAuthenticated())) {
    redirect('/hq')
  }
  return <Dashboard />
}
