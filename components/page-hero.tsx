import { Reveal } from '@/components/reveal'

type Props = {
  eyebrow: string
  title: string
  intro?: string
  image?: string
}

export function PageHero({ eyebrow, title, intro, image }: Props) {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 text-ink-foreground md:pt-44">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
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
