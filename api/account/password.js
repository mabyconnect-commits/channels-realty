// Change password — verifies the current password before setting a new one.
const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, unauthorized } = require('../../lib/http');
const { requireUser, hashPassword, verifyPassword } = require('../../lib/auth');

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100),
});

module.exports = handler('POST', async (req, res) => {
  const user = await requireUser(req);
  const { currentPassword, newPassword } = parse(schema, req.body);

  const full = await prisma.user.findUnique({ where: { id: user.id } });
  if (!full || !(await verifyPassword(currentPassword, full.passwordHash))) unauthorized('Current password is incorrect');

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(newPassword) } });
  return ok(res, {});
});
