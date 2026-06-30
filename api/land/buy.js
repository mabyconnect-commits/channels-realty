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
  giftCardCode: z.string().max(40).optional(),
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
  const landValue = unitPrice(estate, drop, body.tier) * BigInt(body.sqm); // full land cost (kobo)

  // Optional gift card: applies its drop-day value (face × multiplier) as a discount.
  let charge = landValue;
  let appliedCard = null;
  if (body.giftCardCode && body.giftCardCode.trim()) {
    const card = await prisma.giftCard.findFirst({ where: { code: body.giftCardCode.trim().toUpperCase(), userId: user.id, status: 'ACTIVE' } });
    if (!card) bad('Invalid or already-used gift card code');
    const value = BigInt(Math.round(Number(card.face) * card.multiplier));
    const discount = value < landValue ? value : landValue;
    charge = landValue - discount;
    appliedCard = card.id;
  }

  const ref = 'CR-LAND-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  const order = await prisma.order.create({
    data: {
      ref, userId: user.id, kind: 'LAND', amount: charge, sqm: body.sqm, estateId: estate.id,
      provider: charge === 0n ? 'giftcard' : body.method, status: 'PENDING',
      meta: { tier: body.tier || 'presale', estate: estate.name, landValue: Number(landValue), appliedCard },
    },
  });

  // Fully covered by a gift card — no payment needed.
  if (charge === 0n) {
    const done = await fulfillOrder(order.id);
    return ok(res, { paid: true, order: done });
  }

  // ---- Pay from wallet (instant) ----
  if (body.method === 'wallet') {
    const w = user.wallet || { balance: 0n, bonusCredit: 0n };
    const total = BigInt(w.balance) + BigInt(w.bonusCredit);
    if (total < charge) { await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } }); bad('Insufficient wallet balance'); }

    const spendBonus = BigInt(w.bonusCredit) < charge ? BigInt(w.bonusCredit) : charge;
    const spendBalance = charge - spendBonus;
    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({ where: { userId: user.id }, data: { bonusCredit: { decrement: spendBonus }, balance: { decrement: spendBalance } } });
      await tx.transaction.create({ data: { userId: user.id, type: 'PURCHASE', amount: -charge, label: `Bought ${body.sqm} sqm — ${estate.name}`, meta: { orderId: order.id, bonusUsed: Number(spendBonus) } } });
    });
    const done = await fulfillOrder(order.id);
    return ok(res, { paid: true, order: done });
  }

  // ---- Pay with Paystack (redirect) ----
  const init = await paystack.initTransaction({
    email: user.email, amount: Number(charge), reference: ref,
    metadata: { orderId: order.id, userId: user.id, kind: 'LAND' },
    callbackPath: '/?pay=callback&ref=' + ref,
  });
  return ok(res, { paid: false, authorizationUrl: init.authorizationUrl, reference: ref, order });
});
