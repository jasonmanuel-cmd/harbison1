# Harbison Standard: local SEO analysis

Audited October 17, 2026. Scope: the live homepage and bio, rendered JSON-LD, the supplied public Google Business Profile, and targeted public citation searches. Preserve the current two-page site.

## Implementation update — October 17, 2026

- Saved the owner-specified YouTube URL (`https://www.youtube.com/@NathanaelRealEstate`) in the Google Business Profile accessible from the signed-in manager.
- Added the existing LinkedIn URL (`https://www.linkedin.com/in/nathanael-harbison`) to that profile. Google returned the saved four-link list; public display may lag.
- Added a concise visible service-area sentence to the shared website contact section, including California City. Added California City to the existing Organization `areaServed` array to match the visible copy. No address, rating, hours or new service claims added.
- Confirmed the managed profile's phone, website and real-estate category already match the site.
- **New blocker:** the owner dashboard explicitly reports “Verification not successful. To get verified, submit another recording.” Entering the verification flow currently asks for the owner's hidden mailing address. No address was entered and no verification claim was submitted. This is separate from the already-verified Search Console domain.
- **Possible duplicate records:** the original supplied public link resolves to Maps identifier `0x55c3f972bcd0ce09`, while the manager opens `0x2baea95838168b00` (manager business ID `17922934384710660329`). They share name/phone/site, but the identifiers differ. Treat as a possible duplicate until Google/owner confirms; no deletion, merging, replacement of the site's Google link, or review migration attempted.
- Zillow is signed out in the available browser. Its profile cannot be edited without the agent account. Realtor.com corrections also require an authorized agent account and confirmation of current brokerage details; no support messages sent.

### Ready-to-enter directory corrections

Use these verified values when editing the agent-owned profiles:

| Field | Value |
|---|---|
| Agent | Nathanael Harbison |
| Brand / personal website | Harbison Standard / https://www.harbisonstandard.com/ |
| Direct phone | (661) 472-7499 |
| Email | nate85.realtor@gmail.com |
| California DRE | 02059393 |
| Bio URL | https://www.harbisonstandard.com/about |
| Core service region | Tehachapi, Bakersfield, California City, Kern County |

Retain accurate brokerage attribution and office numbers; confirm them before editing. For Zillow, inspect the “Visit agent website” destination and Facebook destination as well as the bio. For Realtor.com, reconcile both existing profiles rather than creating a third. Do not copy a directory office address into the website without confirming a public customer-facing location.

Optional review-request draft for the owner after resolving the correct Google listing: “Thank you for working with me. If you would like to share your experience, I would appreciate an honest Google review: [insert the review link from the correct verified profile]. Your feedback helps others understand what working together is like.” No requests have been sent; there is no incentive or positive-review screening.

The score and findings below are the original audit baseline, not a claim that profile verification or citation cleanup is complete.

## Local SEO score: 62/100

This is an editorial readiness and evidence score, not a Google score or a prediction of map rankings. Unknown account-only settings receive partial credit; absence from a limited search does not prove a listing is absent.

| Dimension | Points | Assessment |
|---|---:|---|
| Google Business Profile signals | 18/25 | Correct visible category, name, phone, website and service areas; account verification, secondary categories and publishing activity unconfirmed |
| Reviews and reputation | 7/20 | Google says “Be the first to review”; established reviews exist on other platforms |
| Local on-page SEO | 17/20 | Local title, accessible local H1, visible regional coverage, clickable phone and email, directly linked bio |
| Identity consistency and citations | 8/15 | Site/schema/Google agree; agent directories contain different phones, websites and affiliation descriptions |
| Structured data | 8/10 | Consistent Organization + Person with service areas and license link; no verified public office address for a LocalBusiness rich-result implementation |
| Local authority evidence | 4/10 | Agent-directory profiles found; no chamber, press or community partnership evidence established in this sample |
| **Total** | **62/100** | **External listing cleanup and Google review development are the priorities** |

## Business type and industry

**Service-area presentation; real estate.** The website and public Google profile describe regional service without publishing a customer-facing office address. This is an inference from public presentation, not confirmation of the profile's internal business settings. Google lists California City, Kern County, Bakersfield and Tehachapi. Website schema names Tehachapi, Bakersfield and Kern County, which includes California City.

Do not publish a residential address, brokerage address, geographic coordinates or opening hours merely to complete markup. Confirm the actual business arrangement before changing those fields. Search Console verification does not establish Google Business Profile ownership or verification.

## Google Business Profile checklist

Observed directly through the owner's supplied [Google profile link](https://share.google/lv8AvSPXSSrPLItKX), resolving to entity `/g/11nvy_5pwh`:

| Check | Result | Next step |
|---|---|---|
| Business name | Harbison Standard | Matches website; keep real-world name without extra keywords |
| Visible category | Real estate agent | Fits the current site; secondary categories require owner dashboard review |
| Phone | (661) 472-7499 | Matches site and JSON-LD |
| Website | harbisonstandard.com | Correct domain; resolves to the preferred HTTPS www site |
| Service areas | California City, Kern County, Bakersfield, Tehachapi | Consistent regional scope |
| Hours | Monday–Saturday 9 AM–9 PM; Sunday closed | Published on Google; confirm these accurately reflect customer availability before copying to site |
| Description | Mentions Nathanael, Kern County, Bakersfield and Tehachapi | Relevant; no keyword expansion needed |
| Social profiles | Instagram and Facebook match; YouTube uses @Nathanaelharbison | Compare its destination with the owner-specified @NathanaelRealEstate; alias equivalence not established |
| Photos | “See photos” control present | Photo quantity, freshness and ownership not audited |
| Reviews | “Be the first to review” | Begin requesting honest feedback from actual clients |
| Posts, Q&A, owner verification, Insights | Not established | Review in the authorized GBP manager; no profile settings changed in this audit |

Google recommends accurate business information, useful photos and review responses. Local results depend on relevance, distance and prominence; there is no guaranteed placement. [Google local ranking guidance](https://support.google.com/business/answer/7091?hl=en)

## Review health snapshot

- **Google:** no published reviews indicated by the visible “Be the first to review” prompt. No Google star rating, review cadence or response history to assess.
- **Zillow:** 5.0 from 18 reviews displayed at audit time. This is Zillow feedback, not Google feedback. [Zillow profile](https://www.zillow.com/profile/nate85%20realtor)
- **Older Realtor.com profile:** 5.0 from seven reviews; visible review dates include October 2024 and older entries. [Realtor.com profile](https://www.realtor.com/realestateagents/5bad71dc655f080013e5417d)
- **Website:** no fabricated ratings, review-gating form, or aggregateRating markup detected in the current two-page implementation.

Use the review-request link generated inside GBP. Ask actual clients consistently for honest feedback, without incentives or screening for positive sentiment. Reply thoughtfully without disclosing transaction details. Do not treat an “18-day rule,” ten-review threshold or fixed posting schedule as a Google requirement. [Google review guidance](https://support.google.com/business/answer/3474122?hl=en)

## Name, address and phone comparison

| Source | Identity | Phone | Website / address notes |
|---|---|---|---|
| Visible site, both pages | Harbison Standard; Nathanael Harbison | (661) 472-7499 | www.harbisonstandard.com; no public office address |
| Organization + Person JSON-LD | Same brand and person | (661) 472-7499 | Same website; no address invented |
| Google profile | Harbison Standard | (661) 472-7499 | Correct domain; no street address displayed in inspected panel |
| Zillow | Nathanael Harbison; Mora Partner's Inc | (661) 472-7499 | Links to morapartnershomes.com; publishes a Bakersfield brokerage address |
| Realtor.com, newer profile | Nathanael Harbison; The Mora Partners | (619) 975-3467 | Links to bestsandiegohomesforsale.com; bio references Compass/San Diego; publishes a different Bakersfield office address |
| Realtor.com, older profile | Nathanael Harbison; Keller Williams Tehachapi | (661) 233-5052, explicitly labeled office | Different office affiliation; may be historical rather than a wrong personal phone |

The newer Realtor.com record displays DRE #02059393, strengthening the identity match. Confirm the current supervising brokerage before changing affiliations or requesting profile consolidation. Different office and personal numbers can be legitimate; make their roles clear. Do not replace site information with directory information automatically. [Newer Realtor.com profile](https://www.realtor.com/realestateagents/Nathanael-Harbison_Tehachapi_CA_100139432_582974748)

## Citation presence

| Platform | Evidence / status |
|---|---|
| Google | Confirmed public profile |
| Facebook | Linked from website and public Google profile; page ownership/details not independently audited |
| Instagram | Matching handle on site and public Google profile |
| Zillow | Profile found; phone/email match site, website destination differs |
| Realtor.com | Two public profiles found with differing contact/affiliation details |
| Yelp / BBB | No matching result established in targeted searches; Yelp blocks automated access. Status unknown, not “missing” |
| Apple Maps | Existing listing/claim status unknown. Check via [Apple Business](https://business.apple.com/), whose official site offers Maps listing management |
| Bing | Existing listing/claim status unknown. Check the official [Bing business portal](https://www.bing.com/forbusiness/) |
| Homes.com / local MLS | Not verified in this limited sample; review after reconciling the primary agent profiles |

A related [Harbison Buys Homes bio](https://www.callharbison.com/about) links back to this site and matches the phone/email. It also uses the older YouTube handle. Keep related brands' roles clear; the related site is not independent reputation proof. Its claims and testimonials were not validated by this audit, and that repository was not edited.

## Schema status and implementation guidance

The live pages emit linked **Organization + Person** nodes, including business name, website, phone, email, headshot, service areas, official DRE record and social links. The homepage also emits WebSite. The latest copy edits are live. Existing schema validation from the preceding SEO pass returned zero errors and warnings; this audit re-extracted live JSON-LD and confirmed those identity fields remain consistent.

**Keep the current implementation.** It accurately describes the available facts. `RealEstateAgent` is the relevant LocalBusiness subtype, but Google's LocalBusiness feature requires address information. No customer-facing office is confirmed here. There is no justified ready-to-publish address/geo patch; the existing `agentSchema()` and `personSchema()` in `src/lib/seo.ts` are the ready-to-use implementation for the present facts. If a public office is confirmed later, retain the stable entity ID and linked Person, use the appropriate subtype, and add only verified address and hours before validating again. [Google LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business)

Do not add self-serving review stars from Google, Zillow or Realtor.com as an SEO fix. Google excludes self-serving Organization/LocalBusiness review snippets, including third-party widgets placed on the business's own site. [Google review policy explanation](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful)

## Page quality and local intent

- Homepage title: “Harbison Standard | Kern County Real Estate.”
- Accessible homepage H1: “Harbison Standard: Real Estate in Tehachapi & Kern County.” Visible location line also names Tehachapi, Bakersfield and Kern County.
- Bio title: “Meet Nathanael Harbison | Harbison Standard.” The introduction supplies Kern County context without stuffing the title.
- Both pages expose direct contact information. Bio has an above-the-fold call button; homepage contact follows the videos and introduction.
- Both pages are one navigation click apart. No multi-location operation, store locator or doorway-page pattern detected.
- Dedicated service/city pages are intentionally outside the requested site scope. Do not recreate retired pages merely to improve an audit checklist score.
- Search Console work completed earlier today: two-page sitemap accepted; both URLs indexed; recrawls requested. Older snippets/enhancement reports may persist until Google processes the changes.

## Top ten prioritized actions

| Priority | Action | Completion criteria |
|---|---|---|
| High | Reconcile Realtor.com records | Confirm current brokerage, personal/office numbers and canonical website; resolve stale profiles through account/support tools |
| High | Correct Zillow website destination if outdated | Owner confirms intended destination and updates profile while preserving legitimate brokerage affiliation |
| High | Build genuine Google review history | Obtain GBP review link, ask actual clients impartially, and respond to feedback |
| High | Verify GBP ownership/settings | Review real-world name, category, contact, service areas and accurate hours in owner manager |
| Medium | Reconcile YouTube destinations | Confirm whether old handle is an alias; use the intended current channel consistently on GBP and related site |
| Medium | Check Apple Maps listing | Claim or correct an eligible existing record; use verified business details and appropriate address visibility |
| Medium | Check Bing business listing | Claim or correct eligible record and inspect phone, URL, category and service area |
| Medium | Maintain original GBP photos | Use real headshots, work and project images; ensure permission and accurate captions |
| Low | Strengthen genuine local authority | Add real community/industry affiliations or earned local coverage when available; do not invent badges or buy ranking promises |
| Low | Measure outcomes | Record GBP calls/site visits and Search Console local queries monthly; compare before/after directory corrections |

No critical website defect was established. Account/directory changes and review outreach were not performed. Website design and two-page scope remain unchanged.

## Limitations and next measurement

This is a public-evidence audit, not a complete listing crawl. It did not measure geo-grid rankings, non-branded map-pack positions across locations, comprehensive backlinks, Domain Authority, GBP Insights, owner-only verification/category settings, or all review dates and responses. Public directory/search data can lag current account data. No claims about absolute local rank or AI recommendation coverage follow from this score.

GBP manager and Search Console supply first-party performance data. BrightLocal or Local Falcon can add geo-grid checks; Whitespark can support citation discovery; Ahrefs or Semrush can investigate backlinks. Tool coverage and pricing were not audited. For a separate AI-search assessment, use the seo-geo skill rather than treating this local audit as an AI visibility score.

The skill's broad ranking percentages, fixed review timing rules and conversion statistics were not used as established facts. Recommendations above prioritize observed discrepancies and official platform guidance.
