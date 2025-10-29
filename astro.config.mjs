// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';


import react from '@astrojs/react';


import tailwindcss from '@tailwindcss/vite';


import sitemap from '@astrojs/sitemap';


import showTailwindcssBreakpoint from 'astro-show-tailwindcss-breakpoint';

// https://astro.build/config
export default defineConfig({
  site: 'https://socialia.apps.darideveloper.com',

  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  integrations: [
    react(),
    sitemap(),
    showTailwindcssBreakpoint(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

});