const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, created, parse, bad } = require('../../lib/http');
const { hashPassword, signToken, setSessionCookie, genRefCode, publicUser } = require('../../lib/auth');

const schema = z.object({
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().max(30).optional(),
  ref: z.string().max(20).optional(),
});

module.exports = handler('POST', async (req, res) => {
  const body = parse(schema, req.body);
  const email = body.email.toLowerCase().trim();

  if (await prisma.user.findUnique({ where: { email } })) bad('That email is already registered');

  // resolve referrer (optional)
  let referredById = null;
  if (body.ref) {
    const ref = await prisma.user.findUnique({ where: { refCode: body.ref.toUpperCase().trim() } });
    if (ref) referredById = ref.id;
  }

  // unique referral code
  let refCode = genRefCode(body.firstName);
  for (let i = 0; i < 5 && (await prisma.user.findUnique({ where: { refCode } })); i++) refCode = genRefCode(body.firstName);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(body.password),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      phone: body.phone,
      refCode,
      referredById,
      wallet: { create: {} },
      membership: { create: { tier: 'STARTER' } },
    },
    include: { wallet: true, membership: true },
  });

  setSessionCookie(res, signToken(user));
  return created(res, { user: publicUser(user) });
});
