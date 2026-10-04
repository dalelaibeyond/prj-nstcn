import test from 'node:test';
import assert from 'node:assert/strict';
import { createInquiryHandler, createLimiter, validateInquiry, makeMessage } from '../src/lib/inquiry.mjs';

const good = { name: 'Review Tester', company: 'Review placeholder', phoneWhatsapp: '+65 8123 4567', email: 'reviewer@localhost.test', message: 'Local review inquiry; no real commercial request.', _hp: '', _ts: Date.now() - 5000 };
const request = (input, options = {}) => new Request('http://localhost:4321/api/inquiry/', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...options.headers }, body: JSON.stringify(input) });

test('all five fields are required and malformed or injected values are rejected', () => {
  assert.deepEqual(validateInquiry(good).fields, []);
  for (const field of ['name', 'company', 'phoneWhatsapp', 'email', 'message']) {
    assert.ok(validateInquiry({ ...good, [field]: '' }).fields.includes(field));
  }
  assert.ok(validateInquiry({ ...good, email: 'x@localhost.test\r\nBcc: stolen@localhost.test' }).fields.includes('email'));
  assert.ok(validateInquiry({ ...good, company: 'test\nInjected' }).fields.includes('company'));
  assert.ok(validateInquiry({ ...good, message: 'x'.repeat(5001) }).fields.includes('message'));
  assert.ok(validateInquiry({ ...good, email: 'invalid' }).fields.includes('email'));
  assert.ok(validateInquiry({ ...good, phoneWhatsapp: 'not-a-number' }).fields.includes('phoneWhatsapp'));
});
test('honeypot and too-fast submissions silently succeed without delivery', async () => {
  let deliveries = 0;
  const handler = createInquiryHandler({ deliver: async () => { deliveries++; } });
  assert.equal((await handler(request({ ...good, _hp: 'robot' }), 'a')).status, 200);
  assert.equal((await handler(request({ ...good, _ts: Date.now() }), 'b')).status, 200);
  assert.equal((await handler(request({ ...good, _ts: 'invalid' }), 'c')).status, 200);
  assert.equal(deliveries, 0);
});
test('rate limits are per IP and expire after ten minutes', () => {
  const limit = createLimiter();
  assert.equal(limit('first', 0), true); assert.equal(limit('first', 1), true); assert.equal(limit('first', 2), true); assert.equal(limit('first', 3), false);
  assert.equal(limit('second', 3), true); assert.equal(limit('first', 600000), true);
});
test('rate-limited requests are silently dropped', async () => {
  let deliveries = 0;
  const handler = createInquiryHandler({ deliver: async () => { deliveries++; } });
  for (let i = 0; i < 4; i++) assert.equal((await handler(request(good), 'same')).status, 200);
  assert.equal(deliveries, 3);
});
test('server validates independently, blocks cross-origin requests and oversized bodies', async () => {
  const handler = createInquiryHandler({ deliver: async () => assert.fail('Invalid input delivered') });
  const invalid = await handler(request({ ...good, email: 'bad' }), 'one');
  assert.equal(invalid.status, 400); assert.deepEqual((await invalid.json()).fields, ['email']);
  assert.equal((await handler(request(good, { headers: { Origin: 'https://outside.test' } }), 'two')).status, 403);
  assert.equal((await handler(request({ ...good, message: 'x'.repeat(18000) }), 'three')).status, 413);
  const malformed = new Request('http://localhost:4321/api/inquiry/', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: '[' });
  assert.equal((await handler(malformed, 'four')).status, 400);
});
test('mail failure is honest, generic and does not log personal data', async () => {
  const logs = [];
  const handler = createInquiryHandler({ deliver: async () => { throw new Error('secret SMTP credential'); }, log: line => logs.push(line) });
  const response = await handler(request(good), 'failure');
  assert.equal(response.status, 503); assert.deepEqual(await response.json(), { ok: false });
  assert.equal(logs.length, 1); assert.ok(!logs[0].includes(good.email)); assert.ok(!logs[0].includes('secret'));
});
test('Reply-To is the submitter and headers cannot be supplied by inquiry data', () => {
  const message = makeMessage(good, { MAIL_FROM: 'site@localhost.test', INQUIRY_TO: 'inbox@localhost.test' });
  assert.equal(message.replyTo, good.email); assert.equal(message.to, 'inbox@localhost.test'); assert.equal(message.from, 'site@localhost.test');
  assert.equal(message.disableFileAccess, true); assert.equal(message.disableUrlAccess, true);
});
test('plain HTML form submissions redirect back with a result', async () => {
  const handler = createInquiryHandler({ deliver: async () => {} });
  const req = new Request('http://localhost:4321/api/inquiry/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(good) });
  const response = await handler(req, 'no-js');
  assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/contact/?outcome=sent');
});
