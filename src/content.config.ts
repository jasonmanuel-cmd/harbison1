import { defineCollection } from 'astro:content'
import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'

const listings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/listings' }),
  schema: z.object({
    address: z.string(),
    city: z.enum(['Tehachapi', 'Bakersfield', 'Newbury Park', 'California City']),
    zip: z.string().regex(/^\d{5}$/),
    price: z.number().int().positive(),
    beds: z.number().int().positive().optional(),
    baths: z.number().positive().optional(),
    sqft: z.number().int().positive().optional(),
    /** Human-readable lot size as published, e.g. "0.48 acre lot". */
    lot: z.string().optional(),
    /** Normalized lot size in acres, used for filtering. */
    lotAcres: z.number().positive().optional(),
    neighborhood: z.string().optional(),
    type: z.enum(['home', 'land']),
    status: z.enum(['active', 'pending', 'sold']),
    blurb: z.string(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    attribution: z.string().optional(),
    mls: z.string().optional(),
    listedAt: z.coerce.date().optional(),
    soldAt: z.coerce.date().optional(),
    featured: z.boolean().default(false),
  }),
})

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string(),
    cardTitle: z.string(),
    summary: z.string(),
    eyebrow: z.string(),
    order: z.number(),
    /** Photo key in src/assets/property, without extension. */
    hero: z.string(),
    intro: z.string(),
    points: z.array(z.string()).min(1),
    situations: z.array(z.string()).optional(),
    outro: z.string().optional(),
    /** Which listings to show beneath the guide: an area id, or "land". */
    related: z.string().optional(),
    cta: z.object({
      goal: z.enum(['Buying', 'Selling', 'Investing']),
      eyebrow: z.string(),
      title: z.string(),
      body: z.string(),
    }),
  }),
})

const areas = defineCollection({
  loader: file('src/content/areas.json'),
  schema: z.object({
    name: z.string(),
    region: z.string(),
    tag: z.string(),
    photo: z.string(),
    body: z.string(),
    order: z.number(),
    match: z.object({ city: z.string().optional(), neighborhood: z.string().optional() }),
  }),
})

export const collections = { listings, guides, areas }
