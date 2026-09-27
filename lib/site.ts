export const contact = {
  phone: '(661) 472-7499',
  phoneHref: 'tel:+16614727499',
  smsHref: 'sms:+16614727499',
  email: 'nate85.realtor@gmail.com',
  dre: '02059393',
  youtube: 'https://www.youtube.com/@Nathanaelharbison',
  instagram: 'https://www.instagram.com/nathanaelharbison',
  facebook: 'https://www.facebook.com/nate85.realtor',
  reviews: 'https://www.google.com/search?q=Harbison+Standard+reviews',
}

export type City = 'Tehachapi' | 'Bakersfield'

export type Listing = {
  slug: string
  address: string
  city: City
  zip: string
  price: number
  beds?: number
  baths?: number
  sqft?: number
  lot: string
  neighborhood?: string
  blurb: string
  image: string
}

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
    image: '/images/property/2300-weybridge-dr-1.webp',
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
    image: '/images/property/958-fairway-dr-1.webp',
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
    image: '/images/property/28211-seabiscuit-way-1.webp',
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
    image: '/images/property/2206-ribble-valley-dr-1.webp',
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
    image: '/images/property/21204-stage-dr-1.webp',
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
    image: '/images/property/18211-sulky-ln-1.webp',
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
    image: '/images/property/28751-gleneagle-ct-1.webp',
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
    image: '/images/property/2901-summit-cir-1.webp',
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
    image: '/images/property/3109-mount-vernon-ave-1.webp',
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
    image: '/images/property/909-oberlin-ct-1.webp',
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
    image: '/images/property/505-jeffrey-st-1.webp',
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
    image: '/images/property/22208-mariposa-1.webp',
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
    image: '/images/property/chalet-tehachapi-1.webp',
  },
]

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
}
