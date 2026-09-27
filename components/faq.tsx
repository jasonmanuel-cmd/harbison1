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
    <section id="faq" aria-labelledby="faq-heading" className="py-20 md:py-28">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <h2 className="wide text-4xl font-extrabold uppercase leading-none tracking-tight md:text-6xl">
          Three steps. No pressure.
        </h2>
        <ol className="mt-12 grid border-t border-ink md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 border-b border-border py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <span className="wide text-6xl font-extrabold leading-none text-poppy" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-24 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-muted-foreground">Before you reach out</p>
            <h2 id="faq-heading" className="mt-3 text-3xl font-medium text-balance md:text-4xl">
              Quick answers.
            </h2>
          </div>
          <div className="border-t border-ink lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium md:text-xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="size-5 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="max-w-2xl pb-6 leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
