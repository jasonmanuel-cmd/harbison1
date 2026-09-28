import Link from 'next/link'

import { JsonLd } from '@/components/json-ld'
import { breadcrumbList } from '@/lib/seo'

/**
 * A breadcrumb trail that a visitor can see and click.
 *
 * The BreadcrumbList markup on its own would be schema describing something
 * invisible on the page, which is exactly the kind of structured data search
 * engines discount. Rendering the trail as well means the markup describes
 * what is actually there -- it also gives anyone who lands deep in a property
 * URL a way back to the listings index without using the header nav.
 */
export function Breadcrumbs({
  trail,
  tone = 'light',
}: {
  trail: { name: string; path: string }[]
  /** 'light' for the dark navy header bands, 'dark' for light page bodies. */
  tone?: 'light' | 'dark'
}) {
  return (
    <>
      <JsonLd data={breadcrumbList(trail)} />
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((c, i) => {
            const last = i === trail.length - 1
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span
                    aria-current="page"
                    className={
                      tone === 'light' ? 'text-ink-foreground' : 'text-foreground'
                    }
                  >
                    {c.name}
                  </span>
                ) : (
                  <Link
                    href={c.path}
                    className={
                      tone === 'light'
                        ? 'text-ink-foreground/70 underline-offset-4 transition-colors hover:text-poppy hover:underline'
                        : 'text-muted-foreground underline-offset-4 transition-colors hover:text-gold hover:underline'
                    }
                  >
                    {c.name}
                  </Link>
                )}
                {!last && (
                  <span aria-hidden="true" className={tone === 'light' ? 'text-ink-foreground/40' : 'text-muted-foreground/50'}>
                    /
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
