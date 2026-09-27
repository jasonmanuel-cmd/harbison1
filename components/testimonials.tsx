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
    <section id="reviews" aria-labelledby="reviews-heading" className="border-t border-ink py-20 md:py-28">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 md:px-8 lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-6 lg:col-span-4">
          <div>
            <p className="label text-muted-foreground">Client notes</p>
            <h2 id="reviews-heading" className="wide mt-3 text-4xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
              In their words.
            </h2>
          </div>
          <a
            href={contact.reviews}
            target="_blank"
            rel="noopener noreferrer"
            className="label self-start underline decoration-poppy decoration-2 underline-offset-8 hover:hl"
          >
            Read all reviews on Google
          </a>
        </div>
        <figure className="lg:col-span-8">
          <blockquote className="text-3xl font-medium leading-snug tracking-tight text-balance md:text-5xl">
            <span aria-hidden="true" className="text-poppy">
              “
            </span>
            {lead.quote}
            <span aria-hidden="true" className="text-poppy">
              ”
            </span>
          </blockquote>
          <figcaption className="label mt-6 text-muted-foreground">{lead.who}</figcaption>
        </figure>
      </div>

      <div className="mx-auto mt-16 max-w-[90rem] px-5 md:px-8">
        <ul className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4" aria-label="More client reviews">
          {rest.map((r) => (
            <li key={r.who} className="w-80 shrink-0 snap-start md:w-96">
              <figure className="flex h-full flex-col justify-between gap-6 border-t-2 border-ink pt-5">
                <blockquote className="leading-relaxed">{`“${r.quote}”`}</blockquote>
                <figcaption className="label text-muted-foreground">{r.who}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
