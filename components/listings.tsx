'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPrice, listings, type Listing } from '@/lib/site'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const INTERVAL = 7000
const pad = (n: number) => String(n).padStart(2, '0')

function facts(l: Listing) {
  const parts = [l.beds ? `${l.beds} Beds` : null, l.baths ? `${l.baths} Baths` : null]
  parts.push(l.sqft ? `${l.sqft.toLocaleString('en-US')} Sq Ft` : (l.lot ?? null))
  return parts.filter(Boolean).join('  ·  ')
}

export function Listings() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const stripRef = useRef<HTMLUListElement>(null)
  const total = listings.length
  const l = listings[current]

  const go = (delta: number) => setCurrent((v) => (v + delta + total) % total)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setCurrent((v) => (v + 1) % total), INTERVAL)
    return () => clearTimeout(t)
  }, [current, paused, total])

  useEffect(() => {
    const strip = stripRef.current
    const item = strip?.children[current] as HTMLElement | undefined
    if (!strip || !item) return
    strip.scrollTo({ left: item.offsetLeft - strip.offsetLeft - 20, behavior: 'smooth' })
  }, [current])

  return (
    <section id="listings" aria-labelledby="listings-heading" className="scroll-mt-16 bg-background pt-24 md:pt-32">
      <Reveal className="mx-auto max-w-[90rem] px-5 text-center md:px-8">
        <p className="eyebrow text-muted-foreground">Tehachapi & Bakersfield</p>
        <h2 id="listings-heading" className="mt-5 text-4xl font-medium tracking-wide text-balance md:text-6xl">
          Property Collection
        </h2>
      </Reveal>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured properties"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative mt-14 h-[78svh] min-h-[32rem] overflow-hidden bg-ink text-ink-foreground md:mt-16"
      >
        {listings.map((item, i) => (
          <div
            key={item.slug}
            aria-hidden={i !== current}
            className={cn(
              'absolute inset-0 transition-opacity duration-[1400ms] ease-in-out',
              i === current ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Image
              src={item.image}
              alt={`${item.address}, ${item.city}, CA`}
              fill
              sizes="100vw"
              loading={i < 2 ? 'eager' : 'lazy'}
              className="kenburns object-cover"
              style={{ '--kx': i % 2 ? '2%' : '-2%', '--ky': i % 3 ? '-1.5%' : '1.5%', '--kd': '16s' } as CSSProperties}
            />
          </div>
        ))}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/10" />

        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[90rem] flex-col gap-8 px-5 pb-10 md:px-8 md:pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div key={l.slug} className="rise max-w-3xl" aria-live="polite">
            <p className="eyebrow text-poppy">{l.neighborhood ?? `${l.city}, CA`}</p>
            <h3 className="mt-3 text-4xl font-medium tracking-wide text-balance md:text-6xl">{l.address}</h3>
            <p className="mt-3 text-ink-foreground/85">
              {l.city}, CA {l.zip}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="font-display text-2xl tracking-wide md:text-3xl">{formatPrice(l.price)}</span>
              <span className="label text-ink-foreground/80">{facts(l)}</span>
            </div>
            <p className="mt-4 hidden max-w-xl text-sm leading-relaxed text-ink-foreground/75 md:block">{l.blurb}</p>
          </div>

          <div className="flex items-center gap-4 self-start lg:self-end">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex size-12 items-center justify-center rounded-full border border-ink-foreground/50 transition-colors hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
              <span className="sr-only">Previous property</span>
            </button>
            <span className="label min-w-20 text-center tabular-nums">
              {pad(current + 1)} <span className="text-ink-foreground/60">|</span> {pad(total)}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex size-12 items-center justify-center rounded-full border border-ink-foreground/50 transition-colors hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
              <span className="sr-only">Next property</span>
            </button>
          </div>
        </div>

        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-ink-foreground/15">
          {!paused && (
            <span
              key={current}
              className="progress block h-full w-full bg-poppy"
              style={{ '--pd': `${INTERVAL}ms` } as CSSProperties}
            />
          )}
        </span>
      </div>

      <div className="mx-auto max-w-[90rem] py-10 md:py-12">
        <ul ref={stripRef} className="flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:px-8" aria-label="All properties">
          {listings.map((item, i) => (
            <li key={item.slug} className="w-56 shrink-0 snap-start md:w-64">
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-current={i === current}
                className="group flex w-full flex-col text-left"
              >
                <span
                  className={cn(
                    'relative block aspect-[4/3] overflow-hidden bg-muted ring-2 ring-offset-2 transition-shadow',
                    i === current ? 'ring-poppy' : 'ring-transparent',
                  )}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="256px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="mt-3 truncate font-display text-lg tracking-wide">{item.address}</span>
                <span className="label text-muted-foreground">
                  {item.city} · {formatPrice(item.price)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center px-5">
          <a href="#contact" className="pill bg-ink text-ink-foreground hover:bg-poppy hover:text-ink">
            Ask about a property
          </a>
        </div>
      </div>
    </section>
  )
}
