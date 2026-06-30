const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, unauthorized } = require('../../lib/http');
const { verifyPassword, signToken, setSessionCookie, publicUser } = require('../../lib/auth');

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

module.exports = handler('POST', async (req, res) => {
  const body = parse(schema, req.body);
  const user = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase().trim() },
    include: { wallet: true, membership: true },
  });
  if (!user || !(await verifyPassword(body.password, user.passwordHash))) unauthorized('Wrong email or password');

  setSessionCookie(res, signToken(user));
  return ok(res, { user: publicUser(user) });
});
