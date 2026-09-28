import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    label: 'Buy',
    body: 'See what your budget really buys and which neighborhoods match the way you live — local or relocating from LA.',
    image: '/images/property/28211-seabiscuit-way-1.webp',
    alt: 'Stallion Springs home on three-quarters of an acre',
  },
  {
    label: 'Sell',
    body: 'Timing, repairs, pricing, and a plan — including inherited, as-is, and private off-MLS sales.',
    image: '/images/property/958-fairway-dr-2.webp',
    alt: 'Renovated Stockdale Country Club home',
  },
  {
    label: 'Invest',
    body: 'Rentals, flips, land, and value-add — with the real numbers first, and honest hold-or-sell advice.',
    image: '/images/property/chalet-tehachapi-1.webp',
    alt: 'Twenty acres with valley views in Tehachapi',
  },
]

export function Services() {
  return (
    <section id="services" aria-label="Buy, sell, or invest" className="scroll-mt-16">
      <ul className="grid gap-px bg-ink-foreground md:grid-cols-3">
        {services.map((s) => (
          <li key={s.label}>
            <a
              href="#contact"
              className="group relative flex h-[26rem] items-end justify-center overflow-hidden bg-ink text-ink-foreground md:h-[34rem]"
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition-colors duration-700 group-hover:bg-ink/35"
              />
              <span className="relative flex flex-col items-center gap-4 px-8 pb-10 text-center">
                <span className="font-display text-4xl font-medium tracking-[0.08em]">{s.label}</span>
                <span className="grid max-w-xs grid-rows-[0fr] opacity-0 transition-all duration-700 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 max-md:grid-rows-[1fr] max-md:opacity-100">
                  <span className="overflow-hidden text-sm leading-relaxed text-ink-foreground/85">{s.body}</span>
                </span>
                <span className="label flex items-center gap-2 text-poppy">
                  Start here <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
