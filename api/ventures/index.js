const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, bad, notFound } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');

const schema = z.object({ ventureId: z.string(), amount: z.number().int().min(1000) }); // naira

module.exports = handler(['GET', 'POST'], async (req, res) => {
  const user = await requireUser(req);

  if (req.method === 'GET') {
    const ventures = await prisma.jointVenture.findMany({ where: { status: 'OPEN' }, orderBy: { createdAt: 'asc' } });
    return ok(res, { ventures });
  }

  const body = parse(schema, req.body);
  const kobo = BigInt(body.amount) * 100n;
  const v = await prisma.jointVenture.findUnique({ where: { id: body.ventureId } });
  if (!v || v.status !== 'OPEN') notFound('Venture not open');
  if (kobo < v.minInvest) bad(`Minimum investment is ₦${Number(v.minInvest) / 100}`);

  const w = user.wallet || { balance: 0n };
  if (BigInt(w.balance) < kobo) bad('Insufficient wallet balance');

  const result = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { userId: user.id }, data: { balance: { decrement: kobo } } });
    await tx.transaction.create({ data: { userId: user.id, type: 'PURCHASE', amount: -kobo, label: `Joint venture — ${v.name}` } });
    const inv = await tx.jVInvestment.create({ data: { ventureId: v.id, userId: user.id, amount: kobo } });
    const updated = await tx.jointVenture.update({ where: { id: v.id }, data: { raised: { increment: kobo } } });
    if (updated.raised >= updated.target) await tx.jointVenture.update({ where: { id: v.id }, data: { status: 'FUNDED' } });
    return inv;
  });
  return ok(res, { investment: result });
});
