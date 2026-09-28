import type { Metadata } from 'next'
import { offMarketContent } from '@/lib/site'
import { ContentPage } from '@/components/content-page'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata: Metadata = {
  title: 'Off-Market Deals | Harbison Standard',
  description:
    'Private listings not on MLS or Zillow — tax-defaulted, pre-foreclosure, probate, FSBO. Get alerts before Zillow.',
}

export default function OffMarketPage() {
  return (
    <ContentPage
      eyebrow="Off-Market"
      title={offMarketContent.title}
      intro={offMarketContent.intro}
      image="/images/property/2206-ribble-valley-dr-1.webp"
      points={offMarketContent.points}
    >
      <div className="rounded-sm border border-border bg-background p-6 text-foreground md:p-8">
        <p className="eyebrow text-muted-foreground">Get off-market alerts</p>
        <h3 className="mt-3 font-display text-xl tracking-wide">Create a buyer profile.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your budget, area, and property type. Get alerts when a matching private lead is found — before it reaches Zillow.
        </p>
        <div className="mt-6">
          <InquiryForm defaultGoal="Investing" dark={false} compact />
        </div>
      </div>
    </ContentPage>
  )
}
