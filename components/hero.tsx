'use client'

import Image from 'next/image'
import { useEffect, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

const slides = [
  { src: '/images/hero-1600.webp', kx: '-4%', ky: '-2%' },
  { src: '/images/property/2300-weybridge-dr-1.webp', kx: '4%', ky: '-2.5%' },
  { src: '/images/property/958-fairway-dr-1.webp', kx: '3.5%', ky: '2%' },
]

function SplitWord({ word, startDelay, className }: { word: string; startDelay: number; className?: string }) {
  return (
    <span aria-hidden="true" className="block overflow-hidden whitespace-nowrap px-[0.04em] pb-[0.06em]">
      {word.split('').map((char, i) => (
        <span key={i} className={cn('letter', className)} style={{ animationDelay: `${startDelay + i * 55}ms` }}>
          {char}
        </span>
      ))}
    </span>
  )
}

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
      <div aria-hidden="true" className="absolute inset-x-0 top-0 z-[2] h-[45%] bg-gradient-to-b from-ink/80 via-ink/35 to-transparent md:h-[55%] md:from-ink/75 md:via-ink/40" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[2] h-[40%] bg-gradient-to-t from-ink/90 via-ink/50 to-transparent md:h-32 md:from-ink/60" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[90rem] flex-col justify-between px-5 pb-[max(5.25rem,calc(env(safe-area-inset-bottom)+4.5rem))] pt-24 md:justify-start md:gap-5 md:px-8 md:pb-0 md:pt-[17vh]">
        <div className="flex flex-col items-center text-center">
          <p
            className="eyebrow rise text-[0.65rem] tracking-[0.2em] text-ink-foreground/85 sm:text-xs sm:tracking-[0.32em]"
            style={{ animationDelay: '200ms' }}
          >
            Tehachapi · Bakersfield · Kern County
          </p>
          <h1
            id="hero-heading"
            aria-label="Harbison Standard"
            className="mt-3 flex flex-col items-center font-display font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-[clamp(2rem,10vw,4.5rem)] md:mt-4 md:flex-row md:gap-[0.3em] md:text-[clamp(2.5rem,4.6vw,4.5rem)]"
          >
            <SplitWord word="Harbison" startDelay={250} />
            <SplitWord word="Standard" startDelay={650} className="gold-outline" />
          </h1>
        </div>

        <div className="flex flex-col items-center text-center">
          <p
            className="rise flex flex-wrap items-center justify-center gap-x-2 text-pretty text-base leading-snug text-ink-foreground/95 sm:text-lg md:text-xl"
            style={{ animationDelay: '1300ms' }}
          >
            <span>{"It's not what you do."}</span>
            <span>
              {"It's "}
              <span className="font-display font-bold italic text-poppy">how</span>
              {' you do it.'}
            </span>
          </p>
          <div
            className="rise mt-4 flex w-full max-w-sm gap-2 sm:w-auto sm:max-w-none sm:gap-3 md:mt-5"
            style={{ animationDelay: '1000ms' }}
          >
            <a
              href="#listings"
              className="pill min-w-0 flex-1 justify-center whitespace-nowrap bg-poppy px-3 text-[0.68rem] tracking-[0.12em] text-ink hover:bg-ink-foreground sm:flex-none sm:px-8 sm:text-xs sm:tracking-[0.2em]"
            >
              View properties
            </a>
            <a
              href="#contact"
              className="pill min-w-0 flex-1 justify-center whitespace-nowrap border border-ink-foreground/70 px-3 text-[0.68rem] tracking-[0.12em] hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink sm:flex-none sm:px-8 sm:text-xs sm:tracking-[0.2em]"
            >
              {"Let's connect"}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10 mx-auto hidden max-w-[90rem] items-end justify-center px-5 md:bottom-8 md:flex md:justify-end md:gap-10 md:px-8">
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
