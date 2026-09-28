'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/hq/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not sign in')
      }
      router.replace('/hq/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in')
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <label htmlFor="hq-password" className="label text-ink-foreground/70">
          Password
        </label>
        <input
          id="hq-password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-ink-foreground/25 bg-transparent px-4 py-3 text-base text-ink-foreground outline-none focus-visible:border-poppy focus-visible:ring-2 focus-visible:ring-poppy/30"
        />
      </div>

      {error && (
        <p role="alert" className="border border-poppy/50 px-4 py-3 text-sm text-poppy">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="pill w-full justify-center bg-poppy text-ink hover:bg-ink-foreground disabled:opacity-60"
      >
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Checking…
          </>
        ) : (
          <>
            Sign in <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}
