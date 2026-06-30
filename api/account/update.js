// Update profile fields (name, phone). Email and password change elsewhere.
const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse } = require('../../lib/http');
const { requireUser, publicUser } = require('../../lib/auth');

const schema = z.object({
  firstName: z.string().min(1).max(60).optional(),
  lastName: z.string().min(1).max(60).optional(),
  phone: z.string().max(30).optional(),
});

module.exports = handler('POST', async (req, res) => {
  const user = await requireUser(req);
  const data = parse(schema, req.body);
  const updated = await prisma.user.update({
    where: { id: user.id }, data,
    include: { wallet: true, membership: true },
  });
  return ok(res, { user: publicUser(updated) });
});
