// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: process.env.PUBLIC_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Forward cookies from the original request
              if (req.headers.cookie) {
                proxyReq.setHeader('cookie', req.headers.cookie);
              }
            });
          }
        }
      }
    }
  },

  integrations: [react()],
});