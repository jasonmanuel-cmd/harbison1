# Harbison Standard / Call Harbison — shared CRM status

## Project handoff — October 16, 2026

This is the current operational record. Older sections below are dated snapshots,
not assertions that the same counts or deployment IDs remain current indefinitely.
No production behavior was changed during this records-only update.

### Changes and affected files

| Repository | Files | Change |
|---|---|---|
| Standard | `src/pages/api/lead.ts`, `src/lib/server/shared-crm.ts`, `src/components/InquiryForm.astro` | Authenticated, idempotent intake into Call Harbison HQ; source/campaign and buyer-profile preservation; private storage diagnostic |
| Standard | `astro.config.mjs`, `.env.example`, `package.json`, `test/shared-crm.test.mjs` | Server-only bridge configuration and three client/security checks |
| Standard | `src/pages/api/hq/analytics.ts` | Protected server-to-server aggregates for shared HQ; uncached responses |
| Standard | `src/pages/hq/index.astro`, `src/pages/hq/dashboard.astro`, `vercel.json` | Direct permanent redirects to Call Harbison HQ |
| Standard | `src/components/hq/Dashboard.tsx`, `src/pages/api/hq/leads.ts` | Earlier shared-CRM link and guards against legacy lead mutations after cutover; old dashboard component is no longer the HQ entry point |
| HBH | `api/intake.js`, `lib/shared-intake.js`, `api/leads.js` | Private intake, original-input snapshot, brand handling, verification cleanup, explicit customer-SMS opt-in gate |
| HBH | `api/hq.js`, `lib/demo-leads.js` | Brand filtering, protected analytics proxy and narrowly guarded fake-record deletion |
| HBH | `static/hq/app.js`, `static/hq/index.html`, `static/hq/analytics.js` | Shared CRM interface and Website stats tab |
| HBH | `dev.mjs`, `dev/mock-supabase.mjs`, `test/shared-intake.test.js`, `test/central-hq.test.js` | Local bridge support and meaningful two-brand, authorization, filtering, retry, failure and cleanup tests |
| Both | `README.md`, `.env.example`; HBH `docs/SHARED-CRM.md` | Setup, release order, responsibilities and known limits |

Production configuration also changed: matching server-only intake secrets and
the Standard bridge URL were configured; HQ's password was reset and verified.
Credential values are deliberately excluded from project records and Git.

### Checks and actual results

- Latest implementation checks: HBH **40/40 tests passed** and **35 pages built**;
  Standard **3/3 tests passed**, type check **0 errors, 0 warnings, 10 existing hints**,
  and production build passed.
- Live authenticated diagnostics on both sites returned HTTP **200**, with
  `verified=true` and `cleaned=true`: synthetic storage/read/delete succeeded without
  sending notifications.
- Latest cleanup deleted **9 explicit QA/test IDs**, **0 skipped**. Subsequent reads
  returned **0 recognized test records**, **0 central leads**, and **0 open pipeline**.
  These were counts at verification time, not a requirement that the CRM stay empty.
- Live Standard HQ routes returned **308** to Call Harbison HQ. Its analytics API
  returned **401** without credentials and had no redirect.
- Live shared-HQ analytics returned **200**. Recorded 30-day snapshot:
  **563 sessions, 234 daily unique-visitor hashes, 441 page views**.
- Local and live browser checks passed: authenticated entry, seven metric cards,
  thirteen breakdown groups, date-range switching, no page errors, no mobile
  horizontal overflow. The local upstream-error test hid stale data and showed an error.
- Login after the requested password change returned **200** and a subsequent
  authenticated session check passed.
- Records-only update: reviewed all intended documentation and the staged diff;
  whitespace checks passed and a credential-pattern scan of all four intended
  documentation files found zero matches. The staged changes contain documentation only. Existing
  implementation checks above were not rerun for prose-only edits.

### Remaining problems and limits

- Live public-form notification receipt has not been verified. Provider email/SMS
  receipt is separate from the verified storage diagnostics.
- Historical Standard leads have not been imported; preserve original timestamps,
  notes, statuses and provenance when doing that work.
- Website stats currently cover **Standard traffic only**. The lead/pipeline
  dashboard covers both brands; Call Harbison GA4 traffic is not combined into it.
- Shared password access is not per-user authorization. The user-selected password
  remains in Vercel only; individual staff accounts and stronger authentication remain future work.
- No durable retry queue was added. HBH public submission throttling and the
  phone/address-only optional-details update path remain hardening items.
- Original audit items concerning testimonial provenance, hidden inventory versus
  listing copy, notification resilience and older README claims remain outside this release.
- The last observed GitHub Actions failure was an account billing lock before
  jobs started, not a failing local test. Its current billing state was not rechecked
  during this records update. Production builds and browser checks passed separately.
- Phone intake, missed-call automation and customer-message activation remain
  pending their documented decisions and broker review.

### Next concrete action

Coordinate one clearly labeled public-form test on each site with Nathanael,
confirm the complete HQ record and actual notification receipt, then mark/remove
those test records. Do not treat a storage-only diagnostic as proof of email delivery.
Afterward, plan a backed-up, duplicate-aware import of historical Standard leads.

### Decisions and corrections

- Call Harbison HQ is the single login and operational CRM; Standard's HQ now redirects.
- Keep Standard's analytics database in place and fetch aggregates server-to-server;
  no schema migration or browser exposure of service credentials was needed.
- “Face data” was confirmed by the user to mean fake/demo/test records. Initial
  inspection found eight obvious matches; full-record validation identified a ninth
  QA probe. All nine matched independent fake markers and were backed up before deletion.
- Buyer-profile extras use notes plus the original activity snapshot for compatibility;
  they are not separate structured filter columns.
- Customer SMS stays disabled by default; no phone routing or missed-call sequence
  was activated. The proposed marketing number remains pending review.
- Secret-bearing temporary access files were removed. The ignored local fake-data
  backup and deletion receipt are intentionally retained and excluded from commits.

Companion operational runbook: [HBH shared CRM](https://github.com/jasonmanuel-cmd/HBH/blob/main/docs/SHARED-CRM.md).
Original pre-change audit: [October 15 audit](WEBSITE-AUDIT-2026-10-15.md).

## October 16 update: central stats and test-data cleanup

- Standard's `/hq` and `/hq/dashboard` now return HTTP 308 directly to `https://www.callharbison.com/hq`.
- The shared HQ's **Website stats** tab displays Standard's existing analytics, with 7/30/90-day ranges and all visitor, time, source, campaign, location, device, browser, operating-system and page breakdowns. Call Harbison lead/pipeline metrics remain on the Dashboard.
- Aggregates are fetched server-to-server using the existing shared secret. Unauthenticated access to Standard's analytics endpoint still returns 401; the API is not redirected.
- Nine explicitly marked CIPHER QA/test leads were backed up and deleted by their exact IDs. Rechecking the cleanup endpoint found zero remaining recognized test records; the central lead table currently contains zero leads. No ordinary contact matched the cleanup criteria, and historical Standard leads were not touched.
- Local backup: `HBH-main/.env.hq-demo-backup.local` (ignored by Git); deletion receipt: `HBH-main/.env.hq-cleanup-result.local`.
- Verified live stats at the time of the check: 563 sessions, 234 daily unique-visitor hashes, 441 page views in the 30-day window. These are existing recorded Standard analytics, not demonstration figures.
- Validation passed: 40 HBH tests, 3 Standard tests, Standard type check and production build, HBH build, desktop/mobile browser rendering, changing the date range, the upstream-error state, and the deployed redirect-to-stats flow. The live browser had no page errors and no horizontal mobile overflow.
- Merged PRs: [Standard #5](https://github.com/jasonmanuel-cmd/harbison1/pull/5), [HBH #7](https://github.com/jasonmanuel-cmd/HBH/pull/7).
- Main commits: Standard `e084394069b5cb9b6329bcc22286a07af4ebce73`; HBH `a5841ead567c44f4dd3600aebfcd700388289e68`.
- Production deployments checked READY: Standard `dpl_BJ8ZXVHqFeDrSECzpcR6BUuRx8xX`; HBH `dpl_CR2fLNgmQ643SR8gM8ciVTRBf6L8`.

The original implementation record follows.

Verified October 15, 2026.

Both websites now route new website inquiries into **https://www.callharbison.com/hq**. HQ identifies the brand and source and uses one lead pipeline for follow-up. The changes are merged into each GitHub repository's main branch and both production deployments are ready.

## Current intake and handoff

- Harbison Standard sends inquiries through a private authenticated connection to the Call Harbison database. Its original database continues to hold site analytics. It no longer receives new lead copies after this cutover.
- Call Harbison continues to save its website inquiries directly into the same lead table.
- HQ includes a brand filter and brand labels. Standard's additional buyer profile and message are kept in notes and an initial activity snapshot. No property address is invented for a buyer inquiry.
- New Standard inquiries are assigned to Nathanael. Call Harbison retains its existing assignment behavior. Marketing/intake staff organize information and coordinate follow-up; property advice, pricing, negotiation and contracts go to Nathanael.
- Social content, personal-platform links, referral links and QR codes can direct people to these forms. Website attribution records the supplied campaign/source context. Social inbox messages and phone calls are not automatically imported by this release.
- Existing staff email notification paths remain configured in the applications. Actual email receipt was not tested during the cutover.

## Automated responses and broker review

Customer SMS acknowledgments default off and require an explicit enabled flag, response consent and Twilio configuration. No missed-call text or follow-up sequence was activated.

The proposed marketing/general inquiry number **661-201-4994** remains pending review and is not configured as a call-to-CRM integration. The public professional number **661-472-7499** was retained.

Broker-review items remain: brand/brokerage identification, personal-platform marketing, intake phone, fields and consent language, any customer-message wording and sending conditions, and handoff responsibilities. The existing shared HQ password remains team access, not separate role-based permissions.

Historical Standard leads remain in the original database; they were not imported into the shared CRM as part of this release.

## Verification

- HBH: all 37 tests passed and its 35-page build passed.
- Standard: all 3 bridge tests passed, type check passed with zero errors/warnings and 10 existing hints, and production build passed.
- Live Call Harbison private intake: saved a server-generated test record, read it back, deleted it; HTTP 200 with `verified=true` and `cleaned=true`.
- Live Standard `/api/lead`: authenticated diagnostic reached Call Harbison's private intake and completed the same storage/read/delete cycle; HTTP 200 with `verified=true` and `cleaned=true`.
- The diagnostics do not send staff or customer notifications. Both public form types were exercised together against the local test database; real public form submissions and provider receipt were not tested in production.
- Unauthenticated Call Harbison private intake returned HTTP 401.
- Temporary local files holding the new bridge secret were removed. The secret is stored server-side in Vercel and is not part of GitHub or the browser bundle.

GitHub releases: [Standard PR #4](https://github.com/jasonmanuel-cmd/harbison1/pull/4), [HBH PR #6](https://github.com/jasonmanuel-cmd/HBH/pull/6).

Merged commits: Standard `2b0d356931ba7d7f7391662228f237d80e9a647b`; HBH `abdbcaec5e61fbdfd3a545d2cb61f39c212f5c83`.

Latest production deployments checked: Standard `dpl_DVMr6BZ8kdxspEhUSdvm1Jk8E7Gz`; HBH `dpl_FJGyvsYXuRH6WC58Q93wGKCRWstS` (both READY).

Configuration and maintenance: see `HBH-main/docs/SHARED-CRM.md`.
