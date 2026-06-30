const { prisma } = require('../../lib/prisma');
const { handler, ok } = require('../../lib/http');

module.exports = handler('GET', async (_req, res) => {
  const drops = await prisma.drop.findMany({
    where: { active: true },
    include: { estate: true },
    orderBy: { endsAt: 'asc' },
  });
  return ok(res, { drops });
});
