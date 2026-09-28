import type { Metadata } from 'next'
import { relocateContent } from '@/lib/site'
import { ContentPage } from '@/components/content-page'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata: Metadata = {
  title: 'Moving from Los Angeles to Bakersfield | Harbison Standard',
  description:
    'Compare what your budget buys in Bakersfield vs Los Angeles. Community selection, schools, lifestyle fit, and long-term strategy for Kern County relocators.',
}

export default function RelocatePage() {
  return (
    <ContentPage
      eyebrow="Relocate"
      title={relocateContent.title}
      intro={relocateContent.intro}
      image="/images/property/28211-seabiscuit-way-1.webp"
      points={relocateContent.points}
      outro={relocateContent.outro}
    >
      <div className="rounded-sm border border-border bg-background p-6 text-foreground md:p-8">
        <p className="eyebrow text-muted-foreground">Create a buyer profile</p>
        <h3 className="mt-3 font-display text-xl tracking-wide">See what your budget buys.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Tell Nathanael your budget, timeline, and priorities — get a realistic picture of Kern County options.
        </p>
        <div className="mt-6">
          <InquiryForm defaultGoal="Buying" dark={false} compact />
        </div>
      </div>
    </ContentPage>
  )
}
