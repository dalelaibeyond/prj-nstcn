import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone', bodySizeLimit: 16_384 }),
  session: false,
  site: process.env.SITE_ORIGIN || 'https://acme-devices.example',
  trailingSlash: 'always',
  server: { port: 4321, host: '0.0.0.0' },
});
