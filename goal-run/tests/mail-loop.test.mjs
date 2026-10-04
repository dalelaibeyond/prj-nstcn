import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { SMTPServer } from 'smtp-server';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { corePaths } from '../scripts/check.mjs';

test('built server serves the website and sends a local inquiry over SMTP with submitter Reply-To', { timeout: 30000 }, async t => {
  let received = ''; let envelope;
  const smtp = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'], logger: false,
    onData(stream, session, callback) {
      envelope = session.envelope;
      stream.on('data', chunk => received += chunk.toString());
      stream.on('end', () => callback(null));
    },
  });
  smtp.listen(0, '127.0.0.1'); await once(smtp.server, 'listening');
  t.after(() => new Promise(resolve => smtp.close(resolve)));
  const port = 14321;
  const server = spawn(process.execPath, ['dist/server/entry.mjs'], {
    env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), MAIL_TRANSPORT: 'smtp', SMTP_HOST: '127.0.0.1', SMTP_PORT: String(smtp.server.address().port), SMTP_SECURE: 'false', SMTP_USER: '', SMTP_PASS: '', MAIL_FROM: 'site@localhost.test', INQUIRY_TO: 'dalelai0776@gmail.com' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = ''; server.stdout.on('data', chunk => output += chunk); server.stderr.on('data', chunk => output += chunk);
  t.after(async () => { if (server.exitCode === null) { server.kill('SIGTERM'); await once(server, 'exit'); } });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
    if (server.exitCode !== null) break;
    await delay(100);
  }
  assert.ok(ready, `Built server failed to start: ${output}`);
  for (const path of corePaths) { const response = await fetch(base + path); assert.equal(response.status, 200, path); assert.ok((await response.text()).includes('<h1')); }
  assert.equal((await fetch(`${base}/missing-review-route/`)).status, 404);
  const payload = new URLSearchParams({ name: 'Review Tester', company: 'Review placeholder', phoneWhatsapp: '+65 8123 4567', email: 'reviewer@localhost.test', message: 'Local SMTP review loop. This is a test inquiry.', _hp: '', _ts: String(Date.now() - 5000) });
  const response = await fetch(`${base}/api/inquiry/`, { method: 'POST', body: payload, headers: { Accept: 'application/json', Origin: base } });
  assert.equal(response.status, 200, output); assert.deepEqual(await response.json(), { ok: true });
  assert.match(received, /^Reply-To: reviewer@localhost\.test\r?$/m);
  assert.match(received, /Local SMTP review loop/);
  assert.equal(envelope.rcptTo[0].address, 'dalelai0776@gmail.com');
  console.log('Local SMTP acceptance verified; Reply-To: reviewer@localhost.test. No external mailbox delivery is claimed.');
});
