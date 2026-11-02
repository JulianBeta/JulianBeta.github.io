import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  // Files live in content/blog/<lang>/<slug>.md → id "<lang>/<slug>"
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Slug of the same post in the other language, for the language switch and hreflang.
    translation: z.string().optional(),
  }),
});

export const collections = { blog };
