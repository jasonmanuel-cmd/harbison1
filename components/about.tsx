import Image from 'next/image'
import { contact } from '@/lib/site'

const values = [
  { title: 'Property perspective', body: 'A more informed eye for condition, repairs, and potential.' },
  { title: 'Straightforward advice', body: 'Clear communication without pressure or unnecessary complexity.' },
  { title: 'A plan built around you', body: 'Shaped around your budget, timeline, and reason for moving.' },
  { title: 'Local understanding', body: 'Grounded knowledge of Kern County and Tehachapi opportunities.' },
]

const socials = [
  { href: contact.reviews, label: 'Google reviews' },
  { href: contact.youtube, label: 'YouTube' },
  { href: contact.instagram, label: 'Instagram' },
  { href: contact.facebook, label: 'Facebook' },
]

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 md:py-28">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 md:px-8 lg:grid-cols-12 lg:gap-16">
        <figure className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <Image
              src="/images/headshot.webp"
              alt="Nathanael Harbison, REALTOR®"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="label mt-4 flex flex-wrap justify-between gap-2 border-t border-ink pt-4">
            <span>Nathanael Harbison</span>
            <span className="text-muted-foreground">REALTOR® · DRE #{contact.dre}</span>
          </figcaption>
        </figure>

        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="label text-muted-foreground">The standard, in writing</p>
          <h2 id="about-heading" className="wide mt-4 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance md:text-6xl">
            A higher standard for your next move.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty">
            {
              "Whether you're buying, selling, or exploring an investment, the right decision starts with understanding the property in front of you. Nathanael brings a practical perspective shaped by real estate, development, and a long-term view of value."
            }
          </p>

          <dl className="mt-10 border-t border-ink">
            {values.map((v, i) => (
              <div key={v.title} className="grid gap-1 border-b border-border py-5 sm:grid-cols-[4rem_14rem_minmax(0,1fr)] sm:gap-6">
                <dt className="contents">
                  <span className="label text-muted-foreground">§ {i + 1}</span>
                  <span className="font-semibold">{v.title}</span>
                </dt>
                <dd className="leading-relaxed text-muted-foreground">{v.body}</dd>
              </div>
            ))}
          </dl>

          <ul className="label mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-poppy decoration-2 underline-offset-8 hover:text-poppy"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
