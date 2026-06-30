/* ============================================================
   CHANNELS REALTY — Launch / Affiliate / Investor data (window.DATA3)
   New feature set inspired by the platform feature parity pass.
   ============================================================ */
(function () {
  // Launch window ends ~15 days out (keeps the countdown live in a static deploy)
  const launchEnds = Date.now() + (15 * 24 * 60 * 60 + 10 * 3600 + 18 * 60) * 1000;

  const launch = {
    live: true,
    title: 'Grand Launch — Win ₦Millions + Free Lands',
    sub: 'Join the launch now to get ahead of the drop. Everybody is a winner!',
    ends: launchEnds,
    // free-sqm thresholds (cumulative sqm bought during launch week)
    bonuses: [
      { id: 'b1', label: 'Free 100 sqm on Launch Week', sub: 'Purchase bonus — threshold 200 sqm', reward: '100 sqm free land', threshold: 200, have: 96 },
      { id: 'b2', label: 'Free 50 sqm on Launch Week', sub: 'Purchase bonus — threshold 120 sqm', reward: '50 sqm free land', threshold: 120, have: 96 },
      { id: 'b3', label: 'Free Starter Kit + 20 sqm', sub: 'Purchase bonus — threshold 60 sqm', reward: '20 sqm + branded kit', threshold: 60, have: 96 },
    ],
    prizes: [
      { rank: 1, label: '₦5,000,000 Cash', color: '#d9a23e' },
      { rank: 2, label: '₦2,000,000 Cash', color: '#9aa3ab' },
      { rank: 3, label: '₦1,000,000 Cash', color: '#c0732f' },
    ],
    qualified: false,
  };

  const giftCards = [
    { id: 'g1', name: '₦20,000 Land Card', face: 20000, pay: 20000, mult: 1.5, tag: 'Most popular', color: '#2b5666' },
    { id: 'g2', name: '₦50,000 Land Card', face: 50000, pay: 50000, mult: 1.75, tag: 'Best value', color: '#d9742e' },
    { id: 'g3', name: '₦100,000 Land Card', face: 100000, pay: 100000, mult: 2.0, tag: 'Drop-day x2', color: '#3f7c91' },
    { id: 'g4', name: '₦250,000 Estate Card', face: 250000, pay: 250000, mult: 2.25, tag: 'Whale', color: '#9a6f15' },
  ];

  const landingPages = [
    { id: 'bold', kind: 'BOLD', name: 'Bold Offer', pitch: 'Less than ₦50,000 Can Start Your Real Estate Empire', slug: 'bold-offer', visits: 0, signups: 0 },
    { id: 'simple', kind: 'SIMPLE', name: 'Simple Convert', pitch: 'Own Real Land From As Little As 1 SQM', slug: 'simple-offer', visits: 0, signups: 0 },
    { id: 'story', kind: 'STORY', name: 'Story Pitch', pitch: 'Buy & Trade Real Lands Like Stocks & Shares', slug: 'story-pitch', visits: 0, signups: 0 },
  ];

  const promoAssets = [
    { id: 'pa1', name: 'Launch banner (1080×1080)', type: 'Image', size: '420 KB' },
    { id: 'pa2', name: '"We Are Live" story (1080×1920)', type: 'Image', size: '380 KB' },
    { id: 'pa3', name: '30-sec promo video', type: 'Video', size: '4.8 MB' },
    { id: 'pa4', name: 'WhatsApp broadcast pack', type: 'Text', size: '12 KB' },
  ];
  const promoTones = ['Excited, trustworthy', 'Professional', 'Friendly & casual', 'Urgent / FOMO', 'Storytelling'];

  // Portfolio holdings (per-estate growth)
  const holdings = [
    { id: 'h1', estate: 'Channels Gardens', city: 'Epe, Lagos', sqm: 60, cost: 720000, value: 850000, appr: 18 },
    { id: 'h2', estate: 'Channels Gardens', city: 'Epe, Lagos', sqm: 36, cost: 432000, value: 484000, appr: 12 },
  ];

  // P2P resale market listings
  const p2p = [
    { id: 'r1', estate: 'Channels Haven', city: 'Ibeju-Lekki', sqm: 50, ask: 1050000, base: 900000, seller: 'Adaeze O.', avatar: 'assets/agent-1.jpg', verified: true, disc: 0 },
    { id: 'r2', estate: 'Channels Gardens', city: 'Epe, Lagos', sqm: 25, ask: 312500, base: 300000, seller: 'Ibrahim M.', avatar: 'assets/owner-3.jpg', verified: true, disc: 4 },
    { id: 'r3', estate: 'Channels Heights', city: 'Kuje, Abuja', sqm: 40, ask: 588000, base: 600000, seller: 'Grace E.', avatar: 'assets/agent-2.jpg', verified: false, disc: 2 },
    { id: 'r4', estate: 'Channels Meadows', city: 'Mowe, Ogun', sqm: 100, ask: 760000, base: 800000, seller: 'Yusuf B.', avatar: 'assets/owner-1.jpg', verified: true, disc: 5 },
  ];

  // Joint ventures
  const ventures = [
    { id: 'jv1', name: 'Lekki Terrace Duplexes', city: 'Ibeju-Lekki, Lagos', raised: 38, target: 60, min: 250000, roi: 32, months: 18, slots: 14 },
    { id: 'jv2', name: 'Epe Smart Shortlets', city: 'Epe, Lagos', raised: 72, target: 80, min: 150000, roi: 26, months: 12, slots: 6 },
    { id: 'jv3', name: 'Abuja Commercial Plaza', city: 'Kuje, Abuja', raised: 21, target: 100, min: 500000, roi: 40, months: 24, slots: 28 },
  ];

  // Insider investor signals
  const insider = [
    { id: 'in1', estate: 'Channels Haven', signal: 'Price moving up', detail: 'Dangote corridor demand surged 24% this month. Next price tier in ~9 days.', heat: 92, dir: 'up' },
    { id: 'in2', estate: 'Channels Heights', signal: 'Early accumulation', detail: 'Insiders bought 980 sqm this week before the FCT road award.', heat: 78, dir: 'up' },
    { id: 'in3', estate: 'Channels Meadows', signal: 'Value entry', detail: 'Lowest ₦/sqm on the platform — ideal first plot before Q3 review.', heat: 54, dir: 'flat' },
  ];

  const membership = [
    { id: 'free', name: 'Starter', price: 0, period: '', accent: '#6a747b', perks: ['Buy & own land by the sqm', 'Standard 20% / 5% commissions', 'Community access', 'Basic support'], current: true },
    { id: 'pro', name: 'Pro Investor', price: 9900, period: '/mo', accent: '#d9742e', perks: ['Everything in Starter', 'Unlock Instant Trade ⚡', 'P2P market — 0% selling fee', '+1.5% commission boost', 'Priority payouts', 'Insider investor signals'], popular: true },
    { id: 'elite', name: 'Estate Elite', price: 29900, period: '/mo', accent: '#9a6f15', perks: ['Everything in Pro', 'Joint-venture early access', 'Dedicated account manager', 'Quarterly physical site tours', 'White-glove documentation', 'Highest commission tier'] },
  ];

  const orders = [
    { id: 'CR-10482', item: '36 sqm — Channels Gardens', amount: 432000, status: 'Completed', date: 'Mar 24, 2026', kind: 'land' },
    { id: 'CR-10455', item: '60 sqm — Channels Gardens', amount: 720000, status: 'Completed', date: 'Feb 18, 2026', kind: 'land' },
    { id: 'CR-10501', item: '₦50,000 Land Gift Card', amount: 50000, status: 'Processing', date: 'Today', kind: 'giftcard' },
    { id: 'CR-10399', item: 'Payout to GTBank ••4821', amount: 50000, status: 'Completed', date: 'Mar 28, 2026', kind: 'payout' },
  ];

  const topAffiliates = [
    { name: 'Adaeze Okafor', avatar: 'assets/agent-1.jpg', sqm: 1840 },
    { name: 'Ibrahim Musa', avatar: 'assets/owner-3.jpg', sqm: 1210 },
    { name: 'Grace Effiong', avatar: 'assets/agent-2.jpg', sqm: 760 },
    { name: 'Blessing Eze', avatar: 'assets/agent-3.jpg', sqm: 188 },
    { name: 'Yusuf Bello', avatar: 'assets/owner-1.jpg', sqm: 142 },
  ];

  const banners = [
    { id: 'live', text: '🌹 WE ARE LIVE — Grand Launch is on!', cta: 'Claim Land', to: 'launch', kind: 'hot' },
    { id: 'cash', text: '📣 WIN ₦7,000,000 CASH this launch week', cta: 'Get Affiliate Link', to: 'affiliate', kind: 'go' },
  ];

  window.DATA3 = {
    launch, giftCards, landingPages, promoAssets, promoTones,
    holdings, p2p, ventures, insider, membership, orders, topAffiliates, banners,
  };
})();
