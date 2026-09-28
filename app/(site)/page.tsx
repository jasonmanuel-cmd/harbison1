import type { Metadata } from 'next'

import { About } from '@/components/about'
import { Areas } from '@/components/areas'
import { Contact } from '@/components/contact'
import { Faq } from '@/components/faq'
import { FloatingKeys } from '@/components/floating-keys'
import { Guides } from '@/components/guides'
import { Hero } from '@/components/hero'
import { JsonLd } from '@/components/json-ld'
import { Listings } from '@/components/listings'
import { Services } from '@/components/services'
import { Standard } from '@/components/standard'
import { Statement } from '@/components/statement'
import { Testimonials } from '@/components/testimonials'
import { faqs } from '@/lib/site'
import { faqSchema, pageMetadata, websiteSchema } from '@/lib/seo'

// The site chrome (header, main landmark, footer, mobile action bar) is
// rendered once in app/layout.tsx so every route gets it. It used to be
// duplicated on the homepage only, which left the other nine pages rendering
// with no navigation at all.

export const metadata: Metadata = pageMetadata({
  title: 'Real Estate in Tehachapi & Kern County, CA',
  description:
    'Nathanael Harbison, REALTOR® DRE #02059393, helps you buy, sell, and invest in Tehachapi, Bakersfield, and Kern County. Current listings, market context, and a clear next step.',
  path: '/',
  image: '/images/hero-1600.webp',
  imageAlt: 'Harbison Standard — real estate in Kern County, California',
})

export default function Page() {
  return (
    <>
      {/* The site as an entity, and the visible FAQ accordion as structured
          data. Both read from the same source as what is rendered below, so
          the markup cannot describe something the page does not say. */}
      <JsonLd data={websiteSchema()} />
      <JsonLd data={faqSchema(faqs)} />
      <Hero />
      <Standard />
      <Services />
      <About />
      <div className="relative isolate">
        <FloatingKeys />
        <Listings />
      </div>
      <Areas />
      <Statement />
      <div className="relative isolate">
        <FloatingKeys />
        <Testimonials />
      </div>
      <Guides />
      <Faq />
      <Contact />
    </>
  )
}
