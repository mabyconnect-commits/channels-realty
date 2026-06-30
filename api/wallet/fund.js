const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');
const paystack = require('../../lib/paystack');

// amount is in NAIRA from the client; stored/charged in kobo.
const schema = z.object({ amount: z.number().int().min(100).max(50000000) });

module.exports = handler('POST', async (req, res) => {
  const user = await requireUser(req);
  const { amount } = parse(schema, req.body);
  const kobo = BigInt(amount) * 100n;

  const ref = 'CR-FUND-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  const order = await prisma.order.create({
    data: { ref, userId: user.id, kind: 'WALLET_FUNDING', amount: kobo, provider: 'paystack', status: 'PENDING' },
  });

  const init = await paystack.initTransaction({
    email: user.email, amount: Number(kobo), reference: ref,
    metadata: { orderId: order.id, userId: user.id, kind: 'WALLET_FUNDING' },
    callbackPath: '/?pay=callback&ref=' + ref,
  });
  return ok(res, { authorizationUrl: init.authorizationUrl, reference: ref });
});
