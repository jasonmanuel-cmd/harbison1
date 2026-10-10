import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { getActiveListings, getAreas, getSoldListings } from '@/lib/listings'
import { abs } from '@/lib/seo'

/**
 * Generated from the same collections the pages are built from, so a new
 * listing, guide or neighborhood is listed the moment it is added. Served at
 * /sitemap.xml — the URL robots.txt and Search Console already point to.
 */
type Entry = { path: string; priority: number; freq: 'daily' | 'weekly' | 'monthly' | 'yearly'; lastmod?: Date }

const STATIC: Entry[] = [
  { path: '/', priority: 1.0, freq: 'weekly' },
  { path: '/properties', priority: 0.9, freq: 'daily' },
  { path: '/areas', priority: 0.7, freq: 'weekly' },
  { path: '/contact', priority: 0.8, freq: 'monthly' },
  { path: '/guides', priority: 0.7, freq: 'weekly' },
  { path: '/about', priority: 0.6, freq: 'monthly' },
  { path: '/privacy', priority: 0.2, freq: 'yearly' },
  { path: '/terms', priority: 0.2, freq: 'yearly' },
  { path: '/accessibility', priority: 0.2, freq: 'yearly' },
]

export const GET: APIRoute = async () => {
  const [active, sold, areas, guides] = await Promise.all([getActiveListings(), getSoldListings(), getAreas(), getCollection('guides')])
  const now = new Date()

  const entries: Entry[] = [
    ...STATIC,
    ...guides.map((g) => ({ path: `/${g.id}`, priority: 0.7, freq: 'monthly' as const })),
    ...areas.map((a) => ({ path: `/areas/${a.id}`, priority: 0.7, freq: 'weekly' as const })),
    // Current listings are the pages most likely to be searched by address.
    ...active.map((l) => ({ path: `/property/${l.id}`, priority: 0.8, freq: 'weekly' as const, lastmod: l.data.listedAt })),
    // Sold listings stay indexed: track record, and the pages most likely to earn links.
    ...sold.map((l) => ({ path: `/property/${l.id}`, priority: 0.4, freq: 'yearly' as const, lastmod: l.data.soldAt })),
  ]

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (e) =>
        `<url><loc>${abs(e.path)}</loc><lastmod>${(e.lastmod ?? now).toISOString()}</lastmod><changefreq>${e.freq}</changefreq><priority>${e.priority.toFixed(1)}</priority></url>`,
    ),
    '</urlset>',
    '',
  ].join('\n')

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
