/* ============================================================
   INVESTORS' CORNER — Portfolio · P2P · Instant Trade · JV ·
   Landlords · Insider · List Estate · Membership · Orders
   ============================================================ */

/* ---- Portfolio (All Assets) ---- */
function Portfolio() {
  const app = window.useApp();
  const D = window.DATA;
  const [H, setH] = useState(app.live ? [] : window.DATA3.holdings);
  useEffect(() => {
    if (app.live && window.API) window.API.portfolio().then((r) => {
      setH((r.holdings || []).map((h) => ({ id: h.id, estate: h.estate, city: h.city, sqm: h.sqm, cost: Math.round(h.cost / 100), value: Math.round(h.value / 100), appr: h.appr })));
    }).catch(() => {});
  }, [app.live]);
  const value = H.reduce((s, h) => s + h.value, 0);
  const cost = H.reduce((s, h) => s + h.cost, 0);
  const gain = value - cost;
  const gainPct = cost ? ((gain / cost) * 100).toFixed(1) : '0.0';
  const empty = H.length === 0;
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Portfolio (All Assets)" sub="Track the growth of each estate you own. Buy more or resell — per estate." />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        <Card style={{ padding: 16 }}><div className="stat-label">Portfolio value</div><div className="num" style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{D.fmtNaira(value)}</div></Card>
        <Card style={{ padding: 16 }}><div className="stat-label">Cost basis</div><div className="num" style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{D.fmtNaira(cost)}</div></Card>
        <Card style={{ padding: 16, background: 'var(--green-50)' }}><div className="stat-label">Total gain</div><div className="num" style={{ fontSize: 22, fontWeight: 800, marginTop: 6, color: 'var(--green-600)' }}>+{D.fmtNaira(gain)}</div><div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-600)' }}>+{gainPct}%</div></Card>
      </div>

      {empty ? (
        <Card style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ width: 60, height: 60, margin: '0 auto', borderRadius: 16, background: 'var(--surface-sunk)', color: 'var(--faint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.land size={30} /></div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 14 }}>You don’t own any land yet</h3>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>Buy from a live drop to start your portfolio.</p>
          <Btn size="lg" style={{ marginTop: 16 }} icon={<Icons.fire size={17} />} onClick={() => app.nav('drops')}>Browse drops</Btn>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {H.map((h) => (
            <Card key={h.id}>
              <div className="row between">
                <div className="row gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--teal-100)', color: 'var(--teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 44px' }}><Icons.land size={22} /></div>
                  <div><div style={{ fontWeight: 800, fontSize: 15 }}>{h.estate}</div><div className="muted" style={{ fontSize: 12.5 }}>{h.city} · {h.sqm} sqm</div></div>
                </div>
                <span className="chip chip-green"><Icons.trending size={13} /> +{h.appr}%</span>
              </div>
              <div className="row between" style={{ marginTop: 14 }}>
                <div><div className="muted" style={{ fontSize: 11.5 }}>Cost</div><div className="num" style={{ fontWeight: 700 }}>{D.fmtNaira(h.cost)}</div></div>
                <div style={{ textAlign: 'right' }}><div className="muted" style={{ fontSize: 11.5 }}>Value</div><div className="num" style={{ fontWeight: 800, color: 'var(--green-600)' }}>{D.fmtNaira(h.value)}</div></div>
              </div>
              <div className="row gap-2" style={{ marginTop: 12 }}>
                <Btn size="sm" icon={<Icons.plus size={15} />} onClick={() => app.nav('drops')}>Buy more</Btn>
                <Btn size="sm" variant="outline" icon={<Icons.trending size={15} />} onClick={() => app.nav('p2p')}>Resell</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- P2P Land Market ---- */
function P2PMarket() {
  const app = window.useApp();
  const D = window.DATA;
  const toast = useToast();
  const [listings, setListings] = useState(app.live ? [] : window.DATA3.p2p);
  useEffect(() => {
    if (app.live && window.API) window.API.p2p().then((r) => setListings((r.listings || []).map((l) => ({
      id: l.id, estate: l.estate.name, city: l.estate.city, sqm: l.sqm, ask: Math.round(l.ask / 100),
      seller: l.seller.firstName, avatar: 'assets/agent-1.jpg', verified: l.seller.kycStatus === 'APPROVED', disc: 0,
    })))).catch(() => {});
  }, [app.live]);
  const [tab, setTab] = useState('buy');
  const tabs = [['instant', 'Instant', Icons.bolt], ['buy', 'Buy', Icons.wallet], ['sell', 'Sell', Icons.land], ['mine', 'Mine', Icons.grid]];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="row gap-3">
        <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--green-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 46px' }}><Icons.grid size={22} /></div>
        <div><h2 style={{ fontSize: 22, fontWeight: 800 }}>P2P Land Market</h2><p className="muted" style={{ fontSize: 13 }}>Buy and sell land directly with other investors.</p></div>
      </div>

      <div className="row gap-2 hide-scroll" style={{ overflowX: 'auto' }}>
        {tabs.map(([id, label, Ic]) => (
          <button key={id} onClick={() => setTab(id)} className="row gap-2" style={{ padding: '9px 16px', borderRadius: 999, fontWeight: 800, fontSize: 13.5, whiteSpace: 'nowrap',
            background: tab === id ? 'var(--green-600)' : 'var(--surface-sunk)', color: tab === id ? '#fff' : 'var(--on-surface-mut)' }}>
            <Ic size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === 'instant' && (
        <Card style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ width: 56, height: 56, margin: '0 auto', borderRadius: '50%', background: 'var(--surface-sunk)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.bolt size={28} /></div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginTop: 14 }}>Instant Trade is a Pro feature</h3>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>Sell to the platform instantly at the floor price. Upgrade to unlock.</p>
          <Btn size="lg" style={{ marginTop: 16 }} icon={<Icons.lock size={16} />} onClick={() => app.nav('membership')}>Unlock Instant Trade</Btn>
        </Card>
      )}

      {tab === 'buy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {listings.map((l) => (
            <Card key={l.id}>
              <div className="row between">
                <div className="row gap-3">
                  <Avatar src={l.avatar} name={l.seller} size={40} />
                  <div>
                    <div className="row gap-2"><span style={{ fontWeight: 800, fontSize: 15 }}>{l.estate}</span>{l.verified && <Icons.checkCircle size={15} style={{ color: 'var(--green-600)' }} />}</div>
                    <div className="muted" style={{ fontSize: 12.5 }}>{l.sqm} sqm · {l.city} · {l.seller}</div>
                  </div>
                </div>
                {l.disc > 0 && <span className="chip chip-green">-{l.disc}%</span>}
              </div>
              <div className="row between" style={{ marginTop: 14 }}>
                <div><div className="muted" style={{ fontSize: 11.5 }}>Asking</div><div className="num" style={{ fontWeight: 800, fontSize: 18 }}>{D.fmtNaira(l.ask)}</div></div>
                <Btn size="sm" icon={<Icons.wallet size={15} />} onClick={() => { app.fireConfetti(); toast('Offer sent to ' + l.seller); }}>Buy now</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'sell' && (
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>List your land for resale</h3>
          <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>Set your price and sell to other investors. 0% selling fee on Pro.</p>
          <label className="stat-label" style={{ display: 'block', marginTop: 14 }}>Estate</label>
          <select style={{ width: '100%', marginTop: 8, padding: '13px 15px', borderRadius: 'var(--r-sm)', border: '1px solid var(--hairline)', background: 'var(--surface)', fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }}>
            {app.parcels.map((p) => <option key={p.id}>{p.estate} — {p.sqm} sqm</option>)}
          </select>
          <label className="stat-label" style={{ display: 'block', marginTop: 14 }}>Asking price (₦)</label>
          <input type="number" placeholder="e.g. 850000" style={{ width: '100%', marginTop: 8, padding: '13px 15px', borderRadius: 'var(--r-sm)', border: '1px solid var(--hairline)', background: 'var(--surface)', fontWeight: 700, fontSize: 15, color: 'var(--on-surface)' }} />
          <Btn block size="lg" style={{ marginTop: 16 }} icon={<Icons.land size={17} />} onClick={() => toast('Listing submitted for review')}>List for sale</Btn>
        </Card>
      )}

      {tab === 'mine' && (
        <Card style={{ textAlign: 'center', padding: 36 }}>
          <Icons.grid size={30} style={{ color: 'var(--faint)' }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 12 }}>No active listings</h3>
          <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>Your resale listings will appear here.</p>
        </Card>
      )}
    </div>
  );
}

/* ---- Instant Trade (locked / premium) ---- */
function InstantTrade() {
  const app = window.useApp();
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Instant Trade ⚡" sub="Sell land to the platform instantly at the live floor price — no waiting for a buyer." />
      <Card style={{ textAlign: 'center', padding: 40, background: 'linear-gradient(135deg, #1c2429, #2b3640)', color: '#fff' }}>
        <div style={{ width: 64, height: 64, margin: '0 auto', borderRadius: 18, background: 'rgba(246,201,69,.16)', color: '#f6c945', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.lock size={30} /></div>
        <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginTop: 16 }}>Unlock Instant Trade</h3>
        <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 14, marginTop: 8, maxWidth: 360, margin: '8px auto 0' }}>Instant Trade is available on Pro Investor and above. Cash out your sqm in one tap at the live price.</p>
        <Btn size="lg" style={{ marginTop: 20, background: '#f6c945', color: '#5a1a10' }} icon={<Icons.spark size={17} />} onClick={() => app.nav('membership')}>See membership plans</Btn>
      </Card>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>What you get</h3>
        {['One-tap sell at the live floor price', 'No waiting for a P2P buyer', 'Funds land in your wallet instantly', '0% trading fee on Estate Elite'].map((x, i) => (
          <div key={i} className="row gap-2" style={{ padding: '8px 0', fontSize: 14, fontWeight: 600 }}><Icons.checkCircle size={16} style={{ color: 'var(--green-600)' }} /> {x}</div>
        ))}
      </Card>
    </div>
  );
}

/* ---- Joint Ventures ---- */
function JointVentures() {
  const app = window.useApp();
  const D = window.DATA;
  const toast = useToast();
  const [V, setV] = useState(app.live ? [] : window.DATA3.ventures);
  useEffect(() => {
    if (app.live && window.API) window.API.ventures().then((r) => setV((r.ventures || []).map((v) => ({
      id: v.id, name: v.name, city: v.city, raised: Math.round(v.raised / 100), target: Math.round(v.target / 100),
      min: Math.round(v.minInvest / 100), roi: v.roiPct, months: v.months, slots: v.slots,
    })))).catch(() => {});
  }, [app.live]);
  const join = async (v) => {
    if (app.live && window.API) {
      try { await window.API.investVenture(v.id, v.min); app.fireConfetti(); toast('Invested in ' + v.name); if (app.reload) await app.reload(); }
      catch (e) { toast(e.message || 'Could not invest'); }
    } else { app.fireConfetti(); toast('Reserved a slot in ' + v.name); }
  };
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Joint Ventures" sub="Pool funds with other investors on bigger developments and share the returns." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {V.map((v) => {
          const pct = Math.round((v.raised / v.target) * 100);
          return (
            <Card key={v.id}>
              <div className="row between">
                <div className="row gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--teal-100)', color: 'var(--teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 44px' }}><Icons.users size={22} /></div>
                  <div><div style={{ fontWeight: 800, fontSize: 15 }}>{v.name}</div><div className="muted" style={{ fontSize: 12.5 }}>{v.city}</div></div>
                </div>
                <span className="chip chip-green"><Icons.trending size={13} /> {v.roi}% ROI</span>
              </div>
              <div className="row gap-3" style={{ marginTop: 14 }}>
                <div style={{ flex: 1 }}><Progress value={pct} variant="" /></div>
                <span className="num muted" style={{ fontSize: 12.5, fontWeight: 700 }}>{pct}% raised</span>
              </div>
              <div className="row between" style={{ marginTop: 12 }}>
                <div className="muted" style={{ fontSize: 12.5 }}>Min {D.fmtNaira(v.min)} · {v.months} mo · {v.slots} slots left</div>
                <Btn size="sm" icon={<Icons.plus size={15} />} onClick={() => join(v)}>Join</Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---- New Landlords (ROI showcase) ---- */
function Landlords() {
  const app = window.useApp();
  const D = window.DATA;
  const recent = window.DATA2.leaderboard.slice(0, 4);
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', textAlign: 'center', background: 'linear-gradient(150deg, var(--teal-800), var(--teal-600))', color: '#fff', padding: 'clamp(28px,6vw,44px) 24px' }}>
        <span className="chip" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}>👑 New Landlords</span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(26px,6vw,38px)', fontWeight: 800, marginTop: 14 }}>Watch Your Land ROI Grow</h2>
        <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, marginTop: 10, maxWidth: 400, margin: '10px auto 0' }}>Join hundreds of smart investors already building wealth through land ownership.</p>
        <Btn size="lg" style={{ marginTop: 20, background: '#f6c945', color: '#5a1a10' }} iconR={<Icons.arrowRight size={17} />} onClick={() => app.nav('drops')}>Buy yours now</Btn>
      </div>
      <div className="sec-head"><h3 style={{ fontSize: 16 }}>Newest landlords</h3></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recent.map((r, i) => (
          <Card key={i} style={{ padding: 14 }}>
            <div className="row gap-3">
              <Avatar src={r.avatar} name={r.name} size={42} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>{r.name}</div><div className="muted" style={{ fontSize: 12 }}>{r.badge} · {r.team} sqm owned</div></div>
              <span className="chip chip-green"><Icons.trending size={13} /> +{12 + i * 3}%</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---- Insider Investor ---- */
function InsiderInvestor() {
  const app = window.useApp();
  const I = window.DATA3.insider;
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Insider Investor" sub="Early signals on which estates are heating up — buy before the next price tier." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {I.map((s) => (
          <Card key={s.id}>
            <div className="row between">
              <div className="row gap-2"><span style={{ fontWeight: 800, fontSize: 15 }}>{s.estate}</span></div>
              <span className="chip" style={{ background: s.dir === 'up' ? 'var(--green-50)' : 'var(--surface-sunk)', color: s.dir === 'up' ? 'var(--green-600)' : 'var(--on-surface-mut)' }}>
                {s.dir === 'up' ? <Icons.arrowUp size={13} /> : <Icons.trending size={13} />} {s.signal}
              </span>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>{s.detail}</p>
            <div className="row gap-3" style={{ marginTop: 12 }}>
              <span className="stat-label" style={{ fontSize: 11 }}>Heat</span>
              <div style={{ flex: 1 }}><Progress value={s.heat} variant={s.heat > 80 ? '' : 'green'} /></div>
              <span className="num" style={{ fontWeight: 800, fontSize: 12.5, color: s.heat > 80 ? 'var(--accent)' : 'var(--green-600)' }}>{s.heat}%</span>
            </div>
            <Btn block size="sm" style={{ marginTop: 12 }} icon={<Icons.fire size={15} />} onClick={() => app.nav('drops')}>Buy before next tier</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---- List an Estate ---- */
function ListEstate() {
  const toast = useToast();
  const [sent, setSent] = useState(false);
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="List an Estate" sub="Own land or a development? List it on Channels and reach thousands of buyers." />
      {sent ? (
        <Card style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ width: 60, height: 60, margin: '0 auto', borderRadius: '50%', background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.checkCircle size={32} /></div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 14 }}>Submission received</h3>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>Our acquisitions team will reach out within 48 hours to verify titles and onboard your estate.</p>
        </Card>
      ) : (
        <Card>
          {[['Estate / property name', 'e.g. Sunrise Court'], ['Location', 'City, State'], ['Total size (sqm)', 'e.g. 10000'], ['Title type', 'C of O / Gazette / Deed'], ['Asking price per sqm (₦)', 'e.g. 15000']].map(([l, p]) => (
            <div key={l} style={{ marginBottom: 14 }}>
              <label className="stat-label">{l}</label>
              <input placeholder={p} style={{ width: '100%', marginTop: 8, padding: '13px 15px', borderRadius: 'var(--r-sm)', border: '1px solid var(--hairline)', background: 'var(--surface)', fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }} />
            </div>
          ))}
          <div style={{ padding: 24, borderRadius: 'var(--r-md)', border: '2px dashed var(--hairline)', textAlign: 'center', marginBottom: 8 }}>
            <Icons.arrowUp size={22} style={{ color: 'var(--faint)' }} />
            <div className="muted" style={{ fontSize: 13, marginTop: 6, fontWeight: 700 }}>Upload title documents &amp; photos</div>
          </div>
          <Btn block size="lg" style={{ marginTop: 8 }} icon={<Icons.land size={17} />} onClick={() => { setSent(true); toast('Estate submitted!'); }}>Submit estate</Btn>
        </Card>
      )}
    </div>
  );
}

/* ---- Membership (tiers + Royal Profile) ---- */
function Membership() {
  const app = window.useApp();
  const D = window.DATA;
  const toast = useToast();
  const tiers = window.DATA3.membership;
  const [royal, setRoyal] = useState('Monarch');
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Membership" sub="Upgrade to unlock Instant Trade, lower fees, insider signals and more." />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
        {tiers.map((t) => (
          <Card key={t.id} style={{ position: 'relative', border: t.popular ? '2px solid var(--accent)' : '1px solid var(--hairline)' }}>
            {t.popular && <span className="chip chip-accent" style={{ position: 'absolute', top: -11, left: 18, padding: '3px 10px' }}>Most popular</span>}
            <div className="row gap-2"><span style={{ width: 12, height: 12, borderRadius: '50%', background: t.accent }} /><h3 style={{ fontSize: 17, fontWeight: 800 }}>{t.name}</h3></div>
            <div className="num" style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>{t.price ? D.fmtNaira(t.price) : 'Free'}<span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{t.period}</span></div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {t.perks.map((p) => (
                <div key={p} className="row gap-2" style={{ fontSize: 13, fontWeight: 600 }}><Icons.check size={15} style={{ color: 'var(--green-600)', flex: '0 0 15px' }} /> {p}</div>
              ))}
            </div>
            <Btn block size="lg" variant={t.current ? 'ghost' : t.popular ? 'primary' : 'outline'} disabled={t.current} style={{ marginTop: 16 }}
              onClick={async () => {
                if (app.live && window.API && t.id !== 'free') {
                  try {
                    const r = await window.API.upgradeMembership(t.id.toUpperCase(), 'paystack');
                    if (r.authorizationUrl) { window.location.href = r.authorizationUrl; return; }
                    app.fireConfetti(); toast('Upgraded to ' + t.name + '!'); if (app.reload) await app.reload();
                  } catch (e) { toast(e.message || 'Could not upgrade'); }
                } else { app.fireConfetti(); toast('Upgraded to ' + t.name + '!'); }
              }}>
              {t.current ? 'Current plan' : 'Upgrade'}
            </Btn>
          </Card>
        ))}
      </div>

      {/* Royal Profile */}
      <Card style={{ background: 'linear-gradient(135deg, #f8efd6, var(--surface))' }}>
        <div className="row gap-2"><Icons.trophy size={20} style={{ color: 'var(--gold)' }} /><h3 style={{ fontSize: 17, fontWeight: 800 }}>Royal Profile</h3></div>
        <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>The member holding the most sqm is crowned <b>Monarch</b>. Set how we should address you, should you ever take the throne.</p>
        <div className="row gap-2 wrap" style={{ marginTop: 14 }}>
          {['King', 'Queen', 'Monarch'].map((r) => (
            <button key={r} onClick={() => setRoyal(r)} className="chip clickable" style={{ background: royal === r ? 'var(--gold)' : 'var(--surface-sunk)', color: royal === r ? '#fff' : 'var(--on-surface-mut)', padding: '8px 16px' }}>{r}</button>
          ))}
        </div>
        <Btn block size="lg" style={{ marginTop: 16, background: 'var(--gold)', boxShadow: 'none' }} icon={<Icons.trophy size={16} />} onClick={() => toast('Royal preferences saved 👑')}>Save royal preferences</Btn>
      </Card>
    </div>
  );
}

/* ---- Orders ---- */
function Orders() {
  const app = window.useApp();
  const D = window.DATA;
  const [O, setO] = useState(app.live ? [] : window.DATA3.orders);
  useEffect(() => {
    if (app.live && window.API) window.API.orders().then((r) => {
      const kindMap = { LAND: 'land', GIFTCARD: 'giftcard', MEMBERSHIP: 'land', WALLET_FUNDING: 'payout' };
      const statusMap = { PAID: 'Completed', PENDING: 'Processing', FAILED: 'Failed', CANCELLED: 'Cancelled' };
      const label = (o) => o.kind === 'LAND' ? `${o.sqm || ''} sqm — ${o.estate ? o.estate.name : 'Land'}`
        : o.kind === 'GIFTCARD' ? 'Gift card' : o.kind === 'MEMBERSHIP' ? 'Membership' : 'Wallet funding';
      setO((r.orders || []).map((o) => ({
        id: o.ref, item: label(o), amount: Math.round(o.amount / 100), status: statusMap[o.status] || o.status,
        date: new Date(o.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }), kind: kindMap[o.kind] || 'land',
      })));
    }).catch(() => {});
  }, [app.live]);
  const icon = (k) => k === 'giftcard' ? Icons.gift : k === 'payout' ? Icons.bank : Icons.land;
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Orders" sub="Every purchase, gift card and payout in one place." />
      <Card pad={false}>
        {O.map((o, i) => {
          const Ic = icon(o.kind);
          const done = o.status === 'Completed';
          return (
            <div key={o.id} className="row gap-3" style={{ padding: '14px 18px', borderTop: i ? '1px solid var(--line-2)' : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--surface-sunk)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 40px' }}><Ic size={19} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{o.item}</div>
                <div className="muted font-mono" style={{ fontSize: 11.5 }}>{o.id} · {o.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="num" style={{ fontWeight: 800, fontSize: 14 }}>{D.fmtNaira(o.amount)}</div>
                <span className="chip" style={{ padding: '1px 8px', fontSize: 10.5, background: done ? 'var(--green-50)' : 'var(--surface-sunk)', color: done ? 'var(--green-600)' : 'var(--orange-500)' }}>{o.status}</span>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

Object.assign(window, { Portfolio, P2PMarket, InstantTrade, JointVentures, Landlords, InsiderInvestor, ListEstate, Membership, Orders });
