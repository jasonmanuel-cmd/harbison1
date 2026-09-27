import Image from 'next/image'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { contact } from '@/lib/site'

const display = 'wide font-extrabold uppercase leading-[0.86] tracking-tight text-[clamp(2.75rem,9.2vw,9.5rem)]'

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="overflow-hidden">
      <div className="mx-auto max-w-[90rem] px-5 pt-10 md:px-8 md:pt-14">
        <div className="rise label flex flex-wrap items-center justify-between gap-3 text-muted-foreground">
          <span>Kern County, California</span>
          <span className="hidden md:inline">Tehachapi — Bakersfield — Stallion Springs — California City</span>
          <span>DRE #{contact.dre}</span>
        </div>
        <h1 id="hero-heading" className={`rise mt-6 ${display}`} style={{ animationDelay: '80ms' }}>
          <span className="block">It&apos;s not what</span>
          <span className="block">you do.</span>
          <span className="sr-only"> It&apos;s how you do it.</span>
        </h1>
      </div>

      <div className="rise relative mt-8 md:mt-10" style={{ animationDelay: '200ms' }}>
        <div className="relative aspect-[4/3] w-full bg-muted md:aspect-[21/8]">
          <Image
            src="/images/hero-1600.webp"
            alt="A Kern County home represented by Harbison Standard"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="label absolute bottom-0 left-0 flex items-center gap-4 bg-ink px-4 py-3 text-ink-foreground md:left-8">
          <span>35.13° N</span>
          <span aria-hidden="true" className="size-1.5 bg-poppy" />
          <span>118.45° W</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-12 lg:items-end">
        <p aria-hidden="true" className={`rise lg:col-span-7 ${display}`} style={{ animationDelay: '320ms' }}>
          It&apos;s <span className="hl">how</span> you do it.
        </p>
        <div className="rise flex flex-col gap-6 lg:col-span-5 lg:pb-3" style={{ animationDelay: '440ms' }}>
          <p className="max-w-md text-lg leading-relaxed text-pretty">
            Buy, sell, and invest across Tehachapi, Bakersfield, and all of Kern County with Nathanael Harbison —
            practical advice, direct communication, and a clear next step.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              className="label flex items-center gap-2 bg-poppy px-6 py-4 text-ink transition-colors hover:bg-ink hover:text-ink-foreground"
            >
              Start a conversation <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#listings"
              className="label flex items-center gap-2 border-2 border-foreground bg-background px-6 py-4 transition-colors hover:bg-poppy hover:text-ink"
            >
              View listings <ArrowDownRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
