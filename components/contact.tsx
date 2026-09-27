'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { contact } from '@/lib/site'
import { cn } from '@/lib/utils'

const goals = [
  { id: 'Buy a home', hint: 'Find a place that fits your budget and life.' },
  { id: 'Sell my home', hint: 'Pricing, prep, timing, or an as-is sale.' },
  { id: 'Invest', hint: 'Rentals, flips, land, or off-market deals.' },
  { id: 'Just exploring', hint: 'Questions first. No commitment.' },
]

const timelines = ['ASAP', '1–3 months', '3–6 months', '6+ months']

export function Contact() {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [timeline, setTimeline] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const body = [`Goal: ${goal}`, timeline && `Timeline: ${timeline}`, `Name: ${name}`, phone && `Phone: ${phone}`, '', message]
    .filter((line): line is string => typeof line === 'string')
    .join('\n')

  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`${goal} — ${name}`)}&body=${encodeURIComponent(body)}`

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-ink py-20 text-ink-foreground md:py-28">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <p className="label text-ink-foreground/60">Direct line · Call or text</p>
        <a
          href={contact.phoneHref}
          className="wide mt-4 block text-[clamp(2.5rem,9vw,9rem)] font-extrabold leading-none tracking-tight transition-colors hover:text-poppy"
        >
          {contact.phone}
        </a>

        <div className="mt-16 grid gap-12 border-t border-ink-foreground/20 pt-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <h2 id="contact-heading" className="wide text-3xl font-extrabold uppercase leading-none tracking-tight text-balance md:text-5xl">
              Good things start with a conversation.
            </h2>
            <p className="max-w-md leading-relaxed text-ink-foreground/70">
              Buying your first home, planning a sale, or seeing potential in a property? Tell Nathanael what you have in
              mind. Most messages get a reply within 24 hours.
            </p>
            <ul className="label flex flex-col gap-3">
              <li>
                <a href={contact.smsHref} className="underline decoration-poppy decoration-2 underline-offset-8 hover:text-poppy">
                  Send a text
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all underline decoration-poppy decoration-2 underline-offset-8 hover:text-poppy"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="border border-ink-foreground/20 p-6 md:p-10 lg:col-span-7">
            <ol className="flex gap-2" aria-label="Progress">
              {['Your goal', 'Your details', 'Review'].map((label, i) => (
                <li key={label} className="flex-1">
                  <span className={cn('block h-1', i <= step ? 'bg-poppy' : 'bg-ink-foreground/15')} />
                  <span
                    className={cn('label mt-2 block', i === step ? 'text-ink-foreground' : 'text-ink-foreground/50')}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ol>

            {step === 0 && (
              <fieldset className="mt-8">
                <legend className="wide text-2xl font-bold uppercase tracking-tight">{"What's your next move?"}</legend>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setGoal(g.id)
                        setStep(1)
                      }}
                      aria-pressed={goal === g.id}
                      className={cn(
                        'border p-5 text-left transition-colors',
                        goal === g.id ? 'border-poppy bg-poppy/10' : 'border-ink-foreground/20 hover:border-ink-foreground/60',
                      )}
                    >
                      <span className="block font-semibold">{g.id}</span>
                      <span className="mt-1 block text-sm text-ink-foreground/60">{g.hint}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <form
                className="mt-8 flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  setStep(2)
                }}
              >
                <h3 className="wide text-2xl font-bold uppercase tracking-tight">A few details</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" id="name">
                    <input id="name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
                  </Field>
                  <Field label="Phone (optional)" id="phone">
                    <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
                  </Field>
                </div>
                <fieldset>
                  <legend className="label text-ink-foreground/70">Timeline</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {timelines.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeline(t)}
                        aria-pressed={timeline === t}
                        className={cn(
                          'border px-4 py-2 text-sm transition-colors',
                          timeline === t ? 'border-poppy bg-poppy text-ink' : 'border-ink-foreground/25 hover:border-ink-foreground/60',
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <Field label="Anything you'd like Nathanael to know?" id="message">
                  <textarea id="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} />
                </Field>
                <div className="flex justify-between gap-3 pt-2">
                  <button type="button" onClick={() => setStep(0)} className="label inline-flex items-center gap-2 px-2 py-3">
                    <ArrowLeft className="size-4" aria-hidden="true" /> Back
                  </button>
                  <button type="submit" className="label inline-flex items-center gap-2 bg-poppy px-7 py-4 text-ink hover:bg-ink-foreground">
                    Review <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="mt-8">
                <h3 className="wide text-2xl font-bold uppercase tracking-tight">Look good?</h3>
                <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <Summary term="Goal" value={goal} />
                  <Summary term="Timeline" value={timeline || 'Not specified'} />
                  <Summary term="Name" value={name} />
                  <Summary term="Phone" value={phone || 'Not provided'} />
                </dl>
                {message && <p className="mt-4 bg-ink-foreground/5 p-4 text-sm leading-relaxed">{message}</p>}
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button type="button" onClick={() => setStep(1)} className="label inline-flex items-center justify-center gap-2 px-2 py-3">
                    <ArrowLeft className="size-4" aria-hidden="true" /> Edit
                  </button>
                  <a href={mailto} className="label inline-flex items-center justify-center gap-2 bg-poppy px-7 py-4 text-ink hover:bg-ink-foreground">
                    Send to Nathanael <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const inputClass =
  'mt-2 w-full border border-ink-foreground/25 bg-transparent px-4 py-3 text-base text-ink-foreground outline-none focus-visible:border-poppy focus-visible:ring-2 focus-visible:ring-poppy/30'

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label text-ink-foreground/70">
        {label}
      </label>
      {children}
    </div>
  )
}

function Summary({ term, value }: { term: string; value: string }) {
  return (
    <div className="border-t border-ink-foreground/20 pt-3">
      <dt className="label text-ink-foreground/60">{term}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
