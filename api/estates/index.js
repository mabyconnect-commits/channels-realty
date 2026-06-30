const { prisma } = require('../../lib/prisma');
const { handler, ok } = require('../../lib/http');

module.exports = handler('GET', async (_req, res) => {
  const estates = await prisma.estate.findMany({ orderBy: { createdAt: 'asc' } });
  return ok(res, { estates });
});
