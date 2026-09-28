import { About } from '@/components/about'
import { Areas } from '@/components/areas'
import { Contact } from '@/components/contact'
import { Faq } from '@/components/faq'
import { FloatingKeys } from '@/components/floating-keys'
import { Guides } from '@/components/guides'
import { Hero } from '@/components/hero'
import { Listings } from '@/components/listings'
import { Services } from '@/components/services'
import { Standard } from '@/components/standard'
import { Statement } from '@/components/statement'
import { Testimonials } from '@/components/testimonials'

// The site chrome (header, main landmark, footer, mobile action bar) is
// rendered once in app/layout.tsx so every route gets it. It used to be
// duplicated on the homepage only, which left the other nine pages rendering
// with no navigation at all.

export default function Page() {
  return (
    <>
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
