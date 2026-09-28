import type { MetadataRoute } from 'next'

import { abs } from '@/lib/seo'

/**
 * /robots.txt did not exist before, so crawlers had no sitemap pointer and no
 * signal about the internal CRM.
 *
 * The AI crawlers are listed explicitly rather than left to the wildcard. This
 * is a real editorial decision, not a technical one: these crawlers are how an
 * assistant finds and cites the site, so they are welcome. The one exception is
 * the HQ dashboard, which is private analytics and has no business being
 * quoted, summarized or indexed by anything.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The CRM is behind auth, but a URL in a robots.txt is still a URL an
        // assistant may fetch and quote. Disallowing costs nothing here.
        disallow: ['/hq', '/api/'],
      },
      {
        // Answer engines and assistants, which is where a local business
        // search is increasingly decided.
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-User',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
          'Bingbot',
          'DuckAssistBot',
          'Amazonbot',
          'Meta-ExternalAgent',
        ],
        allow: '/',
        disallow: ['/hq', '/api/'],
      },
    ],
    // No Host directive on purpose. It is optional, only Yandex honours it,
    // and naming the canonical domain made the file invalid on any other host
    // -- Lighthouse rejected it outright while the site was served from the
    // Vercel URL. The Sitemap line is absolute, so crawlers get the canonical
    // location without the Host line disagreeing with where they are standing.
    sitemap: abs('/sitemap.xml'),
  }
}
