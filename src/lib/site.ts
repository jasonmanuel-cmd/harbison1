export const SITE_NAME = 'Harbison Standard'
export const SITE_URL = 'https://www.harbisonstandard.com'
export const TAGLINE = 'It’s not what you do. It’s how you do it.'

export const contact = {
  name: 'Nathanael Harbison',
  phone: '(661) 472-7499',
  phoneE164: '+16614727499',
  phoneHref: 'tel:+16614727499',
  smsHref: 'sms:+16614727499',
  email: 'nate85.realtor@gmail.com',
  dre: '02059393',
  youtube: 'https://www.youtube.com/@Nathanaelharbison',
  instagram: 'https://www.instagram.com/nathanaelharbison',
  facebook: 'https://www.facebook.com/nate85.realtor',
  linkedin: 'https://www.linkedin.com/in/nathanael-harbison',
  reviews: 'https://www.google.com/search?q=Harbison+Standard+reviews',
}

export const serviceArea = ['Tehachapi, CA', 'Bakersfield, CA', 'California City, CA', 'Stallion Springs, CA', 'Kern County, CA']

export const primaryNav = [
  { href: '/properties', label: 'Properties' },
  { href: '/areas', label: 'Neighborhoods' },
  { href: '/private-sale', label: 'Private Sale' },
]

export const menuLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/areas', label: 'Neighborhoods' },
  { href: '/relocate', label: 'Relocate from LA' },
  { href: '/private-sale', label: 'Private Sale' },
  { href: '/off-market-deals', label: 'Off-Market Deals' },
  { href: '/why-tehachapi', label: 'Why Tehachapi' },
  { href: '/land', label: 'Land' },
  { href: '/about', label: 'Meet Nathanael' },
  { href: '/guides', label: 'Guides' },
  { href: '/contact', label: 'Let’s connect' },
]

export const socials = [
  { href: contact.reviews, label: 'Google reviews' },
  { href: contact.youtube, label: 'YouTube' },
  { href: contact.instagram, label: 'Instagram' },
  { href: contact.facebook, label: 'Facebook' },
  { href: contact.linkedin, label: 'LinkedIn' },
]

export const values = [
  { title: 'Property perspective', body: 'A more informed eye for condition, repairs, and potential.' },
  { title: 'Straightforward advice', body: 'Clear communication without pressure or complexity.' },
  { title: 'A plan built around you', body: 'Shaped around your budget, timeline, and reason for moving.' },
  { title: 'Local understanding', body: 'Grounded knowledge of Kern County and Tehachapi.' },
]

export const testimonials = [
  {
    quote:
      'Nathanael was honest, responsive, and easy to work with from start to finish. He understood what we were looking for and didn’t waste our time with properties that didn’t fit.',
    who: 'Buyer · Bakersfield',
  },
  {
    quote:
      'We weren’t sure whether to fix things up or sell as-is. Nathanael helped us think it through clearly and never made us feel pressured.',
    who: 'Seller · Time-sensitive sale',
  },
  {
    quote:
      'After three years of ownership, we wanted guidance on whether to hold or sell. Nathanael laid out the numbers and let us decide. That straight talk is exactly what we needed.',
    who: 'Investor · California City',
  },
  {
    quote:
      'Our inherited home felt overwhelming. Nathanael helped us understand the options and what the property was actually worth. We felt supported every step.',
    who: 'Seller · Inherited property',
  },
  {
    quote:
      'Coming from Los Angeles, we didn’t know the Bakersfield market. Nathanael showed us what our budget could actually buy and helped us understand the neighborhoods.',
    who: 'Buyer · Relocated from LA',
  },
  {
    quote:
      'Nathanael brought calm, clarity, and practical advice throughout the sale. We always felt like we understood what was happening and why.',
    who: 'Seller · Kern County',
  },
]

export const faqs = [
  {
    q: 'Who is Nathanael Harbison?',
    a: `Nathanael Harbison is a California-licensed REALTOR® (DRE #${contact.dre}) at Harbison Standard. He helps buyers, sellers, and investors across Kern County.`,
  },
  {
    q: 'Where does Harbison Standard serve?',
    a: 'All of Kern County, including Tehachapi, Bakersfield, California City, and Stallion Springs — for buying, selling, and investing.',
  },
  {
    q: 'Can Nathanael help me sell my home?',
    a: 'Yes. Nathanael guides sellers through planned moves, inherited properties, homes needing repairs, and time-sensitive situations, including selling as-is when that makes sense.',
  },
  {
    q: 'Do you work with real estate investors?',
    a: 'Yes. Nathanael works with investors on rentals, flips, land, and value-add homes, and talks plainly about what makes sense for their goals.',
  },
  {
    q: 'How do I get in touch?',
    a: `Call or text ${contact.phone} or email ${contact.email}. Messages typically get a response within 24 hours.`,
  },
]

export const steps = [
  { title: 'Start with a conversation', body: 'Share your situation, questions, or property goals.' },
  { title: 'Look at the details', body: 'Review the property, timing, numbers, and practical considerations.' },
  { title: 'Decide on the right move', body: 'Build a plan that fits — whether that means buying, selling, or waiting.' },
]

export const services = [
  {
    label: 'Buy',
    goal: 'Buying',
    body: 'See what your budget really buys and which neighborhoods match the way you live — local or relocating from LA.',
    photo: '28211-seabiscuit-way-1',
    alt: 'Stallion Springs home on three-quarters of an acre',
    href: '/properties',
  },
  {
    label: 'Sell',
    goal: 'Selling',
    body: 'Timing, repairs, pricing, and a plan — including inherited, as-is, and private off-MLS sales.',
    photo: '958-fairway-dr-2',
    alt: 'Renovated Stockdale Country Club home',
    href: '/private-sale',
  },
  {
    label: 'Invest',
    goal: 'Investing',
    body: 'Rentals, flips, land, and value-add — with the real numbers first, and honest hold-or-sell advice.',
    photo: 'chalet-property-1',
    alt: 'Twenty acres with valley views in Tehachapi',
    href: '/off-market-deals',
  },
]

// ---------------------------------------------------------------- formatting

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const formatPrice = (price: number) => usd.format(price)

/** $1.2M / $899K — for tight UI like map pins and chips. */
export function formatPriceShort(price: number) {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 2).replace(/\.?0+$/, '')}M`
  if (price >= 1_000) return `$${Math.round(price / 1_000)}K`
  return usd.format(price)
}

export function formatDate(value: Date) {
  return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
