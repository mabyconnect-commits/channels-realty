// Paystack webhook. We don't trust the payload — on every event we re-verify the
// transaction against Paystack's API (with our secret key) before fulfilling.
// This is robust even when the platform has already parsed the request body.
const { prisma } = require('../../lib/prisma');
const { handler, ok } = require('../../lib/http');
const paystack = require('../../lib/paystack');
const { fulfillOrder } = require('../../lib/fulfill');

module.exports = handler('POST', async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const reference = body && body.data && body.data.reference;

  // Best-effort signature check if a raw body is available; never the sole gate.
  const sig = req.headers['x-paystack-signature'];
  if (req.rawBody && sig && !paystack.verifyWebhook(req.rawBody, sig)) {
    return ok(res, { ignored: 'bad signature' });
  }

  if (!reference) return ok(res, { ignored: 'no reference' });

  const order = await prisma.order.findUnique({ where: { ref: reference } });
  if (!order || order.status === 'PAID') return ok(res, { handled: true });

  const result = await paystack.verifyTransaction(reference).catch(() => null);
  if (result && result.status === 'success' && BigInt(result.amount) >= order.amount) {
    await fulfillOrder(order.id);
  }
  return ok(res, { handled: true });
});
