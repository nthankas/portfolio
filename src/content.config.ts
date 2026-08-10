import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content status.
 *
 * `confirmed`      every fact in this file traces to the build brief, the live
 *                  GitHub pull, or the owner.
 * `needs_confirmation`
 *                  the file renders correctly but one or more fields listed in
 *                  `openQuestions` are the owner's to settle. These surface as
 *                  a terminal warning at build time (see scripts/check-gaps.mjs)
 *                  and never as a visible badge on the page.
 */
const status = z.enum(['confirmed', 'needs_confirmation']);

const artifact = z.object({
  label: z.string(),
  href: z.string().url().optional(),
  /** Set when the artifact is known to exist but is not yet publishable. */
  pending: z.boolean().default(false),
  note: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** Sorts the projects section. Lower is higher on the page. */
    priority: z.number().int(),
    /** One sentence. Shown in the collapsed card. Leads with the constraint. */
    thesis: z.string(),
    role: z.string(),
    org: z.string(),
    dates: z.string(),
    team: z.string().optional(),
    stack: z.array(z.string()).min(1),
    repo: z.string().url().optional(),
    /** Slug of the dedicated case study route, when one exists. */
    caseStudy: z.string().optional(),
    artifacts: z.array(artifact).default([]),
    status,
    /** Human-readable list of what is unresolved. Drives `npm run check:gaps`. */
    openQuestions: z.array(z.string()).default([]),
    /** Open Graph / meta description for the case study route. */
    description: z.string(),
  }),
});

export const collections = { projects };
