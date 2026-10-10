import { getCollection, type CollectionEntry } from 'astro:content'
import { listingPhotos } from './photos'

export type Listing = CollectionEntry<'listings'>
export type Area = CollectionEntry<'areas'>

/**
 * While false, no for-sale homes are shown anywhere: pages, cards, stats, sitemap
 * and the property pages themselves. Sold homes are unaffected. Set to true to restore.
 */
export const SHOW_FOR_SALE = false

/** Active and pending listings, newest first. */
export async function getActiveListings(): Promise<Listing[]> {
  if (!SHOW_FOR_SALE) return []
  const all = await getCollection('listings', (l) => l.data.status !== 'sold')
  return all.sort((a, b) => (b.data.listedAt?.getTime() ?? 0) - (a.data.listedAt?.getTime() ?? 0) || b.data.price - a.data.price)
}

/** Closed transactions, most recent first. */
export async function getSoldListings(): Promise<Listing[]> {
  const all = await getCollection('listings', (l) => l.data.status === 'sold')
  return all.sort((a, b) => (b.data.soldAt?.getTime() ?? 0) - (a.data.soldAt?.getTime() ?? 0))
}

export async function getAreas(): Promise<Area[]> {
  return (await getCollection('areas')).sort((a, b) => a.data.order - b.data.order)
}

export function inArea(listing: Listing, area: Area) {
  const { city, neighborhood } = area.data.match
  if (city && listing.data.city !== city) return false
  if (neighborhood && !(listing.data.neighborhood ?? '').includes(neighborhood)) return false
  return true
}

export function cover(listing: Listing) {
  return listingPhotos(listing.id)[0]
}

/** "4 Beds · 3 Baths · 2,836 Sq Ft" — falls back to lot size for land. */
export function factLine(l: Listing['data'], sep = '  ·  ') {
  const parts: string[] = []
  if (l.beds) parts.push(`${l.beds} Beds`)
  if (l.baths) parts.push(`${l.baths} Baths`)
  if (l.sqft) parts.push(`${l.sqft.toLocaleString('en-US')} Sq Ft`)
  else if (l.lot) parts.push(l.lot)
  return parts.join(sep)
}

export function locationLine(l: Listing['data']) {
  return `${l.city}, CA ${l.zip}`
}

function median(values: number[]) {
  if (values.length === 0) return 0
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}

/** Stats computed from real listing data only — nothing is estimated or invented. */
export function marketStats(list: Listing[]) {
  const prices = list.map((l) => l.data.price)
  const ppsf = list.filter((l) => l.data.sqft).map((l) => l.data.price / l.data.sqft!)
  return {
    count: list.length,
    homes: list.filter((l) => l.data.type === 'home').length,
    land: list.filter((l) => l.data.type === 'land').length,
    median: median(prices),
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
    medianPpsf: Math.round(median(ppsf)),
  }
}

/** Closest-priced listings, preferring the same city. */
export function similar(target: Listing, pool: Listing[], n = 3) {
  return pool
    .filter((l) => l.id !== target.id)
    .map((l) => ({
      l,
      score: Math.abs(Math.log(l.data.price / target.data.price)) + (l.data.city === target.data.city ? 0 : 0.8) + (l.data.type === target.data.type ? 0 : 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, n)
    .map(({ l }) => l)
}
