import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
const read = async file => JSON.parse(await readFile(`src/content/${file}.json`, 'utf8'));
const plain = value => value.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

test('all copy pages render their complete public blocks and mapped SEO without internal notes', async () => {
  const pages = await read('pages');
  assert.equal(pages.length, 26);
  assert.equal(new Set(pages.map(p => p.path)).size, 26);
  for (const p of pages) {
    const file = p.path === '/404/' ? '404.html' : p.path.slice(1) + 'index.html';
    const $ = load(await readFile(`dist/client/${file}`, 'utf8'));
    const text = plain($('main').text());
    assert.equal($('h1').text(), p.title, p.path);
    assert.equal($('title').text(), p.seoTitle, p.path);
    assert.equal($('meta[name="description"]').attr('content'), p.seoDescription, p.path);
    assert.equal($('meta[property="og:description"]').attr('content'), p.seoDescription, p.path);
    assert.match($('meta[name="robots"]').attr('content'), /noindex/);
    assert.ok(text.includes(plain(p.description)), `${p.path}: introduction`);
    assert.doesNotMatch($('body').text(), /Acme Devices|200\+ employees|24 hours|3×|−40%|\+18%|oneberry|Internal notes|\[NEED:|\[MEDIA:|[\u3400-\u9fff]/i, p.path);
    for (const b of p.blocks) {
      if (p.path === '/contact/' && (b.type === 'table' || b.text === 'All fields are required.')) continue;
      if (p.path === '/' && b.type === 'heading' && b.level === 3) continue; // Product cards use title case.
      if (p.path === '/products/' && b.type === 'heading' && ['AI companion toys', 'AI office assistants', 'AI glasses'].includes(b.text)) continue;
      if (b.type === 'link') assert.ok($(`a[href="${b.href}"]`).toArray().some(a => plain($(a).text()).includes(plain(b.text))), `${p.path}: ${b.text}`);
      else if (b.type === 'list') b.items.forEach(item => assert.ok(text.includes(plain(item)), `${p.path}: ${item}`));
      else if (b.type === 'table') b.rows.flat().forEach(cell => assert.ok(text.includes(plain(cell)), `${p.path}: ${cell}`));
      else assert.ok(text.includes(plain(b.text)), `${p.path}: ${b.text}`);
    }
    const source = await readFile(`../${p.source}`, 'utf8');
    const publicCopy = source.split(/## (?:Page copy(?: template)?|Article copy)\n/)[1].split('## Internal notes')[0];
    for (const match of publicCopy.matchAll(/^## (.+)$/gm)) assert.ok(p.blocks.some(b => b.type === 'heading' && b.text === match[1]), `${p.path}: missing source section ${match[1]}`);
  }
});

test('review identity, product directions and full articles retain factual boundaries', async () => {
  const [site] = await read('site');
  assert.equal(site.brandName, 'NEXSTACK AI');
  assert.equal(site.email, 'dalelai0776@gmail.com');
  assert.equal(site.whatsapp.e164, '66613306115');
  assert.deepEqual(site.metrics, []); assert.deepEqual(site.milestones, []);
  assert.equal(site.linkedin, null);
  assert.deepEqual(site.formFields.map(f => f.key), ['name', 'company', 'phoneWhatsapp', 'email', 'message']);
  assert.equal((await read('products')).length, 3);
  for (const product of await read('products')) { assert.deepEqual(product.certifications, []); assert.deepEqual(product.models, []); }
  const pages = await read('pages');
  for (const article of await read('insights')) {
    assert.ok(article.body.filter(b => b.type === 'paragraph').length >= 7);
    assert.deepEqual(article.body, pages.find(p => p.path === article.path).blocks);
  }
  const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
  assert.doesNotMatch(sitemap, /case-studies\/(?:logistics|education|retail)|edge-ai-in-consumer-devices|child-safety-standards/);
  const origin = new URL(sitemap.match(/<loc>(.*?)<\/loc>/)[1]).origin;
  for (const p of pages.filter(p => p.path !== '/404/')) {
    const $ = load(await readFile(`dist/client/${p.path.slice(1)}index.html`, 'utf8'));
    assert.equal($('link[rel="canonical"]').attr('href'), new URL(p.path, origin).href);
  }
});
