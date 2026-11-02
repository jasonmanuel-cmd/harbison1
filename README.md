# Harbison Standard

Marketing site for **Harbison Standard** (Nathanael Harbison, REALTOR®, DRE #02059393), a
real estate practice serving Tehachapi, Bakersfield, and Kern County, CA.

Live: https://www.harbisonstandard.com

## Public site

The homepage explains Harbison Standard and retains the original hero video.
`/about` contains Nathanael’s bio, contact details, and social profiles. Retired property, guide, and neighborhood routes return the custom 404.
`/contact` redirects to the contact section and `/privacy` to the in-page privacy
disclosure; no extra public content page is added.

Popular videos are a curated snapshot of the channel in
`src/data/popular-videos.json`: three long videos, then the three most-viewed Shorts
(view counts as of 2026-10-30); rankings do not refresh automatically.
YouTube’s player loads only after a visitor chooses a video. The hero uses muted,
inline MP4 playback with a poster fallback and a manual play/pause control;
phones, data-saving connections, and reduced-motion visitors see a still
image until they choose play. Desktop and tablet retain automatic playback.

For production-like local audits:

```powershell
npm run build
python scripts/preview-production.py
# In another terminal:
pwsh scripts/audit-all.ps1
```

The preview uses gzip and immutable caching for hashed assets, as the deployment
CDN does. The audit checks both public routes on mobile and desktop and fails
if any performance, accessibility, best-practices, or SEO score is below 90.

### Current contact flow

The public pages (/ and /about, plus their Spanish versions) offer phone and email links. No InquiryForm or ContactSection is mounted. /contact redirects to /#connect, not to a Call Harbison form. Retained lead API/components are not evidence of public website capture. /hq redirects are a separate staff flow. Restoring a public form requires a product decision.

### Shared CRM

The shared lead destination is Call Harbison HQ at https://www.callharbison.com/hq.
Set server-only `SHARED_CRM_URL=https://www.callharbison.com/api/intake` and
`SHARED_CRM_SECRET` (the same 32+ character secret as HBH's `CRM_INGEST_SECRET`).
The receiving intake bridge must already be available. When the retained API is called and configured, Standard sends those inquiries
to that CRM instead of its original lead table. `/hq` and `/hq/dashboard` redirect there.
Keep Standard's existing `SUPABASE_*` values for analytics. Historical Standard
leads remain in the original database until separately imported.

Standard's analytics are available in the shared HQ's **Website stats** tab.
Its API serves aggregates to the Call Harbison server using the existing shared
secret; database credentials and raw session records stay server-side.

Buyer fields and messages are preserved in CRM notes and an initial activity
snapshot. The retained API attempts existing Formspree notifications; configuring the bridge
does not activate customer SMS or marketing consent. Run `npm test` for the bridge
client checks. See HBH's `docs/SHARED-CRM.md` for the release and broker-review runbook.

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
time, and only the API routes and `/hq` render per request. The public site uses normal browser navigation and small native scripts for
the background video, YouTube selection, and analytics. No React runtime is
loaded on either public page. The local HQ routes redirect to Call Harbison.

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

## Retained content (not public routes)

| What | Where | Notes |
| --- | --- | --- |
| Listings | `src/content/listings/*.json` | Validated by the Zod schema in `src/content.config.ts`; the build fails on a missing or mistyped field |
| Photos | `src/assets/property/<slug>-<n>.jpg` | Discovered per listing and encoded to responsive WebP at build time |
| Guides | `src/content/guides/*.md` | Retained data; former guide URLs are retired |
| Neighborhoods | `src/content/areas.json` | Retained data; former area URLs are retired |
| Contact details, FAQ, testimonials | `src/lib/site.ts` | |

These files/components are retained for possible future work; editing them does not restore retired routes. The following is a historical data format, not an instruction to publish inventory.

**Listing format:** drop photos into `src/assets/property/` as
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

Changing retained listing status does not make a property URL public.

## Retained lead API

The retained InquiryForm is not mounted. Direct callers of /api/lead must send bounded JSON with name, email and a callable phone number. Optional strings are length-checked; invalid input is rejected, not silently truncated. A honeypot still discards bots. Rate limits are instance-local and are not a global abuse quota.

When the API is called, it attempts CRM storage and then Formspree notification to the existing configured recipients. Either shared-CRM setting selects that path; incomplete shared configuration fails rather than falling back to local storage. Without either setting, legacy local storage remains available. Storage failure does not prevent an email attempt. Provider acceptance is not inbox receipt.

A duplicate shared receipt proves storage only. The API returns HTTP 202 with stored=true and notification=unknown, without sending another email. The retained UI requests direct confirmation and does not claim a notification succeeded. This prevents false success and blind duplicate emails, but does not recover a missing notification. A durable delivery-state/outbox contract in the receiver is a deployment prerequisite for reliable automatic recovery; no schema or receiver changes are included here. Legacy local storage has no submission-ID idempotency and must not be used for automatic retries.

The retained browser request has a 45-second deadline. A timeout or lost response may follow successful acceptance; its mailto fallback is an optional draft requiring a mail client and a user send action, not a delivery guarantee.

### Environment variables

Set these in the Vercel project (Settings → Environment Variables). They are
read at request time through `astro:env`, never inlined into the build.

| Variable | Required | Purpose |
| --- | --- | --- |
| `FORMSPREE_FORM_ID` | no | Defaults to `xqpkdwrp` |
| `NOTIFY_EMAIL` | no | Defaults to `nate85.realtor@gmail.com` |
| `SUPABASE_URL` | analytics / legacy storage | `https://<ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | analytics / legacy storage | **Server only** |
| `HQ_PASSWORD` | legacy API auth only | Does not control the redirected HQ page |
| `HQ_SECRET` | legacy API auth only | Retained cookie-signing helper |
| `ANALYTICS_SALT` | recommended | Salts the daily IP hash |

Standard's /hq routes redirect regardless of local Supabase or HQ password configuration. The receiving site's authentication and inbox must be checked separately; do not diagnose the current HQ using retained local dashboard instructions.

`ANALYTICS_SALT` has a hardcoded fallback, so analytics works without it — but
that fallback is a published constant in this repo, which makes unique-visitor
hashes correlatable across every deployment of it. Set it to a random string.

The retained legacy API auth helper compares `HQ_PASSWORD` in constant time. Its cookie
is an HMAC over an expiry timestamp, valid 8 hours, `httpOnly` + `sameSite=lax`
+ `secure` in production.

## Database

`supabase/schema.sql` is the full schema for a new project.
`supabase/migration-existing-project.sql` reconciles an existing project that
already holds real data (ref `pebqmuumwygrpjofdwfy`) — it only ever adds
columns and backfills, never drops.

Schema files are retained reference/migration artifacts. Do not run them automatically during deployment. Reconcile the target database and obtain explicit migration approval first.

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
  an opt-out. These preferences also suppress session attribution from the retained form; restricted session storage skips tracking without interrupting the page.
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

## SEO checks

Run `npm run build` followed by `npm run audit:seo` to check built metadata,
JSON-LD, canonical URLs, sitemap coverage, identity links, and the privacy
controls. The brand uses Organization markup without an unverified office
address; Nathanael is represented by a linked Person and public DRE record.
