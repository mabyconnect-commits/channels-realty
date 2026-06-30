const { prisma } = require('../../lib/prisma');
const { handler, ok } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');

module.exports = handler('GET', async (req, res) => {
  const user = await requireUser(req);
  const wallet = user.wallet || (await prisma.wallet.create({ data: { userId: user.id } }));
  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 30,
  });
  return ok(res, {
    wallet: {
      balance: Number(wallet.balance), pending: Number(wallet.pending),
      bonusCredit: Number(wallet.bonusCredit), points: wallet.points,
    },
    transactions,
  });
});
