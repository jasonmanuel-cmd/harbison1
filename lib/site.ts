export const contact = {
  phone: '(661) 472-7499',
  phoneHref: 'tel:+16614727499',
  smsHref: 'sms:+16614727499',
  email: 'nate85.realtor@gmail.com',
  dre: '02059393',
  youtube: 'https://www.youtube.com/@Nathanaelharbison',
  instagram: 'https://www.instagram.com/nathanaelharbison',
  facebook: 'https://www.facebook.com/nate85.realtor',
  linkedin: 'https://www.linkedin.com/in/nathanael-harbison',
  reviews: 'https://www.google.com/search?q=Harbison+Standard+reviews',
}

export type City = 'Tehachapi' | 'Bakersfield' | 'Newbury Park'

export type Listing = {
  slug: string
  address: string
  city: City
  zip: string
  price: number
  beds?: number
  baths?: number
  sqft?: number
  /** Optional: a few sold listings never had a lot size published. */
  lot?: string
  neighborhood?: string
  blurb: string
  image: string
  description?: string
  features?: string[]
  images?: string[]
  status?: string
  attribution?: string
  mls?: string
  date?: string
}

// ---------------------------------------------------------------------------
// Gallery images
// ---------------------------------------------------------------------------
// Images are served as WebP. The previous JPEG originals were converted and
// removed; WebP has been in universal browser support since 2020, so no
// <picture> fallback is needed.
//
// The image list comes from a build-time generated manifest rather than a
// hardcoded count. Every listing previously claimed 24 photos while several
// only ever had 6 to 22, so those galleries shipped broken image slots to
// visitors. The manifest is produced by scripts/generate-image-manifest.mjs,
// which scans the directory — see that file for why it cannot be read at
// runtime.
import { propertyImages } from './property-images.generated'

/** The full gallery for a listing, discovered from the build-time manifest. */
const img = (slug: string): string[] => propertyImages[slug] ?? []

/**
 * The single image used for a listing's card and social preview. Falls back to
 * a neutral placeholder so a listing can never reference a missing file.
 */
const lead = (slug: string): string => propertyImages[slug]?.[0] ?? '/images/hero-1600.webp'

export const listings: Listing[] = [
  {
    slug: '2300-weybridge-dr',
    address: '2300 Weybridge Dr',
    city: 'Bakersfield',
    zip: '93311',
    price: 2895000,
    beds: 5,
    baths: 8,
    sqft: 7025,
    lot: '19,602 sq ft lot',
    neighborhood: 'Seven Oaks Estate',
    blurb:
      'Stunning 7,000+ sq ft estate with a $1,000,000+ remodel on the 9th hole of the Islands course, a short walk from the Seven Oaks clubhouse.',
    image: lead('2300-weybridge-dr'),
    images: img('2300-weybridge-dr'),
    status: 'Available',
    attribution: 'Listing courtesy of William Gordon, Watson Realty.',
    mls: 'V137657',
    date: '2026-07-15',
    description:
      'Stunning 7,000+ sq ft estate with $1,000,000+ remodel! Situated on the 9th hole of the Islands course, you are only a short walk from the Seven Oaks clubhouse. One of the most striking features is the refinished wood flooring, cabinetry, coffered ceilings and banisters, particularly in the study, foyer and staircase. The gourmet kitchen has high-end Wolf appliances and premier custom cabinets. The owner\'s suite is located on the ground floor with its 3 walk-in closets plus sitting area and direct access to the back yard spa. 4 ensuite bedrooms upstairs, all with walk-in closets. Finished walk-out basement used as gym/storage. Owned solar system and elevator with access to all three floors.',
    features: ['Seven Oaks gated', 'Golf course views', 'Elevator', 'Owned solar', 'Wolf appliances'],
  },
  {
    slug: '958-fairway-dr',
    address: '958 Fairway Dr',
    city: 'Bakersfield',
    zip: '93309',
    price: 899900,
    beds: 4,
    baths: 3,
    sqft: 2170,
    lot: '10,744 sq ft lot',
    neighborhood: 'Stockdale Country Club',
    blurb:
      'Beautifully renovated home in the prestigious Stockdale Country Club. New Presidential roof, updated 200-amp electrical, and a renovated pool.',
    image: lead('958-fairway-dr'),
    images: img('958-fairway-dr'),
    status: 'Available',
    attribution: 'Listing courtesy of Cecilia Clark, Emerge Real Estate.',
    mls: 'OC26184352',
    date: '2026-08-21',
    description:
      'Welcome to this beautifully renovated 4-bedroom, 3-bathroom home nestled in the prestigious Stockdale Country Club. A brand new Presidential roof, updated 200-amp electrical panel, and renovated pool mean the big ticket items are already taken care of. Inside, the fully renovated interior delivers a fresh, modern feel throughout, complemented by a desirable dual en-suite layout offering two private bedroom and bathroom combinations, perfect for multigenerational living or hosting guests in style.',
    features: ['Stockdale Country Club', 'Dual en-suite layout', 'Renovated pool', 'New Presidential roof'],
  },
  {
    slug: '28211-seabiscuit-way',
    address: '28211 Seabiscuit Way',
    city: 'Tehachapi',
    zip: '93561',
    price: 699000,
    beds: 4,
    baths: 3,
    sqft: 2836,
    lot: '0.75 acre lot',
    neighborhood: 'Stallion Springs',
    blurb:
      'An exceptional Stallion Springs home offering space, privacy, thoughtful design, and freedom on three-quarters of an acre.',
    image: lead('28211-seabiscuit-way'),
    images: img('28211-seabiscuit-way'),
    status: 'Available',
    attribution: 'Listing courtesy of Adonae Faris, Tehachapi Summit Real Estate.',
    mls: '9994413',
    date: '2026-08-29',
    description:
      'Welcome to this exceptional Stallion Springs home offering space, privacy, thoughtful design, and freedom. With approximately 2,836 square feet, 4 bedrooms, 3 bathrooms, and a spacious 3 car garage, this beautifully appointed residence offers the perfect blend of mountain living and modern comfort. The expansive primary suite is a true retreat, featuring vaulted ceilings, walk-in closet and separate 2nd closet, a luxurious soaking tub, and large walk-in shower. The home also has a tankless water heater, central vacuum, and fully paid-off solar system with panels and battery storage.',
    features: ['Paid-off solar + battery', '3-car garage', 'Outdoor fire pit & waterfall', 'EV charger'],
  },
  {
    slug: '2206-ribble-valley-dr',
    address: '2206 Ribble Valley Dr',
    city: 'Bakersfield',
    zip: '93311',
    price: 975000,
    beds: 5,
    baths: 3,
    sqft: 3123,
    lot: '14,375 sq ft lot',
    neighborhood: 'Grand Island · Seven Oaks',
    blurb:
      'Prestigious Gibbons & Wheelan home in the gated Grand Island community, with a tiered stone-entry staircase and stacked-stone pillars.',
    image: lead('2206-ribble-valley-dr'),
    images: img('2206-ribble-valley-dr'),
    status: 'Available',
    attribution: 'Listing courtesy of Jeff Jackson, Cal Connect Realty Group Inc.',
    mls: 'NS26187383',
    date: '2026-08-26',
    description:
      'Prestigious Gibbons & Wheelan home located in the gated Grand Island community at Seven Oaks. An elegant tiered stone-entry staircase, stacked-stone pillars, manicured landscaping, exposed rafter-tail eaves, and a rock-accented elevation create exceptional curb appeal. Custom double wrought-iron entry doors with hand-forged scrollwork welcome you inside, where you\'ll find tray ceilings, custom 20-inch tile flooring, and a desirable three-way split-wing design. The granite kitchen features upscale custom cabinetry, a center island, a wine refrigerator, and a custom backsplash.',
    features: ['Grand Island gated', 'Waterfall pool', 'Wrought-iron entry', 'Wine refrigerator'],
  },
  {
    slug: '21204-stage-dr',
    address: '21204 Stage Dr',
    city: 'Tehachapi',
    zip: '93561',
    price: 499900,
    beds: 4,
    baths: 2,
    sqft: 1945,
    lot: '0.48 acre lot',
    neighborhood: 'West Golden Hills',
    blurb: 'Brand new construction in West Golden Hills with a desirable split-wing floor plan on a spacious lot.',
    image: lead('21204-stage-dr'),
    images: img('21204-stage-dr'),
    status: 'Available',
    attribution: 'Listing courtesy of Descygene Simunovich, Miramar Intl Tehachapi.',
    mls: '9994415',
    date: '2026-08-21',
    description:
      'Brand New Construction in West Golden Hills! This beautiful 4 bedroom, 2 bath home offers approximately 1,945 sq. ft. on a spacious .48 acre lot. The desirable split-wing floor plan features luxury vinyl plank flooring, a stylish kitchen with soft-close cabinetry and a walk-in pantry, plus a spacious interior laundry room. The primary suite includes a beautifully tiled shower and two walk-in closets. Additional highlights include an oversized attached 2 car garage, Presidential style composition roof, and paid off solar.',
    features: ['New construction 2026', 'Paid-off solar', 'Oversized 2-car garage', 'Presidential composition roof'],
  },
  {
    slug: '18211-sulky-ln',
    address: '18211 Sulky Ln',
    city: 'Tehachapi',
    zip: '93561',
    price: 499000,
    beds: 3,
    baths: 3,
    sqft: 2496,
    lot: '0.27 acre lot',
    neighborhood: 'Stallion Springs',
    blurb: 'Luxury, convenience, and low-maintenance living in a beautifully crafted 2018 Stallion Springs home.',
    image: lead('18211-sulky-ln'),
    images: img('18211-sulky-ln'),
    status: 'Available',
    attribution: 'Listing courtesy of Heather McKinley, Keller Williams Tehachapi.',
    mls: '9994314',
    date: '2026-09-14',
    description:
      'Luxury, convenience, and low-maintenance living come together in this beautifully crafted Stallion Springs home. Built in 2018, this beautifully designed residence offers 3 bedrooms, 3 bathrooms, and nearly 2,500 square feet of thoughtfully planned living space. Soaring ceilings, abundant natural light, and an open-concept floor plan create an inviting atmosphere for both everyday living and entertaining. The spacious great room flows seamlessly into the stunning chef\'s kitchen, complete with beautiful cabinetry, generous prep space, a large center island, and modern finishes.',
    features: ['Built 2018', 'Open-concept floor plan', "Chef's kitchen with island", 'Spa-inspired primary suite'],
  },
  {
    slug: '28751-gleneagle-ct',
    address: '28751 Gleneagle Ct',
    city: 'Tehachapi',
    zip: '93561',
    price: 499999,
    beds: 3,
    baths: 2.5,
    sqft: 2364,
    lot: '0.47 acre lot',
    neighborhood: 'Stallion Springs',
    blurb: 'Sweeping mountain views and refined living in a serene Stallion Springs setting.',
    image: lead('28751-gleneagle-ct'),
    images: img('28751-gleneagle-ct'),
    status: 'Available',
    attribution: 'Listing courtesy of Chrystle Deal & Monique Weese, LRS Realty & Management, Inc.',
    mls: '202603588',
    date: '2026-09-12',
    description:
      'Welcome to 28751 Gleneagle Ct, an exceptional Stallion Springs residence offering sweeping mountain views and refined living in a serene setting. This thoughtfully designed home features 3 bedrooms, 2.5 bathrooms, and a versatile bonus room ideal for an office, gym, or guest retreat. The primary suite offers private deck access, a walk-in closet, and picturesque views. The great room is highlighted by dramatic floor-to-ceiling windows that fill the home with natural light.',
    features: ['Floor-to-ceiling windows', 'Mountain views', 'Oversized 3-car garage', 'Greenhouse'],
  },
  {
    slug: '2901-summit-cir',
    address: '2901 Summit Cir',
    city: 'Bakersfield',
    zip: '93306',
    price: 359000,
    beds: 2,
    baths: 1.75,
    sqft: 2209,
    lot: '6,570 sq ft lot',
    neighborhood: 'Summit Villas · 55+',
    blurb: 'Owned solar, no lease, no loan. Resort-like living in a gated 55+ community of only 12 custom homes.',
    image: lead('2901-summit-cir'),
    images: img('2901-summit-cir'),
    status: 'Available',
    attribution: 'Listing courtesy of Bradley Barnett, Century 21 Select Real Estate.',
    mls: '202607788',
    date: '2026-07-18',
    description:
      'Owned Solar. No Lease, No Loan! Discover easy, resort-like living in the unmatched Summit Villas, a gated 55+ community of only 12 custom homes. Residents enjoy a private clubhouse, sparkling pool, and a reservable guest house while the HOA maintains the community\'s shared amenities. This beautiful home offers approximately 2,209 square feet with abundant flexible-use spaces designed for comfortable living.',
    features: ['55+ gated community', 'Owned solar', 'Private clubhouse', 'Community pool'],
  },
  {
    slug: '3109-mount-vernon-ave',
    address: '3109 Mount Vernon Ave',
    city: 'Bakersfield',
    zip: '93306',
    price: 299900,
    beds: 4,
    baths: 2,
    sqft: 1680,
    lot: '8,276 sq ft lot',
    blurb: 'Dining room, breakfast area, large family room, central heat and air, and alley access.',
    image: lead('3109-mount-vernon-ave'),
    images: img('3109-mount-vernon-ave'),
    status: 'Available',
    attribution: 'Listing courtesy of Jorge Solis, Infinity Real Estate Services.',
    mls: '202607149',
    date: '2026-09-18',
    description:
      'Home features a dining room, breakfast area, large family room, laundry room, 1,680 sq ft of living space, Central Heat & Air, Alley Access, 4 bedrooms, 2 bathrooms, Spacious backyard 8,276 sq ft lot size plus a mother-in-law unit with its own kitchenette. The property is being sold with the tenant in place. The current long-term tenant pays $1,800 per month and is under a lease through October 31, 2026. No FHA financing; conventional or cash offers only.',
    features: ['Mother-in-law unit', 'Tenant in place', '$1,800/mo income', 'Alley access'],
  },
  {
    slug: '909-oberlin-ct',
    address: '909 Oberlin Ct',
    city: 'Bakersfield',
    zip: '93305',
    price: 299900,
    beds: 3,
    baths: 2,
    sqft: 1350,
    lot: '10,000 sq ft lot',
    blurb: 'Beautifully updated home on a quiet cul-de-sac, set on an expansive 10,000 sq ft lot.',
    image: lead('909-oberlin-ct'),
    images: img('909-oberlin-ct'),
    status: 'Available',
    attribution: 'Listing courtesy of Jesus H Garcia, The Mora Partners Inc.',
    mls: '202608755',
    date: '2026-09-18',
    description:
      'Welcome to this beautifully updated 3-bedroom, 2-bathroom home situated on a quiet cul-de-sac and set on an expansive 10,000-square-foot lot! Step inside to an inviting living area featuring recessed lighting, ceiling fans, and large windows that provide abundant natural light. The updated kitchen offers quartz countertops, a new sink, and modern lighting. Both bathrooms have been tastefully upgraded with new vanities, flooring, mirrors, and showers. Additional improvements include a new roof, solar panels, new electrical panel, wood fencing, recessed lighting, ceiling fans, and convenient indoor laundry.',
    features: ['Quiet cul-de-sac', 'New roof & solar', 'Quartz countertops', 'ADU potential'],
  },
  {
    slug: '505-jeffrey-st',
    address: '505 Jeffrey St',
    city: 'Bakersfield',
    zip: '93305',
    price: 287000,
    beds: 2,
    baths: 2,
    lot: '6,969 sq ft lot',
    blurb: 'Extensively remodeled, move-in ready home on an oversized East Bakersfield lot, including new plumbing.',
    image: lead('505-jeffrey-st'),
    images: img('505-jeffrey-st'),
    status: 'Available',
    attribution: 'Listing courtesy of Karmen Domani, Real Broker.',
    mls: '202608357',
    date: '2026-09-18',
    description:
      'Beautifully remodeled 2-bedroom, 2-bath home on an oversized lot in East Bakersfield. This move-in ready property has been extensively updated, including new plumbing and electrical, a new kitchen with updated cabinetry, countertops and fixtures, fully renovated bathrooms, new flooring, fresh interior and exterior paint, and updated lighting. The bright, functional floor plan maximizes the living space and offers a clean, modern feel throughout. The large lot provides exceptional outdoor space with room for entertaining, future improvements or potential ADU possibilities (buyer to verify).',
    features: ['New plumbing & electrical', 'New kitchen', 'Renovated bathrooms', 'ADU potential'],
  },
  {
    slug: '22208-mariposa-road',
    address: '22208 Mariposa Road',
    city: 'Tehachapi',
    zip: '93561',
    price: 40000,
    lot: '13,068 sq ft lot',
    neighborhood: 'Land',
    blurb: 'Prime Tehachapi land ready for your future build, whether a primary house or multi-family.',
    image: lead('22208-mariposa'),
    images: img('22208-mariposa'),
    status: 'Available',
    date: '2026-09-16',
    description:
      'Prime Tehachapi land opportunity ready for your future build for either a primary house or even multi family! This property offers the perfect blend of rural living and modern convenience.',
  },
  {
    slug: 'chalet-property',
    address: 'Chalet Property',
    city: 'Tehachapi',
    zip: '93561',
    price: 199000,
    lot: '20± acres',
    neighborhood: 'Cummings Valley · Land',
    blurb:
      '20± acres with phenomenal views across the valley to the Tehachapi Mountains. Building pad cleared and gated ranch entry in place.',
    image: lead('chalet-tehachapi'),
    images: img('chalet-tehachapi'),
    status: 'Available',
    date: '2026-09-16',
    description:
      '20± acres in the Cummings Valley area with phenomenal views across the valley to the Tehachapi Mountains. Building pad already cleared, gated ranch entry in place, overhead power at the road, and an established access road to the site.',
  },
  {
    slug: '585-n-wendy-dr',
    address: '585 N Wendy Dr',
    city: 'Newbury Park',
    zip: '91320',
    price: 880000,
    beds: 3,
    baths: 2,
    sqft: 1633,
    lot: '7,840 sq ft lot',
    neighborhood: 'Ventura County',
    blurb:
      'Fully reimagined luxury residence with Boney Mountain views, chef\'s kitchen, 400+ sq ft bonus room, and top-rated schools. Move-in ready.',
    image: '/images/585-n-wendy-dr-newbury-park-ca-800.webp',
    // This property's photos are named wendy1..wendy18 rather than
    // <slug>-<n>, so pass the prefix explicitly. The count is read from disk.
    images: img('585-n-wendy-dr'),
    status: 'Available',
    date: '2026-09-16',
    description:
      'Welcome to a fully reimagined Newbury Park residence where designer finishes meet everyday livability, all framed by sweeping views of Boney Mountain. Step inside to find luxury vinyl plank flooring flowing throughout, setting the stage for a home that has been remodeled top to bottom with genuine attention to detail.',
  },
]

export const soldListings: Listing[] = [
  {
    slug: '18024-pellisier-rd',
    address: '18024 Pellisier Road',
    city: 'Tehachapi',
    zip: '93561',
    price: 980000,
    beds: 4,
    baths: 3,
    sqft: 2805,
    lot: '20.08 acres',
    blurb: 'A mountain ranch with room to breathe. Set on more than 20 acres in Cummings Valley, this home brings together expansive views, a wraparound deck, and a barn with horse stalls.',
    image: '/images/property/2300-weybridge-dr-2.webp',
    status: 'Sold',
    date: '2025-07-01',
  },
  {
    slug: '10618-sheridan-st',
    address: '10618 Sheridan Street',
    city: 'Tehachapi',
    zip: '93505',
    price: 345000,
    beds: 4,
    baths: 2,
    sqft: 1705,
    blurb: 'A well-maintained single-story residence featuring 4 bedrooms, 2 bathrooms, and 1,705 sq ft of living space.',
    image: '/images/property/28211-seabiscuit-way-1.webp',
    status: 'Sold',
    date: '2025-06-06',
  },
  {
    slug: '9664-mendiburu-rd',
    address: '9664 Mendiburu Road',
    city: 'Tehachapi',
    zip: '93505',
    price: 359000,
    beds: 4,
    baths: 2,
    sqft: 2246,
    blurb: 'A 4-bedroom, 2-bathroom California City property offering 2,246 sq ft with solid bones and renovation potential.',
    image: '/images/property/28751-gleneagle-ct-1.webp',
    status: 'Sold',
    date: '2024-01-12',
  },
  {
    slug: '17400-alsab-pl',
    address: '17400 Alsab Place',
    city: 'Tehachapi',
    zip: '93561',
    price: 390000,
    beds: 3,
    baths: 2,
    sqft: 1507,
    blurb: 'A 3-bedroom, 2-bathroom Stallion Springs residence with 1,507 sq ft of comfortable living space.',
    image: '/images/property/21204-stage-dr-1.webp',
    status: 'Sold',
    date: '2023-10-30',
  },
  {
    slug: '21213-windsong-st',
    address: '21213 Windsong Street',
    city: 'Tehachapi',
    zip: '93505',
    price: 305000,
    beds: 3,
    baths: 2.5,
    sqft: 1591,
    blurb: 'An affordable 3-bedroom, 2.5-bathroom California City home offering 1,591 sq ft of accessible living space.',
    image: '/images/property/18211-sulky-ln-1.webp',
    status: 'Sold',
    date: '2023-09-08',
  },
]

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
}

export function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ---------- Page content (from harbisonstandard.com) ----------

export const privateSaleContent = {
  title: 'Sell Your House Privately in Kern County',
  intro:
    'Sell your house privately in Kern County without MLS, Zillow, open houses, or a sign in the yard. The Harbison Standard Private Sale Program offers a confidential, as-is, fast-close option for homeowners in Bakersfield, Tehachapi, and California City who want privacy.',
  points: [
    'No open houses, no strangers walking through — one private walkthrough with Nathanael Harbison, REALTOR® DRE #02059393, then private offers from a vetted buyer network of cash investors and retail buyers who want off-market homes not on Zillow.',
    'Close in 7–14 days cash or 21–30 days private retail, as-is, leave what you want.',
    'Legal in California with C.A.R. Form SELM, Seller Instruction to Exclude Listing from MLS.',
    'A private sale trades a modest discount for privacy, speed, and convenience. Cash investors typically pay 70–80 percent of market; private retail buyers pay 90–95 percent for off-market access.',
  ],
  areas: 'Serving all of Kern County including Bakersfield, Tehachapi, California City, Stallion Springs, Bear Valley Springs, and Golden Hills.',
  situations: [
    'Divorce or financial pressure',
    'Inherited property',
    'Bad tenants or problem tenants',
    'The house needs work',
    'You want a quiet, confidential sale',
  ],
}

export const offMarketContent = {
  title: 'Off-Market Deals in Kern County',
  intro:
    'Off-market deals in Bakersfield, Tehachapi, and California City are properties for sale that never appear on MLS, Zillow, or Realtor.com. Harbison Standard maintains a private lead system that monitors county tax-defaulted lists, Notice of Default pre-foreclosure filings, probate cases, code violations, Craigslist by-owner posts, Zillow FSBO, Facebook Marketplace, and wholesaler lists across Kern County.',
  points: [
    'Every lead is scored 1–10 for deal quality using price per square foot against 90-day comps, days on market, and motivation keywords.',
    'Off-market properties often trade 10–30 percent below market because sellers trade price for speed and privacy: tax-defaulted owners facing auction, pre-foreclosure sellers behind on payments, probate heirs who want a fast as-is sale, and owners of vacant or distressed houses.',
    'Investors make up most off-market buyers, and Nathanael maintains a private buyer network of cash buyers who want inventory not on the MLS.',
    'Create a buyer profile with your budget, area, and property type to get alerts when a matching private lead is found — before it reaches Zillow.',
  ],
}

export const relocateContent = {
  title: 'Moving from Los Angeles to Bakersfield',
  intro:
    'Moving from Los Angeles to Kern County involves understanding significant market differences in cost, lifestyle, schools, and long-term strategy.',
  points: [
    'Cost of living is substantially lower than Los Angeles, with home prices typically 40–60% less than comparable Southern California properties while offering comparable or better quality and space.',
    'The lifestyle differs markedly — smaller communities, significantly less traffic, clearer skies, cleaner air, and proximity to mountains, hiking, and outdoor recreation without the urban density.',
    'Schools, employment centers, neighborhood character, and community vibe vary across different Kern County communities, making community selection as important as property selection.',
    'Bakersfield offers urban amenities, diverse neighborhoods, employment diversity, and established infrastructure similar to larger metro areas.',
    'Tehachapi provides mountain living, cooler climate, strong community character, top-rated schools, and proven appreciation history.',
    'California City and Stallion Springs offer value pricing and emerging market potential for long-term appreciation.',
  ],
  outro:
    'Nathanael helps Los Angeles relocators think through budget expectations, lifestyle fit, school quality, employment access, and long-term real estate strategy.',
}

export const whyTehachapiContent = {
  title: 'Why Tehachapi Stands Out',
  intro:
    'Tehachapi offers mountain living, strong appreciation history, excellent schools, community character, and outdoor recreation opportunities that attract diverse buyer profiles.',
  points: [
    'The area attracts primary-residence buyers seeking lifestyle, investors analyzing appreciation potential, and families wanting small-town feel with urban amenities nearby.',
    'Elevation provides cooler summers, crisp air, distinct seasons, and relief from valley heat.',
    'Schools are consistently well-regarded and attract education-focused families.',
    'Property values have appreciated steadily over decades, with strong demand from relocators and investors supporting continued appreciation.',
    'The community maintains character while developing thoughtfully, balancing growth with preservation of mountain community feel.',
    'Employment opportunities, shopping, dining, and entertainment have expanded while maintaining community scale.',
    'Mountain recreation including hiking, biking, skiing, and outdoor activities is minutes away.',
  ],
}

export const landContent = {
  title: 'Land Opportunities in Kern County',
  intro:
    'Land opportunities in Kern County range from small residential lots in established neighborhoods to larger acreage for farming, ranching, commercial development, or future residential development.',
  points: [
    'Prices vary significantly based on location, access, zoning, utilities, and intended use.',
    'Land values depend on zoning designations, infrastructure availability, market trends, buyer intent, and development potential.',
    'Nathanael analyzes land deals from an investment perspective, understanding hold periods, development potential, infrastructure costs, and realistic exit strategies and timelines.',
    'Land investing requires different analysis than residential property investing, focusing on development potential, market timing, and long-term appreciation.',
  ],
}

export const aboutContent = {
  title: 'About Nathanael Harbison',
  paragraphs: [
    'Nathanael Harbison is a California-licensed REALTOR® (DRE #02059393) with verified transaction experience across Kern County and regional markets. His approach emphasizes clear communication, practical advice, and aligning strategy with client goals rather than pushing transactions.',
    'Nathanael works with buyers exploring their first purchases, relocating professionals from Los Angeles and beyond, sellers managing inherited properties or time-sensitive moves, and investors analyzing deal fundamentals for long-term wealth building. His experience includes residential sales across price ranges, investment property analysis, and navigating special situations like probate sales, short sales, and divorce settlements.',
    'Nathanael is committed to understanding what matters to his clients first, then presenting straightforward options without pressure or artificial urgency. He brings market knowledge from active participation in Kern County real estate, understanding neighborhood characteristics, pricing trends, school quality, employment centers, and buyer pools across different property types.',
    'Whether you are buying, selling, or investing, Nathanael approaches every conversation with respect for your time, your decision-making process, and your long-term interests. The real estate transaction is a significant decision deserving honest counsel and practical guidance.',
    'Every client relationship begins with listening — understanding your goals, timeline, constraints, and what success looks like from your perspective. Then comes honest market feedback without the sales pitch. Nathanael respects the stakes of real estate decisions and brings disciplined analysis, local market expertise, and transparent communication throughout your transaction.',
  ],
}

export const guides = [
  {
    slug: 'private-sale',
    title: 'Sell your house privately',
    body: 'No MLS, no Zillow, no open houses. Confidential, as-is, fast close for Kern County homeowners who want a quiet sale.',
  },
  {
    slug: 'off-market-deals',
    title: 'Off-market deals',
    body: 'Private listings not on MLS or Zillow — tax-defaulted, pre-foreclosure, probate, FSBO. Get alerts before Zillow.',
  },
  {
    slug: 'relocate',
    title: 'Moving from LA?',
    body: 'Compare what your budget buys in Bakersfield vs Los Angeles. Create a buyer profile for Kern County.',
  },
  {
    slug: 'why-tehachapi',
    title: 'Why Tehachapi?',
    body: 'Discover what makes this mountain community different — affordable land, four seasons, and a growing local economy.',
  },
  {
    slug: 'land',
    title: 'Cheap land in Kern County',
    body: 'View current land listings and learn what your budget buys in Bakersfield, Tehachapi, and the surrounding areas.',
  },
]

// ---------------------------------------------------------------------------
// FAQ
//
// Lives here rather than in components/faq.tsx so the rendered questions and
// the FAQPage structured data read from one source. Duplicating it is how the
// two drift apart, at which point the markup describes something the page does
// not say -- the kind of structured data search engines discount.
// ---------------------------------------------------------------------------

export const faqs = [
  {
    q: 'Who is Nathanael Harbison?',
    a: `Nathanael Harbison is a California-licensed REALTOR® (DRE #${contact.dre}) at Harbison Standard. He helps buyers, sellers, and investors across Kern County.`,
  },
  {
    q: 'Where does Harbison Standard serve?',
    a: 'All of Kern County, including Tehachapi, Bakersfield, California City, and Stallion Springs - for buying, selling, and investing.',
  },
  {
    q: 'Can Nathanael help me sell my home?',
    a: 'Yes. Nathanael guides sellers through planned moves, inherited properties, homes needing repairs, and time-sensitive situations, including selling as-is when that makes sense.',
  },
  {
    q: 'Do you work with real estate investors?',
    a: 'Yes. Nathanael works with investors on rentals, flips, land, and value-add homes, and talks plainly about what makes sense for their goals.',
  },
  {
    q: 'How do I get in touch?',
    a: `Call or text ${contact.phone} or email ${contact.email}. Messages typically get a response within 24 hours.`,
  },
]
