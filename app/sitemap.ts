import type { MetadataRoute } from 'next'

import { listings, soldListings } from '@/lib/site'
import { abs, ROUTES, SITE_URL } from '@/lib/seo'

/**
 * Generated from the same route table the pages are built from, so a new
 * listing is listed the moment it is added to lib/site.ts. It did not exist at
 * all before -- /sitemap.xml was a 404, which for a site whose entire business
 * depends on being found for local property searches is the single most costly
 * omission here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = ROUTES.map((r) => ({
    url: abs(r.path),
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }))

  // Current listings are the pages most likely to be searched by address, so
  // they outrank the evergreen content.
  const active: MetadataRoute.Sitemap = listings.map((p) => ({
    url: abs(`/property/${p.slug}`),
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Sold listings stay indexed: they are proof of track record, they get
  // searched for by people who saw the sign out front, and they are the pages
  // most likely to earn links.
  const sold: MetadataRoute.Sitemap = soldListings.map((p) => ({
    url: abs(`/property/${p.slug}`),
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: 'yearly',
    priority: 0.4,
  }))

  return [...staticRoutes, ...active, ...sold]
}

export const dynamic = 'force-static'
export { SITE_URL }
