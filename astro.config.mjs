// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sugampanthi.com.np',
  integrations: [
    react(),
    // applyBaseStyles: false because we import our own full CSS with @tailwind base
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  output: 'static',
  markdown: {
    shikiConfig: {
      // Register custom fence languages used for image/layout blocks in blog posts
      langAlias: {
        image: 'plaintext',
        twoimages: 'plaintext',
        textandimage: 'plaintext',
      },
    },
  },
});
