import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HQ | Harbison Standard',
  description: 'Internal CRM and site analytics.',
  // The CRM must never appear in search results or be link-previewable.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function HqLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ink text-ink-foreground">{children}</div>
}
