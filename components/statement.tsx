import { Reveal } from '@/components/reveal'

export function Statement() {
  return (
    <section
      aria-label="The Harbison Standard"
      className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-ink bg-cover bg-center text-ink-foreground lg:bg-fixed"
      style={{ backgroundImage: "url('/images/property/2300-weybridge-dr-2.webp')" }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-ink/60" />
      <Reveal className="relative mx-auto max-w-4xl px-5 py-24 text-center">
        <p className="eyebrow text-ink-foreground/80">The Harbison Standard</p>
        <p className="mt-6 font-display text-4xl font-medium leading-tight tracking-wide text-balance md:text-6xl">
          {"It's not what you do. It's "}
          <span className="text-poppy">how</span>
          {' you do it.'}
        </p>
        <a
          href="#contact"
          className="pill mt-10 border border-ink-foreground/70 hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink"
        >
          Start a conversation
        </a>
      </Reveal>
    </section>
  )
}
