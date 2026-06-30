// Buy a P2P listing — pay from wallet (instant settlement) or via Paystack.
const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, bad, notFound } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');
const paystack = require('../../lib/paystack');
const { fulfillOrder } = require('../../lib/fulfill');

const schema = z.object({ listingId: z.string().min(1), method: z.enum(['wallet', 'paystack']).default('paystack') });

module.exports = handler('POST', async (req, res) => {
  const user = await requireUser(req);
  const { listingId, method } = parse(schema, req.body);

  const listing = await prisma.p2PListing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status !== 'ACTIVE') notFound('Listing not available');
  if (listing.sellerId === user.id) bad('You cannot buy your own listing');

  const amount = listing.ask;
  const ref = 'CR-P2P-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  const order = await prisma.order.create({
    data: { ref, userId: user.id, kind: 'P2P', amount, estateId: listing.estateId, sqm: listing.sqm, provider: method, status: 'PENDING', meta: { listingId: listing.id, sellerId: listing.sellerId } },
  });

  if (method === 'wallet') {
    const w = user.wallet || { balance: 0n };
    if (BigInt(w.balance) < amount) { await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } }); bad('Insufficient wallet balance'); }
    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({ where: { userId: user.id }, data: { balance: { decrement: amount } } });
      await tx.transaction.create({ data: { userId: user.id, type: 'PURCHASE', amount: -amount, label: `Bought ${listing.sqm} sqm (P2P)`, meta: { orderId: order.id } } });
    });
    try {
      const done = await fulfillOrder(order.id);
      return ok(res, { paid: true, order: done });
    } catch (e) {
      // settlement failed (e.g. listing taken first) — refund the buyer.
      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({ where: { userId: user.id }, data: { balance: { increment: amount } } });
        await tx.transaction.create({ data: { userId: user.id, type: 'REFUND', amount, label: 'P2P purchase failed — refunded', meta: { orderId: order.id } } });
        await tx.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } });
      });
      bad(e.message || 'This listing is no longer available — you were refunded');
    }
  }

  const init = await paystack.initTransaction({
    email: user.email, amount: Number(amount), reference: ref,
    metadata: { orderId: order.id, userId: user.id, kind: 'P2P' },
    callbackPath: '/?pay=callback&ref=' + ref,
  });
  return ok(res, { paid: false, authorizationUrl: init.authorizationUrl, reference: ref });
});
