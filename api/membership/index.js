const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, bad } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');
const paystack = require('../../lib/paystack');
const { fulfillOrder } = require('../../lib/fulfill');

const PLANS = {
  STARTER: { tier: 'STARTER', price: 0 },
  PRO: { tier: 'PRO', price: 990000 },     // ₦9,900 / mo (kobo)
  ELITE: { tier: 'ELITE', price: 2990000 }, // ₦29,900 / mo (kobo)
};

const schema = z.object({ tier: z.enum(['PRO', 'ELITE']), method: z.enum(['wallet', 'paystack']).default('paystack') });

module.exports = handler(['GET', 'POST'], async (req, res) => {
  const user = await requireUser(req);

  if (req.method === 'GET') {
    return ok(res, { current: user.membership ? user.membership.tier : 'STARTER', plans: PLANS });
  }

  const { tier, method } = parse(schema, req.body);
  const plan = PLANS[tier];
  const amount = BigInt(plan.price);

  const ref = 'CR-MEMB-' + Date.now().toString(36).toUpperCase();
  const order = await prisma.order.create({ data: { ref, userId: user.id, kind: 'MEMBERSHIP', amount, provider: method, status: 'PENDING', meta: { tier } } });

  if (method === 'wallet') {
    const w = user.wallet || { balance: 0n };
    if (BigInt(w.balance) < amount) { await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } }); bad('Insufficient wallet balance'); }
    await prisma.wallet.update({ where: { userId: user.id }, data: { balance: { decrement: amount } } });
    const done = await fulfillOrder(order.id);
    return ok(res, { paid: true, order: done });
  }

  const init = await paystack.initTransaction({
    email: user.email, amount: Number(amount), reference: ref,
    metadata: { orderId: order.id, userId: user.id, kind: 'MEMBERSHIP', tier },
    callbackPath: '/?pay=callback&ref=' + ref,
  });
  return ok(res, { paid: false, authorizationUrl: init.authorizationUrl, reference: ref });
});
