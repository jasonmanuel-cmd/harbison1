# Harbison Standard

Marketing site for **Harbison Standard** (Nathanael Harbison, REALTOR®, DRE #02059393), a
real estate practice serving Tehachapi, Bakersfield, and Kern County, CA.

Live: https://www.harbisonstandard.com

[Astro](https://astro.build) 7, Tailwind 4, TypeScript. Every merge to `main`
auto-deploys to Vercel.

## Commands

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # type-check (astro check)
npm run build      # production build
```

Requires Node 22.12+.

The site is static-first: every content page is prerendered to HTML at build
time, and only the API routes and `/hq` render per request. Public pages ship no
framework JavaScript — carousels, filters, the photo viewer, the payment
estimator and the lead form are small native custom elements. React loads only
on `/hq`.

### Audits

These check the things that quietly break a real estate site — contrast and
link targets:

```bash
npm run audit:contrast         # WCAG contrast + opacity sweep of the palette
npm run audit:contrast-scan    # scans src/ for dark-only colours on light surfaces
npm run audit:links            # crawls the deployed site (pass a base URL to override)
```

`audit:contrast-scan` is a heuristic: text laid over a photo with a dark
gradient (the neighborhood cards) is reported even though it is readable.
`scripts/audit-all.ps1` runs Lighthouse across the main routes; reports are kept
in `audits/`. Unclosed or mis-nested tags fail the build — Astro's compiler is
strict about them.

## Content

| What | Where | Notes |
| --- | --- | --- |
| Listings | `src/content/listings/*.json` | Validated by the Zod schema in `src/content.config.ts`; the build fails on a missing or mistyped field |
| Photos | `src/assets/property/<slug>-<n>.jpg` | Discovered per listing and encoded to responsive WebP at build time |
| Guides | `src/content/guides/*.md` | Front matter only → `/private-sale`, `/land`, … |
| Neighborhoods | `src/content/areas.json` | → `/areas/<id>`; stats are computed from the listings |
| Contact details, FAQ, testimonials | `src/lib/site.ts` | |

**Add a listing:** drop photos into `src/assets/property/` as
`my-new-listing-1.jpg`, `-2.jpg`, … and create
`src/content/listings/my-new-listing.json`:

```json
{
  "address": "123 Example St",
  "city": "Tehachapi",
  "zip": "93561",
  "price": 525000,
  "beds": 3,
  "baths": 2,
  "sqft": 1850,
  "lot": "0.5 acre lot",
  "lotAcres": 0.5,
  "neighborhood": "Stallion Springs",
  "type": "home",
  "status": "active",
  "blurb": "One or two sentences for cards.",
  "description": "The full description.",
  "features": ["Mountain views", "3-car garage"],
  "listedAt": "2026-10-01"
}
```

**Mark as sold:** set `"status": "sold"` and add `"soldAt"`. The page stays live
at the same URL with a Sold badge, and moves to the "Sold & closed" list.

## Lead capture

This is the part that matters most, so it is worth understanding before you
change it.

Every form on the site — contact, the guide pages, each neighborhood and each
property page — renders the same `src/components/InquiryForm.astro` and posts to
the same `src/pages/api/lead.ts`. There is no second form path.

A submission is delivered two ways, independently:

1. **Email, via Formspree.** Always active. This is the primary channel and
   does not depend on any other service. Form `xqpkdwrp` forwards to
   `nate85.realtor@gmail.com`. Override with `FORMSPREE_FORM_ID` and
   `NOTIFY_EMAIL`.
2. **Supabase, for the `/hq` dashboard.** Best-effort. A storage failure is
   caught and logged so it never blocks the email. The visitor's message and the
   analytics session id are stored with the lead, so `/hq` can show what they
   wrote and which visit produced it.

If the API is unreachable the form shows a pre-filled `mailto:` button addressed
straight to Nathanael, so an inquiry cannot be silently lost. A hidden honeypot
field absorbs bot submissions without delivering them.

### Environment variables

Set these in the Vercel project (Settings → Environment Variables). They are
read at request time through `astro:env`, never inlined into the build.

| Variable | Required | Purpose |
| --- | --- | --- |
| `FORMSPREE_FORM_ID` | no | Defaults to `xqpkdwrp` |
| `NOTIFY_EMAIL` | no | Defaults to `nate85.realtor@gmail.com` |
| `SUPABASE_URL` | for `/hq` | `https://<ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | for `/hq` | **Server only** |
| `HQ_PASSWORD` | for `/hq` | Unlocks the dashboard |
| `HQ_SECRET` | recommended | Signs the `/hq` session cookie; falls back to `HQ_PASSWORD` |
| `ANALYTICS_SALT` | recommended | Salts the daily IP hash |

Two deliberate consequences of leaving these unset:

- **No Supabase → `/hq` returns 503 and shows no leads.** Email still works.
  This is the safe failure mode, not a broken one.
- **No `HQ_PASSWORD` → `/hq` is locked permanently.** `isAuthenticated()`
  returns false before any cookie check, so there is no way in.

`ANALYTICS_SALT` has a hardcoded fallback, so analytics works without it — but
that fallback is a published constant in this repo, which makes unique-visitor
hashes correlatable across every deployment of it. Set it to a random string.

`HQ_PASSWORD` is stored in plaintext and compared in constant time. The cookie
is an HMAC over an expiry timestamp, valid 8 hours, `httpOnly` + `sameSite=lax`
+ `secure` in production.

## Database

`supabase/schema.sql` is the full schema for a new project.
`supabase/migration-existing-project.sql` reconciles an existing project that
already holds real data (ref `pebqmuumwygrpjofdwfy`) — it only ever adds
columns and backfills, never drops.

**If you are deploying against an existing database, run
`migration-existing-project.sql`.** It is fully idempotent. Skipping it is the
reason a fresh deploy can serve a working site whose CRM silently stores
nothing.

Postgres function `bump_session()` accumulates page views and dwell time. It
exists because PostgREST cannot express `page_views = page_views + n`, and a
read-modify-write from the app drops concurrent updates on fast multi-page
visits.

### Security posture

RLS is enabled on `leads`, `sessions`, and `visits` with **no public policies**,
so the anon key can read nothing. Only the `service_role` key — server-side
only, via `src/lib/server/supabase.ts` — bypasses RLS. `bump_session()` is
`SECURITY DEFINER` and its execute grant is limited to `service_role`.

Never import anything from `src/lib/server/` into a client script. Leaking the
service role key to the browser exposes every lead in the database.

## Analytics

First-party and written in `src/scripts/analytics.ts` — no Google Analytics, no
cookies, no cross-site identifiers. Sessions live in `sessionStorage` and clear
when the tab closes.

- No raw IP is stored. The server derives a unique-per-day salted hash purely to
  count uniques.
- Coarse geography comes from Vercel edge headers; country, region, city only.
- Do Not Track and Global Privacy Control are both honoured, and the footer has
  an opt-out.
- Age is never inferred from traffic. The age-range field on the form is
  optional and self-reported by the visitor.

## SEO

`src/lib/seo.ts` owns the structured data. The agent and the person are one
`@graph` on every page; property pages add `RealEstateListing`, the homepage
adds `WebSite` and `FAQPage`, and breadcrumbs are rendered visibly and emitted
as `BreadcrumbList` by the same component. Each page sets its own canonical.
`/sitemap.xml` and `/robots.txt` are generated from the content collections;
`public/llms.txt` is a hand-written summary for answer engines.

## Layout

```
src/pages/         routes — public pages prerendered; api/ and hq/ per request
src/components/    page sections, including the one shared inquiry form
src/layouts/       Base.astro: head, header, footer, <main> landmark
src/content/       listings, guides, neighborhoods
src/assets/        photos, logo, headshot (optimized at build)
src/lib/           site data, SEO, listing helpers; server/ is server-only
src/scripts/       browser analytics
supabase/          schema and the reconciliation migration
scripts/           audits
```
