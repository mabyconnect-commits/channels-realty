const { prisma } = require('../../lib/prisma');
const { handler, ok } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');

module.exports = handler('GET', async (req, res) => {
  const user = await requireUser(req);
  const orders = await prisma.order.findMany({
    where: { userId: user.id }, include: { estate: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }, take: 50,
  });
  return ok(res, { orders });
});
