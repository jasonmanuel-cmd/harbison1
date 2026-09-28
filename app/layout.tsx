import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito_Sans, Syne } from 'next/font/google'

import { AnalyticsTracker } from '@/components/analytics-tracker'
import { contact } from '@/lib/site'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.harbisonstandard.com'),
  title: {
    default: title,
    // Pages supply only their own short title, so the brand suffix is appended
    // consistently rather than being repeated in every page file.
    template: '%s | Harbison Standard',
  },
  description,
  applicationName: 'Harbison Standard',
  authors: [{ name: 'Nathanael Harbison', url: 'https://www.harbisonstandard.com' }],
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
  ],
  category: 'real estate',
  alternates: { canonical: '/' },
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
  // Twitter/X uses OG when no twitter:* block is present, but naming the card
  // explicitly avoids surprises if the image aspect ratio ever changes.
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': 'https://www.harbisonstandard.com/#agent',
    name: 'Harbison Standard',
    description,
    url: 'https://www.harbisonstandard.com',
    telephone: contact.phone,
    email: contact.email,
    image: 'https://www.harbisonstandard.com/images/hero-1600.webp',
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
      { '@type': 'AdministrativeArea', name: 'Kern County, California' },
    ],
    founder: {
      '@type': 'Person',
      name: 'Nathanael Harbison',
      jobTitle: 'REALTOR®',
      identifier: { '@type': 'PropertyValue', name: 'DRE License', value: `#${contact.dre}` },
    },
    sameAs: [contact.instagram, contact.facebook, contact.linkedin, contact.youtube],
  }

  return (
    <html lang="en" className={`${syne.variable} ${nunito.variable} bg-background`}>
      <head>
        {/* Warm up the connection to the CMS/hosting origin used for the OG
            image so the crawler does not pay DNS+TLS on first fetch. */}
        <link rel="preconnect" href="https://www.harbisonstandard.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
