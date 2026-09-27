'use client'

import Image from 'next/image'
import { useEffect, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

const slides = [
  { src: '/images/hero-1600.webp', kx: '-2%', ky: '-1%' },
  { src: '/images/property/2300-weybridge-dr-1.webp', kx: '2%', ky: '-2%' },
  { src: '/images/property/28751-gleneagle-ct-1.webp', kx: '-3%', ky: '1%' },
  { src: '/images/property/958-fairway-dr-1.webp', kx: '2%', ky: '1.5%' },
  { src: '/images/property/2206-ribble-valley-dr-1.webp', kx: '-1.5%', ky: '-2%' },
]

const INTERVAL = 6500

export function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setCurrent((v) => (v + 1) % slides.length), INTERVAL)
    return () => clearInterval(t)
  }, [])

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
            'absolute inset-0 transition-opacity duration-[1800ms] ease-in-out',
            i === current ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Image
            src={s.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="kenburns object-cover"
            style={{ '--kx': s.kx, '--ky': s.ky, '--kd': `${18 + i * 2}s` } as CSSProperties}
          />
        </div>
      ))}
      <div aria-hidden="true" className="absolute inset-0 bg-ink/45" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />

      <div className="relative z-10 flex flex-col items-center px-5 text-center">
        <p className="eyebrow rise text-ink-foreground/85" style={{ animationDelay: '200ms' }}>
          Tehachapi · Bakersfield · Kern County
        </p>
        <h1
          id="hero-heading"
          className="title-in mt-6 font-display text-[clamp(2.75rem,9vw,7.5rem)] font-medium leading-none text-balance"
        >
          Harbison Standard
        </h1>
        <p
          className="rise mt-6 max-w-xl text-xs font-semibold uppercase leading-relaxed tracking-[0.38em] text-ink-foreground/90 md:text-sm"
          style={{ animationDelay: '700ms' }}
        >
          {"It's not what you do. It's "}
          <span className="text-poppy">how</span>
          {' you do it.'}
        </p>
        <div className="rise mt-10 flex flex-wrap justify-center gap-3" style={{ animationDelay: '1000ms' }}>
          <a href="#listings" className="pill bg-poppy text-ink hover:bg-ink-foreground">
            View properties
          </a>
          <a href="#contact" className="pill border border-ink-foreground/70 hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink">
            {"Let's connect"}
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-[90rem] items-end justify-between px-5 md:px-8">
        <div className="flex gap-2" role="group" aria-label="Hero slides">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setCurrent(i)}
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
