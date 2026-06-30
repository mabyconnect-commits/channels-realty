/* ============================================================
   CHANNELS REALTY — Frontend API client (window.API)
   Talks to the Vercel serverless backend under /api.
   Cookies (httpOnly session) are sent automatically.
   ============================================================ */
(function () {
  const BASE = '/api';

  async function req(path, { method = 'GET', body } = {}) {
    const res = await fetch(BASE + path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    });
    let data = {};
    try { data = await res.json(); } catch (_) {}
    if (!res.ok || data.ok === false) {
      const err = new Error(data.error || ('Request failed (' + res.status + ')'));
      err.status = res.status;
      throw err;
    }
    return data;
  }

  const API = {
    // health / availability
    health: () => req('/health'),
    async available() { try { await req('/health'); return true; } catch (_) { return false; } },

    // auth
    signup: (b) => req('/auth/signup', { method: 'POST', body: b }),
    login: (b) => req('/auth/login', { method: 'POST', body: b }),
    logout: () => req('/auth/logout', { method: 'POST' }),
    me: () => req('/auth/me'),

    // catalog
    estates: () => req('/estates'),
    drops: () => req('/drops'),

    // money & assets
    dashboard: () => req('/dashboard'),
    wallet: () => req('/wallet'),
    fundWallet: (amount) => req('/wallet/fund', { method: 'POST', body: { amount } }),
    buyLand: (b) => req('/land/buy', { method: 'POST', body: b }),
    verifyPayment: (reference) => req('/payments/verify', { method: 'POST', body: { reference } }),
    orders: () => req('/orders'),
    portfolio: () => req('/portfolio'),

    // affiliate
    referrals: () => req('/referrals'),

    // gift cards / membership
    giftcards: () => req('/giftcards'),
    buyGiftcard: (id, method) => req('/giftcards', { method: 'POST', body: { id, method } }),
    membership: () => req('/membership'),
    upgradeMembership: (tier, method) => req('/membership', { method: 'POST', body: { tier, method } }),

    // investors' corner
    ventures: () => req('/ventures'),
    investVenture: (ventureId, amount) => req('/ventures', { method: 'POST', body: { ventureId, amount } }),
    p2p: () => req('/p2p'),
    listP2P: (b) => req('/p2p', { method: 'POST', body: b }),
    p2pBuy: (listingId, method) => req('/p2p/buy', { method: 'POST', body: { listingId, method } }),

    // kyc & payouts
    submitKyc: (b) => req('/kyc/submit', { method: 'POST', body: b }),
    payouts: () => req('/payouts'),
    requestPayout: (b) => req('/payouts', { method: 'POST', body: b }),

    // banks & payout accounts
    banks: () => req('/banks'),
    accounts: () => req('/accounts'),
    addAccount: (b) => req('/accounts', { method: 'POST', body: b }),

    // admin
    adminKycList: () => req('/admin/kyc'),
    adminKycDecide: (userId, decision) => req('/admin/kyc', { method: 'POST', body: { userId, decision } }),
  };

  // read ?ref= / ?pay= from the URL for signup attribution + payment callback
  API.params = (() => { try { return Object.fromEntries(new URLSearchParams(location.search)); } catch (_) { return {}; } })();

  window.API = API;
})();
