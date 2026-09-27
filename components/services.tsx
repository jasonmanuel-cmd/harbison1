'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const services = [
  {
    id: 'sell',
    label: 'Sell',
    title: 'Sell with a plan, not a guess.',
    body: 'A thoughtful approach to timing, repairs, pricing, and next steps — so you know what your home is worth and what it takes to get there.',
    points: ['Pricing strategy grounded in local comps', 'Inherited and as-is sales', 'Time-sensitive moves', 'Private, off-MLS options'],
    image: '/images/property-front-800.webp',
    cta: 'Get a pricing plan',
  },
  {
    id: 'buy',
    label: 'Buy',
    title: 'Find the home that actually fits.',
    body: 'Whether you are local or relocating from LA, see what your budget really buys and which neighborhoods match the way you live.',
    points: ['Honest neighborhood guidance', 'Relocation from Southern California', 'Condition and repair perspective', 'Only homes that fit your goals'],
    image: '/images/house-800.webp',
    cta: 'Start your search',
  },
  {
    id: 'invest',
    label: 'Invest',
    title: 'Run the real numbers first.',
    body: 'Talk through rentals, flips, land, and value-add opportunities with a practical eye — including whether to hold or sell what you already own.',
    points: ['Rentals and flips', 'Land and new builds', 'Hold-or-sell analysis', 'Off-market deal alerts'],
    image: '/images/investing-800.webp',
    cta: 'Talk investments',
  },
]

export function Services() {
  const [current, setCurrent] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const s = services[current]

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (current + (e.key === 'ArrowRight' ? 1 : -1) + services.length) % services.length
    setCurrent(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="services" aria-labelledby="services-heading" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <p className="label text-muted-foreground">How Nathanael helps</p>
        <h2 id="services-heading" className="mt-3 max-w-2xl text-2xl font-medium text-balance md:text-3xl">
          {"Wherever you're starting, there's a clear next step. Pick a direction."}
        </h2>

        <div role="tablist" aria-label="Services" onKeyDown={onKeyDown} className="mt-10 flex flex-wrap gap-x-8 border-b border-ink md:gap-x-14">
          {services.map((it, i) => (
            <button
              key={it.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              type="button"
              id={`tab-${it.id}`}
              aria-selected={i === current}
              aria-controls="service-panel"
              tabIndex={i === current ? 0 : -1}
              onClick={() => setCurrent(i)}
              className={cn(
                'wide -mb-px border-b-4 pb-2 text-5xl font-extrabold uppercase leading-none tracking-tight transition-colors md:text-8xl',
                i === current ? 'border-poppy text-foreground' : 'border-transparent text-foreground/35 hover:text-foreground/60',
              )}
            >
              {it.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id="service-panel"
          aria-labelledby={`tab-${s.id}`}
          className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14"
        >
          <div key={s.image} className="rise relative aspect-[16/10] overflow-hidden bg-muted lg:col-span-7">
            <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <div key={s.id} className="rise flex flex-col justify-between gap-8 lg:col-span-5">
            <div>
              <h3 className="wide text-3xl font-bold uppercase leading-tight tracking-tight text-balance md:text-4xl">{s.title}</h3>
              <p className="mt-5 leading-relaxed text-pretty">{s.body}</p>
              <ul className="mt-8 border-t border-ink">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-4 border-b border-border py-3">
                    <span aria-hidden="true" className="size-2 shrink-0 bg-poppy" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="#contact"
              className="label flex items-center justify-between gap-2 bg-ink px-6 py-4 text-ink-foreground transition-colors hover:bg-poppy hover:text-ink"
            >
              {s.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
