import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { guides } from '@/lib/site'
import { Reveal } from '@/components/reveal'

export function Guides() {
  return (
    <section id="guides" aria-labelledby="guides-heading" className="scroll-mt-16 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-muted-foreground">Resources</p>
            <h2 id="guides-heading" className="mt-4 text-4xl font-medium tracking-wide md:text-6xl">
              Guides for <span className="italic text-poppy">your search.</span>
            </h2>
          </div>
          <Link href="/guides" className="label shrink-0 text-muted-foreground transition-colors hover:text-poppy">
            View all guides →
          </Link>
        </Reveal>

        <ul className="mt-14 grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => (
            <Reveal key={g.slug} delay={(i % 3) * 80}>
              <li className="h-full bg-background">
                <Link
                  href={`/${g.slug}`}
                  className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-secondary"
                >
                  <span className="font-display text-4xl font-medium text-poppy/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-2xl tracking-wide">{g.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{g.body}</p>
                  <span className="label mt-auto flex items-center gap-2 text-poppy">
                    Read more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
