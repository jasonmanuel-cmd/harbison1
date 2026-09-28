import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPrice, listings, soldListings } from '@/lib/site'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Properties | Harbison Standard',
  description:
    'Explore current listings across Tehachapi, Bakersfield, and Kern County with Nathanael Harbison, REALTOR® DRE #02059393.',
}

function PropertyCard({ p, i }: { p: (typeof listings)[number]; i: number }) {
  return (
    <Reveal delay={(i % 3) * 100}>
      <li>
        <Link
          href={`/property/${p.slug}`}
          className="group flex flex-col overflow-hidden bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={`${p.address}, ${p.city}, CA`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute left-4 top-4 bg-ink/85 px-3 py-1 text-xs font-semibold tracking-widest text-ink-foreground uppercase">
              {p.status}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl tracking-wide">{p.address}</h3>
              <span className="font-display text-lg text-poppy">{formatPrice(p.price)}</span>
            </div>
            <p className="label text-muted-foreground">
              {p.neighborhood ? `${p.neighborhood} · ` : ''}
              {p.city}, CA {p.zip}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
            <div className="mt-auto flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-4 text-sm text-muted-foreground">
              {p.beds !== undefined && <span>{p.beds} beds</span>}
              {p.baths !== undefined && <span>{p.baths} baths</span>}
              {p.sqft !== undefined && <span>{p.sqft.toLocaleString('en-US')} sq ft</span>}
              {p.lot && <span>{p.lot}</span>}
            </div>
          </div>
        </Link>
      </li>
    </Reveal>
  )
}

export default function PropertiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Tehachapi · Bakersfield · Kern County"
        title="Current Listings"
        intro="Explore every current listing, with photos, price, and property details. Select a property to see more or ask about a showing."
        image="/images/property/2300-weybridge-dr-1.jpg"
      />

      <section className="bg-background py-16 md:py-24" aria-label="All properties">
        <div className="mx-auto max-w-[90rem] px-5 md:px-8">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((p, i) => (
              <PropertyCard key={p.slug} p={p} i={i} />
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-secondary py-16 md:py-24" aria-label="Past transactions">
        <div className="mx-auto max-w-[90rem] px-5 md:px-8">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-muted-foreground">Past transactions</p>
              <h2 className="mt-4 text-3xl font-medium tracking-wide md:text-5xl">Sold &amp; closed</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              A selection of recent sales across Kern County. Listing courtesy attribution remains with the original listing agent or brokerage.
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {soldListings.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 100}>
                <li className="flex flex-col gap-3 border-t border-foreground/15 pt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-lg tracking-wide">{p.address}</h3>
                    <span className="font-display text-muted-foreground">{formatPrice(p.price)}</span>
                  </div>
                  <p className="label text-muted-foreground">
                    {p.city}, CA {p.zip}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
                  <span className="label mt-auto text-poppy">Sold</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
