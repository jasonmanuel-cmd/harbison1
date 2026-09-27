import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
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
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
