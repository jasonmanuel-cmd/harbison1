import type { Metadata } from 'next'
import { privateSaleContent } from '@/lib/site'
import { ContentPage } from '@/components/content-page'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata: Metadata = {
  title: 'Sell Your House Privately | Harbison Standard',
  description:
    'Sell your house privately in Kern County without MLS, Zillow, open houses, or a sign in the yard. Confidential, as-is, fast close.',
}

export default function PrivateSalePage() {
  return (
    <ContentPage
      eyebrow="Private Sale Program"
      title={privateSaleContent.title}
      intro={privateSaleContent.intro}
      image="/images/property/958-fairway-dr-1.webp"
      points={privateSaleContent.points}
      outro={privateSaleContent.areas}
    >
      <div className="rounded-sm border border-border bg-background p-6 text-foreground md:p-8">
        <p className="eyebrow text-muted-foreground">Considering a private sale?</p>
        <h3 className="mt-3 font-display text-xl tracking-wide">Talk it through confidentially.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No obligation. A private conversation about your situation and whether a quiet sale makes sense.
        </p>
        <div className="mt-6">
          <InquiryForm defaultGoal="Selling" dark={false} compact />
        </div>
      </div>
    </ContentPage>
  )
}
