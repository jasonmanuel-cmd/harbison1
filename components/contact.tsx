import { contact } from '@/lib/site'
import { InquiryForm } from '@/components/inquiry-form'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-16 bg-ink py-24 text-ink-foreground md:py-32">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <p className="eyebrow text-ink-foreground/60">Direct line · Call or text</p>
        <a
          href={contact.phoneHref}
          className="mt-5 block font-display text-[clamp(2.5rem,8vw,7rem)] font-medium leading-none tracking-wide transition-colors hover:text-poppy"
        >
          {contact.phone}
        </a>

        <div className="mt-16 grid gap-12 border-t border-ink-foreground/20 pt-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <h2 id="contact-heading" className="text-4xl font-medium leading-tight tracking-wide text-balance md:text-5xl">
              Good things start with a conversation.
            </h2>
            <p className="max-w-md leading-relaxed text-ink-foreground/70">
              Buying your first home, planning a sale, or seeing potential in a property? Tell Nathanael what you have in
              mind. Most messages get a reply within 24 hours.
            </p>
            <ul className="label flex flex-col">
              <li>
                <a href={contact.smsHref} className="inline-flex min-h-11 items-center underline decoration-poppy decoration-2 underline-offset-8 hover:text-poppy">
                  Send a text
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex min-h-11 items-center break-all underline decoration-poppy decoration-2 underline-offset-8 hover:text-poppy"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-sm border border-ink-foreground/20 bg-ink-foreground/[0.03] p-6 md:p-10 lg:col-span-7">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  )
}
