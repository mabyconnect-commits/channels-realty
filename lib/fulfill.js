// Order fulfillment + referral commissions. Idempotent: safe to call from both
// the payment webhook and the verify endpoint (whichever lands first wins).
const { prisma } = require('./prisma');

const L1_RATE = 20n; // %
const L2_RATE = 5n;  // %
const SIGNUP_BONUS = 200000n; // ₦2,000 in kobo, paid to referrer on referee's full KYC

const pct = (amount, rate) => (BigInt(amount) * rate) / 100n;

// Credit a user's wallet and write a ledger transaction (within a tx client).
async function credit(tx, userId, field, amount, txData) {
  await tx.wallet.upsert({
    where: { userId },
    create: { userId, [field]: amount },
    update: { [field]: { increment: amount } },
  });
  await tx.transaction.create({ data: { userId, amount, ...txData } });
}

// Pay L1 + L2 commissions for a land purchase by `buyer`.
async function payCommissions(tx, buyer, order) {
  if (!buyer.referredById) return;
  const l1 = await tx.user.findUnique({ where: { id: buyer.referredById } });
  if (l1) {
    const amt = pct(order.amount, L1_RATE);
    await credit(tx, l1.id, 'balance', amt, { type: 'COMMISSION', label: `L1 commission — ${buyer.firstName}`, meta: { orderId: order.id } });
    await tx.commission.create({ data: { earnerId: l1.id, sourceUserId: buyer.id, orderId: order.id, level: 1, amount: amt, status: 'AVAILABLE' } });
    if (l1.referredById) {
      const l2 = await tx.user.findUnique({ where: { id: l1.referredById } });
      if (l2) {
        const amt2 = pct(order.amount, L2_RATE);
        await credit(tx, l2.id, 'balance', amt2, { type: 'COMMISSION', label: `L2 override — ${buyer.firstName}`, meta: { orderId: order.id } });
        await tx.commission.create({ data: { earnerId: l2.id, sourceUserId: buyer.id, orderId: order.id, level: 2, amount: amt2, status: 'AVAILABLE' } });
      }
    }
  }
}

// Fulfill a PAID order's side effects exactly once.
async function fulfillOrder(orderId) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { user: true } });
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    if (order.status === 'PAID') return order; // already fulfilled — idempotent

    const buyer = order.user;

    if (order.kind === 'LAND' && order.estateId && order.sqm) {
      // Note: the buyer's wallet debit (if paying by wallet) is recorded by the buy
      // endpoint. Here we only allocate land + pay out referral commissions.
      await tx.holding.create({ data: { userId: buyer.id, estateId: order.estateId, sqm: order.sqm, cost: order.amount, status: 'Allocated' } });
      await tx.estate.update({ where: { id: order.estateId }, data: { availableSqm: { decrement: order.sqm } } });
      await payCommissions(tx, buyer, order);
    } else if (order.kind === 'WALLET_FUNDING') {
      await credit(tx, buyer.id, 'balance', order.amount, { type: 'FUNDING', label: 'Wallet funding', meta: { orderId: order.id } });
    } else if (order.kind === 'GIFTCARD') {
      const mult = order.meta && order.meta.multiplier ? Number(order.meta.multiplier) : 1;
      const face = order.meta && order.meta.face ? BigInt(order.meta.face) : order.amount;
      await tx.giftCard.create({ data: { code: 'GC-' + Math.random().toString(36).slice(2, 10).toUpperCase(), userId: buyer.id, face, pay: order.amount, multiplier: mult, status: 'ACTIVE' } });
      await tx.transaction.create({ data: { userId: buyer.id, type: 'GIFTCARD', amount: -order.amount, label: 'Gift card purchase', meta: { orderId: order.id } } });
    } else if (order.kind === 'MEMBERSHIP') {
      const tier = (order.meta && order.meta.tier) || 'PRO';
      await tx.membership.upsert({ where: { userId: buyer.id }, create: { userId: buyer.id, tier, renewsAt: new Date(Date.now() + 30 * 864e5) }, update: { tier, active: true, renewsAt: new Date(Date.now() + 30 * 864e5) } });
      await tx.transaction.create({ data: { userId: buyer.id, type: 'MEMBERSHIP', amount: -order.amount, label: `Membership — ${tier}`, meta: { orderId: order.id } } });
    }

    return tx.order.update({ where: { id: order.id }, data: { status: 'PAID', paidAt: new Date() } });
  });
}

module.exports = { fulfillOrder, payCommissions, credit, L1_RATE, L2_RATE, SIGNUP_BONUS, pct };
