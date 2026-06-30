// Manage payout bank accounts: list + add (resolves the name and creates a
// Paystack transfer recipient so payouts can be sent automatically).
const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, bad } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');
const paystack = require('../../lib/paystack');

const schema = z.object({
  bankCode: z.string().min(2).max(10),
  bankName: z.string().min(2).max(80),
  accountNumber: z.string().min(10).max(10),
  primary: z.boolean().optional(),
});

module.exports = handler(['GET', 'POST'], async (req, res) => {
  const user = await requireUser(req);

  if (req.method === 'GET') {
    const accounts = await prisma.bankAccount.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    return ok(res, { accounts });
  }

  const body = parse(schema, req.body);

  // Resolve the real account name + create a transfer recipient when payments are configured.
  let accountName = 'Account holder';
  let recipientCode = null;
  if (paystack.configured()) {
    const resolved = await paystack.resolveAccount({ accountNumber: body.accountNumber, bankCode: body.bankCode }).catch(() => null);
    if (!resolved) bad('Could not verify that account number');
    accountName = resolved.accountName;
    recipientCode = await paystack.createRecipient({ name: accountName, accountNumber: body.accountNumber, bankCode: body.bankCode }).catch(() => null);
  }

  const existing = await prisma.bankAccount.count({ where: { userId: user.id } });
  const account = await prisma.$transaction(async (tx) => {
    if (body.primary || existing === 0) await tx.bankAccount.updateMany({ where: { userId: user.id }, data: { primary: false } });
    return tx.bankAccount.create({
      data: { userId: user.id, bankCode: body.bankCode, bankName: body.bankName, accountNumber: body.accountNumber, accountName, recipientCode, primary: body.primary || existing === 0 },
    });
  });
  return ok(res, { account });
});
