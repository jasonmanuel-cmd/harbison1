import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { formatPrice, listings } from '@/lib/site'

const picks = ['2300-weybridge-dr', '958-fairway-dr', '28211-seabiscuit-way']
  .map((slug) => listings.find((l) => l.slug === slug))
  .filter((l) => l !== undefined)

export function Featured() {
  const [lead, ...rest] = picks

  return (
    <section aria-labelledby="featured-heading" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Hand-selected</p>
            <h2 id="featured-heading" className="mt-3 text-4xl font-medium text-balance md:text-6xl">
              Our top picks right now.
            </h2>
          </div>
          <a href="#listings" className="text-sm font-semibold underline decoration-brass underline-offset-8">
            See all {listings.length} listings
          </a>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-5">
          <a
            href="#contact"
            className="group relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden rounded-md bg-ink p-6 text-ink-foreground md:p-8 lg:col-span-3 lg:min-h-[36rem]"
          >
            <Image
              src={lead.image}
              alt={`${lead.address}, ${lead.city}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">{lead.neighborhood}</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-4xl font-medium md:text-5xl">{lead.address}</h3>
                <p className="mt-2 text-sm text-ink-foreground/80">
                  {lead.beds} bed · {lead.baths} bath · {lead.sqft?.toLocaleString()} sqft
                </p>
              </div>
              <p className="font-serif text-3xl md:text-4xl">{formatPrice(lead.price)}</p>
            </div>
          </a>

          <div className="flex flex-col gap-5 lg:col-span-2">
            {rest.map((l) => (
              <a
                key={l.slug}
                href="#contact"
                className="group flex flex-1 flex-col overflow-hidden rounded-md border border-border bg-card"
              >
                <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:flex-1">
                  <Image
                    src={l.image}
                    alt={`${l.address}, ${l.city}`}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {l.neighborhood}
                    </p>
                    <h3 className="mt-1 text-2xl font-medium">{l.address}</h3>
                    <p className="text-sm text-muted-foreground">
                      {l.beds} bed · {l.baths} bath · {l.sqft?.toLocaleString()} sqft
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ArrowUpRight
                      className="size-5 text-brass transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                    <p className="font-serif text-2xl">{formatPrice(l.price)}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-5 grid overflow-hidden rounded-md border border-border bg-card md:grid-cols-2">
          <div className="relative aspect-[3/2] md:aspect-auto">
            <Image
              src="/images/585-n-wendy-dr-newbury-park-ca-800.webp"
              alt="585 N Wendy Dr, Newbury Park"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">Featured · Newbury Park</p>
            <h3 className="text-3xl font-medium md:text-4xl">585 N Wendy Dr</h3>
            <p className="leading-relaxed text-pretty text-muted-foreground">
              {
                "Fully reimagined luxury residence with Boney Mountain views, a chef's kitchen, a 400+ sq ft bonus room, and top-rated schools. Move-in ready."
              }
            </p>
            <p className="text-sm font-medium">3 beds · 2 baths · 1,633 sqft</p>
            <a
              href="#contact"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-90"
            >
              Ask about a showing
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
