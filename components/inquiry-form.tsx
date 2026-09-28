'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, Check, Loader2, Mail } from 'lucide-react'
import { contact } from '@/lib/site'
import { cn } from '@/lib/utils'

const timelines = ['As soon as possible', 'Within 3 months', '3–6 months', '6–12 months', 'Just researching']
const financingOptions = ['Pre-approved', 'Talking with a lender', 'Cash buyer', 'Need a lender introduction', 'Not sure yet']
const propertyTypes = ['Single-family home', 'Land / acreage', 'Condo / townhome', 'Investment property', 'Open to options']
const acreageOptions = ['No requirement yet', 'Standard lot', 'Large lot', '0.5+ acre', '1+ acre', '2+ acres', '5+ acres', '10+ acres', 'Not sure']
const bedroomOptions = ['No minimum yet', '1+', '2+', '3+', '4+', '5+']

type Props = {
  defaultGoal?: string
  defaultInterest?: string
  dark?: boolean
  compact?: boolean
}

export function InquiryForm({ defaultGoal = '', defaultInterest = '', dark = true, compact = false }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [currentCity, setCurrentCity] = useState('')
  const [desiredArea, setDesiredArea] = useState('')
  const [budget, setBudget] = useState('')
  const [bedroom, setBedroom] = useState('')
  const [acreageReq, setAcreageReq] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [timeline, setTimeline] = useState('')
  const [financing, setFinancing] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle')
  const [error, setError] = useState('')

  const inputClass = dark
    ? 'mt-2 w-full border border-ink-foreground/25 bg-transparent px-4 py-3 text-base text-ink-foreground outline-none focus-visible:border-poppy focus-visible:ring-2 focus-visible:ring-poppy/30'
    : 'mt-2 w-full border border-foreground/25 bg-transparent px-4 py-3 text-base text-foreground outline-none focus-visible:border-poppy focus-visible:ring-2 focus-visible:ring-poppy/30'

  const labelClass = dark ? 'label text-ink-foreground/70' : 'label text-muted-foreground'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          current_city: currentCity,
          desired_area: desiredArea,
          budget,
          bedrooms: bedroom,
          acreage_requirement: acreageReq,
          property_type: propertyType,
          timeline,
          financing_status: financing,
          goal: defaultGoal,
          interest: defaultInterest,
          message,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }
      setStatus('sent')
    } catch (err) {
      // The lead service is not reachable. Fall back to a real, working
      // delivery path — the visitor's own email client — instead of
      // claiming a message was sent.
      setStatus('fallback')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const mailtoHref = useMemo(() => {
    const summary = [
      `Goal: ${defaultGoal || 'General inquiry'}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      currentCity && `Current city: ${currentCity}`,
      desiredArea && `Desired area: ${desiredArea}`,
      budget && `Budget: ${budget}`,
      bedroom && `Bedrooms: ${bedroom}`,
      acreageReq && `Acreage / lot: ${acreageReq}`,
      propertyType && `Property type: ${propertyType}`,
      timeline && `Timeline: ${timeline}`,
      financing && `Financing: ${financing}`,
      defaultInterest && `Property of interest: ${defaultInterest}`,
      message && `\n${message}`,
    ]
      .filter(Boolean)
      .join('\n')
    return `mailto:${contact.email}?subject=${encodeURIComponent(
      `Website inquiry — ${defaultGoal || 'General'}${name ? ` — ${name}` : ''}`,
    )}&body=${encodeURIComponent(summary)}`
  }, [
    defaultGoal,
    defaultInterest,
    name,
    phone,
    email,
    currentCity,
    desiredArea,
    budget,
    bedroom,
    acreageReq,
    propertyType,
    timeline,
    financing,
    message,
  ])

  if (status === 'fallback') {
    return (
      <div
        role="status"
        className={cn('flex flex-col items-center gap-4 py-10 text-center', dark ? 'text-ink-foreground' : 'text-foreground')}
      >
        <p className="font-display text-2xl tracking-wide">Send this straight to Nathanael</p>
        <p className={cn('max-w-md text-sm leading-relaxed', dark ? 'text-ink-foreground/70' : 'text-muted-foreground')}>
          Our online form is temporarily unavailable. Your details are ready below — the button opens your email app
          with everything filled in, addressed to Nathanael directly.
        </p>
        <a
          href={mailtoHref}
          className={cn(
            'pill mt-2 justify-center px-8',
            dark ? 'bg-poppy text-ink hover:bg-ink-foreground' : 'bg-ink text-ink-foreground hover:bg-poppy hover:text-ink',
          )}
        >
          <Mail className="size-4" aria-hidden="true" />
          Open email and send
        </a>
        <p className={cn('mt-2 text-xs', dark ? 'text-ink-foreground/50' : 'text-muted-foreground')}>
          Prefer to talk? Call or text{' '}
          <a href={contact.phoneHref} className="underline underline-offset-4 hover:text-poppy">
            {contact.phone}
          </a>
        </p>
      </div>
    )
  }

  if (status === 'sent') {
    return (
      <div className={cn('flex flex-col items-center gap-4 py-12 text-center', dark ? 'text-ink-foreground' : 'text-foreground')}>
        <span className="flex size-14 items-center justify-center rounded-full bg-poppy text-ink">
          <Check className="size-6" aria-hidden="true" />
        </span>
        <p className="font-display text-2xl tracking-wide">Thank you — your message is on its way.</p>
        <p className={cn('max-w-md text-sm leading-relaxed', dark ? 'text-ink-foreground/70' : 'text-muted-foreground')}>
          Nathanael typically responds within 24 hours. If it is urgent, call or text (661) 472-7499.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-5', compact && 'gap-4')}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-name" className={labelClass}>Full name *</label>
          <input id="inq-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="inq-phone" className={labelClass}>Phone *</label>
          <input id="inq-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-email" className={labelClass}>Email *</label>
          <input id="inq-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="inq-city" className={labelClass}>Current city</label>
          <input id="inq-city" value={currentCity} onChange={(e) => setCurrentCity(e.target.value)} autoComplete="address-level2" className={inputClass} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-area" className={labelClass}>Desired area</label>
          <input id="inq-area" value={desiredArea} onChange={(e) => setDesiredArea(e.target.value)} placeholder="e.g. Tehachapi, Bakersfield" className={inputClass} />
        </div>
        <div>
          <label htmlFor="inq-budget" className={labelClass}>Budget</label>
          <input id="inq-budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $400k–$600k" className={inputClass} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-bedrooms" className={labelClass}>Bedrooms</label>
          <select id="inq-bedrooms" value={bedroom} onChange={(e) => setBedroom(e.target.value)} className={cn(inputClass, 'appearance-none')}>
            <option value="">No minimum yet</option>
            {bedroomOptions.slice(1).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="inq-acreage" className={labelClass}>Acreage / lot requirement</label>
          <select id="inq-acreage" value={acreageReq} onChange={(e) => setAcreageReq(e.target.value)} className={cn(inputClass, 'appearance-none')}>
            <option value="">No requirement yet</option>
            {acreageOptions.slice(1).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-type" className={labelClass}>Property type</label>
          <select id="inq-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={cn(inputClass, 'appearance-none')}>
            <option value="">Open to options</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="inq-timeline" className={labelClass}>Timeline</label>
          <select id="inq-timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} className={cn(inputClass, 'appearance-none')}>
            <option value="">Select a timeline</option>
            {timelines.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="inq-financing" className={labelClass}>Financing status</label>
        <select id="inq-financing" value={financing} onChange={(e) => setFinancing(e.target.value)} className={cn(inputClass, 'appearance-none')}>
          <option value="">Not sure yet</option>
          {financingOptions.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="inq-message" className={labelClass}>Anything you'd like Nathanael to know?</label>
        <textarea id="inq-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} />
      </div>

      {status === 'sending' && error && (
        <p role="status" className={cn('border px-4 py-3 text-sm', dark ? 'border-ink-foreground/25 text-ink-foreground/70' : 'border-border text-muted-foreground')}>
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="pill w-full justify-center bg-poppy text-ink hover:bg-ink-foreground disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send message <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
        <p className={cn('mt-3 text-xs leading-relaxed', dark ? 'text-ink-foreground/50' : 'text-muted-foreground')}>
          No mailing-list signup. Your information is used to respond to this real-estate request.
        </p>
      </div>
    </form>
  )
}
