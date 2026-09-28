# Harbison Standard

The website for **Harbison Standard** — Nathanael Harbison, REALTOR® (DRE #02059393), serving buyers, sellers, and investors in Tehachapi, Bakersfield, and Kern County.

Built with [Astro](https://astro.build) 7, Tailwind CSS 4, and deployed on Vercel.

## Architecture

| Area | How it works |
| --- | --- |
| **Public pages** | Prerendered to static HTML at build time. No framework JavaScript — interactivity (carousels, filters, gallery, payment estimator, lead form) is small native custom elements. |
| **Listings** | Content collection in `src/content/listings/*.json`, validated by a Zod schema in `src/content.config.ts`. |
| **Photos** | `src/assets/property/<slug>-<n>.jpg`. Discovered automatically per listing and converted to responsive WebP at build time. |
| **Guides** | Markdown front-matter in `src/content/guides/*.md` → `/private-sale`, `/land`, etc. |
| **Neighborhoods** | `src/content/areas.json` → `/areas/<id>`, with stats computed from live listing data. |
| **Leads** | `POST /api/lead` → emailed via Formspree, mirrored to Supabase when configured. Falls back to a pre-filled `mailto:` if the service is down. |
| **Analytics** | First-party, cookieless (`/api/track` + `src/scripts/analytics.ts`). Honors Do Not Track, Global Privacy Control, and a footer opt-out. |
| **HQ** | `/hq` — password-protected CRM + analytics dashboard (the only page that loads React). |

Page navigation uses Astro's `<ClientRouter />` view transitions, so listing photos morph from the card into the property page.

## Common tasks

**Add a listing:** drop photos into `src/assets/property/` as `my-new-listing-1.jpg`, `-2.jpg`, … and create `src/content/listings/my-new-listing.json`:

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

The build fails with a clear message if a field is missing or mistyped. **Mark as sold:** set `"status": "sold"` and add `"soldAt"`.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # type-check
npm run build    # production build
```

Requires Node 22.12+.

## Environment variables

All optional — see `.env.example`. Set them in Vercel → Project → Settings → Environment Variables.

| Variable | Purpose |
| --- | --- |
| `FORMSPREE_FORM_ID`, `NOTIFY_EMAIL` | Lead email delivery (defaults to the existing form) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | CRM + analytics storage |
| `ANALYTICS_SALT` | Salt for the daily-rotating visitor hash |
| `HQ_PASSWORD`, `HQ_SECRET` | Enables `/hq` |

## Database

`supabase/schema.sql` (new project) or `supabase/migration-existing-project.sql` (existing data), then **`supabase/migration-002-analytics-rpc.sql`**, which adds the `visits.page_token` column and `bump_session()` function the analytics ingest depends on.
