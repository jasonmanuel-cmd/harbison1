/**
 * Responsive image helpers.
 *
 * The site uses plain <img> rather than next/image (images.unoptimized is set
 * because Vercel's optimizer would otherwise re-encode files that are already
 * WebP). That makes srcset our job, so the wiring lives here in one place
 * instead of being repeated — and mis-repeated — across every component.
 *
 * Variant data is generated at build time; see
 * scripts/generate-responsive-images.mjs.
 */
import { imageVariants } from './property-image-sizes.generated'

export type ImageVariant = { srcset: string; widths: number[] }

/** The `sizes` value matching how wide the image actually renders. */
export type Slot = 'card' | 'hero' | 'gallery' | 'wide'

const SIZES: Record<Slot, string> = {
  // A listing card is one column on a phone, three on a laptop.
  card: '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw',
  hero: '100vw',
  // The main gallery image is full width inside a max-w container.
  gallery: '(min-width: 1280px) 1200px, 100vw',
  wide: '(min-width: 1280px) 1400px, 100vw',
}

type Props = {
  src: string
  slot: Slot
  alt: string
  className?: string
  /** Above-the-fold images should not be lazy. */
  priority?: boolean
  sizes?: string
}

export function ResponsiveImage({
  src,
  slot,
  alt,
  className,
  priority = false,
  sizes,
}: Props) {
  // Keys are filenames like "2300-weybridge-dr-1.webp"; src is a public path.
  const file = src.replace('/images/', '').replace('/property/', '')
  const variant = imageVariants[file]

  if (!variant) {
    // No variants generated for this file; the original still renders.
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    )
  }

  return (
    <img
      src={src}
      srcSet={variant.srcset}
      sizes={sizes ?? SIZES[slot]}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      // The widest variant is the default when a browser ignores srcset.
      width={variant.widths[variant.widths.length - 1]}
    />
  )
}
