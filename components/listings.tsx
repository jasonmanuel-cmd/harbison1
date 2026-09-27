'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { formatPrice, listings, type City, type Listing } from '@/lib/site'
import { cn } from '@/lib/utils'

type Filter = 'All' | City
const filters: Filter[] = ['All', 'Tehachapi', 'Bakersfield']

const columns = 'lg:grid-cols-[3.5rem_minmax(0,1fr)_10rem_7rem_13rem_9rem_1.5rem]'

function bedBath(l: Listing) {
  return l.beds ? `${l.beds} bd / ${l.baths} ba` : 'Land'
}

function footprint(l: Listing) {
  return l.sqft ? `${l.sqft.toLocaleString('en-US')} sf · ${l.lot}` : l.lot
}

export function Listings() {
  const [filter, setFilter] = useState<Filter>('All')
  const [active, setActive] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const rows = filter === 'All' ? listings : listings.filter((l) => l.city === filter)

  function followPointer(e: React.MouseEvent) {
    const el = previewRef.current
    if (!el) return
    el.style.transform = `translate3d(${e.clientX + 28}px, ${e.clientY - 120}px, 0)`
  }

  return (
    <section id="listings" aria-labelledby="listings-heading" className="border-t border-ink py-20 md:py-28">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-muted-foreground">Current &amp; recent listings</p>
            <h2
              id="listings-heading"
              className="wide mt-3 text-5xl font-extrabold uppercase leading-none tracking-tight md:text-8xl"
            >
              The Register
            </h2>
          </div>
          <div role="group" aria-label="Filter by city" className="flex self-start border border-ink lg:self-auto">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'label px-4 py-3 transition-colors',
                  filter === f ? 'bg-poppy text-ink' : 'hover:bg-secondary',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className={cn('label mt-14 hidden gap-6 border-b border-ink pb-3 text-muted-foreground lg:grid', columns)}
        >
          <span>No.</span>
          <span>Address</span>
          <span>City</span>
          <span>Bd / Ba</span>
          <span>Interior / Lot</span>
          <span className="text-right">Price</span>
          <span />
        </div>

        <ol
          onMouseMove={followPointer}
          onMouseLeave={() => setActive(null)}
          className="mt-10 border-t border-ink lg:mt-0 lg:border-t-0"
        >
          {rows.map((l, i) => (
            <li key={l.slug} onMouseEnter={() => setActive(l.slug)} className="border-b border-border">
              <a
                href="#contact"
                className={cn(
                  'group grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-5 lg:items-center lg:gap-6 lg:py-6',
                  columns,
                )}
              >
                <span className="relative row-span-3 aspect-square overflow-hidden bg-muted lg:hidden">
                  <Image src={l.image} alt="" fill sizes="88px" className="object-cover" />
                </span>
                <span className="label hidden text-muted-foreground lg:block">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="wide block truncate text-lg font-bold uppercase tracking-tight transition-colors md:text-2xl lg:group-hover:text-poppy">
                    {l.address}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {l.neighborhood ?? `${l.city}, CA ${l.zip}`}
                  </span>
                </span>
                <span className="hidden text-sm lg:block">
                  {l.city}, {l.zip}
                </span>
                <span className="label hidden lg:block">{bedBath(l)}</span>
                <span className="label hidden text-muted-foreground lg:block">{footprint(l)}</span>
                <span className="label col-start-2 text-muted-foreground lg:hidden">
                  {l.city} · {bedBath(l)}
                </span>
                <span className="wide col-start-2 text-lg font-bold tracking-tight lg:col-start-auto lg:text-right lg:text-xl">
                  {formatPrice(l.price)}
                </span>
                <ArrowUpRight
                  className="hidden size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 lg:block"
                  aria-hidden="true"
                />
                <span className="sr-only">Ask Nathanael about {l.address}</span>
              </a>
            </li>
          ))}
        </ol>

        <p className="label mt-8 text-muted-foreground">Select any property to ask about availability or a showing.</p>
      </div>

      <div
        ref={previewRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-50 hidden aspect-[4/3] w-80 overflow-hidden bg-muted shadow-2xl transition-opacity duration-200 lg:block',
          active ? 'opacity-100' : 'opacity-0',
        )}
      >
        {listings.map((l) => (
          <Image
            key={l.slug}
            src={l.image}
            alt=""
            fill
            sizes="320px"
            loading="eager"
            className={cn('object-cover transition-opacity duration-300', active === l.slug ? 'opacity-100' : 'opacity-0')}
          />
        ))}
      </div>
    </section>
  )
}
