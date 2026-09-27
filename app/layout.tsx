import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'Buy, Sell & Invest in Kern County | Harbison Standard',
  description:
    'Buy, sell, and invest in Tehachapi, Bakersfield, and Kern County with Nathanael Harbison, REALTOR® DRE #02059393. Practical advice, direct communication, and a clear next step.',
  metadataBase: new URL('https://www.harbisonstandard.com'),
  openGraph: {
    title: 'Harbison Standard | Kern County Real Estate',
    description: 'It’s not what you do. It’s how you do it. Buy, sell, and invest in Kern County with Nathanael Harbison.',
    images: ['/images/hero-1600.webp'],
  },
}

export const viewport: Viewport = {
  themeColor: '#17191b',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
