// List Nigerian banks for payout setup (proxied from Paystack).
const { handler, ok } = require('../lib/http');
const paystack = require('../lib/paystack');

module.exports = handler('GET', async (_req, res) => {
  const banks = paystack.configured() ? await paystack.listBanks() : [];
  return ok(res, { banks });
});
