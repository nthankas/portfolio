// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { deploy } from './src/site.config.ts';

export default defineConfig({
  site: deploy.site,
  base: deploy.base,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  build: {
    // Emit one CSS file rather than per-page chunks; the stylesheet is small
    // enough that a single cacheable request beats per-route splitting.
    inlineStylesheets: 'auto',
  },
  image: {
    // Figures are wide diagrams and photographs; these are the widths the
    // srcset is generated at.
    responsiveStyles: false,
  },
  markdown: {
    smartypants: false,
  },
});
