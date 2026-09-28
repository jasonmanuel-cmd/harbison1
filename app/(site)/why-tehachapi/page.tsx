import type { Metadata } from 'next'
import { whyTehachapiContent } from '@/lib/site'
import { ContentPage } from '@/components/content-page'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata: Metadata = {
  title: 'Why Tehachapi | Harbison Standard',
  description:
    'Discover what makes this mountain community different — affordable land, four seasons, top-rated schools, and a growing local economy.',
}

export default function WhyTehachapiPage() {
  return (
    <ContentPage
      eyebrow="Tehachapi · Elev. 3,970 ft"
      title={whyTehachapiContent.title}
      intro={whyTehachapiContent.intro}
      image="/images/property/28751-gleneagle-ct-1.webp"
      points={whyTehachapiContent.points}
    >
      <div className="rounded-sm border border-border bg-background p-6 text-foreground md:p-8">
        <p className="eyebrow text-muted-foreground">Exploring Tehachapi?</p>
        <h2 className="mt-3 font-display text-xl tracking-wide">Talk through the move.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Schools, neighborhoods, land, and what daily life actually looks like at 3,970 feet.
        </p>
        <div className="mt-6">
          <InquiryForm defaultGoal="Buying" dark={false} compact />
        </div>
      </div>
    </ContentPage>
  )
}
