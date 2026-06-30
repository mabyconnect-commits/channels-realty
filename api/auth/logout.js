const { handler, ok } = require('../../lib/http');
const { clearSessionCookie } = require('../../lib/auth');

module.exports = handler('POST', async (_req, res) => {
  clearSessionCookie(res);
  return ok(res, {});
});
