const { handler, ok } = require('../../lib/http');
const { requireUser, publicUser } = require('../../lib/auth');

module.exports = handler('GET', async (req, res) => {
  const user = await requireUser(req);
  return ok(res, { user: publicUser(user) });
});
