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
});
