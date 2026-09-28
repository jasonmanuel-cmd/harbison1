import type { Metadata } from 'next'

import { contact, type Listing } from './site'

/**
 * Per-page metadata and structured data.
 *
 * Every page used to hand-roll its own `title` including the brand suffix,
 * which the root layout's title template then appended a second time --
 * "Properties | Harbison Standard | Harbison Standard". And because no page
 * declared `alternates`, they all inherited `canonical: '/'` from the root
 * layout, so every URL on the site told search engines it was a duplicate of
 * the homepage. Both are fixed by routing every page through pageMetadata(),
 * which owns the canonical, the social cards and the title suffix in one
 * place.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.harbisonstandard.com'
).replace(/\/$/, '')

export const BRAND = 'Harbison Standard'

/** Absolute URL for a site-relative path. Canonicals must be absolute. */
export function abs(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

type Args = {
  /** Bare page title. The brand suffix is appended here, not in the page. */
  title: string
  description: string
  /** Site-relative path, used for the canonical and og:url. */
  path: string
  /** Site-relative or absolute image for the social card. */
  image?: string
  imageAlt?: string
  /** Keeps sold/archived pages out of the index while still following links. */
  noindex?: boolean
}

export function pageMetadata({
  title,
  description,
  path,
  image = '/images/hero-1600.webp',
  imageAlt,
  noindex,
}: Args): Metadata {
  const url = abs(path)
  // The social card must be absolute for most crawlers to fetch it, and the
  // site-relative form here keeps the images interchangeable.
  const imageUrl = image.startsWith('http') ? image : abs(image)
  const fullTitle = title === BRAND ? title : `${title} | ${BRAND}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: BRAND,
      locale: 'en_US',
      url,
      title: fullTitle,
      description,
      images: [{ url: imageUrl, width: 1600, height: 900, alt: imageAlt ?? fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

/** Wraps nodes in a single @graph, which is how Google recommends combining. */
export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

export const orgId = `${SITE_URL}/#agent`
export const personId = `${SITE_URL}/#nathanael`

/** The agent, referenced by id from page-level nodes rather than repeated. */
export function agentRef() {
  return { '@id': orgId }
}

export function personRef() {
  return { '@id': personId }
}

/**
 * Breadcrumbs. Rendered as a visible trail by the pages that use it, so the
 * markup matches what a visitor actually sees rather than being schema-only.
 */
export function breadcrumbList(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  }
}

/**
 * A single property.
 *
 * RealEstateListing is the type Google documents for a specific home; it
 * carries the address, the physical facts and the offering terms, so the
 * details a buyer or an assistant would otherwise have to scrape off the page
 * are machine-readable. Every field is optional in the source Listing type,
 * so each one is only emitted when the listing actually states it -- an
 * invented bedroom count would be worse than no structured data at all.
 */
export function propertySchema(p: Listing) {
  const place = {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.address,
      addressLocality: p.city,
      addressRegion: 'CA',
      postalCode: p.zip,
      addressCountry: 'US',
    },
  }

  const residence: Record<string, unknown> = {
    ...place,
    // After the spread: place also carries an @type, and a later key wins.
    '@type': 'SingleFamilyResidence',
    name: `${p.address}, ${p.city}, CA ${p.zip}`,
  }
  if (typeof p.beds === 'number') residence.numberOfBedrooms = p.beds
  if (typeof p.baths === 'number') residence.numberOfBathroomsTotal = p.baths
  if (typeof p.sqft === 'number') {
    residence.floorSize = { '@type': 'QuantitativeValue', value: p.sqft, unitCode: 'FTK' }
  }
  if (p.features?.length) {
    residence.amenityFeature = p.features.map((f) => ({
      '@type': 'LocationFeatureSpecification',
      name: f,
      value: true,
    }))
  }
  if (p.image) residence.image = abs(p.image)

  const node: Record<string, unknown> = {
    ...place,
    // After the spread, for the same reason as above.
    '@type': 'RealEstateListing',
    name: `${p.address}, ${p.city}, CA`,
    description: p.blurb,
    url: abs(`/property/${p.slug}`),
    datePosted: p.date,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'USD',
      availability: p.status === 'Sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      seller: agentRef(),
      ...(p.date ? { priceValidUntil: p.date } : {}),
    },
  }
  if (p.image) node.image = abs(p.image)
  if (p.mls) node.identifier = { '@type': 'PropertyValue', name: 'MLS', value: p.mls }
  if (p.neighborhood) node.areaServed = p.neighborhood

  return graph(node, residence)
}

/** FAQ entries, for pages that render a question-and-answer list. */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/** The site-level search/identity node, emitted once on the homepage. */
export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND,
    publisher: { '@id': orgId },
    inLanguage: 'en-US',
  }
}

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: 'Nathanael Harbison',
    jobTitle: 'REALTOR®',
    description:
      'California-licensed REALTOR® serving buyers, sellers, and investors in Tehachapi, Bakersfield, and Kern County.',
    url: `${SITE_URL}/about`,
    telephone: contact.phone,
    email: contact.email,
    image: abs('/images/headshot.webp'),
    worksFor: { '@id': orgId },
    identifier: { '@type': 'PropertyValue', name: 'DRE License', value: `#${contact.dre}` },
    knowsAbout: [
      'Tehachapi real estate',
      'Kern County housing market',
      'Bakersfield real estate',
      'Land and acreage',
      'Relocation',
      'Private and off-market sales',
    ],
    sameAs: [contact.instagram, contact.facebook, contact.linkedin, contact.youtube],
  }
}

/** All routes that belong in the sitemap, with their crawl priority. */
export const ROUTES: { path: string; priority: number; freq: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1.0, freq: 'weekly' },
  { path: '/properties', priority: 0.9, freq: 'daily' },
  { path: '/about', priority: 0.6, freq: 'monthly' },
  { path: '/contact', priority: 0.8, freq: 'monthly' },
  { path: '/guides', priority: 0.7, freq: 'weekly' },
  { path: '/land', priority: 0.7, freq: 'weekly' },
  { path: '/relocate', priority: 0.7, freq: 'monthly' },
  { path: '/why-tehachapi', priority: 0.6, freq: 'monthly' },
  { path: '/private-sale', priority: 0.6, freq: 'monthly' },
  { path: '/off-market-deals', priority: 0.6, freq: 'monthly' },
]
