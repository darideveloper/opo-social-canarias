// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import node from "@astrojs/node";

// Load from .env files (development) OR use process.env (production)
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
const PUBLIC_API_BASE_URL = env.PUBLIC_API_BASE_URL || process.env.PUBLIC_API_BASE_URL;

console.log(PUBLIC_API_BASE_URL)

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: PUBLIC_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Forward cookies from the original request
              if (req.headers.cookie) {
                proxyReq.setHeader('cookie', req.headers.cookie);
              }
            });
            
            // Forward Set-Cookie headers from backend response
            proxy.on('proxyRes', (proxyRes, req, res) => {
              if (proxyRes.headers['set-cookie']) {
                // Forward all Set-Cookie headers
                res.setHeader('set-cookie', proxyRes.headers['set-cookie']);
              }
            });
          }
        }
      }
    }
  },

  integrations: [react()],
});