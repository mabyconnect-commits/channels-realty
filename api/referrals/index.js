const { prisma } = require('../../lib/prisma');
const { handler, ok } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');

const SITE = process.env.SITE_URL || 'https://channels-realty-three.vercel.app';

module.exports = handler('GET', async (req, res) => {
  const user = await requireUser(req);

  const downline = await prisma.user.findMany({
    where: { referredById: user.id },
    select: { id: true, firstName: true, lastName: true, kycStatus: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  const fullKyc = downline.filter((d) => d.kycStatus === 'APPROVED').length;

  const earned = await prisma.commission.aggregate({ where: { earnerId: user.id }, _sum: { amount: true } });
  const totalEarned = Number(earned._sum.amount || 0);

  return ok(res, {
    refCode: user.refCode,
    refLink: `${SITE}/?ref=${user.refCode}`,
    stats: {
      total: downline.length,
      fullKyc,
      partial: downline.length - fullKyc,
      totalEarned,
      signupBonus: Number(user.wallet ? user.wallet.bonusCredit : 0),
      commissions: Number(user.wallet ? user.wallet.balance : 0),
    },
    downline,
  });
});
