import type { MetadataRoute } from 'next'

import { contact } from '@/lib/site'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Harbison Standard — Kern County Real Estate',
    short_name: 'Harbison Standard',
    description:
      'Buy, sell, and invest in Tehachapi, Bakersfield, and Kern County with Nathanael Harbison, REALTOR®.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0c1a3a',
    theme_color: '#0c1a3a',
    categories: ['business', 'shopping', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    // Lets a phone turn the address into a tap-to-call / tap-to-map shortcut.
    shortcuts: [
      {
        name: 'Call Nathanael',
        short_name: 'Call',
        url: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
      },
      {
        name: 'Browse listings',
        short_name: 'Listings',
        url: '/properties',
      },
    ],
  }
}
