import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { contact } from '@/lib/site'

const credentials = [
  `REALTOR® · DRE #${contact.dre}`,
  'Serving all of Kern County',
  'Buyers · Sellers · Investors',
  'Call or text direct',
]

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-svh flex-col bg-ink text-ink-foreground">
      <Image
        src="/images/hero-1600.webp"
        alt="Modern home overlooking Cummings Valley and the Tehachapi Mountains"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/45" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pt-32 pb-12 md:px-8 md:pb-16">
        <p className="rise text-xs font-semibold uppercase tracking-[0.3em] text-brass">
          Tehachapi · Bakersfield · Kern County
        </p>
        <h1 className="rise mt-5 max-w-4xl text-5xl leading-[0.95] font-medium text-balance [animation-delay:120ms] sm:text-6xl md:text-8xl">
          {"It's not what you do."}
          <span className="block italic text-brass">{"It's how you do it."}</span>
        </h1>
        <p className="rise mt-6 max-w-xl text-base leading-relaxed text-pretty text-ink-foreground/80 [animation-delay:240ms] md:text-lg">
          Buy, sell, and invest in Kern County with Nathanael Harbison. Practical advice, thoughtful preparation, and
          a clear next step for your property goals.
        </p>
        <div className="rise mt-8 flex flex-col gap-3 [animation-delay:360ms] sm:flex-row">
          <a
            href="#listings"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-brass px-7 py-4 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
          >
            Browse current listings
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-sm border border-ink-foreground/30 px-7 py-4 text-sm font-semibold text-ink-foreground transition-colors hover:border-brass hover:text-brass"
          >
            {"What's my home worth?"}
          </a>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-y-3 px-5 py-5 md:grid-cols-4 md:px-8">
          {credentials.map((c) => (
            <li key={c} className="text-xs font-medium uppercase tracking-[0.18em] text-ink-foreground/70">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
