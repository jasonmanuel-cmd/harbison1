import { contact } from '@/lib/site'

const reviews = [
  {
    quote:
      "Nathanael was honest, responsive, and easy to work with from start to finish. He understood what we were looking for and didn't waste our time with properties that didn't fit.",
    who: 'Buyer · Bakersfield',
  },
  {
    quote:
      "We weren't sure whether to fix things up or sell as-is. Nathanael helped us think it through clearly and never made us feel pressured.",
    who: 'Seller · Time-sensitive sale',
  },
  {
    quote:
      'After three years of ownership, we wanted guidance on whether to hold or sell. Nathanael laid out the numbers and let us decide. That straight talk is exactly what we needed.',
    who: 'Investor · California City',
  },
  {
    quote:
      'Our inherited home felt overwhelming. Nathanael helped us understand the options and what the property was actually worth. We felt supported every step.',
    who: 'Seller · Inherited property',
  },
  {
    quote:
      "Coming from Los Angeles, we didn't know the Bakersfield market. Nathanael showed us what our budget could actually buy and helped us understand the neighborhoods.",
    who: 'Buyer · Relocated from LA',
  },
  {
    quote:
      'Nathanael brought calm, clarity, and practical advice throughout the sale. We always felt like we understood what was happening and why.',
    who: 'Seller · Kern County',
  },
]

export function Testimonials() {
  const [lead, ...rest] = reviews
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 id="reviews-heading" className="sr-only">
          What clients say
        </h2>
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="font-serif text-3xl leading-snug text-balance italic md:text-5xl">
            {`“${lead.quote}”`}
          </blockquote>
          <figcaption className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-brass">{lead.who}</figcaption>
        </figure>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {rest.map((r) => (
            <figure key={r.who} className="flex flex-col justify-between gap-6 rounded-md border border-border bg-card p-6">
              <blockquote className="text-sm leading-relaxed text-foreground/85">{`“${r.quote}”`}</blockquote>
              <figcaption className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {r.who}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={contact.reviews}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold underline decoration-brass underline-offset-8"
          >
            Read all reviews on Google
          </a>
        </div>
      </div>
    </section>
  )
}
