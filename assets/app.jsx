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
};

const BOTTOM = [
  { id: 'dashboard', label: 'Home', icon: Icons.home },
  { id: 'milestones', label: 'Land', icon: Icons.land },
  { id: 'team', label: 'Team', icon: Icons.users },
  { id: 'wallet', label: 'Wallet', icon: Icons.wallet },
  { id: 'more', label: 'More', icon: Icons.grid },
];

const SIDE_GROUPS = [
  { label: 'Overview', items: ['dashboard', 'milestones', 'team', 'wallet'] },
  { label: 'Grow', items: ['tasks', 'badges', 'leaderboard', 'analytics', 'toolkit', 'academy', 'events'] },
  { label: 'Property', items: ['market', 'docs', 'plans'] },
  { label: 'Account', items: ['profile', 'notifications', 'store', 'support', 'settings'] },
];
const SIDE_ICON = {
  dashboard: Icons.home, milestones: Icons.land, team: Icons.users, wallet: Icons.wallet,
  tasks: Icons.bolt, badges: Icons.trophy, leaderboard: Icons.trending, analytics: Icons.eye,
  toolkit: Icons.share, academy: Icons.doc, events: Icons.clock, market: Icons.pin, docs: Icons.shield,
  plans: Icons.card, profile: Icons.users, notifications: Icons.bell, store: Icons.gift, support: Icons.info, settings: Icons.spark,
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

  const base = window.DATA.user;
  const [st, setSt] = useState({
    balance: base.balance, pending: base.pending, lifetime: base.lifetime,
    directRefs: base.directRefs, level2: base.level2,
    landSqm: base.landSqm, points: base.points,
    claimed: ['kit', 'm75'],
    tasksDone: window.DATA.tasks.filter((x) => x.done).map((x) => x.id),
    parcels: window.DATA.parcels,
    notifRead: false,
  });

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
    logout: () => setView('landing'),
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

  const ctx = { ...st, teamTotal: st.directRefs + st.level2, user: base, tweaks: t, screen, ...actions };

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
            onComplete={() => { setView('app'); navRoot('dashboard'); }} />
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
