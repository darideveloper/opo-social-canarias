// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import node from "@astrojs/node";
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env.local
const envFile = '.env.local';
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log('✅ Loaded environment from .env.local');
} else {
  console.warn('⚠️ .env.local not found, using system environment variables');
}

// In config files, prefer direct process.env access
const PUBLIC_API_BASE_URL = process.env.PUBLIC_API_BASE_URL;
console.log('🔧 PUBLIC_API_BASE_URL:', PUBLIC_API_BASE_URL || 'NOT SET');

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