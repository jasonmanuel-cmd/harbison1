import { Plus } from 'lucide-react'
import { contact, faqs } from '@/lib/site'
import { Reveal } from '@/components/reveal'


const steps = [
  { title: 'Start with a conversation', body: 'Share your situation, questions, or property goals.' },
  { title: 'Look at the details', body: 'Review the property, timing, numbers, and practical considerations.' },
  { title: 'Decide on the right move', body: 'Build a plan that fits — whether that means buying, selling, or waiting.' },
]

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-16 bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <Reveal className="text-center">
          <p className="eyebrow text-muted-foreground">How it works</p>
          <h2 className="mt-5 text-4xl font-medium tracking-wide md:text-6xl">Three steps. No pressure.</h2>
        </Reveal>
        <ol className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal
              key={s.title}
              as="li"
              delay={i * 120}
              className="flex flex-col items-center gap-4 text-center"
            >
              <span
                aria-hidden="true"
                className="flex size-14 items-center justify-center rounded-full border border-gold font-display text-xl text-foreground"
              >
                {i + 1}
              </span>
              <h3 className="text-xl tracking-wide">{s.title}</h3>
              <p className="max-w-xs leading-relaxed text-muted-foreground">{s.body}</p>
            </Reveal>
          ))}
        </ol>

        <div className="mx-auto mt-24 max-w-3xl">
          <Reveal className="text-center">
            <p className="eyebrow text-muted-foreground">Before you reach out</p>
            <h2 id="faq-heading" className="mt-5 text-3xl font-medium tracking-wide md:text-5xl">
              Questions
            </h2>
          </Reveal>
          <div className="mt-10 border-t border-foreground/20">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-foreground/20">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg tracking-wide md:text-xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/25 transition-colors group-open:border-poppy group-open:bg-poppy">
                    <Plus className="size-4 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                  </span>
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
