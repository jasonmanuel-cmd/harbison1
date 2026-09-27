import Image from 'next/image'
import { Mail, MessageSquare, Phone } from 'lucide-react'
import { contact } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="bg-ink pb-20 text-ink-foreground lg:pb-0">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <div className="flex justify-center py-12">
          <Image
            src="/images/harbison-logo-crop.png"
            alt="Harbison Standard — Real Estate, Development, Investing"
            width={804}
            height={272}
            className="h-auto w-full max-w-md"
          />
        </div>
        <div className="label flex flex-col gap-4 border-t border-ink-foreground/20 py-8 text-ink-foreground/60 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Harbison Standard · Nathanael Harbison, REALTOR® · DRE #{contact.dre}</span>
          <span>Tehachapi · Bakersfield · Kern County, CA</span>
        </div>
      </div>
    </footer>
  )
}

export function MobileActionBar() {
  const actions = [
    { href: contact.phoneHref, label: 'Call', icon: Phone },
    { href: contact.smsHref, label: 'Text', icon: MessageSquare },
    { href: `mailto:${contact.email}`, label: 'Email', icon: Mail },
  ]
  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-ink-foreground/20 bg-ink text-ink-foreground lg:hidden">
      {actions.map(({ href, label, icon: Icon }) => (
        <a key={label} href={href} className="label flex items-center justify-center gap-2 py-4 first:bg-poppy first:text-ink">
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </a>
      ))}
    </nav>
  )
}
