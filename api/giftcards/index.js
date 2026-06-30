const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, bad } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');
const paystack = require('../../lib/paystack');
const { fulfillOrder } = require('../../lib/fulfill');

// Catalog (kobo). Multiplier = drop-day land value.
const CATALOG = [
  { id: 'g1', name: '₦20,000 Land Card', face: 2000000, multiplier: 1.5 },
  { id: 'g2', name: '₦50,000 Land Card', face: 5000000, multiplier: 1.75 },
  { id: 'g3', name: '₦100,000 Land Card', face: 10000000, multiplier: 2.0 },
  { id: 'g4', name: '₦250,000 Estate Card', face: 25000000, multiplier: 2.25 },
];

const schema = z.object({ id: z.string(), method: z.enum(['wallet', 'paystack']).default('paystack') });

module.exports = handler(['GET', 'POST'], async (req, res) => {
  const user = await requireUser(req);

  if (req.method === 'GET') {
    const owned = await prisma.giftCard.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    return ok(res, { catalog: CATALOG, owned });
  }

  const { id, method } = parse(schema, req.body);
  const card = CATALOG.find((c) => c.id === id);
  if (!card) bad('Unknown gift card');
  const amount = BigInt(card.face);

  const ref = 'CR-GIFT-' + Date.now().toString(36).toUpperCase();
  const order = await prisma.order.create({
    data: { ref, userId: user.id, kind: 'GIFTCARD', amount, provider: method, status: 'PENDING', meta: { face: Number(card.face), multiplier: card.multiplier } },
  });

  if (method === 'wallet') {
    const w = user.wallet || { balance: 0n };
    if (BigInt(w.balance) < amount) { await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } }); bad('Insufficient wallet balance'); }
    await prisma.wallet.update({ where: { userId: user.id }, data: { balance: { decrement: amount } } });
    const done = await fulfillOrder(order.id);
    return ok(res, { paid: true, order: done });
  }

  const init = await paystack.initTransaction({
    email: user.email, amount: Number(amount), reference: ref,
    metadata: { orderId: order.id, userId: user.id, kind: 'GIFTCARD' },
    callbackPath: '/?pay=callback&ref=' + ref,
  });
  return ok(res, { paid: false, authorizationUrl: init.authorizationUrl, reference: ref });
});
