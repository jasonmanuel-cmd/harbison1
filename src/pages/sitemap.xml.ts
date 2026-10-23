import type { APIRoute } from 'astro'
import { SITE_URL } from '@/lib/site'

// Each page lists its English and Spanish versions as alternates, so search engines pair them up.
const pages: [en: string, es: string][] = [
  ['', '/es'],
  ['/about', '/es/about'],
]

const entry = (loc: string, [en, es]: [string, string]) =>
  `<url><loc>${SITE_URL}${loc}</loc>` +
  `<xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${en}"/>` +
  `<xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}${es}"/>` +
  `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${en}"/></url>`

export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${pages
      .flatMap((pair) => [entry(pair[0], pair), entry(pair[1], pair)])
      .join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  )
