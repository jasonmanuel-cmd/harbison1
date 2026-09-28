import type { Metadata } from 'next'
import { landContent } from '@/lib/site'
import { ContentPage } from '@/components/content-page'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata: Metadata = {
  title: 'Cheap Land in Kern County | Harbison Standard',
  description:
    'View current land listings and learn what your budget buys in Bakersfield, Tehachapi, and the surrounding areas.',
}

export default function LandPage() {
  return (
    <ContentPage
      eyebrow="Land"
      title={landContent.title}
      intro={landContent.intro}
      image="/images/property/chalet-tehachapi-1.jpg"
      points={landContent.points}
    >
      <div className="rounded-sm border border-border bg-background p-6 text-foreground md:p-8">
        <p className="eyebrow text-muted-foreground">Looking at land?</p>
        <h3 className="mt-3 font-display text-xl tracking-wide">Analyze the deal first.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Zoning, utilities, access, and exit strategy — understand what a parcel is actually worth before you buy.
        </p>
        <div className="mt-6">
          <InquiryForm defaultGoal="Investing" dark={false} compact />
        </div>
      </div>
    </ContentPage>
  )
}
