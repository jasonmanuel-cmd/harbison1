'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Menu, Phone, X } from 'lucide-react'
import { contact } from '@/lib/site'
import { cn } from '@/lib/utils'

const nav = [
  { href: '#listings', label: 'Listings' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open ? 'bg-ink/95 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#top" aria-label="Harbison Standard home" className="shrink-0">
          <Image
            src="/images/logo-500.webp"
            alt="Harbison Standard — Real Estate, Development, Investing"
            width={500}
            height={130}
            priority
            className="h-10 w-auto md:h-12"
          />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide text-ink-foreground/80 transition-colors hover:text-brass"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={contact.phoneHref}
            className="hidden items-center gap-2 text-sm font-medium text-ink-foreground md:flex"
          >
            <Phone className="size-4 text-brass" aria-hidden="true" />
            {contact.phone}
          </a>
          <a
            href="#contact"
            className="hidden rounded-sm bg-brass px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Start a conversation
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex size-10 items-center justify-center rounded-sm text-ink-foreground lg:hidden"
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-ink-foreground/10 lg:hidden">
          <ul className="flex flex-col px-5 py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-serif text-2xl text-ink-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="flex gap-3 pt-4">
              <a
                href={contact.phoneHref}
                className="flex-1 rounded-sm border border-ink-foreground/20 py-3 text-center text-sm font-semibold text-ink-foreground"
              >
                Call
              </a>
              <a
                href={contact.smsHref}
                className="flex-1 rounded-sm bg-brass py-3 text-center text-sm font-semibold text-ink"
              >
                Text Nathanael
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
