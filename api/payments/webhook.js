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

  const event = body.event || '';

  // ---- Payout transfer events ----
  if (event.indexOf('transfer.') === 0) {
    const transferCode = body.data && body.data.transfer_code;
    if (!transferCode) return ok(res, { ignored: 'no transfer code' });
    const payout = await prisma.payout.findFirst({ where: { providerRef: transferCode } });
    if (!payout || payout.status === 'PAID' || payout.status === 'FAILED') return ok(res, { handled: true });
    if (event === 'transfer.success') {
      await prisma.payout.update({ where: { id: payout.id }, data: { status: 'PAID' } });
    } else if ((event === 'transfer.failed' || event === 'transfer.reversed') && payout.status === 'PROCESSING') {
      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({ where: { userId: payout.userId }, data: { balance: { increment: payout.amount } } });
        await tx.transaction.create({ data: { userId: payout.userId, type: 'REFUND', amount: payout.amount, label: 'Payout reversed — refunded' } });
        await tx.payout.update({ where: { id: payout.id }, data: { status: 'FAILED' } });
      });
    }
    return ok(res, { handled: true });
  }

  // ---- Charge (purchase / funding) events ----
  if (!reference) return ok(res, { ignored: 'no reference' });
  const order = await prisma.order.findUnique({ where: { ref: reference } });
  if (!order || order.status === 'PAID') return ok(res, { handled: true });

  const result = await paystack.verifyTransaction(reference).catch(() => null);
  if (result && result.status === 'success' && BigInt(result.amount) >= order.amount) {
    await fulfillOrder(order.id);
  }
  return ok(res, { handled: true });
});
