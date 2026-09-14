// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { posts } from './src/data/posts.js';

// lastmod tells Google which pages are worth recrawling. Blog posts carry a
// real publication date; pages without one are left without a lastmod rather
// than stamped with the build time, which Google treats as noise.
const postDates = new Map(
  posts.map((post) => [`https://spanthi.com/blog/${post.slug}/`, post.date]),
);

export default defineConfig({
  site: 'https://spanthi.com',
  integrations: [
    react(),
    // applyBaseStyles: false because we import our own full CSS with @tailwind base
    tailwind({ applyBaseStyles: false }),
    sitemap({
      serialize(item) {
        const date = postDates.get(item.url);
        if (date) item.lastmod = new Date(`${date}T00:00:00Z`).toISOString();
        return item;
      },
    }),
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
