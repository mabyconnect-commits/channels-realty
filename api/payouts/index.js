// Request a payout to a saved bank account. Debits the wallet, records the payout,
// and (when Paystack is configured) initiates a real transfer. The webhook finalizes
// PAID/FAILED; a failed initiation refunds the wallet immediately.
const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, bad, notFound } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');
const paystack = require('../../lib/paystack');

const schema = z.object({
  amount: z.number().int().min(1000), // naira; min ₦1,000
  accountId: z.string().optional(),
});

module.exports = handler(['GET', 'POST'], async (req, res) => {
  const user = await requireUser(req);

  if (req.method === 'GET') {
    const payouts = await prisma.payout.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    return ok(res, { payouts });
  }

  const body = parse(schema, req.body);
  const kobo = BigInt(body.amount) * 100n;

  const account = body.accountId
    ? await prisma.bankAccount.findFirst({ where: { id: body.accountId, userId: user.id } })
    : await prisma.bankAccount.findFirst({ where: { userId: user.id, primary: true } })
      || await prisma.bankAccount.findFirst({ where: { userId: user.id } });
  if (!account) bad('Add a bank account first');

  const wallet = user.wallet || (await prisma.wallet.create({ data: { userId: user.id } }));
  if (BigInt(wallet.balance) < kobo) bad('Insufficient withdrawable balance');

  const willTransfer = paystack.configured() && !!account.recipientCode;
  const ref = 'CR-PAYOUT-' + Date.now().toString(36).toUpperCase();

  // Debit + record (atomic).
  const payout = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { userId: user.id }, data: { balance: { decrement: kobo } } });
    await tx.transaction.create({ data: { userId: user.id, type: 'PAYOUT', amount: -kobo, label: `Payout to ${account.accountName} ••${account.accountNumber.slice(-4)}`, reference: ref } });
    return tx.payout.create({ data: {
      userId: user.id, amount: kobo, bankCode: account.bankCode, bankName: account.bankName,
      accountNumber: account.accountNumber, accountName: account.accountName, recipientCode: account.recipientCode,
      status: willTransfer ? 'PROCESSING' : 'REQUESTED',
    } });
  });

  // Initiate the actual transfer; refund on failure.
  if (willTransfer) {
    try {
      const tr = await paystack.initiateTransfer({ amount: Number(kobo), recipientCode: account.recipientCode, reason: 'Channels Realty payout', reference: ref });
      await prisma.payout.update({ where: { id: payout.id }, data: { providerRef: tr.transferCode } });
    } catch (e) {
      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({ where: { userId: user.id }, data: { balance: { increment: kobo } } });
        await tx.transaction.create({ data: { userId: user.id, type: 'REFUND', amount: kobo, label: 'Payout failed — refunded' } });
        await tx.payout.update({ where: { id: payout.id }, data: { status: 'FAILED' } });
      });
      bad('Payout could not be initiated — your balance was refunded');
    }
  }

  return ok(res, { payout });
});
