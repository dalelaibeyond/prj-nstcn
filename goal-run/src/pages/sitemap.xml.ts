import type { APIRoute } from 'astro';
import { loadContent } from '../lib/content';
import { routes } from '../lib/routes';
export const prerender = true;
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const GET: APIRoute = async () => {
  const c = await loadContent();
  const origin = import.meta.env.SITE_ORIGIN || `https://${c.site.domain}`;
  const paths = ['/', ...routes(c).map(r => `/${r.path}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${escape(new URL(path, origin).href)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
