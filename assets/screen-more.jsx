/* ============================================================
   MORE HUB · ONBOARDING · INVITE
   ============================================================ */
function MoreHub() {
  const app = window.useApp();
  const D = window.DATA;
  const tier = D.currentTier(app.teamTotal);
  const groups = [
    { label: '🔥 Grand Launch', items: [
      ['launch', 'Grand Launch', Icons.fire, '#c0392b'],
      ['drops', 'Land drops', Icons.land, 'var(--orange-500)'],
      ['giftcards', 'Gift cards', Icons.gift, 'var(--gold)'],
      ['membership', 'Membership', Icons.trophy, 'var(--gold)'],
    ]},
    { label: 'Invest', items: [
      ['portfolio', 'Portfolio', Icons.eye, 'var(--green-600)'],
      ['market', 'Marketplace', Icons.pin, 'var(--orange-500)'],
      ['p2p', 'P2P market', Icons.grid, 'var(--teal-600)'],
      ['trade', 'Instant trade', Icons.bolt, 'var(--gold)'],
      ['jv', 'Joint ventures', Icons.users, 'var(--teal-700)'],
      ['insider', 'Insider investor', Icons.trending, 'var(--orange-600)'],
      ['landlords', 'New landlords', Icons.trophy, 'var(--teal-600)'],
      ['listestate', 'List an estate', Icons.land, 'var(--green-600)'],
    ]},
    { label: 'Affiliate & earn', items: [
      ['affiliate', 'Referrals & earnings', Icons.share, 'var(--orange-500)'],
      ['pages', 'My landing pages', Icons.grid, 'var(--teal-600)'],
      ['promo', 'Promo hub (AI)', Icons.spark, 'var(--orange-600)'],
      ['leaderboard', 'Leaderboard', Icons.trending, 'var(--teal-600)'],
      ['analytics', 'Earnings analytics', Icons.eye, 'var(--green-600)'],
      ['tree', 'My network tree', Icons.users, 'var(--teal-700)'],
    ]},
    { label: 'Earn & grow', items: [
      ['tasks', 'Tasks & points', Icons.bolt, 'var(--orange-500)'],
      ['badges', 'Rank & badges', Icons.trophy, 'var(--gold)'],
      ['toolkit', 'Marketing toolkit', Icons.share, 'var(--orange-600)'],
    ]},
    { label: 'Property', items: [
      ['docs', 'Document vault', Icons.shield, 'var(--teal-600)'],
      ['orders', 'Orders', Icons.doc, 'var(--teal-700)'],
      ['plans', 'Payment plans', Icons.card, 'var(--green-600)'],
      ['statements', 'Statements', Icons.doc, 'var(--teal-700)'],
    ]},
    { label: 'Learn & connect', items: [
      ['academy', 'Academy', Icons.doc, 'var(--teal-600)'],
      ['events', 'Events & webinars', Icons.clock, 'var(--orange-500)'],
      ['store', 'Rewards store', Icons.gift, 'var(--gold)'],
      ['checkin', 'Daily check-in', Icons.fire, '#d9742e'],
      ['news', 'News & updates', Icons.bell, 'var(--teal-700)'],
      ['invite', 'Invite friends', Icons.users, 'var(--orange-600)'],
    ]},
    { label: 'Account', items: [
      ['profile', 'Profile', Icons.users, 'var(--teal-600)'],
      ['quest', 'Verification quest', Icons.shield, 'var(--green-600)'],
      ['kyc', 'Verification', Icons.shield, 'var(--green-600)'],
      ['payouts', 'Payout methods', Icons.bank, 'var(--teal-700)'],
      ['security', 'Security', Icons.lock, 'var(--orange-600)'],
      ['settings', 'Settings', Icons.spark, 'var(--muted)'],
      ['support', 'Help & support', Icons.info, 'var(--teal-600)'],
    ]},
  ];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Profile strip */}
      <Card className="clickable" onClick={() => app.nav('profile')} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar src={app.user.avatar} name={app.user.name} size={56} ring />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="font-display" style={{ fontSize: 19, fontWeight: 700 }}>{app.user.name}</div>
          <div className="row gap-2" style={{ marginTop: 3 }}>
            <span className="chip chip-accent" style={{ padding: '2px 9px', fontSize: 11 }}><Icons.trophy size={12} /> {tier.name}</span>
            <span className="muted" style={{ fontSize: 12.5 }}>{app.user.handle}</span>
          </div>
        </div>
        <Icons.chevR style={{ color: 'var(--faint)' }} />
      </Card>

      {groups.map((g) => (
        <div key={g.label}>
          <div className="sec-head"><h3 style={{ fontSize: 16 }}>{g.label}</h3></div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
            {g.items.map(([id, label, Ic, color]) => (
              <Card key={id} hover className="clickable" onClick={() => app.nav(id)} style={{ padding: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `color-mix(in srgb, ${color} 14%, transparent)`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><Ic size={21} /></div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <button className="row gap-2 center" onClick={app.logout} style={{ justifyContent: 'center', color: 'var(--red-500)', fontWeight: 700, fontSize: 14.5, padding: 14 }}>
        <Icons.logout size={17} /> Log out
      </button>
    </div>
  );
}

/* ---- Onboarding carousel ---- */
function Onboarding({ onDone, onSkip }) {
  const [i, setI] = useState(0);
  const slides = [
    { icon: <Icons.land size={46} />, color: 'var(--teal-700)', title: 'Own land from ₦20,000', body: 'Buy verified land by the square metre in fast-appreciating Nigerian estates.' },
    { icon: <Icons.share size={46} />, color: 'var(--orange-500)', title: 'Refer & earn 20% instantly', body: 'Get ₦4,000 the moment someone buys through your link — withdrawable anytime.' },
    { icon: <Icons.trophy size={46} />, color: 'var(--gold)', title: 'Hit milestones, earn free land', body: 'Every referral counts. Reach 100 and claim 150 sqm. Climb ranks, unlock bonuses.' },
    { icon: <Icons.shield size={46} />, color: 'var(--green-600)', title: 'Real titles, real allocation', body: 'C of O verified estates with allocation letters, deeds and site tours. No paperwork stress.' },
  ];
  const s = slides[i];
  const last = i === slides.length - 1;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: '24px 22px calc(28px + env(safe-area-inset-bottom))' }}>
      <div className="row between">
        <Logo size={26} />
        <button className="muted" onClick={onSkip} style={{ fontWeight: 700, fontSize: 14 }}>Skip</button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: 460, margin: '0 auto', width: '100%' }}>
        <div key={i} className="reveal" style={{ width: 150, height: 150, borderRadius: 40, marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(150deg, ${s.color}, color-mix(in srgb, ${s.color} 55%, #000))`, color: '#fff', boxShadow: `0 24px 60px color-mix(in srgb, ${s.color} 40%, transparent)` }}>
          {s.icon}
        </div>
        <h1 key={'t' + i} className="reveal" style={{ fontSize: 30, fontWeight: 800, maxWidth: 380 }}>{s.title}</h1>
        <p key={'b' + i} className="reveal muted" style={{ fontSize: 16.5, marginTop: 14, maxWidth: 360, lineHeight: 1.6 }}>{s.body}</p>
      </div>
      <div style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}>
        <div className="row gap-2" style={{ justifyContent: 'center', marginBottom: 24 }}>
          {slides.map((_, k) => (
            <span key={k} onClick={() => setI(k)} className="clickable" style={{ height: 7, width: k === i ? 24 : 7, borderRadius: 7, background: k === i ? 'var(--accent)' : 'var(--hairline)', transition: 'all .3s var(--ease)' }} />
          ))}
        </div>
        <Btn block size="lg" onClick={() => last ? onDone() : setI(i + 1)} iconR={<Icons.arrowRight />}>
          {last ? 'Get started' : 'Next'}
        </Btn>
      </div>
    </div>
  );
}

/* ---- Invite friends ---- */
function Invite() {
  const app = window.useApp();
  const toast = useToast();
  const link = 'https://' + app.user.refLink;
  const contacts = window.DATA.team.concat([
    { name: 'Kemi A.', avatar: 'assets/owner-1.jpg' }, { name: 'Tobi M.', avatar: 'assets/agent-3.jpg' },
  ]).slice(0, 6);
  const [invited, setInvited] = useState([]);
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Invite friends" sub="Bring people into your channel and earn on every plot they buy." />
      <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative', textAlign: 'center',
        background: 'linear-gradient(150deg, var(--teal-800), var(--teal-600))', color: '#fff', padding: 'clamp(26px,5vw,40px)' }}>
        <div style={{ position: 'absolute', top: -40, right: -30, opacity: .15 }}><Icons.gift size={180} /></div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 120, height: 120, margin: '0 auto 18px', background: '#fff', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)' }}>
            <QR />
          </div>
          <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>Scan or share your link</h3>
          <div className="font-mono" style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', marginTop: 8 }}>{app.user.refLink}</div>
          <div className="row gap-2" style={{ justifyContent: 'center', marginTop: 18 }}>
            <Btn variant="primary" icon={<Icons.copy size={16} />} onClick={() => { navigator.clipboard?.writeText(link); toast('Link copied!'); }}>Copy link</Btn>
            <Btn variant="ghost" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }} icon={<Icons.share size={16} />} onClick={() => app.openShare()}>Share</Btn>
          </div>
        </div>
      </div>
      <Card pad={false}>
        <div className="row between" style={{ padding: '16px 20px' }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Invite from contacts</h3><span className="chip">{contacts.length}</span></div>
        {contacts.map((c, i) => (
          <div key={i} className="row gap-3" style={{ padding: '12px 20px', borderTop: '1px solid var(--line-2)' }}>
            <Avatar src={c.avatar} name={c.name} size={42} />
            <div style={{ flex: 1, fontWeight: 700, fontSize: 14.5 }}>{c.name}</div>
            <Btn size="sm" variant={invited.includes(i) ? 'ghost' : 'outline'} disabled={invited.includes(i)}
              onClick={() => { setInvited((x) => [...x, i]); toast('Invite sent to ' + c.name); }}>
              {invited.includes(i) ? 'Invited' : 'Invite'}
            </Btn>
          </div>
        ))}
      </Card>
    </div>
  );
}

function QR() {
  // simple deterministic QR-like grid
  const cells = [];
  for (let i = 0; i < 81; i++) cells.push((i * 7 + (i % 5) * 3) % 3 === 0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: 2, width: 88, height: 88 }}>
      {cells.map((on, i) => <div key={i} style={{ background: on ? 'var(--teal-800)' : 'transparent', borderRadius: 1 }} />)}
    </div>
  );
}

Object.assign(window, { MoreHub, Onboarding, Invite });
