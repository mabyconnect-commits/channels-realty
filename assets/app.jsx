/* ============================================================
   ROOT APP  (exports nothing; mounts to #root)
   ============================================================ */
const AppCtx = React.createContext(null);
window.useApp = () => React.useContext(AppCtx);

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "daylight",
  "accent": "#d9742e",
  "celebrate": true,
  "density": "regular",
  "radius": "rounded"
}/*EDITMODE-END*/;

/* Screen registry: id -> { c: window component name, t: title } */
const SCREENS = {
  dashboard:     { c: 'Dashboard',         t: 'Dashboard' },
  milestones:    { c: 'Milestones',        t: 'Land & Milestones' },
  team:          { c: 'Team',              t: 'Team' },
  tasks:         { c: 'Tasks',             t: 'Tasks & Rewards' },
  wallet:        { c: 'Wallet',            t: 'Wallet' },
  more:          { c: 'MoreHub',           t: 'More' },
  badges:        { c: 'Badges',            t: 'Rank & Badges' },
  market:        { c: 'Marketplace',       t: 'Marketplace' },
  estate:        { c: 'EstateDetail',      t: 'Estate' },
  plotpicker:    { c: 'PlotPicker',        t: 'Choose your plot' },
  checkout:      { c: 'Checkout',          t: 'Checkout' },
  docs:          { c: 'DocumentVault',     t: 'Document Vault' },
  property:      { c: 'PropertyDetail',    t: 'My Property' },
  profile:       { c: 'Profile',           t: 'Profile' },
  kyc:           { c: 'KYC',               t: 'Verification' },
  settings:      { c: 'Settings',          t: 'Settings' },
  security:      { c: 'Security',          t: 'Security' },
  payouts:       { c: 'Payouts',           t: 'Payout Methods' },
  fund:          { c: 'FundWallet',        t: 'Add Money' },
  plans:         { c: 'PaymentPlans',      t: 'Payment Plans' },
  statements:    { c: 'Statements',        t: 'Statements' },
  leaderboard:   { c: 'Leaderboard',       t: 'Leaderboard' },
  tree:          { c: 'Genealogy',         t: 'My Network Tree' },
  analytics:     { c: 'EarningsAnalytics', t: 'Earnings Analytics' },
  toolkit:       { c: 'MarketingToolkit',  t: 'Marketing Toolkit' },
  notifications: { c: 'Notifications',     t: 'Notifications' },
  store:         { c: 'RewardsStore',      t: 'Rewards Store' },
  events:        { c: 'Events',            t: 'Events & Webinars' },
  academy:       { c: 'Academy',           t: 'Academy' },
  checkin:       { c: 'CheckIn',           t: 'Daily Check-in' },
  support:       { c: 'Support',           t: 'Help & Support' },
  news:          { c: 'News',              t: 'News & Updates' },
  invite:        { c: 'Invite',            t: 'Invite Friends' },
  // ---- Launch & affiliate ----
  launch:        { c: 'Launch',            t: 'Grand Launch' },
  drops:         { c: 'Drops',             t: 'Land Drops' },
  giftcards:     { c: 'GiftCards',         t: 'Gift Cards' },
  quest:         { c: 'Quest',             t: 'Verification Quest' },
  affiliate:     { c: 'Affiliate',         t: 'Referrals & Earnings' },
  pages:         { c: 'LandingPages',      t: 'My Landing Pages' },
  promo:         { c: 'PromoHub',          t: 'Promo Hub' },
  // ---- Investors' corner ----
  portfolio:     { c: 'Portfolio',         t: 'Portfolio' },
  p2p:           { c: 'P2PMarket',         t: 'P2P Market' },
  trade:         { c: 'InstantTrade',      t: 'Instant Trade' },
  jv:            { c: 'JointVentures',     t: 'Joint Ventures' },
  landlords:     { c: 'Landlords',         t: 'New Landlords' },
  insider:       { c: 'InsiderInvestor',   t: 'Insider Investor' },
  listestate:    { c: 'ListEstate',        t: 'List an Estate' },
  membership:    { c: 'Membership',        t: 'Membership' },
  orders:        { c: 'Orders',            t: 'Orders' },
};

const BOTTOM = [
  { id: 'dashboard', label: 'Home', icon: Icons.home },
  { id: 'milestones', label: 'Land', icon: Icons.land },
  { id: 'team', label: 'Team', icon: Icons.users },
  { id: 'wallet', label: 'Wallet', icon: Icons.wallet },
  { id: 'more', label: 'More', icon: Icons.grid },
];

const SIDE_GROUPS = [
  { label: 'Overview', items: ['dashboard', 'portfolio', 'milestones', 'team', 'wallet'] },
  { label: 'Launch 🔥', items: ['launch', 'drops', 'giftcards', 'membership'] },
  { label: 'Invest', items: ['market', 'p2p', 'trade', 'jv', 'insider', 'landlords', 'listestate'] },
  { label: 'Affiliate', items: ['affiliate', 'pages', 'promo', 'leaderboard', 'analytics', 'tree'] },
  { label: 'Grow', items: ['tasks', 'badges', 'academy', 'events'] },
  { label: 'Account', items: ['profile', 'quest', 'orders', 'docs', 'notifications', 'support', 'settings'] },
];
const SIDE_ICON = {
  dashboard: Icons.home, milestones: Icons.land, team: Icons.users, wallet: Icons.wallet,
  tasks: Icons.bolt, badges: Icons.trophy, leaderboard: Icons.trending, analytics: Icons.eye,
  toolkit: Icons.share, academy: Icons.doc, events: Icons.clock, market: Icons.pin, docs: Icons.shield,
  plans: Icons.card, profile: Icons.users, notifications: Icons.bell, store: Icons.gift, support: Icons.info, settings: Icons.spark,
  launch: Icons.fire, drops: Icons.land, giftcards: Icons.gift, quest: Icons.shield, membership: Icons.trophy,
  affiliate: Icons.share, pages: Icons.grid, promo: Icons.spark, portfolio: Icons.eye, p2p: Icons.grid,
  trade: Icons.bolt, jv: Icons.users, insider: Icons.trending, landlords: Icons.pin, listestate: Icons.land,
  orders: Icons.doc, tree: Icons.users,
};

function Root() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState('onboard');     // onboard | landing | auth | app
  const [authMode, setAuthMode] = useState('signup');
  const [stack, setStack] = useState([{ id: 'dashboard' }]);
  const [share, setShare] = useState(false);
  const [confetti, setConfetti] = useState(0);

  const top = stack[stack.length - 1];
  const screen = top.id;
  const param = top.param;

  const [profile, setProfile] = useState(null);   // live user (null = demo)
  const [live, setLive] = useState(false);          // backend session active
  const base = profile || window.DATA.user;
  const [st, setSt] = useState({
    balance: window.DATA.user.balance, pending: window.DATA.user.pending, lifetime: window.DATA.user.lifetime,
    directRefs: window.DATA.user.directRefs, level2: window.DATA.user.level2,
    landSqm: window.DATA.user.landSqm, points: window.DATA.user.points,
    claimed: ['kit', 'm75'],
    tasksDone: window.DATA.tasks.filter((x) => x.done).map((x) => x.id),
    parcels: window.DATA.parcels,
    notifRead: false,
  });

  // ---- Live backend integration (graceful fallback to demo data) ----
  const toNaira = (kobo) => Math.round((kobo || 0) / 100);
  const mapUser = (u) => ({
    ...window.DATA.user,
    name: (u.firstName + ' ' + u.lastName).trim(), first: u.firstName,
    email: u.email, phone: u.phone || window.DATA.user.phone,
    refCode: u.refCode, refLink: 'channels.realty/r/' + u.refCode,
    kyc: u.kycStatus === 'APPROVED', kycStatus: u.kycStatus,
    membership: u.membership || 'STARTER', isAffiliate: true,
  });
  const loadProfile = useCallback(async () => {
    if (!window.API) return false;
    try {
      const me = await window.API.me();
      setProfile(mapUser(me.user)); setLive(true);
      const [d, w, r] = await Promise.allSettled([window.API.dashboard(), window.API.wallet(), window.API.referrals()]);
      setSt((s) => {
        const ns = { ...s };
        if (w.status === 'fulfilled') { ns.balance = toNaira(w.value.wallet.balance); ns.pending = toNaira(w.value.wallet.pending); ns.points = w.value.wallet.points; }
        if (d.status === 'fulfilled') { ns.landSqm = d.value.summary.landSqm; ns.lifetime = toNaira(d.value.summary.totalEarned); }
        if (r.status === 'fulfilled') { ns.directRefs = r.value.stats.total; }
        return ns;
      });
      return true;
    } catch (e) { setLive(false); return false; }
  }, []);

  // Restore session on load + handle Paystack redirect callback.
  const booted = useRef(false);
  useEffect(() => {
    if (booted.current) return; booted.current = true;
    (async () => {
      const restored = await loadProfile();
      if (restored) { setView('app'); navRoot('dashboard'); }
      const p = (window.API && window.API.params) || {};
      if (p.pay === 'callback' && p.ref && window.API) {
        try { const v = await window.API.verifyPayment(p.ref); if (v.status === 'paid') await loadProfile(); } catch (_) {}
        try { history.replaceState({}, '', location.pathname); } catch (_) {}
      }
    })();
  }, []);

  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute('data-theme', t.theme === 'daylight' ? '' : t.theme);
    r.style.setProperty('--accent', t.accent);
    if (t.radius === 'sharp') {
      r.style.setProperty('--r-lg', '10px'); r.style.setProperty('--r-xl', '12px');
      r.style.setProperty('--r-md', '8px'); r.style.setProperty('--r-sm', '6px');
    } else {
      ['--r-lg', '--r-xl', '--r-md', '--r-sm'].forEach((k) => r.style.removeProperty(k));
    }
  }, [t.theme, t.accent, t.radius]);

  const scrollTop = () => { window.scrollTo({ top: 0 }); const m = document.querySelector('.main'); if (m) m.scrollTop = 0; };
  const nav = (id, p) => { setStack((s) => [...s, { id, param: p }]); scrollTop(); };
  const navRoot = (id) => { setStack([{ id }]); scrollTop(); };
  const back = () => { setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)); scrollTop(); };
  const fireConfetti = () => { if (t.celebrate) setConfetti((c) => c + 1); };

  const actions = {
    nav, navRoot, back, param,
    openShare: () => setShare(true),
    fireConfetti,
    logout: () => { if (window.API) window.API.logout().catch(() => {}); setProfile(null); setLive(false); setView('landing'); },
    markNotifRead: () => setSt((s) => ({ ...s, notifRead: true })),
    claimMilestone: (m) => setSt((s) => ({ ...s, claimed: [...s.claimed, m.id], landSqm: s.landSqm + (m.sqm || 0),
      parcels: m.sqm ? [...s.parcels, { id: m.id, estate: 'Channels Gardens', city: 'Epe, Lagos', sqm: m.sqm, status: 'Pending survey', appr: 12 }] : s.parcels })),
    buyLand: (sqm) => setSt((s) => ({ ...s, landSqm: s.landSqm + sqm,
      parcels: [...s.parcels, { id: 'b' + Date.now(), estate: 'Channels Gardens', city: 'Epe, Lagos', sqm, status: 'Pending survey', appr: 14 }] })),
    completeTask: (task) => setSt((s) => ({ ...s, tasksDone: [...s.tasksDone, task.id], points: s.points + task.pts })),
    redeemPoints: (sqm) => setSt((s) => ({ ...s, points: s.points - sqm * window.DATA.POINTS_PER_SQM, landSqm: s.landSqm + sqm })),
    spendPoints: (pts) => setSt((s) => ({ ...s, points: Math.max(0, s.points - pts) })),
    addPoints: (pts) => setSt((s) => ({ ...s, points: s.points + pts })),
    doWithdraw: (amt) => setSt((s) => ({ ...s, balance: s.balance - amt })),
    fund: (amt) => setSt((s) => ({ ...s, balance: s.balance + amt })),
  };

  const ctx = { ...st, teamTotal: st.directRefs + st.level2, user: base, live, reload: loadProfile, tweaks: t, screen, ...actions };

  const meta = SCREENS[screen] || SCREENS.dashboard;
  const Screen = window[meta.c] || window.Dashboard;
  const isSub = stack.length > 1;
  const unread = window.DATA2.notifications.filter((n) => n.unread).length;

  return (
    <AppCtx.Provider value={ctx}>
      <ToastProvider>
        {view === 'onboard' && <Onboarding onDone={() => setView('landing')} onSkip={() => setView('landing')} />}

        {view === 'landing' && <Landing onAuth={(m) => { setAuthMode(m); setView('auth'); }} />}

        {view === 'auth' && (
          <Auth mode={authMode} onBack={() => setView('landing')}
            onComplete={() => { setView('app'); navRoot('dashboard'); loadProfile(); }} />
        )}

        {view === 'app' && (
          <div className="shell app-bg">
            {/* Sidebar (desktop) */}
            <aside className="sidebar">
              <div className="sidebar-brand"><Logo size={26} /></div>
              <nav className="side-nav hide-scroll" style={{ overflowY: 'auto', flex: 1, paddingRight: 2 }}>
                {SIDE_GROUPS.map((g) => (
                  <div key={g.label} style={{ marginBottom: 6 }}>
                    <div className="stat-label" style={{ fontSize: 10.5, padding: '12px 13px 6px', color: 'var(--faint)' }}>{g.label}</div>
                    {g.items.map((id) => (
                      <a key={id} className={'side-link ' + (screen === id ? 'active' : '')} onClick={() => navRoot(id)}>
                        {React.createElement(SIDE_ICON[id] || Icons.grid)}{SCREENS[id].t.replace(' & Milestones', '').replace(' & Webinars', '').replace(' Analytics', '')}
                        {id === 'milestones' && <span className="side-badge">{st.landSqm}</span>}
                        {id === 'notifications' && unread > 0 && !st.notifRead && <span className="side-badge">{unread}</span>}
                      </a>
                    ))}
                  </div>
                ))}
              </nav>
              <div style={{ paddingTop: 10 }}>
                <a className="side-link" onClick={actions.logout}><Icons.logout /> Log out</a>
              </div>
            </aside>

            {/* Main */}
            <div className="main">
              <PromoBanner />
              {/* Topbar (desktop) */}
              <div className="topbar d-only">
                {isSub && <button className="chip clickable" onClick={back}><Icons.arrowLeft size={15} /> Back</button>}
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--muted)' }}>{meta.t}</div>
                <div style={{ flex: 1 }} />
                <button className="chip clickable" onClick={() => navRoot('wallet')}><Icons.wallet size={15} /> {window.DATA.fmtNaira(st.balance)}</button>
                <button onClick={() => navRoot('notifications')} style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', position: 'relative' }}>
                  <Icons.bell size={19} />{unread > 0 && !st.notifRead && <span style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--surface)' }} />}
                </button>
                <button onClick={() => navRoot('profile')}><Avatar src={base.avatar} name={base.name} size={40} ring /></button>
              </div>

              {/* Mobile header */}
              <div className="m-header m-only">
                {isSub ? (
                  <>
                    <button onClick={back} style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}><Icons.arrowLeft size={19} /></button>
                    <div style={{ fontWeight: 700, fontSize: 16, marginLeft: 2 }}>{meta.t}</div>
                    <div className="mh-spacer" />
                  </>
                ) : (
                  <>
                    <Logo size={24} />
                    <div className="mh-spacer" />
                    <button className="chip clickable" onClick={() => navRoot('wallet')} style={{ padding: '6px 10px' }}><Icons.wallet size={14} /> {window.DATA.fmtNaira(st.balance)}</button>
                  </>
                )}
                <button onClick={() => navRoot('notifications')} style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', position: 'relative' }}>
                  <Icons.bell size={18} />{unread > 0 && !st.notifRead && <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />}
                </button>
              </div>

              <div className="main-inner">
                {!isSub && (
                  <div className="m-only" style={{ paddingTop: 18, paddingBottom: 4 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700 }}>{screen === 'dashboard' ? `Hi, ${base.first} 👋` : meta.t}</h2>
                  </div>
                )}
                <Screen key={screen + (param ? JSON.stringify(param) : '')} />
              </div>
            </div>

            {/* Bottom nav (mobile) */}
            <nav className="bottom-nav m-only">
              {BOTTOM.map((n) => {
                const active = screen === n.id || (n.id === 'more' && !['dashboard', 'milestones', 'team', 'wallet'].includes(screen));
                return (
                  <button key={n.id} className={'bn-item ' + (active ? 'active' : '')} onClick={() => navRoot(n.id)}>
                    <n.icon /><span>{n.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Floating widgets */}
            <TopAffiliatesFab />
            <SupportFab />
          </div>
        )}

        {/* Globals */}
        <ShareSheet open={share} onClose={() => setShare(false)} />
        <Confetti run={confetti} key={confetti} />

        {/* Tweaks */}
        <TweaksPanel>
          <TweakSection label="Dashboard theme" />
          <TweakRadio label="Look" value={t.theme} options={['daylight', 'midnight', 'canvas']} onChange={(v) => setTweak('theme', v)} />
          <TweakColor label="Accent" value={t.accent} options={['#d9742e', '#2b5666', '#3f7c91', '#d9a23e']} onChange={(v) => setTweak('accent', v)} />
          <TweakRadio label="Corners" value={t.radius} options={['rounded', 'sharp']} onChange={(v) => setTweak('radius', v)} />
          <TweakSection label="Experience" />
          <TweakToggle label="Celebrate rewards (confetti)" value={t.celebrate} onChange={(v) => setTweak('celebrate', v)} />
          <TweakSection label="Jump to" />
          <TweakButton label="Onboarding" onClick={() => setView('onboard')} />
          <TweakButton label="Landing page" onClick={() => setView('landing')} />
          <TweakButton label="Enter app" onClick={() => { setView('app'); navRoot('dashboard'); }} />
        </TweaksPanel>
      </ToastProvider>
    </AppCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
