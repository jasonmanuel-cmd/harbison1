import { Plus } from 'lucide-react'
import { contact } from '@/lib/site'

const faqs = [
  {
    q: 'Who is Nathanael Harbison?',
    a: `Nathanael Harbison is a California-licensed REALTOR® (DRE #${contact.dre}) at Harbison Standard. He helps buyers, sellers, and investors across Kern County.`,
  },
  {
    q: 'Where does Harbison Standard serve?',
    a: 'All of Kern County, including Tehachapi, Bakersfield, California City, and Stallion Springs — for buying, selling, and investing.',
  },
  {
    q: 'Can Nathanael help me sell my home?',
    a: 'Yes. Nathanael guides sellers through planned moves, inherited properties, homes needing repairs, and time-sensitive situations, including selling as-is when that makes sense.',
  },
  {
    q: 'Do you work with real estate investors?',
    a: 'Yes. Nathanael works with investors on rentals, flips, land, and value-add homes, and talks plainly about what makes sense for their goals.',
  },
  {
    q: 'How do I get in touch?',
    a: `Call or text ${contact.phone} or email ${contact.email}. Messages typically get a response within 24 hours.`,
  },
]

const steps = [
  { title: 'Start with a conversation', body: 'Share your situation, questions, or property goals.' },
  { title: 'Look at the details', body: 'Review the property, timing, numbers, and practical considerations.' },
  { title: 'Decide on the right move', body: 'Build a plan that fits — whether that means buying, selling, or waiting.' },
]

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">The process</p>
          <h2 className="mt-3 text-4xl font-medium text-balance md:text-5xl">Three steps. No pressure.</h2>
          <ol className="mt-10 flex flex-col gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="font-serif text-4xl leading-none text-brass" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-7">
          <h2 id="faq-heading" className="text-4xl font-medium text-balance md:text-5xl">
            Quick answers, before you reach out.
          </h2>
          <div className="mt-8 border-t border-border">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="size-5 shrink-0 text-brass transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="pb-6 leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
