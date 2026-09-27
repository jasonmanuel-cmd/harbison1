import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { listings } from '@/lib/site'

const places = [
  {
    city: 'Tehachapi',
    setting: 'Mountain',
    elevation: '3,970 ft',
    image: '/images/property/28751-gleneagle-ct-1.webp',
    alt: 'Stallion Springs home with mountain views in Tehachapi',
    body: 'Four real seasons, room to breathe, and land to build on. Acreage, new construction, and quiet mountain communities an hour from the valley.',
    communities: ['Stallion Springs', 'Golden Hills', 'Bear Valley Springs', 'Cummings Valley'],
  },
  {
    city: 'Bakersfield',
    setting: 'Valley',
    elevation: '404 ft',
    image: '/images/property/2300-weybridge-dr-1.webp',
    alt: 'Seven Oaks estate on the golf course in Bakersfield',
    body: 'Established neighborhoods, golf-course estates, gated communities, and steady rental demand — from Seven Oaks to East Bakersfield.',
    communities: ['Seven Oaks', 'Stockdale', 'Grand Island', 'East Bakersfield'],
  },
] as const

const guides = [
  {
    title: 'Why Tehachapi?',
    body: 'Affordable land, four seasons, and a growing local economy.',
  },
  {
    title: 'Sell privately',
    body: 'No MLS, no Zillow, no open houses. A confidential, as-is close.',
  },
  {
    title: 'Off-market deals',
    body: 'Probate, pre-foreclosure, FSBO — alerts before they go public.',
  },
]

export function Areas() {
  return (
    <section id="areas" aria-labelledby="areas-heading" className="border-t border-ink py-20 md:py-28">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="areas-heading" className="wide text-4xl font-extrabold uppercase leading-none tracking-tight text-balance md:text-7xl">
            Two elevations.
            <br />
            One county.
          </h2>
          <p className="max-w-sm leading-relaxed text-muted-foreground">
            Same mountains, bigger opportunities. Serving clients across Kern County, including California City.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-8">
          {places.map((p) => {
            const count = listings.filter((l) => l.city === p.city).length
            return (
              <article key={p.city} className="flex min-w-0 flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image src={p.image} alt={p.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                  <span className="label absolute left-0 top-0 flex items-center gap-3 bg-ink px-4 py-3 text-ink-foreground">
                    <span aria-hidden="true" className="size-1.5 bg-poppy" />
                    {p.setting} · Elev. {p.elevation}
                  </span>
                </div>
                <h3 className="wide mt-6 break-words text-[clamp(2rem,10vw,3.75rem)] font-extrabold uppercase leading-none tracking-tight">
                  {p.city}
                </h3>
                <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">{p.body}</p>
                <ul className="label mt-6 flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
                  {p.communities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <a
                  href="#listings"
                  className="label mt-8 flex min-h-12 items-center justify-between gap-4 border-t border-ink py-3 hover:bg-poppy"
                >
                  {count} {p.city} properties on the register
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </article>
            )
          })}
        </div>

        <ul className="mt-20 grid border-t border-ink md:grid-cols-3">
          {guides.map((g) => (
            <li key={g.title} className="border-b border-border md:border-b-0 md:border-r md:last:border-r-0">
              <a href="#contact" className="group flex h-full flex-col gap-3 py-8 md:px-8 md:first:pl-0">
                <span className="flex items-center justify-between gap-4">
                  <span className="wide text-xl font-bold uppercase tracking-tight group-hover:hl">{g.title}</span>
                  <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{g.body}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
