import { ui, type Dict } from './ui.ts'

export type Lang = 'en' | 'es'

/** The language of a URL path. Spanish pages live under /es; English has no prefix. */
export const langFromPath = (path: string): Lang => (path === '/es' || path.startsWith('/es/') ? 'es' : 'en')

/** The same page in another language. Only `/` and `/about` have Spanish versions. */
export function pathFor(path: string, lang: Lang): string {
  const base = path.replace(/\/$/, '').replace(/^\/es(?=\/|$)/, '') || '/'
  if (lang === 'en') return base
  return base === '/' ? '/es' : `/es${base}`
}

export const t = (lang: Lang): Dict => ui[lang]

/** localStorage key that remembers the visitor's chosen language. */
export const LANG_STORAGE_KEY = 'hs-lang'
