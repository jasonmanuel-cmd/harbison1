import { About } from '@/components/about'
import { Areas } from '@/components/areas'
import { Contact } from '@/components/contact'
import { Faq } from '@/components/faq'
import { FloatingKeys } from '@/components/floating-keys'
import { Guides } from '@/components/guides'
import { Hero } from '@/components/hero'
import { Listings } from '@/components/listings'
import { Services } from '@/components/services'
import { ConnectPill, MobileActionBar, SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Standard } from '@/components/standard'
import { Statement } from '@/components/statement'
import { Testimonials } from '@/components/testimonials'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Harbison Standard — Nathanael Harbison',
  url: 'https://www.harbisonstandard.com',
  telephone: '+1-661-472-7499',
  email: 'nate85.realtor@gmail.com',
  image: 'https://www.harbisonstandard.com/assets/headshot.webp',
  areaServed: ['Tehachapi, CA', 'Bakersfield, CA', 'California City, CA', 'Stallion Springs, CA', 'Kern County, CA'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="relative">
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
      </main>
      <SiteFooter />
      <ConnectPill />
      <MobileActionBar />
    </>
  )
}
