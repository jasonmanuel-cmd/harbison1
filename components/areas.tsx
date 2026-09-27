import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const communities = ['Tehachapi', 'Bakersfield', 'Stallion Springs', 'California City', 'Golden Hills', 'Seven Oaks']

const guides = [
  {
    title: 'Why Tehachapi?',
    body: 'Affordable land, four real seasons, and a growing local economy — what makes this mountain community different.',
  },
  {
    title: 'Sell your house privately',
    body: 'No MLS, no Zillow, no open houses. A confidential, as-is, fast close for homeowners who want a quiet sale.',
  },
  {
    title: 'Off-market deals',
    body: 'Private opportunities — tax-defaulted, pre-foreclosure, probate, FSBO. Get alerts before they hit Zillow.',
  },
]

export function Areas() {
  return (
    <section aria-labelledby="areas-heading" className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="relative min-h-80 lg:min-h-full">
          <Image
            src="/images/property/chalet-tehachapi-1.webp"
            alt="Cummings Valley land with views to the Tehachapi Mountains"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="px-5 py-20 md:px-12 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Same mountains. Bigger opportunities.</p>
          <h2 id="areas-heading" className="mt-3 text-4xl font-medium text-balance md:text-5xl">
            Serving clients across Kern County.
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {communities.map((c) => (
              <li key={c} className="rounded-full border border-ink-foreground/20 px-4 py-2 text-sm">
                {c}
              </li>
            ))}
          </ul>

          <ul className="mt-12 flex flex-col">
            {guides.map((g) => (
              <li key={g.title} className="border-t border-ink-foreground/15 last:border-b">
                <a href="#contact" className="group flex items-start justify-between gap-6 py-6">
                  <div>
                    <h3 className="text-2xl font-medium group-hover:text-brass">{g.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-foreground/65">{g.body}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-brass" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
