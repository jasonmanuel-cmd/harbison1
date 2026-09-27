'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { formatPrice, listings, type Listing } from '@/lib/site'
import { cn } from '@/lib/utils'

const filters = ['All', 'Tehachapi', 'Bakersfield', 'Land'] as const
type Filter = (typeof filters)[number]

const sorts = {
  'price-desc': { label: 'Price: high to low', fn: (a: Listing, b: Listing) => b.price - a.price },
  'price-asc': { label: 'Price: low to high', fn: (a: Listing, b: Listing) => a.price - b.price },
  'sqft-desc': { label: 'Largest homes', fn: (a: Listing, b: Listing) => (b.sqft ?? 0) - (a.sqft ?? 0) },
}
type SortKey = keyof typeof sorts

function matches(l: Listing, f: Filter) {
  if (f === 'All') return true
  if (f === 'Land') return !l.beds
  return l.city === f
}

export function Listings() {
  const [filter, setFilter] = useState<Filter>('All')
  const [sort, setSort] = useState<SortKey>('price-desc')

  const visible = useMemo(
    () => listings.filter((l) => matches(l, filter)).sort(sorts[sort].fn),
    [filter, sort],
  )

  return (
    <section id="listings" aria-labelledby="listings-heading" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Available now</p>
            <h2 id="listings-heading" className="mt-3 text-4xl font-medium text-balance md:text-6xl">
              Find your next property.
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div role="group" aria-label="Filter listings" className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const count = listings.filter((l) => matches(l, f)).length
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                      filter === f
                        ? 'border-ink bg-ink text-ink-foreground'
                        : 'border-border bg-card text-foreground hover:border-foreground/40',
                    )}
                  >
                    {f} <span className="opacity-60">{count}</span>
                  </button>
                )
              })}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only">Sort listings</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                {Object.entries(sorts).map(([key, s]) => (
                  <option key={key} value={key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? 'property' : 'properties'}
        </p>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((l) => (
            <li key={l.slug}>
              <ListingCard listing={l} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ListingCard({ listing: l }: { listing: Listing }) {
  const facts = [
    l.beds && `${l.beds} bd`,
    l.baths && `${l.baths} ba`,
    l.sqft && `${l.sqft.toLocaleString()} sqft`,
    l.lot,
  ].filter(Boolean)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card">
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <Image
          src={l.image}
          alt={`${l.address}, ${l.city}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-foreground">
          Available
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-serif text-3xl">{formatPrice(l.price)}</p>
        <h3 className="mt-1 font-sans text-base font-semibold">{l.address}</h3>
        <p className="text-sm text-muted-foreground">
          {l.neighborhood ? `${l.neighborhood} · ` : ''}
          {l.city}, CA {l.zip}
        </p>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{l.blurb}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs font-medium text-foreground/80">{facts.join(' · ')}</p>
          <a
            href={`mailto:nate85.realtor@gmail.com?subject=${encodeURIComponent(`Showing request: ${l.address}`)}`}
            className="shrink-0 text-sm font-semibold underline decoration-brass underline-offset-4"
          >
            Ask<span className="sr-only"> about {l.address}</span>
          </a>
        </div>
      </div>
    </article>
  )
}
