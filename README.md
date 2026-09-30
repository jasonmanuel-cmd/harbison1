# harbison1

Marketing site for **Harbison Standard** (Nathanael Harbison, DRE #02059393), a
real estate practice serving Tehachapi, Bakersfield, and Newbury Park, CA.

Live: https://harbison1.vercel.app

Next.js 16 App Router, React 19, Tailwind 4, TypeScript. Built in
[v0](https://v0.app); every merge to `main` auto-deploys to Vercel.

## Commands

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # runs the image generators first via prebuild
pnpm typecheck      # tsc --noEmit
```

The site is static-first: every content page is prerendered at build time, and
only the API routes and `/hq` render per-request.

### Audits

These check the things that quietly break a real estate site — contrast,
heading order, link targets:

```bash
pnpm audit:contrast         # WCAG contrast + opacity sweep
pnpm audit:contrast-scan    # per-page variant of the above
pnpm audit:tags             # heading hierarchy and meta tags
```

`scripts/crawl.mjs` and `scripts/tag-check.mjs` fetch the deployed site rather
than local files, so they need the site to be up.

## Lead capture

This is the part that matters most, so it is worth understanding before you
change it.

Every form on the site — contact, land, private-sale, off-market-deals,
relocate, why-tehachapi, and each property detail page — renders the same
`components/inquiry-form.tsx` and posts to the same `app/api/lead/route.ts`.
There is no second form path.

A submission is delivered two ways, independently:

1. **Email, via Formspree.** Always active. This is the primary channel and
   does not depend on any other service. Form `xqpkdwrp` forwards to
   `nate85.realtor@gmail.com`. Override with `FORMSPREE_FORM_ID` and
   `NOTIFY_EMAIL`.
2. **Supabase, for the `/hq` dashboard.** Best-effort. A storage failure is
   caught and logged so it never blocks the email.

If the API is unreachable the form shows a pre-filled `mailto:` button addressed
straight to Nathanael, so an inquiry cannot be silently lost.

### Environment variables

Set these in the Vercel project (Settings → Environment Variables):

| Variable | Required | Purpose |
| --- | --- | --- |
| `FORMSPREE_FORM_ID` | no | Defaults to `xqpkdwrp` |
| `NOTIFY_EMAIL` | no | Defaults to `nate85.realtor@gmail.com` |
| `SUPABASE_URL` | for `/hq` | `https://<ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | for `/hq` | **Server only.** Never prefix with `NEXT_PUBLIC_` |
| `HQ_PASSWORD` | for `/hq` | Unlocks the dashboard |
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
only, via `lib/supabase.ts` — bypasses RLS. `bump_session()` is
`SECURITY DEFINER` and its execute grant is limited to `service_role`.

Never import `lib/supabase.ts` from a client component. Leaking the service
role key to the browser exposes every lead in the database.

## Analytics

First-party and written in `lib/analytics.ts` — no Google Analytics, no
cookies, no cross-site identifiers. Sessions live in `sessionStorage` and clear
when the tab closes.

- No raw IP is stored. The server derives a unique-per-day salted hash purely to
  count uniques.
- Coarse geography comes from Vercel edge headers; country, region, city only.
- Do Not Track and Global Privacy Control are both honoured.
- Nothing is recorded until the visitor interacts or dwells, so a bounce never
  registers.
- Age is never inferred from traffic. The age-range field on the form is
  optional and self-reported by the visitor.

## Layout

```
app/(site)/     public pages, prerendered
app/hq/         password-protected dashboard
app/api/        lead, track, hq/*
components/     page sections, including the one shared inquiry form
lib/            site data, SEO, analytics, Supabase access
supabase/       schema and the reconciliation migration
scripts/        image generation and audits
```

Property listings live in `lib/site.ts` as typed objects and feed
`app/(site)/properties`. Image paths and responsive sizes are generated into
`lib/*.generated.ts` by the `prebuild` step — do not hand-edit those.

## A note on `next.config.mjs`

`typescript.ignoreBuildErrors` is set to `true`, so `pnpm build` will **not**
fail on type errors. Run `pnpm typecheck` yourself before pushing. Vercel runs
`build`, which means type errors ship silently otherwise.
