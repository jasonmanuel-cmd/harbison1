import type { Metadata } from 'next'
import { contact } from '@/lib/site'
import { PageHero } from '@/components/page-hero'
import { InquiryForm } from '@/components/inquiry-form'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Contact | Harbison Standard',
  description:
    'Call or text (661) 472-7499 or send a message to Nathanael Harbison, REALTOR® DRE #02059393. Most messages get a reply within 24 hours.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Direct line · Call or text"
        title="Let's Connect"
        intro="Share your real estate question, situation, or inquiry. Nathanael responds within 24 hours. The more context you provide, the better he can address your specific situation."
      />

      <section className="bg-ink py-16 text-ink-foreground md:py-24">
        <div className="mx-auto max-w-[90rem] px-5 md:px-8">
          <Reveal>
            <a
              href={contact.phoneHref}
              className="font-display text-[clamp(2.5rem,8vw,7rem)] font-medium leading-none tracking-wide transition-colors hover:text-poppy"
            >
              {contact.phone}
            </a>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
              <a href={contact.smsHref} className="label inline-flex min-h-11 items-center underline decoration-poppy decoration-2 underline-offset-8 hover:text-poppy">
                Send a text
              </a>
              <a href={`mailto:${contact.email}`} className="label inline-flex min-h-11 items-center break-all underline decoration-poppy decoration-2 underline-offset-8 hover:text-poppy">
                {contact.email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={120} className="mt-16">
            <div className="rounded-sm border border-ink-foreground/20 bg-ink-foreground/[0.03] p-6 md:p-10">
              <h2 className="font-display text-2xl tracking-wide md:text-3xl">Send a message</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-foreground/60">
                Buying your first home, planning a sale, or seeing potential in a property? Tell Nathanael what you have in mind.
              </p>
              <div className="mt-8">
                <InquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
