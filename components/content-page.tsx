import type { ReactNode } from 'react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow: string
  title: string
  intro: string
  image?: string
  points: string[]
  outro?: string
  children?: ReactNode
  light?: boolean
}

export function ContentPage({ eyebrow, title, intro, image, points, outro, children, light = false }: Props) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} image={image} />
      <section className={cn('py-16 md:py-24', light ? 'bg-background text-foreground' : 'bg-secondary text-foreground')}>
        <div className="mx-auto max-w-[90rem] px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <ol className="flex flex-col gap-8">
                {points.map((point, i) => (
                  <Reveal
                    key={i}
                    as="li"
                    delay={i * 60}
                    className="flex gap-6 border-t border-foreground/15 pt-6"
                  >
                    <span aria-hidden="true" className="font-display text-3xl font-medium text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-lg leading-relaxed text-muted-foreground text-pretty">{point}</p>
                  </Reveal>
                ))}
              </ol>
              {outro && (
                <Reveal delay={points.length * 60}>
                  <p className="mt-12 max-w-2xl text-lg leading-relaxed text-foreground text-pretty">{outro}</p>
                </Reveal>
              )}
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={150}>
                <div className="lg:sticky lg:top-28">{children}</div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
