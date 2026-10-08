import type { APIRoute } from 'astro'
import { abs } from '@/lib/seo'

/**
 * The AI crawlers are listed explicitly rather than left to the wildcard. That
 * is an editorial decision: these crawlers are how an assistant finds and cites
 * the site, so they are welcome. The exception is the HQ dashboard, which is
 * private analytics and has no business being quoted, summarized or indexed.
 *
 * No Host directive on purpose — only Yandex honours it, and naming the
 * canonical domain makes the file invalid when served from any other host.
 */
const ASSISTANTS = [
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
]
const RULES = ['Allow: /', 'Disallow: /hq', 'Disallow: /api/']

export const GET: APIRoute = () =>
  new Response(
    ['User-Agent: *', ...RULES, '', ...ASSISTANTS.map((a) => `User-Agent: ${a}`), ...RULES, '', `Sitemap: ${abs('/sitemap.xml')}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  )
