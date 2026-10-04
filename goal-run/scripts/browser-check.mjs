import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { corePaths } from './check.mjs';

const base = process.env.REVIEW_URL || 'http://127.0.0.1:4321';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const reports = []; const errors = [];
const details = (await Promise.all(['products', 'solutions', 'cases', 'insights'].map(async file => JSON.parse(await readFile(`src/content/${file}.json`, 'utf8'))))).flat().map(item => item.path);
try {
  for (const size of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const thirdParty = [];
    page.on('request', req => { if (!req.url().startsWith(base) && !req.url().startsWith('data:')) thirdParty.push(req.url()); });
    await page.addInitScript(() => {
      window.__vitals = { lcp: 0, cls: 0, maxLongTask: 0 };
      new PerformanceObserver(list => list.getEntries().forEach(e => window.__vitals.lcp = e.startTime)).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.__vitals.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => list.getEntries().forEach(e => window.__vitals.maxLongTask = Math.max(window.__vitals.maxLongTask, e.duration))).observe({ type: 'longtask', buffered: true });
    });
    for (const path of [...corePaths, ...details, '/missing-review-page/']) {
      const response = await page.goto(base + path); assert.equal(response.status(), path === '/missing-review-page/' ? 404 : 200, `${size.name} ${path}`);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `Horizontal page overflow: ${size.name} ${path}`);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${size.name} ${path}: accessibility`);
      const metrics = await page.evaluate(() => ({ ...window.__vitals,
        jsBytes: performance.getEntriesByType('resource').filter(r => new URL(r.name).pathname.endsWith('.js')).reduce((sum, r) => sum + r.decodedBodySize, 0)
          + [...document.querySelectorAll('script[type="module"]:not([src])')].reduce((sum, script) => sum + new TextEncoder().encode(script.textContent).byteLength, 0),
      }));
      assert.ok(metrics.lcp < 2500, `LCP exceeded 2.5s: ${path}`);
      assert.ok(metrics.cls <= 0.1, `CLS exceeded 0.1: ${path}`);
      assert.ok(metrics.jsBytes < 16000, `Client JS budget exceeded: ${path}`);
      reports.push({ viewport: size.name, path, ...metrics });
      if (['/', '/products/', '/contact/'].includes(path)) await page.screenshot({ path: `test-results/${size.name}-${path === '/' ? 'home' : path.split('/')[1]}.png`, fullPage: true });
    }
    assert.deepEqual(thirdParty, [], 'Unexpected third-party request');
    await page.goto(base + '/'); await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('href'), '#main-content');
    await page.keyboard.press('Enter'); assert.equal(await page.locator(':focus').getAttribute('id'), 'main-content');
    if (size.name === 'mobile') {
      const toggle = page.locator('.menu-toggle'); await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape'); assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click(); await page.locator('#main-nav a[href="/products/"]').click(); await page.waitForURL('**/products/');
    }
    await page.goto(base + '/compare/'); await page.selectOption('#scenario-filter', 'office');
    assert.equal(await page.locator('thead [data-scenario]:visible').count(), 1); assert.match(await page.locator('thead [data-scenario]:visible').textContent(), /Office/);
    await page.selectOption('#scenario-filter', 'all'); assert.equal(await page.locator('thead [data-scenario]:visible').count(), 3);
    await page.goto(base + '/faq/'); await page.locator('summary').first().click(); assert.ok(await page.locator('details').first().getAttribute('open') !== null);
    await page.goto(base + '/contact/');
    const fill = async () => {
      await page.fill('[name="name"]', 'Review Tester'); await page.fill('[name="company"]', 'Review placeholder'); await page.fill('[name="phoneWhatsapp"]', '+65 8123 4567'); await page.fill('[name="email"]', 'reviewer@localhost.test'); await page.fill('[name="message"]', 'Browser review test inquiry.');
    };
    await fill();
    await page.route('**/api/inquiry/', route => route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ ok: false, fields: ['email'] }) }));
    await page.click('#inquiry-form button'); await page.waitForSelector('[name="email"][aria-invalid="true"]'); assert.equal(await page.locator('#error-email').isVisible(), true);
    await page.unroute('**/api/inquiry/');
    await page.route('**/api/inquiry/', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ ok: false }) }));
    await page.click('#inquiry-form button'); await page.waitForFunction(() => document.querySelector('.form-status')?.textContent?.includes('could not be sent')); assert.match(await page.locator('.form-status').textContent(), /could not be sent/);
    await page.unroute('**/api/inquiry/');
    await page.route('**/api/inquiry/', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }));
    await page.click('#inquiry-form button'); await page.waitForSelector('.form-status[data-state="success"]'); assert.equal(await page.inputValue('[name="email"]'), '');
    const contactAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze(); assert.deepEqual(contactAxe.violations.map(v => v.id), []);
    await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile('test-results/browser-report.json', JSON.stringify({ pages: reports, observedRuntimeErrors: errors, note: 'Local lab observations, not field Core Web Vitals or verified INP. Form UI tests mock responses; separate SMTP integration test verifies the real endpoint.' }, null, 2));
  console.log(`Browser checks passed: ${reports.length} route/viewport checks; zero axe WCAG AA violations, no page overflow or third-party requests. Menu, keyboard, filters, FAQ and form states verified.`);
  console.log(`Local lab maximums: LCP ${Math.max(...reports.map(r => r.lcp)).toFixed(0)}ms; CLS ${Math.max(...reports.map(r => r.cls)).toFixed(4)}; client JS ${Math.max(...reports.map(r => r.jsBytes))} bytes.`);
} finally { await browser.close(); }
