'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { contact } from '@/lib/site'
import { Reveal } from '@/components/reveal'

const reviews = [
  {
    quote:
      "Nathanael was honest, responsive, and easy to work with from start to finish. He understood what we were looking for and didn't waste our time with properties that didn't fit.",
    who: 'Buyer · Bakersfield',
  },
  {
    quote:
      "We weren't sure whether to fix things up or sell as-is. Nathanael helped us think it through clearly and never made us feel pressured.",
    who: 'Seller · Time-sensitive sale',
  },
  {
    quote:
      'After three years of ownership, we wanted guidance on whether to hold or sell. Nathanael laid out the numbers and let us decide. That straight talk is exactly what we needed.',
    who: 'Investor · California City',
  },
  {
    quote:
      'Our inherited home felt overwhelming. Nathanael helped us understand the options and what the property was actually worth. We felt supported every step.',
    who: 'Seller · Inherited property',
  },
  {
    quote:
      "Coming from Los Angeles, we didn't know the Bakersfield market. Nathanael showed us what our budget could actually buy and helped us understand the neighborhoods.",
    who: 'Buyer · Relocated from LA',
  },
  {
    quote:
      'Nathanael brought calm, clarity, and practical advice throughout the sale. We always felt like we understood what was happening and why.',
    who: 'Seller · Kern County',
  },
]

const arrow =
  'flex size-12 shrink-0 items-center justify-center rounded-full border border-foreground/30 transition-colors hover:border-foreground hover:bg-ink hover:text-ink-foreground'

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const r = reviews[current]
  const go = (d: number) => setCurrent((v) => (v + d + reviews.length) % reviews.length)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setCurrent((v) => (v + 1) % reviews.length), 8000)
    return () => clearTimeout(t)
  }, [current, paused])

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="relative z-10 scroll-mt-16 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <Reveal className="flex items-end justify-center gap-5">
          <span aria-hidden="true" className="font-display text-[8rem] leading-[0.7] text-poppy md:text-[11rem]">
            “
          </span>
          <div className="pb-1">
            <p className="eyebrow text-muted-foreground">Testimonials</p>
            <h2 id="reviews-heading" className="mt-3 text-4xl font-medium tracking-wide md:text-6xl">
              Client Stories
            </h2>
          </div>
        </Reveal>

        <div
          className="mt-14 flex items-center gap-6 md:gap-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button type="button" onClick={() => go(-1)} className={`${arrow} hidden md:flex`}>
            <ChevronLeft className="size-5" aria-hidden="true" />
            <span className="sr-only">Previous review</span>
          </button>
          <figure key={current} className="rise min-h-64 flex-1 text-center" aria-live="polite">
            <blockquote className="text-xl leading-relaxed text-pretty md:text-2xl">{`“${r.quote}”`}</blockquote>
            <figcaption className="eyebrow mt-8 text-muted-foreground">{r.who}</figcaption>
          </figure>
          <button type="button" onClick={() => go(1)} className={`${arrow} hidden md:flex`}>
            <ChevronRight className="size-5" aria-hidden="true" />
            <span className="sr-only">Next review</span>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} className={`${arrow} md:hidden`}>
            <ChevronLeft className="size-5" aria-hidden="true" />
            <span className="sr-only">Previous review</span>
          </button>
          <div className="flex gap-1" role="group" aria-label="Choose a review">
            {reviews.map((rv, i) => (
              <button
                key={rv.who}
                type="button"
                onClick={() => setCurrent(i)}
                aria-current={i === current}
                aria-label={`Review ${i + 1}`}
                className="flex size-6 items-center justify-center"
              >
                <span className={`block size-2 rounded-full transition-colors ${i === current ? 'bg-poppy' : 'bg-foreground/20'}`} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} className={`${arrow} md:hidden`}>
            <ChevronRight className="size-5" aria-hidden="true" />
            <span className="sr-only">Next review</span>
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={contact.reviews}
            target="_blank"
            rel="noopener noreferrer"
            className="pill bg-ink text-ink-foreground hover:bg-poppy hover:text-ink"
          >
            Read reviews on Google
          </a>
        </div>
      </div>
    </section>
  )
}
