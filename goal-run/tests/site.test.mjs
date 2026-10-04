import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { checkHtml, checkCss, checkBuild } from '../scripts/check.mjs';
import { findReleaseViolations, inspectRelease, releasePatterns } from '../scripts/gate.mjs';

test('built pages obey the complete static contract', async () => {
  const result = await checkBuild(); assert.deepEqual(result.errors, []); assert.equal(result.pages, 26);
});
test('static verifier rejects inline styles, missing alt and skipped headings', () => {
  const errors = checkHtml('<html lang="en"><body><h1>A</h1><h3>B</h3><img src="x"><p style="color:red">Bad</p></body></html>');
  assert.ok(errors.some(e => e.includes('inline style'))); assert.ok(errors.some(e => e.includes('missing image alt'))); assert.ok(errors.some(e => e.includes('heading skips')));
  assert.ok(checkCss('.card { color: red; padding: 20px; }', 'component.css').length >= 2);
});
test('release gate recognises every forbidden pattern including formatted JSON', () => {
  const fixtures = ['example.com', 'acme-devices.example', 'foo.example', 'person@example.org', 'TODO', 'Lorem', 'FIXME', '"isPlaceholder": true', '"isExample": true', 'Sample case', 'pending'];
  assert.equal(fixtures.length, releasePatterns.length);
  fixtures.forEach(value => assert.ok(findReleaseViolations(value).length, `Missed ${value}`));
  assert.equal(findReleaseViolations('Authentic content with isPlaceholder: false and isExample: false').length, 0);
});
test('review placeholders are retained and the production gate refuses them', async () => {
  assert.ok((await inspectRelease()).length > 0);
  const cases = JSON.parse(await readFile('src/content/cases.json', 'utf8'));
  assert.ok(cases.every(c => c.isExample && c.isPlaceholder && c.quote === null));
  const certifications = JSON.parse(await readFile('src/content/certifications.json', 'utf8'));
  assert.ok(certifications.every(c => c.status === 'in-progress' && c.holder));
});
