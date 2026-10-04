import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { load } from 'cheerio';
import postcss from 'postcss';
import { walk } from './gate.mjs';

export const corePaths = ['/', '/products/', '/compare/', '/solutions/', '/custom/', '/case-studies/', '/about/', '/insights/', '/contact/', '/faq/', '/compliance/', '/privacy/', '/terms/'];
const visualProperties = /^(?:color|background(?:-color|-image)?|(?:margin|padding)(?:-.+)?|(?:row-|column-)?gap|font-size|line-height|letter-spacing|border(?:-color|-width|-radius)?|box-shadow|(?:min-|max-)?height|outline(?:-.+)?|top|bottom|left|right)$/;
export function checkCss(css, filename) {
  if (filename.endsWith('tokens.css')) return [];
  const errors = [];
  postcss.parse(css).walkDecls(decl => {
    if (/#(?:[0-9a-f]{3,8})\b|\b(?:rgb|rgba|hsl|hsla|oklch)\(/i.test(decl.value)) errors.push(`${filename}: colour literal in ${decl.prop}`);
    if (visualProperties.test(decl.prop) && /(?:\d+(?:\.\d+)?(?:rem|em|px|vh|vw|ch)|\b(?:white|black|blue|red|green|gray|grey)\b)/i.test(decl.value)) errors.push(`${filename}: visual literal in ${decl.prop}`);
  });
  return errors;
}
export function checkHtml(html, filename = 'HTML') {
  const $ = load(html); const errors = [];
  if ($('h1').length !== 1) errors.push(`${filename}: expected exactly one h1`);
  let previous = 0;
  $('h1,h2,h3,h4,h5,h6').each((_, element) => { const rank = Number(element.tagName.slice(1)); if (rank > previous + 1) errors.push(`${filename}: heading skips from h${previous} to h${rank}`); previous = rank; });
  if ($('[style]').length) errors.push(`${filename}: inline style`);
  $('img').each((_, image) => { if ($(image).attr('alt') === undefined) errors.push(`${filename}: missing image alt`); });
  $('script[src]').each((_, script) => { const src = $(script).attr('src'); if (/^(?:https?:)?\/\//.test(src)) errors.push(`${filename}: third-party script`); });
  if ($('video[autoplay]').length) errors.push(`${filename}: autoplay video`);
  const first = $('a[href],button,input:not([type="hidden"]),textarea,select').first();
  if (first.attr('href') !== '#main-content') errors.push(`${filename}: skip link is not first focusable element`);
  $('input[required],textarea[required],select[required]').each((_, control) => { const id = $(control).attr('id'); if (!id || !$(`label[for="${id}"]`).length) errors.push(`${filename}: missing form label`); });
  if ($('html').attr('lang') !== 'en') errors.push(`${filename}: language is not English`);
  if (!$('title').text() || !$('meta[name="description"]').attr('content')) errors.push(`${filename}: missing SEO metadata`);
  $('script[type="application/ld+json"]').each((_, script) => { try { JSON.parse($(script).text()); } catch { errors.push(`${filename}: invalid structured data`); } });
  return errors;
}
export function contrast(foreground, background) {
  const luminance = hex => {
    const rgb = hex.replace('#', '').match(/../g).map(part => parseInt(part, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
export async function checkBuild() {
  const errors = [];
  const source = await walk('src');
  for (const file of source.filter(file => /\.(astro|css)$/.test(file))) {
    const text = await readFile(file, 'utf8');
    if (file.endsWith('.css')) errors.push(...checkCss(text, file));
    else {
      if (/\sstyle\s*=/.test(text)) errors.push(`${file}: inline style in source`);
      for (const style of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) errors.push(...checkCss(style[1], file));
    }
  }
  const htmlFiles = (await walk('dist/client')).filter(file => file.endsWith('.html'));
  const paths = new Set(htmlFiles.map(file => '/' + file.replace(/^dist\/client\//, '').replace(/index\.html$/, '')));
  for (const path of corePaths) if (!paths.has(path)) errors.push(`Missing core route: ${path}`);
  const expected = (await Promise.all(['products', 'solutions', 'cases', 'insights'].map(async file => JSON.parse(await readFile(`src/content/${file}.json`, 'utf8'))))).flat();
  for (const item of expected) if (!paths.has(item.path)) errors.push(`Missing detail route: ${item.path}`);
  const site = JSON.parse(await readFile('src/content/site.json', 'utf8'))[0];
  for (const file of htmlFiles) {
    const text = await readFile(file, 'utf8'); errors.push(...checkHtml(text, file));
    const $ = load(text);
    if (site.isPlaceholder && !$('meta[name="robots"]').attr('content')?.includes('noindex')) errors.push(`${file}: placeholder page is indexable`);
    if (site.isPlaceholder && !$('[data-placeholder="true"]').length) errors.push(`${file}: no placeholder banner`);
    for (const link of $('a[href]').toArray()) {
      const href = $(link).attr('href');
      if (href.startsWith('/') && !paths.has(href.split(/[?#]/)[0])) errors.push(`${file}: broken internal link ${href}`);
    }
  }
  const tokens = {}; postcss.parse(await readFile('src/styles/tokens.css', 'utf8')).walkDecls(decl => { tokens[decl.prop] = decl.value; });
  const pairs = [
    ['text', 'bg'], ['text', 'surface'], ['text-muted', 'bg'], ['text-muted', 'surface'], ['text-muted', 'surface-raised'], ['text-muted', 'art-bg'], ['brand', 'bg'], ['brand', 'surface'], ['brand-contrast', 'brand'], ['brand-contrast', 'brand-hover'], ['text-inverse', 'text'], ['warning', 'warning-bg'], ['danger', 'surface'], ['success', 'surface'],
  ];
  for (const [fg, bg] of pairs) { const ratio = contrast(tokens[`--color-${fg}`], tokens[`--color-${bg}`]); if (ratio < 4.5) errors.push(`Contrast ${fg}/${bg}: ${ratio.toFixed(2)} < 4.5`); }
  const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
  for (const path of [...corePaths, ...expected.map(item => item.path)]) if (!sitemap.includes(`${site.domain}${path}</loc>`) && !sitemap.includes(`${process.env.SITE_ORIGIN}${path}</loc>`)) errors.push(`Sitemap missing ${path}`);
  return { errors, pages: htmlFiles.length, contrastPairs: pairs.length };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await checkBuild();
  if (result.errors.length) { console.error(result.errors.join('\n')); process.exitCode = 1; }
  else console.log(`Static checks passed: ${result.pages} pages, ${result.contrastPairs} contrast pairs, headings, links, labels, tokens, noindex and script rules.`);
}
