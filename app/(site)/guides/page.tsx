import type { Metadata } from 'next'
import Link from 'next/link'
import { guides } from '@/lib/site'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Guides & Resources',
  description:
    'Resources for your Kern County property search — private sales, off-market deals, relocating from LA, why Tehachapi, and land opportunities.',
  path: '/guides',
})

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Guides for your search"
        intro="Straightforward resources for buyers, sellers, and investors across Kern County — before you reach out."
  trail={[
  { name: 'Home', path: '/' },
  { name: 'Guides & Resources',
  path: '/guides',
  },
  ]}
      />
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[90rem] px-5 md:px-8">
          <ul className="grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g, i) => (
              <Reveal key={g.slug} as="li" delay={(i % 3) * 80} className="bg-background">
                <Link
                  href={`/${g.slug}`}
                  className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-secondary"
                >
                  <span className="font-display text-4xl font-medium text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-2xl tracking-wide">{g.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{g.body}</p>
                  <span className="label mt-auto flex items-center gap-2 text-gold">
                    Read more <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
