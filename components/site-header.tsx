import Image from 'next/image'
import { Phone } from 'lucide-react'
import { contact } from '@/lib/site'

const links = [
  { href: '#listings', label: 'Listings' },
  { href: '#services', label: 'Services' },
  { href: '#areas', label: 'Areas' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-5 py-3 md:px-8">
        <a href="#top" className="shrink-0" aria-label="Harbison Standard, back to top">
          <Image
            src="/images/harbison-logo-crop.png"
            alt="Harbison Standard — Real Estate, Development, Investing"
            width={804}
            height={272}
            priority
            className="h-12 w-auto md:h-14"
          />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="label underline-offset-8 hover:underline hover:decoration-poppy hover:decoration-2">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={contact.phoneHref}
          className="label flex items-center gap-2 bg-poppy px-4 py-3 text-ink transition-colors hover:bg-ink hover:text-ink-foreground"
        >
          <Phone className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{contact.phone}</span>
          <span className="sm:hidden">Call</span>
        </a>
      </div>
    </header>
  )
}
