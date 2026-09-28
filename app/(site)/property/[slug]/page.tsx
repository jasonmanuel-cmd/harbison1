import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate, formatPrice, listings, soldListings } from '@/lib/site'
import { InquiryForm } from '@/components/inquiry-form'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { Reveal } from '@/components/reveal'
import { ResponsiveImage } from '@/lib/images'
import { pageMetadata, propertySchema } from '@/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
}

/**
 * Both current and sold listings get a static page. The sold ones were left
 * out here, so they were rendered on demand at whatever speed the CDN happened
 * to have that second, even though they are the pages most likely to earn
 * links from a site selling on track record.
 */
export function generateStaticParams() {
  return [...listings, ...soldListings].map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = [...listings, ...soldListings].find((l) => l.slug === slug)
  if (!p) return {}

  return pageMetadata({
    title: `${p.address}, ${p.city}, CA`,
    // The blurb is the agent's own copy. Prefixed with the facts so a search
    // result shows the price and size rather than an open-ended sentence.
    description: `${formatPrice(p.price)} — ${p.blurb}`,
    path: `/property/${p.slug}`,
    image: p.image,
    imageAlt: `${p.address}, ${p.city}, CA`,
  })
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params
  // Sold listings are served from the same template. They used to 404 here
  // even though the sitemap advertised them.
  const p = [...listings, ...soldListings].find((l) => l.slug === slug)
  if (!p) notFound()

  const facts: string[] = []
  if (p.beds) facts.push(`${p.beds} Beds`)
  if (p.baths) facts.push(`${p.baths} Baths`)
  if (p.sqft) facts.push(`${p.sqft.toLocaleString('en-US')} Sq Ft`)
  if (p.lot) facts.push(p.lot)

  const others = listings.filter((l) => l.slug !== p.slug).slice(0, 3)
  const isSold = p.status === 'Sold'
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: p.address, path: `/property/${p.slug}` },
  ]

  return (
    <>
      {/* The listing's own facts. The breadcrumb trail is rendered visibly by
          the Breadcrumbs component below, which also emits its markup. */}
      <JsonLd data={propertySchema(p)} />
      {/* Header */}
      <section className="bg-ink pt-32 text-ink-foreground md:pt-44">
        <div className="mx-auto max-w-[90rem] px-5 pb-10 md:px-8 md:pb-14">
          <Breadcrumbs tone="light" trail={trail} />
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-poppy">{p.neighborhood ?? `${p.city}, CA`}</p>
              <h1 className="mt-4 text-4xl font-medium leading-tight tracking-wide text-balance md:text-6xl">
                {p.address}
              </h1>
              <p className="mt-3 text-ink-foreground/70">
                {p.city}, CA {p.zip}
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              {/* Sold listings share this template, so the status has to be
                  stated on the page. A visitor arriving on one of these URLs
                  from a search result needs to know before they read on. */}
              {isSold && (
                <span className="label self-start rounded-sm bg-ink-foreground/15 px-3 py-1 text-ink-foreground md:self-end">
                  Sold
                  {p.date ? ` · ${formatDate(p.date)}` : ''}
                </span>
              )}
              <span className="font-display text-3xl tracking-wide text-poppy md:text-4xl">
                {isSold ? <s>{formatPrice(p.price)}</s> : formatPrice(p.price)}
              </span>
              <span className="label text-ink-foreground/70">{facts.join('  ·  ')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-ink pb-16 text-ink-foreground md:pb-24" aria-label="Property photos">
        <div className="mx-auto max-w-[90rem] px-5 md:px-8">
          <Reveal>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {(p.images ?? [p.image]).slice(0, 8).map((src, i) => (
                <div
                  key={src}
                  className={
                    i === 0
                      ? 'col-span-2 row-span-2 aspect-square overflow-hidden bg-ink-foreground/10'
                      : 'aspect-square overflow-hidden bg-ink-foreground/10'
                  }
                >
                  <ResponsiveImage
                    src={src}
                    slot="card"
                    alt={`${p.address} photo ${i + 1}`}
                    priority={i === 0}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Reveal>
          {p.attribution && (
            <p className="mt-6 text-xs text-ink-foreground/60">{p.attribution}</p>
          )}
        </div>
      </section>

      {/* Details */}
      <section className="bg-background py-16 text-foreground md:py-24">
        <div className="mx-auto grid max-w-[90rem] gap-14 px-5 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-muted-foreground">About this property</p>
              <h2 className="mt-4 text-3xl font-medium tracking-wide md:text-4xl">
                See the property <span className="italic text-gold">in context.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {p.description ?? p.blurb}
              </p>
            </Reveal>

            {p.features && p.features.length > 0 && (
              <Reveal delay={120}>
                <h3 className="label mt-12 text-muted-foreground">Property context</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.features.map((f) => (
                    <li key={f} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {p.mls && (
              <p className="mt-10 text-sm text-muted-foreground">
                MLS ID: {p.mls}
                {p.date && ` · Listed ${formatDate(p.date)}`}
              </p>
            )}
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={150} className="lg:sticky lg:top-28">
              <div className="rounded-sm border border-border bg-secondary p-6 md:p-10">
                <p className="eyebrow text-muted-foreground">
                  {isSold ? 'Want something like this?' : 'Interested in this one?'}
                </p>
                <h3 className="mt-3 font-display text-2xl tracking-wide">See the full picture.</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {isSold
                    ? `This one is sold, but comparable homes come up regularly. Tell Nathanael what you are looking for and he will let you know when one fits — before it reaches the portals.`
                    : 'Share your buyer profile so Nathanael can respond with this property in context — not in isolation.'}
                </p>
                <div className="mt-8">
                  <InquiryForm
                    defaultGoal="Buying"
                    defaultInterest={p.address}
                    // This form sits in the light --secondary sidebar card, so
                    // it needs the light palette. dark defaults to true, and
                    // omitting it rendered white text on a near-white card.
                    dark={false}
                    compact
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Other properties */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-[90rem] px-5 md:px-8">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="text-3xl font-medium tracking-wide md:text-4xl">More properties</h2>
            <Link href="/properties" className="label shrink-0 text-muted-foreground transition-colors hover:text-gold">
              View all →
            </Link>
          </Reveal>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o, i) => (
              <Reveal key={o.slug} as="li" delay={i * 100}>
                <Link href={`/property/${o.slug}`} className="group flex flex-col gap-3">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <ResponsiveImage
                      src={o.image}
                      slot="card"
                      alt={`${o.address}, ${o.city}, CA`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-lg tracking-wide">{o.address}</h3>
                    <span className="font-display text-gold">{formatPrice(o.price)}</span>
                  </div>
                  <p className="label text-muted-foreground">
                    {o.city}, CA {o.zip}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
