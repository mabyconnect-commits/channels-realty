const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');

const schema = z.object({
  fullName: z.string().min(2).max(120),
  dob: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
  idType: z.string().max(40).optional(),
  idNumber: z.string().max(40).optional(),
  idDocUrl: z.string().url().max(500).optional(),
  selfieUrl: z.string().url().max(500).optional(),
});

module.exports = handler('POST', async (req, res) => {
  const user = await requireUser(req);
  const body = parse(schema, req.body);

  const submission = await prisma.$transaction(async (tx) => {
    const s = await tx.kycSubmission.create({ data: { userId: user.id, status: 'PENDING', ...body } });
    await tx.user.update({ where: { id: user.id }, data: { kycStatus: 'PENDING' } });
    return s;
  });
  return ok(res, { submission, kycStatus: 'PENDING' });
});
