# Standard local EGM fixes — November 2, 2026

Base: 8c42d559152cb0b374c1fa37ed1b52ab5fa100f7. Branch: egm/standard-reliability. Local only; no release authorization exercised.

## Changes

- Current public contact remains phone/email. Documentation now distinguishes it from the retained unmounted form and the separate HQ redirect.
- Partial sessionStorage denial no longer throws from tracking. DNT/GPC/opt-out suppress retained-form session attribution; queued analytics checks the preference before sending.
- Retained lead API bounds JSON body bytes and read time, rejects overlength input and invalid phone/choice fields, and avoids logging arbitrary upstream/error content.
- Shared duplicate acknowledgement reports stored=true, notification=unknown, HTTP 202. It does not resend email or claim email success. Successful new Formspree acceptance is labelled notification=accepted, not inbox receipt.
- Retained browser submission has a 45-second deadline and honest partial/uncertain messages. No automatic retries were added.
- Instance-local limiter now refuses new keys at capacity rather than growing indefinitely. It is still not a global quota.

## Verification

21 automated tests pass. New cases cover partial storage denial, opt-out with an existing session and queued tracking, DNT/GPC, bounded chunked/stalled request bodies, input rejection, storage/email failures, duplicate/concurrent shared receipts, lost responses, safe logging and limiter capacity. Requests/providers are mocked; tests send no real leads or notifications.

Astro check: 0 errors, 0 warnings, two pre-existing hints. Production build passes; the final rerun includes the review corrections. Independent read-only review found no blocker. Its three follow-ups were applied and confirmed: treat HTTP 408 as a recoverable input error, reject nonprimitive bedroom inputs before coercion, and describe provider acceptance rather than asserting personal inbox receipt.

## Remaining prerequisites and limits

A duplicate storage receipt has no durable notification state. Reliable recovery needs a separately designed/approved receiving-side delivery receipt or outbox, reconciliation ownership and retry policy. Do not blindly resend duplicates or treat HTTP 202 as an email confirmation. Receiver atomic deduplication is mocked from its existing contract; this repository's tests do not re-audit the receiver. Legacy local storage has no stable submission-ID idempotency; automatic retries remain unsafe there.

No schema, credentials, recipient, integration configuration, DNS, feature activation or external repository changed. No live notification receipt verified. Deployment needs separate authorization. Restoring any public form needs a product decision; this change does not mount one. Infrastructure-wide rate limits and trusted proxy enforcement remain deployment-level decisions.

Direct API callers must conform to the retained form's phone and option contracts; invalid enum values and malformed phone values now return 400. This may reject undocumented callers that previously relied on permissive truncation/coercion. No currently mounted public form is affected.
