# Landing site verification — October 17, 2026

The public site has a Harbison Standard homepage and Nathanael bio at `/about`.

## Lighthouse

Lighthouse 13.5.0, Chrome 155, default simulated mobile throttling and desktop
preset. Measured against the production build served locally with gzip and
immutable hashed-asset caching (`python scripts/preview-production.py`).
These are local lab results, not a guarantee of identical deployed or real-device scores.

| Page | Profile | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| home | mobile | 99 | 100 | 100 | 100 |
| home | desktop | 100 | 100 | 100 | 100 |
| bio | mobile | 100 | 100 | 100 | 100 |
| bio | desktop | 100 | 100 | 100 | 100 |

The final phone-specific homepage pass scored 99 after font preloading,
offscreen rendering containment, and phone tap-to-play were added.

Run `pwsh scripts/audit-all.ps1` to reproduce all four audits. The script fails
if a score is below 90. Raw reports are generated in the ignored `audits/` folder.

## Browser and functional checks

- Both routes checked at 320, 390, 820, and 1440 CSS pixels: no horizontal overflow
  or broken images.
- Homepage and bio navigation, phone/email links, and five social links inspected.
- Hero MP4: H.264 High, yuv420p, 1280×720, 20 seconds, fast-start metadata.
- Hero plays muted and inline; pause/play control verified. Blocked autoplay and
  reduced motion retain the visible poster and provide manual play. Phones and
  data-saving connections use tap-to-play; desktop and tablet autoplay.
- YouTube loads on selection; each button points directly to its chosen video.
  The playlist parameter was removed after detecting that YouTube could start a
  different item from its queue.
- Browser console checked for first-party runtime errors; none observed locally.
- Production build succeeds; Astro check reports zero errors and zero warnings
  (two existing hints); all three existing tests pass.

## iPhone scope

Responsive phone sizes and iPhone-compatible media settings were checked on Windows
Chrome. No physical iPhone, iOS Safari, or WebKit runtime was available; this does
not claim an actual-device Safari certification or guarantee that all browser
versions and network conditions are error-free.
