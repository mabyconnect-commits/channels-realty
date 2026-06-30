const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, bad, notFound } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');

const schema = z.object({ holdingId: z.string(), sqm: z.number().int().min(1), ask: z.number().int().min(1000) }); // ask in naira

module.exports = handler(['GET', 'POST'], async (req, res) => {
  const user = await requireUser(req);

  if (req.method === 'GET') {
    const listings = await prisma.p2PListing.findMany({
      where: { status: 'ACTIVE' },
      include: { estate: { select: { name: true, city: true } }, seller: { select: { firstName: true, kycStatus: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return ok(res, { listings });
  }

  const body = parse(schema, req.body);
  const holding = await prisma.holding.findUnique({ where: { id: body.holdingId } });
  if (!holding || holding.userId !== user.id) notFound('Holding not found');
  if (body.sqm > holding.sqm) bad('You cannot list more sqm than you own');

  const listing = await prisma.p2PListing.create({
    data: { sellerId: user.id, estateId: holding.estateId, sqm: body.sqm, ask: BigInt(body.ask) * 100n, status: 'ACTIVE' },
  });
  return ok(res, { listing });
});
