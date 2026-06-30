const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, bad } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');

const schema = z.object({
  amount: z.number().int().min(1000), // naira; min ₦1,000
  bankCode: z.string().min(2).max(10),
  accountNumber: z.string().min(8).max(20),
  accountName: z.string().min(2).max(120),
});

module.exports = handler(['GET', 'POST'], async (req, res) => {
  const user = await requireUser(req);

  if (req.method === 'GET') {
    const payouts = await prisma.payout.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    return ok(res, { payouts });
  }

  const body = parse(schema, req.body);
  const kobo = BigInt(body.amount) * 100n;
  const wallet = user.wallet || (await prisma.wallet.create({ data: { userId: user.id } }));
  if (BigInt(wallet.balance) < kobo) bad('Insufficient withdrawable balance');

  const payout = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { userId: user.id }, data: { balance: { decrement: kobo } } });
    await tx.transaction.create({ data: { userId: user.id, type: 'PAYOUT', amount: -kobo, label: `Payout to ${body.accountName} ••${body.accountNumber.slice(-4)}` } });
    return tx.payout.create({ data: { userId: user.id, amount: kobo, bankCode: body.bankCode, accountNumber: body.accountNumber, accountName: body.accountName, status: 'REQUESTED' } });
  });

  // NOTE: a real bank transfer is initiated by an admin/cron via paystack.initiateTransfer
  // (needs a transfer recipient + sufficient Paystack balance). Left as REQUESTED here.
  return ok(res, { payout });
});
