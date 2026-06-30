// Admin: list pending KYC + approve/reject. Approving a referred user pays their
// referrer the ₦2,000 signup bonus (as non-withdrawable land credit).
const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, notFound } = require('../../lib/http');
const { requireUser, requireAdmin } = require('../../lib/auth');
const { SIGNUP_BONUS, credit } = require('../../lib/fulfill');

const schema = z.object({ userId: z.string().min(1), decision: z.enum(['APPROVED', 'REJECTED']) });

module.exports = handler(['GET', 'POST'], async (req, res) => {
  const admin = requireAdmin(await requireUser(req));

  if (req.method === 'GET') {
    const pending = await prisma.kycSubmission.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true, firstName: true, lastName: true, referredById: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return ok(res, { pending });
  }

  const { userId, decision } = parse(schema, req.body);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) notFound('User not found');

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { kycStatus: decision } });
    await tx.kycSubmission.updateMany({ where: { userId, status: 'PENDING' }, data: { status: decision, reviewedAt: new Date() } });
    if (decision === 'APPROVED' && user.referredById) {
      await credit(tx, user.referredById, 'bonusCredit', SIGNUP_BONUS, {
        type: 'BONUS', label: `Signup bonus — ${user.firstName} verified`, meta: { refereeId: user.id },
      });
    }
  });
  return ok(res, { userId, decision });
});
