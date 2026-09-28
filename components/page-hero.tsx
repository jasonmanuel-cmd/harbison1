import { Breadcrumbs } from '@/components/breadcrumbs'
import { Reveal } from '@/components/reveal'
import { ResponsiveImage } from '@/lib/images'

type Props = {
  eyebrow: string
  title: string
  intro?: string
  image?: string
  /**
   * The full breadcrumb trail, ending with the current page. The last
   * entry is rendered as the current page rather than a link. Rendered
   * visibly and emitted as BreadcrumbList markup by the same component, so
   * the two cannot disagree.
   */
  trail?: { name: string; path: string }[]
}

export function PageHero({ eyebrow, title, intro, image, trail }: Props) {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 text-ink-foreground md:pt-44">
      {image && (
        <ResponsiveImage
          src={image}
          slot="hero"
          alt=""
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
      {trail && (
        <div className="relative mx-auto max-w-[90rem] px-5 md:px-8">
          <Breadcrumbs tone="light" trail={trail} />
        </div>
      )}
      <Reveal className="relative mx-auto max-w-[90rem] px-5 pb-16 md:px-8 md:pb-24">
        <p className="eyebrow text-ink-foreground/60">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-wide text-balance md:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-foreground/75 text-pretty">
            {intro}
          </p>
        )}
      </Reveal>
    </section>
  )
}
