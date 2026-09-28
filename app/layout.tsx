import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito_Sans, Syne } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-syne',
})

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
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
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0c1a3a',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${nunito.variable} bg-background`}>
      <body className="overflow-x-clip antialiased [-webkit-text-size-adjust:100%]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
