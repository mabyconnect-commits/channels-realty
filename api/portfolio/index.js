const { prisma } = require('../../lib/prisma');
const { handler, ok } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');

module.exports = handler('GET', async (req, res) => {
  const user = await requireUser(req);
  const holdings = await prisma.holding.findMany({
    where: { userId: user.id }, include: { estate: { select: { name: true, city: true, apprPct: true, pricePerSqm: true } } },
    orderBy: { createdAt: 'desc' },
  });

  let value = 0n, cost = 0n, sqm = 0;
  const items = holdings.map((h) => {
    const v = BigInt(h.estate.pricePerSqm) * BigInt(h.sqm);
    value += v; cost += BigInt(h.cost); sqm += h.sqm;
    return { id: h.id, estate: h.estate.name, city: h.estate.city, sqm: h.sqm, cost: Number(h.cost), value: Number(v), appr: h.estate.apprPct, status: h.status };
  });
  const gain = Number(value - cost);
  const gainPct = Number(cost) ? +((gain / Number(cost)) * 100).toFixed(1) : 0;

  return ok(res, { holdings: items, summary: { value: Number(value), cost: Number(cost), gain, gainPct, sqm } });
});
