import Image from 'next/image'
import { Star } from 'lucide-react'
import { contact } from '@/lib/site'

const values = [
  { title: 'Property perspective', body: 'A more informed eye for property condition, repairs, and potential.' },
  { title: 'Straightforward advice', body: 'Clear communication without pressure or unnecessary complexity.' },
  { title: 'A plan built around you', body: 'Shaped around your budget, timeline, and reason for moving.' },
  { title: 'Local understanding', body: 'Grounded knowledge of Kern County and Tehachapi opportunities.' },
]

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="bg-ink py-20 text-ink-foreground md:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-md">
            <Image
              src="/images/headshot.webp"
              alt="Nathanael Harbison, REALTOR®"
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover"
            />
          </div>
          <div className="mt-6 flex max-w-md items-center justify-between gap-4 border-t border-ink-foreground/15 pt-6">
            <div>
              <p className="font-serif text-2xl">Nathanael Harbison</p>
              <p className="text-sm text-ink-foreground/60">REALTOR® · DRE #{contact.dre}</p>
            </div>
            <a
              href={contact.reviews}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-brass hover:underline"
            >
              <span className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-brass text-brass" />
                ))}
              </span>
              <span>Google reviews</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Meet Nathanael</p>
          <h2 id="about-heading" className="mt-3 text-4xl leading-tight font-medium text-balance md:text-6xl">
            A higher standard for your next move.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-foreground/75">
            {
              "Whether you're buying, selling, or exploring an investment, the right decision starts with understanding the property in front of you. Nathanael brings a practical perspective shaped by real estate, development, and a long-term view of value."
            }
          </p>

          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="border-t border-brass/40 pt-4">
                <dt className="font-serif text-2xl">{v.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-foreground/65">{v.body}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-6 text-sm font-semibold">
            <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="underline decoration-brass underline-offset-8 hover:text-brass">
              Watch on YouTube
            </a>
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="underline decoration-brass underline-offset-8 hover:text-brass">
              Instagram
            </a>
            <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="underline decoration-brass underline-offset-8 hover:text-brass">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
