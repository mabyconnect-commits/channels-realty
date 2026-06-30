const { prisma } = require('../../lib/prisma');
const { handler, ok } = require('../../lib/http');
const { requireUser, publicUser } = require('../../lib/auth');

module.exports = handler('GET', async (req, res) => {
  const user = await requireUser(req);

  const [holdings, refCount, earned, ordersCount] = await Promise.all([
    prisma.holding.findMany({ where: { userId: user.id }, include: { estate: { select: { pricePerSqm: true } } } }),
    prisma.user.count({ where: { referredById: user.id } }),
    prisma.commission.aggregate({ where: { earnerId: user.id }, _sum: { amount: true } }),
    prisma.order.count({ where: { userId: user.id, status: 'PAID' } }),
  ]);

  let value = 0n, cost = 0n, sqm = 0;
  for (const h of holdings) { value += BigInt(h.estate.pricePerSqm) * BigInt(h.sqm); cost += BigInt(h.cost); sqm += h.sqm; }
  const gain = Number(value - cost);

  return ok(res, {
    user: publicUser(user),
    summary: {
      portfolioValue: Number(value), landSqm: sqm, estates: new Set(holdings.map((h) => h.estateId)).size,
      overallRoi: Number(cost) ? +((gain / Number(cost)) * 100).toFixed(1) : 0,
      referrals: refCount, totalEarned: Number(earned._sum.amount || 0), orders: ordersCount,
      kycStatus: user.kycStatus,
    },
  });
});
