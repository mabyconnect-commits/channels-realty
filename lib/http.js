// HTTP helpers for Vercel Node serverless functions (CommonJS).

// BigInt-safe JSON (money is stored as BigInt kobo).
function serialize(obj) {
  return JSON.parse(JSON.stringify(obj, (_k, v) => (typeof v === 'bigint' ? Number(v) : v)));
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(typeof body === 'object' ? serialize(body) : body));
}

const ok = (res, data) => send(res, 200, { ok: true, ...data });
const created = (res, data) => send(res, 201, { ok: true, ...data });
const fail = (res, status, error) => send(res, status, { ok: false, error });

// Parse JSON body (Vercel usually parses req.body, but handle raw streams too).
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return await new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

// Wrap a handler: method guard + central error handling.
function handler(methods, fn) {
  const allow = Array.isArray(methods) ? methods : [methods];
  return async (req, res) => {
    if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
    if (!allow.includes(req.method)) return fail(res, 405, 'Method not allowed');
    try {
      return await fn(req, res);
    } catch (e) {
      if (e && e.statusCode) return fail(res, e.statusCode, e.message);
      console.error('API error:', e);
      return fail(res, 500, 'Something went wrong');
    }
  };
}

// Throwable error with a status code.
class HttpError extends Error {
  constructor(status, message) { super(message); this.statusCode = status; }
}
const bad = (msg) => { throw new HttpError(400, msg); };
const unauthorized = (msg) => { throw new HttpError(401, msg || 'Not signed in'); };
const forbidden = (msg) => { throw new HttpError(403, msg || 'Not allowed'); };
const notFound = (msg) => { throw new HttpError(404, msg || 'Not found'); };

// Validate a request body against a zod schema.
function parse(schema, body) {
  const r = schema.safeParse(body || {});
  if (!r.success) {
    const first = r.error.issues[0];
    throw new HttpError(400, first ? `${first.path.join('.')}: ${first.message}` : 'Invalid input');
  }
  return r.data;
}

module.exports = { serialize, send, ok, created, fail, readBody, handler, HttpError, bad, unauthorized, forbidden, notFound, parse };
