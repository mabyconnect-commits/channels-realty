// Provider-agnostic payments layer with a Paystack adapter.
// Amounts are in KOBO (integers). Swap in a Flutterwave adapter later behind the same shape.
const crypto = require('crypto');

const SECRET = process.env.PAYSTACK_SECRET_KEY || '';
const BASE = 'https://api.paystack.co';
const SITE = process.env.SITE_URL || 'https://channels-realty-three.vercel.app';

function configured() { return !!SECRET; }

async function call(path, method, body) {
  if (!SECRET) {
    const e = new Error('Payments not configured (set PAYSTACK_SECRET_KEY)');
    e.statusCode = 503; throw e;
  }
  const res = await fetch(BASE + path, {
    method,
    headers: { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status === false) {
    const e = new Error(json.message || 'Payment provider error');
    e.statusCode = 502; throw e;
  }
  return json.data;
}

// Initialize a transaction → returns { authorization_url, reference }.
async function initTransaction({ email, amount, reference, metadata, callbackPath }) {
  const data = await call('/transaction/initialize', 'POST', {
    email,
    amount, // kobo
    reference,
    currency: 'NGN',
    metadata: metadata || {},
    callback_url: SITE + (callbackPath || '/?pay=callback'),
  });
  return { authorizationUrl: data.authorization_url, reference: data.reference, accessCode: data.access_code };
}

// Verify a transaction by reference → returns { status, amount, reference, ... }.
async function verifyTransaction(reference) {
  const data = await call(`/transaction/verify/${encodeURIComponent(reference)}`, 'GET');
  return { status: data.status, amount: data.amount, reference: data.reference, paidAt: data.paid_at, metadata: data.metadata };
}

// Create a transfer recipient (for payouts to a Nigerian bank account).
async function createRecipient({ name, accountNumber, bankCode }) {
  const data = await call('/transferrecipient', 'POST', {
    type: 'nuban', name, account_number: accountNumber, bank_code: bankCode, currency: 'NGN',
  });
  return data.recipient_code;
}

// Initiate a payout transfer.
async function initiateTransfer({ amount, recipientCode, reason, reference }) {
  const data = await call('/transfer', 'POST', {
    source: 'balance', amount, recipient: recipientCode, reason, reference,
  });
  return { transferCode: data.transfer_code, status: data.status, reference: data.reference };
}

// Verify a Paystack webhook signature (x-paystack-signature: HMAC-SHA512 of raw body).
function verifyWebhook(rawBody, signature) {
  if (!SECRET || !signature) return false;
  const hash = crypto.createHmac('sha512', SECRET).update(rawBody).digest('hex');
  return hash === signature;
}

module.exports = {
  provider: 'paystack', configured,
  initTransaction, verifyTransaction, createRecipient, initiateTransfer, verifyWebhook,
};
