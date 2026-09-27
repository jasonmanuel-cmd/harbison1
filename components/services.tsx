import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    title: 'Sell your home',
    body: 'A thoughtful approach to timing, repairs, pricing, and next steps — including inherited, as-is, and time-sensitive sales.',
    image: '/images/property-front-800.webp',
    cta: 'Get a pricing plan',
    goal: 'sell',
  },
  {
    title: 'Buy a home',
    body: 'Explore current listings and find a home that fits your goals, whether you are local or relocating from LA.',
    image: '/images/house-800.webp',
    cta: 'Start your search',
    goal: 'buy',
  },
  {
    title: 'Invest',
    body: 'Talk through rentals, flips, land, and value-add opportunities with a practical eye and the real numbers.',
    image: '/images/investing-800.webp',
    cta: 'Talk investments',
    goal: 'invest',
  },
]

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">How we help</p>
        <h2 id="services-heading" className="mt-3 max-w-3xl text-4xl font-medium text-balance md:text-6xl">
          {"Wherever you're starting, there's a clear next step."}
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="group flex flex-col overflow-hidden rounded-md border border-border bg-card">
              <div className="relative aspect-[2/1] overflow-hidden bg-muted">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="text-3xl font-medium">{s.title}</h3>
                <p className="flex-1 leading-relaxed text-muted-foreground">{s.body}</p>
                <a
                  href={`#contact`}
                  data-goal={s.goal}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold"
                >
                  {s.cta}
                  <ArrowRight className="size-4 text-brass transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
