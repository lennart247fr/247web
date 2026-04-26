import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const brandsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/brands' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string(),
    description: z.string(),
    story: z.string(),
    logo: z.string().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    website: z.string().url().optional(),
    galleryImages: z.array(z.string()).default([]),
  }),
});

export const collections = {
  brands: brandsCollection,
};
