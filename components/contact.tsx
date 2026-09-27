'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Mail, MessageSquare, Phone } from 'lucide-react'
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

  const body = [
    `Goal: ${goal}`,
    timeline && `Timeline: ${timeline}`,
    `Name: ${name}`,
    phone && `Phone: ${phone}`,
    '',
    message,
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n')

  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`${goal} — ${name}`)}&body=${encodeURIComponent(body)}`

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">Not sure where to start?</p>
          <h2 id="contact-heading" className="mt-3 text-4xl font-medium text-balance md:text-6xl">
            Good things start with a conversation.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            Buying your first home, planning a sale, or seeing potential in a property? Tell Nathanael what you have in
            mind. Most messages get a reply within 24 hours.
          </p>
          <ul className="mt-10 flex flex-col gap-4">
            <li>
              <a href={contact.phoneHref} className="flex items-center gap-3 font-medium hover:text-brass">
                <Phone className="size-5 text-brass" aria-hidden="true" /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.smsHref} className="flex items-center gap-3 font-medium hover:text-brass">
                <MessageSquare className="size-5 text-brass" aria-hidden="true" /> Text directly
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 font-medium break-all hover:text-brass">
                <Mail className="size-5 text-brass" aria-hidden="true" /> {contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-md border border-border bg-card p-6 md:p-10 lg:col-span-7">
          <ol className="flex gap-2" aria-label="Progress">
            {['Your goal', 'Your details', 'Review'].map((label, i) => (
              <li key={label} className="flex-1">
                <span className={cn('block h-1 rounded-full', i <= step ? 'bg-brass' : 'bg-muted')} />
                <span
                  className={cn('mt-2 block text-xs font-medium', i === step ? 'text-foreground' : 'text-muted-foreground')}
                  aria-current={i === step ? 'step' : undefined}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>

          {step === 0 && (
            <fieldset className="mt-8">
              <legend className="font-serif text-3xl">{"What's your next move?"}</legend>
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
                      'rounded-md border p-5 text-left transition-colors',
                      goal === g.id ? 'border-brass bg-brass/10' : 'border-border hover:border-foreground/40',
                    )}
                  >
                    <span className="block font-semibold">{g.id}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{g.hint}</span>
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
              <h3 className="font-serif text-3xl">A few details</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" id="name">
                  <input id="name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
                </Field>
                <Field label="Phone (optional)" id="phone">
                  <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
                </Field>
              </div>
              <fieldset>
                <legend className="text-sm font-medium">Timeline</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {timelines.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeline(t)}
                      aria-pressed={timeline === t}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm',
                        timeline === t ? 'border-ink bg-ink text-ink-foreground' : 'border-border',
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
              <StepNav onBack={() => setStep(0)} nextLabel="Review" />
            </form>
          )}

          {step === 2 && (
            <div className="mt-8">
              <h3 className="font-serif text-3xl">Look good?</h3>
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <Summary term="Goal" value={goal} />
                <Summary term="Timeline" value={timeline || 'Not specified'} />
                <Summary term="Name" value={name} />
                <Summary term="Phone" value={phone || 'Not provided'} />
              </dl>
              {message && <p className="mt-4 rounded-md bg-muted p-4 text-sm leading-relaxed">{message}</p>}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button type="button" onClick={() => setStep(1)} className="inline-flex items-center justify-center gap-2 px-2 py-3 text-sm font-semibold">
                  <ArrowLeft className="size-4" aria-hidden="true" /> Edit
                </button>
                <a href={mailto} className="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-7 py-4 text-sm font-semibold text-ink-foreground hover:opacity-90">
                  Send to Nathanael <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const inputClass =
  'mt-2 w-full rounded-sm border border-input bg-background px-4 py-3 text-base outline-none focus-visible:border-brass focus-visible:ring-2 focus-visible:ring-brass/30'

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

function Summary({ term, value }: { term: string; value: string }) {
  return (
    <div className="border-t border-border pt-3">
      <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{term}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}

function StepNav({ onBack, nextLabel }: { onBack: () => void; nextLabel: string }) {
  return (
    <div className="flex justify-between gap-3 pt-2">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </button>
      <button type="submit" className="inline-flex items-center gap-2 rounded-sm bg-ink px-7 py-3 text-sm font-semibold text-ink-foreground hover:opacity-90">
        {nextLabel} <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
