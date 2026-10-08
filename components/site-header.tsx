'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { contact } from '@/lib/site'
import { cn } from '@/lib/utils'

const leftLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/relocate', label: 'Relocate' },
  { href: '/private-sale', label: 'Private Sale' },
]

const menuLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/relocate', label: 'Relocate from LA' },
  { href: '/private-sale', label: 'Private Sale' },
  { href: '/off-market-deals', label: 'Off-Market Deals' },
  { href: '/why-tehachapi', label: 'Why Tehachapi' },
  { href: '/land', label: 'Land' },
  { href: '/about', label: 'Meet Nathanael' },
  { href: '/guides', label: 'Guides' },
  { href: '/contact', label: "Let's connect" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* Skip link. Off-screen until focused, then pinned to the top-left so a
          keyboard user can jump straight past the nav to the page content. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-poppy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:uppercase focus:tracking-widest focus:text-ink"
      >
        Skip to content
      </a>
      <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 text-ink-foreground transition-[background-color,box-shadow] duration-500',
        scrolled || open ? 'bg-ink shadow-lg shadow-ink/20' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-5 py-3 md:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {leftLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="label transition-colors hover:text-poppy">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/" className="shrink-0" aria-label="Harbison Standard, back to top" onClick={() => setOpen(false)}>
          <Image
            src="/images/harbison-logo-crop.webp"
            alt="Harbison Standard — Real Estate, Development, Investing"
            width={1000}
            height={250}
            priority
            className={cn('w-auto transition-[height] duration-500', scrolled ? 'h-11 md:h-12' : 'h-12 md:h-16')}
          />
        </Link>

        <div className="flex items-center justify-end gap-8">
          <Link href="/about" className="label hidden transition-colors hover:text-poppy lg:inline">
            About
          </Link>
          <Link href="/contact" className="label hidden transition-colors hover:text-poppy lg:inline">
            {"Let's connect"}
          </Link>
          <a href={contact.phoneHref} className="label hidden transition-colors hover:text-poppy xl:inline">
            M: {contact.phone}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex size-11 items-center justify-center transition-colors hover:text-poppy"
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <div
        id="site-menu"
        hidden={!open}
        className="h-[calc(100svh-4.25rem)] overflow-y-auto border-t border-ink-foreground/15 bg-ink md:h-[calc(100svh-5.5rem)]"
      >
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-10 md:px-8 lg:grid-cols-2 lg:py-16">
          <nav aria-label="Menu">
            <ul className="flex flex-col">
              {menuLinks.map((l, i) => (
                <li key={l.href} className="rise" style={{ animationDelay: `${i * 50}ms` }}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center border-b border-ink-foreground/10 font-display text-3xl tracking-wide transition-colors hover:text-poppy md:text-4xl"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-6 lg:items-end lg:justify-end lg:text-right">
            <p className="eyebrow text-ink-foreground/60">Call or text</p>
            <a href={contact.phoneHref} className="font-display text-4xl tracking-wide hover:text-poppy">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="break-all text-ink-foreground/80 hover:text-poppy">
              {contact.email}
            </a>
            <p className="eyebrow text-ink-foreground/60">DRE #{contact.dre}</p>
          </div>
        </div>
      </div>
      </header>
    </>
  )
}
