'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { listings } from '@/lib/site'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const places = [
  {
    name: 'Tehachapi',
    tag: 'Mountain · Elev. 3,970 ft',
    image: '/images/property/28751-gleneagle-ct-1.webp',
    body: 'Four real seasons, room to breathe, and land to build on — an hour from the valley.',
  },
  {
    name: 'Stallion Springs',
    tag: 'Tehachapi',
    image: '/images/property/28211-seabiscuit-way-1.webp',
    body: 'Quiet, spacious lots with sweeping mountain views and room for horses.',
  },
  {
    name: 'Golden Hills',
    tag: 'Tehachapi',
    image: '/images/property/21204-stage-dr-1.webp',
    body: 'New construction and generous lots on the west side of Tehachapi.',
  },
  {
    name: 'Cummings Valley',
    tag: 'Tehachapi · Land',
    image: '/images/property/chalet-tehachapi-1.webp',
    body: 'Acreage with valley and mountain views, ready for a custom build.',
  },
  {
    name: 'Bakersfield',
    tag: 'Valley · Elev. 404 ft',
    image: '/images/property/2206-ribble-valley-dr-1.webp',
    body: 'Established neighborhoods, gated communities, and steady rental demand.',
  },
  {
    name: 'Seven Oaks',
    tag: 'Bakersfield',
    image: '/images/property/2300-weybridge-dr-1.webp',
    body: 'Golf-course estates and gated enclaves, including Grand Island.',
  },
  {
    name: 'Stockdale',
    tag: 'Bakersfield',
    image: '/images/property/958-fairway-dr-1.webp',
    body: 'Mature trees and country-club living in one of Bakersfield’s classic addresses.',
  },
]

function countFor(name: string) {
  return listings.filter((l) => l.city === name || (l.neighborhood ?? '').includes(name)).length
}

export function Areas() {
  const [current, setCurrent] = useState(0)
  const p = places[current]
  const count = countFor(p.name)

  return (
    <section id="areas" aria-labelledby="areas-heading" className="scroll-mt-16 bg-secondary py-24 md:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 md:px-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-16">
        <Reveal className="flex flex-col">
          <p className="eyebrow text-muted-foreground">Where we work</p>
          <h2 id="areas-heading" className="mt-5 text-4xl font-medium tracking-wide md:text-5xl">
            Neighborhoods
          </h2>
          <ul className="mt-10 flex flex-col" role="list">
            {places.map((place, i) => (
              <li key={place.name}>
                <button
                  type="button"
                  onClick={() => setCurrent(i)}
                  onMouseEnter={() => setCurrent(i)}
                  aria-pressed={i === current}
                  className={cn(
                    'label flex min-h-14 w-full items-center justify-between gap-4 border-b py-4 text-left tracking-[0.2em] transition-colors',
                    i === current ? 'border-foreground text-foreground' : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {place.name}
                  <ChevronRight
                    className={cn('size-4 transition-all', i === current ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0')}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
          <a href="#listings" className="pill mt-10 self-start bg-ink text-ink-foreground hover:bg-poppy hover:text-ink">
            View all properties
          </a>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative aspect-[4/5] overflow-hidden bg-ink text-ink-foreground sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[36rem]">
            {places.map((place, i) => (
              <Image
                key={place.name}
                src={place.image}
                alt={i === current ? `Home in ${place.name}` : ''}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className={cn(
                  'object-cover transition-[opacity,transform] duration-[1200ms] ease-out',
                  i === current ? 'scale-100 opacity-100' : 'scale-110 opacity-0',
                )}
              />
            ))}
            <div aria-hidden="true" className="absolute inset-0 bg-ink/35" />
            <div key={p.name} className="rise absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center" aria-live="polite">
              <p className="eyebrow text-ink-foreground/85">{p.tag}</p>
              <p className="font-display text-5xl font-medium tracking-wide text-balance md:text-7xl">{p.name}</p>
              <p className="max-w-md leading-relaxed text-ink-foreground/90">{p.body}</p>
              {count > 0 && (
                <a
                  href="#listings"
                  className="pill mt-4 border border-ink-foreground/70 hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink"
                >
                  {count} {count === 1 ? 'property' : 'properties'}
                </a>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Also serving California City and the rest of Kern County.</p>
        </Reveal>
      </div>
    </section>
  )
}
