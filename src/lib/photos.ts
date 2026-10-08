import type { ImageMetadata } from 'astro'

/**
 * Every listing photo lives in src/assets/property as `<slug>-<n>.jpg`, so Astro
 * can generate responsive AVIF/WebP variants at build time. Photos are discovered
 * from the folder — adding `new-listing-1.jpg … -24.jpg` is all a listing needs.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/property/*.jpg', { eager: true })

const byKey = new Map<string, ImageMetadata>()
for (const [path, mod] of Object.entries(modules)) {
  const key = path.split('/').pop()!.replace(/\.jpg$/, '')
  byKey.set(key, mod.default)
}

/** A single photo by key, e.g. `958-fairway-dr-2`. Throws at build time if missing. */
export function photo(key: string): ImageMetadata {
  const img = byKey.get(key)
  if (!img) throw new Error(`Missing photo "${key}" in src/assets/property`)
  return img
}

/** All photos for a listing, in numeric order. */
export function listingPhotos(slug: string): ImageMetadata[] {
  const pattern = new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)$`)
  return [...byKey.entries()]
    .map(([key, img]) => [Number(pattern.exec(key)?.[1]), img] as const)
    .filter(([n]) => Number.isFinite(n))
    .sort((a, b) => a[0] - b[0])
    .map(([, img]) => img)
}
