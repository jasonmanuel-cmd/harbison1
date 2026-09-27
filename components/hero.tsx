'use client'

import Image from 'next/image'
import { useEffect, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

const slides = [
  { src: '/images/hero-1600.webp', kx: '-4%', ky: '-2%' },
  { src: '/images/property/2300-weybridge-dr-1.webp', kx: '4%', ky: '-2.5%' },
  { src: '/images/property/28751-gleneagle-ct-1.webp', kx: '-4.5%', ky: '2%' },
  { src: '/images/property/958-fairway-dr-1.webp', kx: '3.5%', ky: '2%' },
  { src: '/images/property/2206-ribble-valley-dr-1.webp', kx: '-3%', ky: '-2.5%' },
]

const INTERVAL = 6500
const FADE = 1800

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)

  const goTo = (next: number) => {
    if (next === current) return
    setPrevious(current)
    setCurrent(next)
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => {
      setPrevious(current)
      setCurrent((current + 1) % slides.length)
    }, INTERVAL)
    return () => clearTimeout(t)
  }, [current])

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex h-svh min-h-[36rem] items-center justify-center overflow-hidden bg-ink text-ink-foreground"
    >
      {slides.map((s, i) => (
        <div
          key={s.src}
          aria-hidden="true"
          className={cn(
            'absolute inset-0 transition-opacity ease-in-out',
            i === current ? 'z-[1] opacity-100' : 'opacity-0',
          )}
          style={{ transitionDuration: `${FADE}ms` }}
        >
          <Image
            src={s.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            data-active={i === current || i === previous}
            className="kenburns object-cover"
            style={{ '--kx': s.kx, '--ky': s.ky, '--kd': `${INTERVAL + FADE * 2}ms` } as CSSProperties}
          />
        </div>
      ))}
      <div aria-hidden="true" className="absolute inset-0 bg-ink/45" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <p
          className="eyebrow rise text-[0.65rem] tracking-[0.2em] text-ink-foreground/85 sm:text-xs sm:tracking-[0.32em]"
          style={{ animationDelay: '200ms' }}
        >
          Tehachapi · Bakersfield · Kern County
        </p>
        <h1
          id="hero-heading"
          className="title-in mt-5 flex flex-col items-center font-display font-medium leading-[0.95] md:mt-6 md:flex-row md:gap-[0.25em]"
        >
          <span className="text-[clamp(3.25rem,15vw,7.5rem)] md:text-[clamp(4rem,9vw,7.5rem)]">Harbison</span>
          <span className="gold-text -mr-[0.12em] pb-[0.08em] pr-[0.12em] text-[clamp(3.25rem,15vw,7.5rem)] italic md:text-[clamp(4rem,9vw,7.5rem)]">
            Standard
          </span>
        </h1>
        <span aria-hidden="true" className="rise mt-6 flex items-center gap-3" style={{ animationDelay: '500ms' }}>
          <span className="block h-px w-10 bg-poppy md:w-16" />
          <span className="block size-1.5 rotate-45 bg-poppy" />
          <span className="block h-px w-10 bg-poppy md:w-16" />
        </span>
        <p
          className="rise mt-6 max-w-xs text-balance text-[0.7rem] font-semibold uppercase leading-relaxed tracking-[0.24em] text-ink-foreground/90 sm:max-w-xl sm:text-xs sm:tracking-[0.38em] md:text-sm"
          style={{ animationDelay: '700ms' }}
        >
          {"It's not what you do. It's "}
          <span className="text-poppy">how</span>
          {' you do it.'}
        </p>
        <div
          className="rise mt-10 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
          style={{ animationDelay: '1000ms' }}
        >
          <a href="#listings" className="pill justify-center bg-poppy text-ink hover:bg-ink-foreground">
            View properties
          </a>
          <a
            href="#contact"
            className="pill justify-center border border-ink-foreground/70 hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink"
          >
            {"Let's connect"}
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-[90rem] items-end justify-center px-5 md:bottom-8 md:justify-between md:px-8">
        <div className="flex gap-2" role="group" aria-label="Hero slides">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1} of ${slides.length}`}
              aria-current={i === current}
              className="flex h-11 w-8 items-center md:w-12"
            >
              <span className="block h-0.5 w-full overflow-hidden bg-ink-foreground/30">
                {i === current && (
                  <span
                    key={current}
                    className="progress block h-full w-full bg-poppy"
                    style={{ '--pd': `${INTERVAL}ms` } as CSSProperties}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <a href="#standard" className="hidden flex-col items-center gap-3 md:flex" aria-label="Scroll to content">
          <span className="eyebrow text-ink-foreground/80">Scroll</span>
          <span className="block h-14 w-px overflow-hidden bg-ink-foreground/20">
            <span className="scroll-cue block h-full w-full bg-ink-foreground" />
          </span>
        </a>
      </div>
    </section>
  )
}
