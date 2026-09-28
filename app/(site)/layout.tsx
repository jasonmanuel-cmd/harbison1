import { SiteHeader } from '@/components/site-header'
import { ConnectPill, MobileActionBar, SiteFooter } from '@/components/site-footer'

/**
 * The public site shell.
 *
 * This lives in the (site) route group so that /hq — which sits outside the
 * group — renders as a standalone internal tool. Previously the chrome was
 * written into the homepage alone, which meant the other nine routes rendered
 * with no header, no navigation and no footer at all: a visitor landing on
 * /contact had no way to reach anything else on the site.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Keyboard users land here first; see the visually-hidden link in
          site-header for the skip target itself. */}
      <SiteHeader />
      {/* One main landmark for the whole site, and a stable skip target. */}
      <main id="main" className="relative">
        {children}
      </main>
      <SiteFooter />
      <ConnectPill />
      <MobileActionBar />
    </>
  )
}
