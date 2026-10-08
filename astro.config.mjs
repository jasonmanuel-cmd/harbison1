// @ts-check
import { defineConfig, envField } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://www.harbisonstandard.com',
  // Everything is prerendered to static HTML by default. Only the API routes and
  // the /hq admin opt into on-demand rendering (`export const prerender = false`).
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    // React is only used for the /hq dashboard island; the public site ships no framework JS.
    react(),
  ],
  // Images are sized with Tailwind classes plus explicit `widths`/`sizes`, so
  // Astro's (unlayered) responsive image styles are left off — they would
  // override Tailwind's layered utilities like h-full / object-cover.
  image: {
    responsiveStyles: false,
  },
  env: {
    schema: {
      FORMSPREE_FORM_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      NOTIFY_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      SUPABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      SUPABASE_SERVICE_ROLE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      ANALYTICS_SALT: envField.string({ context: 'server', access: 'secret', optional: true }),
      HQ_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
      HQ_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
