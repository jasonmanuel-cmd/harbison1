/**
 * Renders a JSON-LD block.
 *
 * Every node on the site is built from data in lib/site.ts and the objects
 * above, so no user input reaches this string. The < is escaped anyway so that
 * a future dynamic node cannot close the script tag and inject markup -- the
 * standard defence for a JSON-LD block.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Static, developer-authored structured data. Escaped so a < inside a
      // value can never terminate the script element early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
