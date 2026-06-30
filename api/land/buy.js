const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, bad, notFound } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');
const paystack = require('../../lib/paystack');
const { fulfillOrder } = require('../../lib/fulfill');

const schema = z.object({
  estateId: z.string().min(1),
  sqm: z.number().int().min(1).max(100000),
  tier: z.enum(['presale', 'main', 'regular']).optional(),
  method: z.enum(['wallet', 'paystack']).default('paystack'),
});

function unitPrice(estate, drop, tier) {
  if (drop) {
    if (tier === 'main') return drop.mainPrice;
    if (tier === 'regular') return drop.regularPrice;
    return drop.presalePrice; // default best price
  }
  return estate.pricePerSqm;
}

module.exports = handler('POST', async (req, res) => {
  const user = await requireUser(req);
  const body = parse(schema, req.body);

  const estate = await prisma.estate.findUnique({ where: { id: body.estateId } });
  if (!estate) notFound('Estate not found');
  if (estate.availableSqm < body.sqm) bad('Not enough land available in this estate');

  const drop = await prisma.drop.findFirst({ where: { estateId: estate.id, active: true } });
  const amount = unitPrice(estate, drop, body.tier) * BigInt(body.sqm); // kobo

  const ref = 'CR-LAND-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  const order = await prisma.order.create({
    data: {
      ref, userId: user.id, kind: 'LAND', amount, sqm: body.sqm, estateId: estate.id,
      provider: body.method, status: 'PENDING', meta: { tier: body.tier || 'presale', estate: estate.name },
    },
  });

  // ---- Pay from wallet (instant) ----
  if (body.method === 'wallet') {
    const w = user.wallet || { balance: 0n, bonusCredit: 0n };
    const total = BigInt(w.balance) + BigInt(w.bonusCredit);
    if (total < amount) { await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } }); bad('Insufficient wallet balance'); }

    const spendBonus = BigInt(w.bonusCredit) < amount ? BigInt(w.bonusCredit) : amount;
    const spendBalance = amount - spendBonus;
    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({ where: { userId: user.id }, data: { bonusCredit: { decrement: spendBonus }, balance: { decrement: spendBalance } } });
      await tx.transaction.create({ data: { userId: user.id, type: 'PURCHASE', amount: -amount, label: `Bought ${body.sqm} sqm — ${estate.name}`, meta: { orderId: order.id, bonusUsed: Number(spendBonus) } } });
    });
    const done = await fulfillOrder(order.id);
    return ok(res, { paid: true, order: done });
  }

  // ---- Pay with Paystack (redirect) ----
  const init = await paystack.initTransaction({
    email: user.email, amount: Number(amount), reference: ref,
    metadata: { orderId: order.id, userId: user.id, kind: 'LAND' },
    callbackPath: '/?pay=callback&ref=' + ref,
  });
  return ok(res, { paid: false, authorizationUrl: init.authorizationUrl, reference: ref, order });
});
