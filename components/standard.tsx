import { listings } from '@/lib/site'
import { Reveal } from '@/components/reveal'

const stats = [
  { value: String(listings.length), label: 'Active & recent properties' },
  { value: '2', label: 'Markets — mountain & valley' },
  { value: '24 hr', label: 'Typical reply time' },
]

export function Standard() {
  return (
    <section id="standard" aria-labelledby="standard-heading" className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
        <Reveal>
          <p className="eyebrow text-muted-foreground">Setting the standard</p>
          <h2 id="standard-heading" className="mt-5 text-4xl font-medium tracking-wide text-balance md:text-6xl">
            Real estate, done the right way.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground text-pretty">
            Practical advice, direct communication, and a clear next step — for buyers, sellers, and investors across
            Tehachapi, Bakersfield, and all of Kern County.
          </p>
        </Reveal>
        <dl className="mt-16 grid gap-12 sm:grid-cols-3">
          {stats.map((s, i) => (
            /* Reveal must be the element that directly contains the dt/dd, or
               the list semantics break. */
            <Reveal key={s.label} delay={i * 120} className="flex flex-col-reverse items-center gap-3">
              <dt className="label text-muted-foreground">{s.label}</dt>
              <dd className="font-display text-5xl font-medium md:text-6xl">{s.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
