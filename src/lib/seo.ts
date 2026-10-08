import { SITE_NAME, SITE_URL, contact } from './site'
import type { Listing } from './listings'

/**
 * Structured data, in one place.
 *
 * The organisation and the agent are emitted as one @graph on every page (see
 * layouts/Base.astro), so the @id references from page-level nodes — offers,
 * listings, articles — always resolve, and the entity is described identically
 * everywhere an assistant might encounter it.
 */

/** Absolute URL for a site-relative path. Canonicals and schema URLs must be absolute. */
export function abs(path: string): string {
  if (path.startsWith('http')) return path
  return path === '/' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** Wraps nodes in a single @graph, which is how Google recommends combining them. */
export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

export const orgId = `${SITE_URL}/#agent`
export const personId = `${SITE_URL}/#nathanael`
export const agentRef = () => ({ '@id': orgId })
export const personRef = () => ({ '@id': personId })

export const SITE_DESCRIPTION =
  'Nathanael Harbison, REALTOR® DRE #02059393, helps you buy, sell, and invest in Tehachapi, Bakersfield, and Kern County. Current listings, market context, and a clear next step.'

export function agentSchema(image: string) {
  return {
    '@type': 'RealEstateAgent',
    '@id': orgId,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: contact.phone,
    email: contact.email,
    image,
    logo: abs('/icon-512.png'),
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: 'Tehachapi', addressRegion: 'CA', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 35.068, longitude: -118.4468 },
    areaServed: [
      { '@type': 'City', name: 'Tehachapi' },
      { '@type': 'City', name: 'Bakersfield' },
      { '@type': 'City', name: 'Newbury Park' },
      { '@type': 'AdministrativeArea', name: 'Kern County, California' },
    ],
    // Referenced by id, so the person node is the single definition of who this is.
    founder: personRef(),
    employee: personRef(),
    sameAs: [contact.instagram, contact.facebook, contact.linkedin, contact.youtube],
  }
}

export function personSchema(image: string) {
  return {
    '@type': 'Person',
    '@id': personId,
    name: contact.name,
    jobTitle: 'REALTOR®',
    description: 'California-licensed REALTOR® serving buyers, sellers, and investors in Tehachapi, Bakersfield, and Kern County.',
    url: abs('/about'),
    telephone: contact.phone,
    email: contact.email,
    image,
    worksFor: agentRef(),
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

/** The site-level identity node, emitted once on the homepage. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: agentRef(),
    inLanguage: 'en-US',
  }
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

/**
 * A single property: the listing (offer terms) plus the residence (physical
 * facts). Each field is emitted only when the listing actually states it — an
 * invented bedroom count would be worse than no structured data at all.
 */
export function propertySchema(listing: Listing, image?: string) {
  const p = listing.data
  const sold = p.status === 'sold'
  const date = (sold ? p.soldAt : p.listedAt)?.toISOString().slice(0, 10)
  const address = {
    '@type': 'PostalAddress',
    streetAddress: p.address,
    addressLocality: p.city,
    addressRegion: 'CA',
    postalCode: p.zip,
    addressCountry: 'US',
  }

  const place: Record<string, unknown> = {
    '@type': p.type === 'land' ? 'Place' : 'SingleFamilyResidence',
    name: `${p.address}, ${p.city}, CA ${p.zip}`,
    address,
  }
  if (p.beds) place.numberOfBedrooms = p.beds
  if (p.baths) place.numberOfBathroomsTotal = p.baths
  if (p.sqft) place.floorSize = { '@type': 'QuantitativeValue', value: p.sqft, unitCode: 'FTK' }
  if (p.features?.length) {
    place.amenityFeature = p.features.map((f) => ({ '@type': 'LocationFeatureSpecification', name: f, value: true }))
  }
  if (image) place.image = image

  const node: Record<string, unknown> = {
    '@type': 'RealEstateListing',
    name: `${p.address}, ${p.city}, CA`,
    description: p.description ?? p.blurb,
    url: abs(`/property/${listing.id}`),
    address,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'USD',
      availability: sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      seller: agentRef(),
    },
  }
  if (date) node.datePosted = date
  if (image) node.image = image
  if (p.mls) node.identifier = { '@type': 'PropertyValue', name: 'MLS', value: p.mls }
  if (p.neighborhood) node.areaServed = p.neighborhood

  return graph(node, place)
}
