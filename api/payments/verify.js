// Confirm a payment after the Paystack redirect. Safe to call repeatedly.
const { z } = require('zod');
const { prisma } = require('../../lib/prisma');
const { handler, ok, parse, notFound, bad } = require('../../lib/http');
const { requireUser } = require('../../lib/auth');
const paystack = require('../../lib/paystack');
const { fulfillOrder } = require('../../lib/fulfill');

const schema = z.object({ reference: z.string().min(1) });

module.exports = handler('POST', async (req, res) => {
  const user = await requireUser(req);
  const { reference } = parse(schema, req.body);

  const order = await prisma.order.findUnique({ where: { ref: reference } });
  if (!order) notFound('Order not found');
  if (order.userId !== user.id) bad('That order is not yours');
  if (order.status === 'PAID') return ok(res, { status: 'paid', order });

  const result = await paystack.verifyTransaction(reference);
  if (result.status !== 'success') {
    if (order.status === 'PENDING') await prisma.order.update({ where: { id: order.id }, data: { status: 'FAILED' } });
    return ok(res, { status: result.status, order });
  }
  if (BigInt(result.amount) < order.amount) bad('Amount paid does not match the order');

  const done = await fulfillOrder(order.id);
  return ok(res, { status: 'paid', order: done });
});
