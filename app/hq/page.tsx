import { redirect } from 'next/navigation'

import { isAuthenticated, hqConfigured } from '@/lib/hq-auth'

import { LoginForm } from './login-form'

// Must be dynamic: the page reads HQ_PASSWORD and the auth cookie at request
// time. Prerendering it at build time would bake in "not configured" and could
// leak a login screen to anyone.
export const dynamic = 'force-dynamic'

export default async function HqPage() {
  if (await isAuthenticated()) {
    redirect('/hq/dashboard')
  }

  if (!hqConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md border border-ink-foreground/20 p-8">
          <h1 className="font-display text-2xl">HQ is not set up</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">
            The admin area is disabled because no password has been configured on the server. Set{' '}
            <code className="bg-ink-foreground/10 px-1.5 py-0.5 text-xs">HQ_PASSWORD</code> and{' '}
            <code className="bg-ink-foreground/10 px-1.5 py-0.5 text-xs">HQ_SECRET</code> in the deployment
            environment, then redeploy.
          </p>
          <p className="mt-4 text-sm text-ink-foreground/60">
            The public site is unaffected and all lead forms still work.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="label text-poppy">Harbison Standard</p>
        <h1 className="mt-2 font-display text-3xl tracking-wide">HQ</h1>
        <p className="mt-2 text-sm text-ink-foreground/60">Leads and site analytics.</p>
        <LoginForm />
      </div>
    </main>
  )
}
