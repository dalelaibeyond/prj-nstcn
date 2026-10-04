import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone', bodySizeLimit: 16_384 }),
  session: false,
  site: process.env.SITE_ORIGIN || 'http://localhost:4321',
  redirects: {
    '/case-studies/logistics/': '/case-studies/workflow-project-01/',
    '/case-studies/education/': '/case-studies/workflow-project-02/',
    '/case-studies/retail/': '/case-studies/workflow-project-03/',
    '/insights/edge-ai-in-consumer-devices/': '/insights/briefing-an-ai-companion-toy/',
    '/insights/child-safety-standards-ai-toys/': '/insights/defining-an-ai-office-assistant/',
  },
  trailingSlash: 'always',
  server: { port: 4321, host: '0.0.0.0' },
});
