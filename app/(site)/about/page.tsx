import type { Metadata } from 'next'
import { aboutContent, contact } from '@/lib/site'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { ResponsiveImage } from '@/lib/images'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    'Meet Nathanael Harbison, California-licensed REALTOR® DRE #02059393, serving buyers, sellers, and investors across Kern County.',
  path: '/about',
  image: '/images/headshot.webp',
})

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
  { href: contact.linkedin, label: 'LinkedIn' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="REALTOR® · DRE #02059393"
        title="Meet Nathanael"
        intro="A practical perspective shaped by real estate, development, and a long-term view of value — and plain talk about what makes sense."
        image="/images/headshot.webp"
  trail={[
  { name: 'Home', path: '/' },
  { name: 'About',
  path: '/about',
  },
  ]}
      />

      <section className="bg-background py-16 text-foreground md:py-24">
        <div className="mx-auto grid max-w-[90rem] gap-14 px-5 md:px-8 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <div className="flex flex-col gap-6">
              {aboutContent.paragraphs.map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-muted-foreground text-pretty first:text-xl first:text-foreground">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-5">
            <figure className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <ResponsiveImage
                  src="/images/headshot.webp"
                  slot="gallery"
                  alt="Nathanael Harbison, REALTOR®"
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="eyebrow mt-4 text-muted-foreground">
                Nathanael Harbison · Harbison Standard
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-[90rem] px-5 md:px-8">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Why Harbison Standard</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-wide md:text-5xl">
              Practical guidance. <span className="italic text-gold">Direct communication. Real experience.</span>
            </h2>
          </Reveal>
          {/* The Reveal wrapper is the grouping div the spec allows inside a
              <dl>; an extra nested div would put the <dt>/<dd> pair two levels
              down and break the definition list for assistive tech. */}
          <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 100}
                className="border-t border-foreground/15 pt-5"
              >
                <dt className="font-display text-lg tracking-wide text-gold">{v.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="/contact" className="pill bg-ink text-ink-foreground hover:bg-poppy hover:text-ink">
              Work with Nathanael
            </a>
            <ul className="flex flex-wrap gap-x-6">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-gold"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
