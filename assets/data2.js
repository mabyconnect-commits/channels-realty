/* ============================================================
   CHANNELS REALTY — Extended data (window.DATA2)
   ============================================================ */
(function () {
  const estates = [
    { id: 'gardens', name: 'Channels Gardens', city: 'Epe, Lagos', priceSqm: 12000, available: 2840, total: 6400, appr: 18, tag: 'Hot', title: 'C of O', blurb: 'Premier estate minutes from the Lekki–Epe expressway. Gated, dry land, fast appreciation.', amen: ['Gated & fenced', 'Tarred roads', 'Drainage', 'Green areas', '24/7 security', 'Recreation'] },
    { id: 'haven', name: 'Channels Haven', city: 'Ibeju-Lekki, Lagos', priceSqm: 18000, available: 1120, total: 4000, appr: 24, tag: 'New', title: 'Gazette', blurb: 'Next to the Dangote Refinery corridor — the fastest growing axis in West Africa.', amen: ['Gated & fenced', 'Street lights', 'Drainage', 'Perimeter fence', 'Security', 'Shopping'] },
    { id: 'meadows', name: 'Channels Meadows', city: 'Mowe, Ogun', priceSqm: 8000, available: 4300, total: 5200, appr: 14, tag: 'Affordable', title: 'C of O', blurb: 'Budget-friendly entry into ownership. Perfect first plot from ₦20,000.', amen: ['Fenced', 'Graded roads', 'Drainage', 'Gate house', 'Security'] },
    { id: 'heights', name: 'Channels Heights', city: 'Kuje, Abuja', priceSqm: 15000, available: 980, total: 3000, appr: 20, tag: 'Capital', title: 'C of O', blurb: 'Own a piece of the Federal Capital Territory in a serviced, titled estate.', amen: ['Gated', 'Tarred roads', 'Power', 'Water', 'Security', 'Parks'] },
  ];

  const documents = [
    { id: 'd1', name: 'Allocation Letter — Channels Gardens', type: 'PDF', status: 'Issued', date: 'Mar 25, 2026', size: '240 KB' },
    { id: 'd2', name: 'Contract of Sale', type: 'PDF', status: 'Issued', date: 'Mar 24, 2026', size: '180 KB' },
    { id: 'd3', name: 'Deed of Assignment', type: 'PDF', status: 'Processing', date: 'Pending survey', size: '—' },
    { id: 'd4', name: 'Survey Plan', type: 'DWG', status: 'Processing', date: 'In progress', size: '—' },
    { id: 'd5', name: 'Payment Receipt #CR-10482', type: 'PDF', status: 'Issued', date: 'Mar 24, 2026', size: '96 KB' },
    { id: 'd6', name: 'Certificate of Occupancy (Estate)', type: 'PDF', status: 'Verified', date: 'Estate-wide', size: '1.2 MB' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Adaeze Okafor', avatar: 'assets/agent-1.jpg', team: 1840, earnings: 8420000, badge: 'Channel Chief', up: true },
    { rank: 2, name: 'Ibrahim Musa', avatar: 'assets/owner-3.jpg', team: 1210, earnings: 6150000, badge: 'Channel Chief', up: true },
    { rank: 3, name: 'Grace Effiong', avatar: 'assets/agent-2.jpg', team: 760, earnings: 3980000, badge: 'Estate Vanguard', up: false },
    { rank: 4, name: 'Tunde Adeyemi', avatar: 'assets/owner-2.jpg', team: 214, earnings: 1240000, badge: 'Channerator', up: true, me: true },
    { rank: 5, name: 'Blessing Eze', avatar: 'assets/agent-3.jpg', team: 188, earnings: 980000, badge: 'Channerator', up: false },
    { rank: 6, name: 'Yusuf Bello', avatar: 'assets/owner-1.jpg', team: 142, earnings: 720000, badge: 'Channerator', up: true },
  ];

  const events = [
    { id: 'e1', title: 'Co-Ownership Masterclass', date: 'Thu, Jun 4', time: '7:00 PM', host: 'Engr. David O.', type: 'Webinar', live: true, seats: 240, registered: true },
    { id: 'e2', title: 'Channels Gardens Site Inspection', date: 'Sat, Jun 6', time: '9:00 AM', host: 'Sales Team', type: 'Physical', live: false, seats: 40, registered: false },
    { id: 'e3', title: 'Building Wealth With Land', date: 'Thu, Jun 11', time: '7:00 PM', host: 'Mrs. Funmi A.', type: 'Webinar', live: false, seats: 500, registered: false },
    { id: 'e4', title: 'Top Referrers Awards Night', date: 'Fri, Jun 26', time: '6:00 PM', host: 'Channels Realty', type: 'Hybrid', live: false, seats: 120, registered: false },
  ];

  const courses = [
    { id: 'c1', title: 'Land Buying 101', lessons: 6, dur: '42 min', level: 'Beginner', progress: 100, color: '#2b5666' },
    { id: 'c2', title: 'Understanding Land Titles', lessons: 5, dur: '38 min', level: 'Beginner', progress: 60, color: '#d9742e' },
    { id: 'c3', title: 'Mastering Referrals', lessons: 8, dur: '1h 04m', level: 'Intermediate', progress: 25, color: '#3f7c91' },
    { id: 'c4', title: 'Closing Like a Pro', lessons: 7, dur: '55 min', level: 'Advanced', progress: 0, color: '#9a6f15' },
    { id: 'c5', title: 'Social Media for Realtors', lessons: 9, dur: '1h 20m', level: 'Intermediate', progress: 0, color: '#2b5666' },
    { id: 'c6', title: 'Land Documentation Deep-Dive', lessons: 4, dur: '30 min', level: 'Advanced', progress: 0, color: '#d9742e' },
  ];

  const notifications = [
    { id: 'n1', type: 'commission', title: 'You earned ₦4,000', body: 'Lv1 commission from Bisi Lawal’s purchase.', time: '12m ago', unread: true },
    { id: 'n2', type: 'milestone', title: 'Milestone almost there!', body: 'Refer 32 more to claim 150 sqm of land.', time: '1h ago', unread: true },
    { id: 'n3', type: 'team', title: 'New team member', body: 'Amaka Obi just joined your channel.', time: '3h ago', unread: true },
    { id: 'n4', type: 'event', title: 'Webinar reminder', body: 'Co-Ownership Masterclass starts tomorrow 7PM.', time: '8h ago', unread: false },
    { id: 'n5', type: 'system', title: 'Allocation letter ready', body: 'Your Channels Gardens 60 sqm document is available.', time: '2d ago', unread: false },
    { id: 'n6', type: 'reward', title: 'Rank up — Channerator!', body: 'Your commission is now 21.5% + 5.5%.', time: '5d ago', unread: false },
  ];

  const store = [
    { id: 's1', name: '5 sqm of land', cost: 5000, type: 'land', tag: 'Best value', icon: 'land' },
    { id: 's2', name: '₦5,000 cash', cost: 6000, type: 'cash', icon: 'wallet' },
    { id: 's3', name: '₦2,000 airtime', cost: 2200, type: 'airtime', icon: 'bolt' },
    { id: 's4', name: 'Channels branded kit', cost: 3500, type: 'swag', icon: 'gift' },
    { id: 's5', name: 'Site tour voucher', cost: 4000, type: 'voucher', icon: 'pin' },
    { id: 's6', name: '1 month ad boost', cost: 2800, type: 'boost', icon: 'trending' },
  ];

  const news = [
    { id: 'a1', tag: 'Launch', date: 'May 28, 2026', title: 'Channels Haven Phase 2 is now open', body: 'New plots released next to the Dangote corridor — early-bird pricing for the first 200 owners.' },
    { id: 'a2', tag: 'Update', date: 'May 20, 2026', title: 'Instant withdrawals now under 2 minutes', body: 'We upgraded our Paystack integration. Commissions hit your bank faster than ever.' },
    { id: 'a3', tag: 'Community', date: 'May 12, 2026', title: '₦1.2B paid to co-owners this quarter', body: 'Our community crossed a major milestone in commissions and land allocations.' },
    { id: 'a4', tag: 'Tip', date: 'May 4, 2026', title: 'How to hit 100 referrals in 60 days', body: 'Three of our Channerators share the exact scripts they use to grow their channel.' },
  ];

  const faqs = [
    { q: 'How does co-ownership work?', a: 'You buy land by the square metre — from as little as ₦20,000 — and own a verified, titled fraction in a Channels estate. Your sqm are pooled into real allocations.' },
    { q: 'When do I get my commission?', a: 'Instantly. The moment someone buys through your link, your 20% (₦4,000 on ₦20,000) lands in your withdrawable balance.' },
    { q: 'How do milestones reward free land?', a: 'Every referral counts toward sqm milestones. Hit 100 referrals and claim 150 sqm — completely free, on top of your commissions.' },
    { q: 'Is my land documented?', a: 'Yes. Every estate carries verified title (C of O or Gazette). You receive an allocation letter, contract of sale and deed.' },
    { q: 'How do I withdraw?', a: 'Open your Wallet, tap Withdraw, choose a bank account and confirm. Payouts are processed via Paystack in minutes.' },
    { q: 'What are points for?', a: 'Complete tasks to earn points. 1,000 points = 1 sqm of land, or redeem for cash, airtime and swag in the Rewards Store.' },
  ];

  // downline tree (for genealogy)
  const tree = {
    name: 'You', avatar: 'assets/owner-2.jpg', refs: 68,
    children: [
      { name: 'Amaka Obi', avatar: 'assets/agent-1.jpg', refs: 14, children: [
        { name: 'Sola B.', avatar: 'assets/agent-3.jpg', refs: 3 }, { name: 'Ada N.', avatar: 'assets/owner-1.jpg', refs: 5 } ] },
      { name: 'Bisi Lawal', avatar: 'assets/agent-2.jpg', refs: 22, children: [
        { name: 'John K.', avatar: 'assets/owner-3.jpg', refs: 2 } ] },
      { name: 'Chidi Nwosu', avatar: 'assets/owner-3.jpg', refs: 9, children: [] },
    ],
  };

  // earnings sparkline (last 7 months)
  const earningsTrend = [120, 180, 150, 240, 210, 320, 380].map((v) => v * 1000);
  const earningsMonths = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

  window.DATA2 = { estates, documents, leaderboard, events, courses, notifications, store, news, faqs, tree, earningsTrend, earningsMonths };
})();
