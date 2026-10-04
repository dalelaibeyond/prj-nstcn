import nodemailer from 'nodemailer';

const limits = { name: 120, company: 200, phoneWhatsapp: 60, email: 254, message: 5000 };
const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/;
const headerSafe = value => !/[\r\n\0]/.test(value);
export function validateInquiry(input) {
  const fields = [];
  const data = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = typeof input[key] === 'string' ? input[key].trim() : '';
    if (!value || value.length > max || /\0/.test(value) || (key !== 'message' && !headerSafe(value))) fields.push(key);
    data[key] = value;
  }
  if (data.email && !emailPattern.test(data.email) && !fields.includes('email')) fields.push('email');
  if (data.phoneWhatsapp && (!/^[+\d\s().-]+$/.test(data.phoneWhatsapp) || data.phoneWhatsapp.replace(/\D/g, '').length < 6) && !fields.includes('phoneWhatsapp')) fields.push('phoneWhatsapp');
  return { data, fields };
}

export function createLimiter({ maximum = 3, windowMs = 600_000, capacity = 10_000 } = {}) {
  const attempts = new Map();
  return (ip, now = Date.now()) => {
    for (const [key, value] of attempts) if (now - value.start >= windowMs) attempts.delete(key);
    const bucket = attempts.get(ip);
    if (!bucket) {
      if (attempts.size >= capacity) return false;
      attempts.set(ip, { start: now, count: 1 }); return true;
    }
    bucket.count += 1;
    return bucket.count <= maximum;
  };
}

export function makeMessage(data, env) {
  if (!env.INQUIRY_TO || !env.MAIL_FROM || !emailPattern.test(env.INQUIRY_TO) || !emailPattern.test(env.MAIL_FROM)) throw new Error('MAIL_CONFIGURATION');
  return {
    to: env.INQUIRY_TO,
    from: env.MAIL_FROM,
    replyTo: data.email,
    subject: `Website inquiry: ${data.company}`,
    text: `Name: ${data.name}\nCompany: ${data.company}\nPhone / WhatsApp: ${data.phoneWhatsapp}\nEmail: ${data.email}\n\n${data.message}`,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}

export async function sendInquiry(data, env = process.env) {
  const message = makeMessage(data, env);
  if (env.MAIL_TRANSPORT === 'resend') {
    if (!env.RESEND_API_KEY) throw new Error('MAIL_CONFIGURATION');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(12_000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: message.from, to: [message.to], reply_to: message.replyTo, subject: message.subject, text: message.text }),
    });
    if (!response.ok) throw new Error('MAIL_DELIVERY');
    return;
  }
  if (!env.SMTP_HOST) throw new Error('MAIL_CONFIGURATION');
  const localTest = env.SMTP_HOST === '127.0.0.1' || env.SMTP_HOST === 'localhost';
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_SECURE === 'true',
    requireTLS: !localTest && env.SMTP_SECURE !== 'true',
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 12_000,
  });
  const result = await transport.sendMail(message);
  if (!result.accepted?.length || result.rejected?.length) throw new Error('MAIL_DELIVERY');
}

async function readBody(request) {
  const maximum = 16_384;
  if (Number(request.headers.get('content-length')) > maximum) throw new Error('BODY_LIMIT');
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximum) { await reader.cancel(); throw new Error('BODY_LIMIT'); }
    chunks.push(value);
  }
  const merged = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(merged);
}

export function createInquiryHandler({ deliver = sendInquiry, limiter = createLimiter(), log = console.error, now = Date.now } = {}) {
  return async (request, ip = 'unknown') => {
    const json = request.headers.get('accept')?.includes('application/json') || request.headers.get('content-type')?.includes('application/json');
    const reply = (status, payload) => {
      const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
      if (!json && (status === 200 || status === 503 || status === 400)) return new Response(null, { status: 303, headers: { 'Cache-Control': 'no-store', Location: `/contact/?outcome=${payload.ok ? 'sent' : 'error'}` } });
      return new Response(JSON.stringify(payload), { status, headers });
    };
    if (request.method !== 'POST') return reply(405, { ok: false });
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return reply(403, { ok: false });
    if (!limiter(ip, now())) return reply(200, { ok: true });
    let input;
    try {
      const body = await readBody(request);
      const contentType = request.headers.get('content-type') || '';
      if (contentType.startsWith('application/json')) input = JSON.parse(body);
      else if (contentType.startsWith('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(body);
        if ([...new Set(params.keys())].some(key => params.getAll(key).length !== 1)) return reply(400, { ok: false });
        input = Object.fromEntries(params);
      } else return reply(415, { ok: false });
    } catch (error) { return reply(error.message === 'BODY_LIMIT' ? 413 : 400, { ok: false }); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) return reply(400, { ok: false });
    if (input._hp) return reply(200, { ok: true });
    const age = now() - Number(input._ts);
    if (!Number.isFinite(age) || Number(input._ts) <= 0 || age < 2000) return reply(200, { ok: true });
    const { data, fields } = validateInquiry(input);
    if (fields.length) return reply(400, { ok: false, fields });
    try { await deliver(data); }
    catch { log('Inquiry mail delivery failed; no inquiry content was logged.'); return reply(503, { ok: false }); }
    return reply(200, { ok: true });
  };
}
