# Harbison websites: architecture and audit

**Follow-up:** the shared CRM implementation was subsequently deployed and verified. See [the current shared CRM status](SHARED-CRM-STATUS.md). Findings below describe the earlier audit state.

Reviewed October 15, 2026. Scope: both supplied source folders, public homepages, selected live API access checks, GitHub repository and CI metadata, and local checks. This is a source and operational review, not a completed visual accessibility or penetration audit. No production settings, customer records, or website code were changed.

## The two businesses

| | Harbison Standard | Harbison Buys Homes |
|---|---|---|
| Website | https://www.harbisonstandard.com | https://www.callharbison.com |
| GitHub | https://github.com/jasonmanuel-cmd/harbison1 | https://github.com/jasonmanuel-cmd/HBH |
| Audience | Buyers, sellers, relocators, land buyers and investors | Property owners facing repairs, inheritance, tenants, deadlines, or uncertainty |
| Purpose | Establish Nathanael Harbison's real estate practice, explain services, show transactions and collect inquiries | Acquire seller inquiries and compare direct purchase, listing, renovation, development, or waiting |
| Primary conversion | Shared inquiry form, phone, email | Three-step property-options form, phone |
| Platform | Astro, TypeScript, Tailwind; React for HQ | Custom Node HTML generator; native browser JavaScript; no package dependencies |
| Hosting | Vercel | Vercel |

Both identify Nathanael Harbison, DRE 02059393, with the same phone and email. They are complementary entry points into the same professional network. They are separate applications with separate lead APIs and HQ implementations. A unified operational CRM is not established by this review.

## Harbison Standard

- Public routes include home, about, contact, properties, individual properties, areas and area detail, guides and individual guides, privacy, terms, accessibility, robots and sitemap.
- Content is edited in local JSON/Markdown collections. This is a curated listing system; no MLS/IDX synchronization was found in the reviewed code.
- Nineteen listing records are present: fourteen active and five sold. `SHOW_FOR_SALE = false` in `src/lib/listings.ts` hides active listings, their routes and associated statistics. Sold transactions remain visible. Active listings are therefore not presently a functioning public inventory.
- Listing galleries, filtering and a payment estimator are implemented. Property photography is absent from the supplied assets folder; the current sold pages deliberately support text-based presentation. Restoring inventory needs an asset review before enabling the flag.
- All inquiry forms use `src/components/InquiryForm.astro` and POST to `/api/lead`. The API attempts Supabase storage, then Formspree email. The browser distinguishes partial delivery and offers a prefilled email fallback when delivery fails.
- `/hq` uses password authentication and signed eight-hour HttpOnly cookies. Its APIs provide leads and first-party visit analytics. Lead management includes status, notes and deletion.
- First-party analytics uses tab sessions, daily salted IP hashes and coarse geography; browser code honors DNT, GPC and an explicit opt-out.
- `supabase/schema.sql` and the reconciliation migration describe the intended database. Current deployed migrations and database policies were not inspected.

## Harbison Buys Homes

- Builds 35 HTML pages: main marketing pages, eleven seller situations, five geographic pages, six guides, a family-property funnel and supporting resources/legal pages.
- `site.config.mjs` centralizes identity, domain and analytics settings. `src/content*.mjs` and `src/family.mjs` contain the copy; `src/templates.mjs` builds presentation and schema.
- The principal funnel asks situation, property address, then contact details and consent. `/thank-you` collects optional timeline, occupancy, condition and outcome details.
- `/api/leads` can send to Supabase, Resend email, webhooks and Twilio. Success requires a storing destination; SMS alone does not count. Missing delivery configuration returns failure, despite older README statements about accepting leads into logs.
- The family funnel supports partner attribution, relationship/authority questions, educational material and optional videos. Attribution stores campaign/click identifiers and referral information.
- `/hq` is a more developed seller CRM: pipeline stages, follow-ups, appointments, notes, contact history, outcomes, profitability and response-time reporting. It uses a signed twelve-hour cookie and a shared password.
- GA4 is enabled by default with a valid configured fallback tag; GTM is optional. Attribution persists in browser storage. This differs from Standard's first-party analytics approach.
- Supabase schema adds leads, partners, events, ad spend and reporting views. Reviewed view migrations set `security_invoker = true`; intended tables enable RLS. Deployment state remains unverified.

## Findings, in recommended order

1. **GitHub Actions is blocked for HBH.** The latest three retrieved CI runs failed. The latest run's annotation explicitly says: “The job was not started because your account is locked due to a billing issue.” This is an account/billing problem, not a demonstrated test failure. Local HBH tests all pass. Evidence: https://github.com/jasonmanuel-cmd/HBH/actions/runs/37690164411 . Resolve the account issue and rerun CI; verify branch protection and deployment gates separately.
2. **HBH's public lead API lacks a server-side rate limit.** `api/leads.js` has validation and a honeypot, but no request throttle. Direct requests can bypass the hidden-field check and consume email/SMS/webhook resources. Add enforced throttling, with monitoring and spending controls as appropriate. Standard's limits and both login throttles are in-memory per instance, not global guarantees.
3. **HBH follow-up updates lack a submission-bound credential.** `kind: 'details'` matches leads by phone/address in a six-hour window. Someone who knows those values can modify permitted supplemental fields. Use a short-lived token tied to the created lead. The current minimal-return PATCH also cannot distinguish a successful match from zero updated rows.
4. **Cross-site testimonial provenance is inconsistent.** Standard sets `SHOW_TESTIMONIALS = false` pending verification. HBH publishes overlapping quotes on its live homepage and attributes them to Standard. Confirm source and permission for each quote; their authenticity is not established by the code. This is a provenance finding, not a legal conclusion.
5. **Standard's inventory messaging overpromises current functionality.** `/properties` title, description and introduction advertise current listings and filtering, while the visibility flag hides all active inventory. Align the page copy with the current operating mode or deliberately restore complete inventory and assets.
6. **Outbound delivery can stall.** Standard's database fetch has no explicit timeout and runs before its timed Formspree request. A database stall can delay email. HBH provider calls also lack explicit application timeouts. Add bounded waits and robust partial-failure reporting; consider durable retries and idempotency.
7. **Standard HQ authentication is shared-password based, with a rotation caveat.** When an independent `HQ_SECRET` is configured, changing only `HQ_PASSWORD` does not revoke already issued cookies, because their signature depends on the unchanged secret. Rotate the signing secret too when immediate revocation is required; consider named accounts as team access grows.
8. **Documentation has drifted.** HBH README still says unconfigured submissions are accepted into logs; code now correctly returns failure. Standard README describes the broader listing capabilities without adequately surfacing the current inventory switch. Update runbooks to reflect actual behavior.

## Verification and limits

- Both production homepages returned HTTP 200. Standard sitemap returned HTTP 200.
- Standard `/api/hq/leads` and HBH `/api/hq?action=me` returned HTTP 401 without authentication.
- HBH: 33 tests passed; build generated 35 pages.
- Standard: dependencies installed from its lockfile; type check passed across 65 files with zero errors, zero warnings and ten hints. Production build passed. Palette contrast script passed its six selected current-state combinations; this is not a full rendered accessibility audit.
- Standard main commit inspected: `d45ff3567295d94b0b34cade71d2ec91b1d93e0a`; its GitHub Vercel status reports success. HBH main: `ad9a6f70ac9022f8d182b825ba6c54ccb11fdcf7`.
- Both supplied folders have no `.git` metadata. Their remote names were established from README, repository listing and GitHub API inspection. A file-by-file equivalence between these snapshots, GitHub main and production was not established.
- No real lead was submitted, to avoid sending unsolicited notifications or creating customer-like data. Email receipt, SMS delivery, live database persistence, dashboard behavior after login, actual environment variables, database advisors, mobile rendering and full browser journeys remain unverified.
- Existing automated tests and source review do not establish production conversion rates, complete security, legal compliance, or accuracy of transaction claims.

Recommended next sequence: unblock CI; verify one controlled lead end to end on each website; harden HBH submission and details endpoints; resolve testimonial provenance and inventory messaging; then perform a browser-based mobile, accessibility and conversion review.
