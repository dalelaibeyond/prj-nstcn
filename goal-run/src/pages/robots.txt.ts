import type { APIRoute } from 'astro';
import { loadContent } from '../lib/content';
export const prerender = true;
export const GET: APIRoute = async () => {
  const c = await loadContent();
  const blocked = import.meta.env.SITE_ENV !== 'production' || c.site.isPlaceholder || [...c.products, ...c.solutions, ...c.cases, ...c.certifications, ...c.insights, ...c.pages].some(item => item.isPlaceholder);
  const origin = import.meta.env.SITE_ORIGIN || `https://${c.site.domain}`;
  return new Response(`User-agent: *\n${blocked ? 'Disallow: /' : 'Allow: /'}\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
