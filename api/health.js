const { prisma } = require('../lib/prisma');
const { handler, ok, fail } = require('../lib/http');
const paystack = require('../lib/paystack');

module.exports = handler('GET', async (_req, res) => {
  let db = 'down';
  try { await prisma.$queryRaw`SELECT 1`; db = 'up'; } catch { db = 'down'; }
  return ok(res, { service: 'channels-realty-api', db, payments: paystack.configured() ? 'configured' : 'not-configured', time: new Date().toISOString() });
});
