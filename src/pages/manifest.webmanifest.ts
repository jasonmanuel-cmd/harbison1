import type { APIRoute } from 'astro'
import { contact } from '@/lib/site'

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: 'Harbison Standard — Kern County Real Estate',
      short_name: 'Harbison Standard',
      description: 'Buy, sell, and invest in Tehachapi, Bakersfield, and Kern County with Nathanael Harbison, REALTOR®.',
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
      shortcuts: [
        { name: 'Call Nathanael', short_name: 'Call', url: contact.phoneHref },
        { name: 'Browse listings', short_name: 'Listings', url: '/properties' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  )
