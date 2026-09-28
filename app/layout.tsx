import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito_Sans, Syne } from 'next/font/google'

import { AnalyticsTracker } from '@/components/analytics-tracker'
import { contact } from '@/lib/site'
import { BRAND, graph, orgId, personId, personSchema, SITE_URL } from '@/lib/seo'

import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const title = 'Harbison Standard | Real Estate in Tehachapi & Kern County, CA'
const description =
  'Nathanael Harbison, REALTOR® DRE #02059393, helps you buy, sell, and invest in Tehachapi, Bakersfield, and Kern County. Current listings, market context, and a clear next step.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    // Pages supply only their own short title, so the brand suffix is appended
    // consistently rather than being repeated in every page file.
    template: '%s | Harbison Standard',
  },
  description,
  applicationName: 'Harbison Standard',
  authors: [{ name: 'Nathanael Harbison', url: SITE_URL }],
  creator: 'Harbison Standard',
  publisher: 'Harbison Standard',
  keywords: [
    'Tehachapi real estate',
    'Kern County real estate',
    'Bakersfield real estate',
    'Tehachapi homes for sale',
    'Kern County realtor',
    'Nathanael Harbison',
    'Harbison Standard',
    'Tehachapi REALTOR',
    'Kern County homes for sale',
    'Bakersfield investment property',
    'Tehachapi housing market',
    'Kern County property for sale',
  ],
  category: 'real estate',
  // No `alternates` here on purpose. When it was set to '/', every page that
  // did not declare its own inherited it, so all twelve URLs advertised the
  // homepage as their canonical and search engines were told to consolidate
  // the whole site onto one page. Each page now sets its own via
  // pageMetadata() in lib/seo.ts.
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: 'website',
    siteName: 'Harbison Standard',
    locale: 'en_US',
    url: '/',
    title,
    description,
    images: [
      {
        url: '/images/hero-1600.webp',
        width: 1600,
        height: 900,
        alt: 'Harbison Standard — real estate in Kern County, California',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/hero-1600.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  other: {
    // Real-world contact details, so a phone or assistant can act on them
    // without having to scrape the page.
    'geo.region': 'US-CA',
    'geo.placename': 'Tehachapi, California',
    'geo.position': '35.0680;-118.4468',
    ICBM: '35.0680, -118.4468',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0c1a3a' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1a3a' },
  ],
  colorScheme: 'light',
}

// The organisation and the agent are one @graph on every page. Emitting them
// here rather than per page means the @id references from page-level nodes
// (offers, listings) always resolve, and the entity is described identically
// everywhere an assistant might encounter it.
const orgSchema = graph(
  {
    '@type': 'RealEstateAgent',
    '@id': orgId,
    name: BRAND,
    description,
    url: SITE_URL,
    telephone: contact.phone,
    email: contact.email,
    image: `${SITE_URL}/images/hero-1600.webp`,
    logo: `${SITE_URL}/icon-512.png`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tehachapi',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 35.068, longitude: -118.4468 },
    areaServed: [
      { '@type': 'City', name: 'Tehachapi' },
      { '@type': 'City', name: 'Bakersfield' },
      { '@type': 'City', name: 'Newbury Park' },
      { '@type': 'AdministrativeArea', name: 'Kern County, California' },
    ],
    // Referenced by id, so the person below is the single definition of who
    // this is rather than a second copy of the same facts.
    founder: { '@id': personId },
    employee: { '@id': personId },
    sameAs: [contact.instagram, contact.facebook, contact.linkedin, contact.youtube],
  },
  personSchema(),
)

/**
 * Root layout: html, body, and the metadata every route shares.
 *
 * The visible site chrome lives in app/(site)/layout.tsx instead of here, so
 * that /hq renders as a standalone internal tool rather than inheriting the
 * public header, footer and mobile action bar. The route group is invisible in
 * the URL — (site) does not become a path segment.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${nunito.variable} bg-background`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Organisation-level structured data, inherited by every page. Pages
            add their own nodes on top of this. */}
        <script
          type="application/ld+json"
          // Static, developer-authored JSON-LD — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="overflow-x-clip antialiased [-webkit-text-size-adjust:100%]">
        <AnalyticsTracker />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
