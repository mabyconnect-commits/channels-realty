/* ============================================================
   CHANNELS REALTY — Data model
   Exposes window.DATA
   ============================================================ */
(function () {
  const NGN_PER_SQM = 12000;        // land value per sqm
  const USD_RATE = 1550;            // ₦ per $1 (display only)

  const fmtNaira = (n) => '₦' + Number(n).toLocaleString('en-NG');
  const fmtUSD = (n) => '$' + Number(Math.round(n)).toLocaleString('en-US');
  const sqmToUSD = (sqm) => fmtUSD((sqm * NGN_PER_SQM) / USD_RATE);

  /* ---- The signed-in member (mid-journey, realistic) ---- */
  const user = {
    name: 'Tunde Adeyemi',
    first: 'Tunde',
    handle: '@tunde_owns',
    email: 'tunde.adeyemi@gmail.com',
    phone: '0814 152 1450',
    avatar: 'assets/owner-2.jpg',
    refCode: 'TUNDE2024',
    refLink: 'channels.realty/r/TUNDE2024',
    joined: 'Mar 2025',
    kyc: true,
    isAffiliate: true,
    // wallet
    balance: 142500,        // withdrawable now
    pending: 28000,         // clearing
    lifetime: 1240000,      // lifetime commission
    // network
    directRefs: 68,         // level 1
    level2: 146,            // level 2
    get teamTotal() { return this.directRefs + this.level2; }, // 214
    // land + points
    landSqm: 96,            // owned land
    points: 640,
  };

  /* ---- Commission rank ladder (team-size driven) ---- */
  const tiers = [
    { id: 'pathfinder', name: 'Pathfinder', team: 0,    l1: 20.0, l2: 5.0,
      blurb: 'Every channel starts here. Earn on every plot you sell.', color: '#6a747b' },
    { id: 'channerator', name: 'Channerator', team: 100, l1: 21.5, l2: 5.5,
      blurb: 'Your network crossed 100. You now move volume.', color: '#d9742e' },
    { id: 'trailblazer', name: 'Trailblazer', team: 250, l1: 22.0, l2: 6.0,
      blurb: 'A team of 250 — you are building an estate empire.', color: '#3f7c91' },
    { id: 'vanguard', name: 'Estate Vanguard', team: 500, l1: 22.5, l2: 6.5,
      blurb: '500 strong. Leadership bonuses unlocked.', color: '#2b5666' },
    { id: 'chief', name: 'Channel Chief', team: 1000, l1: 23.5, l2: 6.5,
      blurb: 'The summit. 1,000 members under your channel.', color: '#9a6f15' },
  ];

  /* ---- Referral → sqm milestones (+ bonus kit) ---- */
  const milestones = [
    { id: 'kit', refs: 25, type: 'kit', title: 'Real Estate Starter Kit',
      reward: 'Branded cap, tee, safety vest & welcome pack', icon: 'kit' },
    { id: 'm75',  refs: 50,  type: 'land', title: '75 sqm of land',  sqm: 75,  icon: 'land' },
    { id: 'm150', refs: 100, type: 'land', title: '150 sqm of land', sqm: 150, icon: 'land' },
    { id: 'm300', refs: 200, type: 'land', title: '300 sqm of land', sqm: 300, icon: 'land' },
    { id: 'm500', refs: 350, type: 'land', title: '500 sqm of land', sqm: 500, icon: 'land' },
    { id: 'plot', refs: 500, type: 'plot', title: 'Full plot + site tour', sqm: 648,
      reward: 'A full 648 sqm plot in Epe, Lagos + VIP site inspection', icon: 'plot' },
  ];

  /* ---- Tasks → points ---- */
  const tasks = [
    { id: 't1', kind: 'video', title: 'Watch: How co-ownership works', sub: '2 min onboarding video', pts: 50, done: true },
    { id: 't2', kind: 'video', title: 'Property tour — Channels Gardens, Epe', sub: '4 min walkthrough', pts: 40, done: true },
    { id: 't3', kind: 'profile', title: 'Complete your KYC', sub: 'Verify identity & bank details', pts: 100, done: true },
    { id: 't4', kind: 'share', title: 'Share your link on WhatsApp status', sub: 'Tap to copy a ready caption', pts: 30, done: false },
    { id: 't5', kind: 'video', title: 'Watch: Land documentation explained', sub: '5 min — C of O, survey, deed', pts: 60, done: false },
    { id: 't6', kind: 'webinar', title: 'Attend the weekly owners webinar', sub: 'Thursdays, 7pm WAT', pts: 150, done: false },
    { id: 't7', kind: 'refer', title: 'Refer a first-time land owner', sub: 'Bonus when they buy their first sqm', pts: 200, done: false },
    { id: 't8', kind: 'checkin', title: 'Daily check-in', sub: 'Keep your streak alive', pts: 10, done: false, streak: 4 },
  ];
  const POINTS_PER_SQM = 1000;   // 1,000 pts = 1 sqm

  /* ---- Team members (sample) ---- */
  const team = [
    { name: 'Amaka Obi', avatar: 'assets/agent-1.jpg', level: 1, refs: 14, joined: '2d ago', vol: 280000, active: true },
    { name: 'Chidi Nwosu', avatar: 'assets/owner-3.jpg', level: 1, refs: 9, joined: '5d ago', vol: 180000, active: true },
    { name: 'Bisi Lawal', avatar: 'assets/agent-2.jpg', level: 1, refs: 22, joined: '1w ago', vol: 440000, active: true },
    { name: 'Emeka Eze', avatar: 'assets/agent-3.jpg', level: 2, refs: 3, joined: '1w ago', vol: 60000, active: false },
    { name: 'Funke Ade', avatar: 'assets/owner-1.jpg', level: 1, refs: 6, joined: '2w ago', vol: 120000, active: true },
    { name: 'Sola Bright', avatar: 'assets/agent-1.jpg', level: 2, refs: 1, joined: '3w ago', vol: 20000, active: false },
  ];

  /* ---- Recent activity / wallet ledger ---- */
  const activity = [
    { id: 1, type: 'commission', label: 'Lv1 commission — Bisi Lawal', amount: 4000, when: 'Today, 11:24', positive: true },
    { id: 2, type: 'commission', label: 'Lv1 commission — Amaka Obi', amount: 4000, when: 'Today, 09:02', positive: true },
    { id: 3, type: 'override', label: 'Lv2 override — Emeka Eze', amount: 1000, when: 'Yesterday', positive: true },
    { id: 4, type: 'withdraw', label: 'Withdrawal to GTBank ••4821', amount: 50000, when: 'Mar 28', positive: false },
    { id: 5, type: 'commission', label: 'Lv1 commission — Funke Ade', amount: 4000, when: 'Mar 27', positive: true },
    { id: 6, type: 'reward', label: 'Milestone reward — 75 sqm claimed', amount: 0, when: 'Mar 25', positive: true, note: '+75 sqm' },
  ];

  /* ---- Land holdings (parcels) ---- */
  const parcels = [
    { id: 'p1', estate: 'Channels Gardens', city: 'Epe, Lagos', sqm: 60, status: 'Allocated', appr: 18 },
    { id: 'p2', estate: 'Channels Gardens', city: 'Epe, Lagos', sqm: 36, status: 'Pending survey', appr: 12 },
  ];

  /* ---- Testimonials ---- */
  const testimonials = [
    { name: 'Amaka Obi', role: 'Channerator · Lagos', avatar: 'assets/agent-1.jpg',
      quote: 'I started with ₦20,000. Eighteen months later I own land in Epe and my referrals pay my rent.' },
    { name: 'Chidi Nwosu', role: 'Land owner · Abuja', avatar: 'assets/owner-3.jpg',
      quote: 'No paperwork stress. I picked my sqm, paid with my card, and got my allocation letter the same week.' },
    { name: 'Bisi Lawal', role: 'Estate Vanguard · Ibadan', avatar: 'assets/agent-2.jpg',
      quote: 'The milestones kept me going. I claimed 150 sqm just from sharing my link with my church group.' },
  ];

  /* ---- Helpers ---- */
  function currentTier(team) {
    let t = tiers[0];
    for (const x of tiers) if (team >= x.team) t = x;
    return t;
  }
  function nextTier(team) {
    for (const x of tiers) if (team < x.team) return x;
    return null;
  }

  window.DATA = {
    NGN_PER_SQM, USD_RATE, POINTS_PER_SQM,
    fmtNaira, fmtUSD, sqmToUSD,
    user, tiers, milestones, tasks, team, activity, parcels, testimonials,
    currentTier, nextTier,
  };
})();
