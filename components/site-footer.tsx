import Image from 'next/image'
import { Mail, MessageSquare, Phone } from 'lucide-react'
import { contact } from '@/lib/site'

const links = [
  { href: '#about', label: 'Meet Nathanael' },
  { href: '#listings', label: 'Properties' },
  { href: '#areas', label: 'Neighborhoods' },
  { href: '#reviews', label: 'Client stories' },
  { href: '#faq', label: 'Questions' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-foreground/10 bg-ink pb-[calc(5rem+env(safe-area-inset-bottom))] text-ink-foreground lg:pb-0">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <div className="flex flex-col items-center gap-10 py-16 text-center">
          <Image
            src="/images/harbison-logo-crop.png"
            alt="Harbison Standard — Real Estate, Development, Investing"
            width={804}
            height={272}
            className="h-auto w-full max-w-sm"
          />
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="label inline-flex min-h-11 items-center text-ink-foreground/70 transition-colors hover:text-poppy">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col items-center gap-2">
            <a href={contact.phoneHref} className="font-display text-2xl tracking-wide hover:text-poppy">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="break-all text-sm text-ink-foreground/70 hover:text-poppy">
              {contact.email}
            </a>
          </div>
        </div>
        <div className="eyebrow flex flex-col gap-3 border-t border-ink-foreground/15 py-8 text-center text-[0.6875rem] text-ink-foreground/55 md:flex-row md:justify-between md:text-left">
          <span>
            © {new Date().getFullYear()} Harbison Standard · Nathanael Harbison, REALTOR® · DRE #{contact.dre}
          </span>
          <span>Tehachapi · Bakersfield · Kern County, CA</span>
        </div>
      </div>
    </footer>
  )
}

export function ConnectPill() {
  return (
    <div className="fixed bottom-6 left-6 z-40 hidden items-center gap-3 lg:flex">
      <a
        href={contact.phoneHref}
        className="flex size-12 items-center justify-center rounded-full bg-ink text-ink-foreground shadow-lg shadow-ink/25 transition-colors hover:bg-poppy hover:text-ink"
      >
        <Phone className="size-5" aria-hidden="true" />
        <span className="sr-only">Call {contact.phone}</span>
      </a>
      <a href="#contact" className="pill bg-poppy text-ink shadow-lg shadow-ink/25 hover:bg-ink hover:text-ink-foreground">
        {"Let's connect"}
      </a>
    </div>
  )
}

export function MobileActionBar() {
  const actions = [
    { href: contact.phoneHref, label: 'Call', icon: Phone },
    { href: contact.smsHref, label: 'Text', icon: MessageSquare },
    { href: `mailto:${contact.email}`, label: 'Email', icon: Mail },
  ]
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-ink-foreground/20 bg-ink pb-[env(safe-area-inset-bottom)] text-ink-foreground lg:hidden"
    >
      {actions.map(({ href, label, icon: Icon }) => (
        <a key={label} href={href} className="label flex min-h-14 items-center justify-center gap-2 first:bg-poppy first:text-ink">
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </a>
      ))}
    </nav>
  )
}
