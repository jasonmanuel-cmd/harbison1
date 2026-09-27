import Image from 'next/image'
import { contact } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="bg-ink pb-24 text-ink-foreground md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <Image src="/images/logo-500.webp" alt="Harbison Standard" width={500} height={130} className="h-12 w-auto" />
          <p className="mt-4 text-sm text-ink-foreground/60">Bakersfield · Tehachapi · Kern County</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-right">
          <a href={contact.phoneHref} className="hover:text-brass">{contact.phone}</a>
          <a href={`mailto:${contact.email}`} className="hover:text-brass">{contact.email}</a>
          <div className="mt-2 flex gap-5 md:justify-end">
            <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="text-ink-foreground/70 hover:text-brass">YouTube</a>
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-ink-foreground/70 hover:text-brass">Instagram</a>
            <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="text-ink-foreground/70 hover:text-brass">Facebook</a>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-ink-foreground/50 md:px-8">
          Nathanael Harbison · REALTOR® · Harbison Standard · DRE #{contact.dre} · Equal Housing Opportunity
        </p>
      </div>
    </footer>
  )
}

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink-foreground/10 bg-ink p-3 md:hidden">
      <a href={contact.phoneHref} className="flex-1 rounded-sm border border-ink-foreground/25 py-3 text-center text-sm font-semibold text-ink-foreground">
        Call
      </a>
      <a href={contact.smsHref} className="flex-1 rounded-sm border border-ink-foreground/25 py-3 text-center text-sm font-semibold text-ink-foreground">
        Text
      </a>
      <a href="#contact" className="flex-[1.4] rounded-sm bg-brass py-3 text-center text-sm font-semibold text-ink">
        Get started
      </a>
    </div>
  )
}
