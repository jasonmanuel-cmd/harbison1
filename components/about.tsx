import Image from 'next/image'
import { contact } from '@/lib/site'
import { Reveal } from '@/components/reveal'

const values = [
  { title: 'Property perspective', body: 'A more informed eye for condition, repairs, and potential.' },
  { title: 'Straightforward advice', body: 'Clear communication without pressure or complexity.' },
  { title: 'A plan built around you', body: 'Shaped around your budget, timeline, and reason for moving.' },
  { title: 'Local understanding', body: 'Grounded knowledge of Kern County and Tehachapi.' },
]

const socials = [
  { href: contact.reviews, label: 'Google reviews' },
  { href: contact.youtube, label: 'YouTube' },
  { href: contact.instagram, label: 'Instagram' },
  { href: contact.facebook, label: 'Facebook' },
]

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="relative scroll-mt-16 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-[90rem] gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-16">
        <Reveal className="flex flex-col justify-center lg:col-span-6">
          <p className="eyebrow text-ink-foreground/70">REALTOR® · DRE #{contact.dre}</p>
          <h2 id="about-heading" className="mt-5 text-5xl font-medium tracking-wide md:text-6xl">
            Meet Nathanael
          </h2>
          <p className="mt-8 max-w-xl leading-relaxed text-ink-foreground/85 text-pretty">
            {
              "Whether you're buying, selling, or exploring an investment, the right decision starts with understanding the property in front of you. Nathanael Harbison brings a practical perspective shaped by real estate, development, and a long-term view of value — and he tells you plainly what makes sense."
            }
          </p>
          <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="border-t border-ink-foreground/20 pt-4">
                <dt className="font-display text-lg tracking-wide text-poppy">{v.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-foreground/75">{v.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#contact" className="pill bg-ink-foreground text-ink hover:bg-poppy">
              Work with Nathanael
            </a>
            <ul className="flex flex-wrap gap-x-6">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label inline-flex min-h-11 items-center text-ink-foreground/70 transition-colors hover:text-poppy"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={150} className="flex items-center justify-center lg:col-span-6 lg:justify-end">
          <figure className="relative w-full max-w-sm">
            <div aria-hidden="true" className="absolute -right-4 -top-4 hidden size-full border border-poppy md:block" />
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-foreground/10">
              <Image
                src="/images/headshot.webp"
                alt="Nathanael Harbison, REALTOR®"
                fill
                sizes="384px"
                className="object-cover"
              />
            </div>
            <figcaption className="eyebrow mt-5 text-ink-foreground/70">Nathanael Harbison · Harbison Standard</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
