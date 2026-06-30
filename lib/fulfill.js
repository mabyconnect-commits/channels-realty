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
    // Atomic claim: only the first caller flips a non-PAID order to PAID. Under
    // concurrency (webhook + verify) the second UPDATE matches 0 rows, so side
    // effects run exactly once. A later throw rolls the whole tx back (incl. the claim).
    const claim = await tx.order.updateMany({ where: { id: orderId, status: { not: 'PAID' } }, data: { status: 'PAID', paidAt: new Date() } });
    const order = await tx.order.findUnique({ where: { id: orderId } }); // no user include — never expose passwordHash
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    if (claim.count === 0) return order; // already fulfilled by a concurrent caller

    const buyer = await tx.user.findUnique({ where: { id: order.userId } });

    if (order.kind === 'LAND' && order.estateId && order.sqm) {
      // The buyer's wallet debit (if any) is recorded by the buy endpoint. Here we
      // allocate land + pay commissions on the FULL land value (a gift-card discount
      // reduces what the buyer pays, not the sale value the referrer earns on).
      const landValue = order.meta && order.meta.landValue ? BigInt(order.meta.landValue) : order.amount;
      await tx.holding.create({ data: { userId: buyer.id, estateId: order.estateId, sqm: order.sqm, cost: landValue, status: 'Allocated' } });
      await tx.estate.update({ where: { id: order.estateId }, data: { availableSqm: { decrement: order.sqm } } });
      await payCommissions(tx, buyer, { ...order, amount: landValue });
      if (order.meta && order.meta.appliedCard) await tx.giftCard.update({ where: { id: order.meta.appliedCard }, data: { status: 'REDEEMED', redeemedAt: new Date() } });
    } else if (order.kind === 'WALLET_FUNDING') {
      await credit(tx, buyer.id, 'balance', order.amount, { type: 'FUNDING', label: 'Wallet funding', meta: { orderId: order.id } });
    } else if (order.kind === 'GIFTCARD') {
      const mult = order.meta && order.meta.multiplier ? Number(order.meta.multiplier) : 1;
      const face = order.meta && order.meta.face ? BigInt(order.meta.face) : order.amount;
      await tx.giftCard.create({ data: { code: 'GC-' + Math.random().toString(36).slice(2, 10).toUpperCase(), userId: buyer.id, face, pay: order.amount, multiplier: mult, status: 'ACTIVE' } });
      await tx.transaction.create({ data: { userId: buyer.id, type: 'GIFTCARD', amount: -order.amount, label: 'Gift card purchase', meta: { orderId: order.id } } });
    } else if (order.kind === 'P2P') {
      const listingId = order.meta && order.meta.listingId;
      const listing = listingId && await tx.p2PListing.findUnique({ where: { id: listingId } });
      if (!listing || listing.status !== 'ACTIVE') throw Object.assign(new Error('Listing no longer available'), { statusCode: 409 });
      // Transfer sqm from the seller's holdings to the buyer.
      let need = listing.sqm;
      const sellerHoldings = await tx.holding.findMany({ where: { userId: listing.sellerId, estateId: listing.estateId }, orderBy: { sqm: 'desc' } });
      for (const h of sellerHoldings) {
        if (need <= 0) break;
        const take = Math.min(need, h.sqm); need -= take;
        if (take === h.sqm) await tx.holding.delete({ where: { id: h.id } });
        else await tx.holding.update({ where: { id: h.id }, data: { sqm: { decrement: take } } });
      }
      if (need > 0) throw Object.assign(new Error('Seller no longer owns enough land'), { statusCode: 409 });
      await tx.holding.create({ data: { userId: buyer.id, estateId: listing.estateId, sqm: listing.sqm, cost: order.amount, status: 'Allocated' } });
      // Pay the seller (0% platform fee).
      await credit(tx, listing.sellerId, 'balance', order.amount, { type: 'SALE', label: `Sold ${listing.sqm} sqm (P2P)`, meta: { orderId: order.id, buyerId: buyer.id } });
      await tx.p2PListing.update({ where: { id: listing.id }, data: { status: 'SOLD' } });
    } else if (order.kind === 'MEMBERSHIP') {
      const tier = (order.meta && order.meta.tier) || 'PRO';
      await tx.membership.upsert({ where: { userId: buyer.id }, create: { userId: buyer.id, tier, renewsAt: new Date(Date.now() + 30 * 864e5) }, update: { tier, active: true, renewsAt: new Date(Date.now() + 30 * 864e5) } });
      await tx.transaction.create({ data: { userId: buyer.id, type: 'MEMBERSHIP', amount: -order.amount, label: `Membership — ${tier}`, meta: { orderId: order.id } } });
    }

    return { ...order, status: 'PAID', paidAt: new Date() };
  });
}

module.exports = { fulfillOrder, payCommissions, credit, L1_RATE, L2_RATE, SIGNUP_BONUS, pct };
