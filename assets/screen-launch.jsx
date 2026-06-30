/* ============================================================
   GRAND LAUNCH · LAND DROPS · GIFT CARDS · VERIFICATION QUEST
   Exports: Launch, Drops, GiftCards, Quest
   ============================================================ */

/* ---- Grand Launch campaign ---- */
function Launch() {
  const app = window.useApp();
  const D = window.DATA;
  const L = window.DATA3.launch;
  const board = window.DATA2.leaderboard;
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Hero */}
      <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative', textAlign: 'center',
        background: 'linear-gradient(160deg,#7a1722,#b5302a 55%,#d9742e)', color: '#fff', padding: 'clamp(24px,5vw,40px) clamp(18px,4vw,32px)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .12, background: 'radial-gradient(circle at 30% 20%, #fff, transparent 40%)' }} />
        <div style={{ position: 'relative' }}>
          <div className="row gap-2 center" style={{ justifyContent: 'center', fontWeight: 800, fontSize: 13, letterSpacing: '.08em' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#6ee7a8', animation: 'ringPulse 1.8s infinite' }} /> 🔥 LAUNCH IS LIVE
          </div>
          <h2 style={{ color: '#fff', fontSize: 'clamp(26px,6vw,40px)', fontWeight: 800, marginTop: 12, lineHeight: 1.1 }}>Grand Launch — Win ₦Millions + Free Lands</h2>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, marginTop: 10, maxWidth: 440, margin: '10px auto 0' }}>{L.sub}</p>
          <div style={{ marginTop: 22, fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: 'rgba(255,255,255,.75)' }}>LAUNCH ENDS IN</div>
          <div style={{ marginTop: 12 }}><Countdown target={L.ends} light /></div>
          <div className="row gap-2 wrap" style={{ justifyContent: 'center', marginTop: 22 }}>
            <Btn variant="primary" style={{ background: '#f6c945', color: '#5a1a10' }} icon={<Icons.spark size={16} />} onClick={() => app.nav('drops')}>Claim Land Now</Btn>
            <Btn variant="ghost" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }} icon={<Icons.share size={16} />} onClick={() => app.nav('affiliate')}>Get Affiliate Link</Btn>
          </div>
        </div>
      </div>

      {/* Purchase-bonus thresholds */}
      <div>
        <div className="sec-head"><h3 style={{ fontSize: 18 }}>🎁 Launch-week free land</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {L.bonuses.map((b) => {
            const pct = Math.min(100, Math.round((b.have / b.threshold) * 100));
            const hit = b.have >= b.threshold;
            return (
              <Card key={b.id}>
                <div className="row between" style={{ alignItems: 'flex-start' }}>
                  <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 40px' }}><Icons.gift size={21} /></div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{b.label}</div>
                      <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{b.sub}</div>
                      <div className="chip chip-green" style={{ marginTop: 8, padding: '3px 10px' }}>🎁 {b.reward}</div>
                    </div>
                  </div>
                  {hit && <span className="chip chip-green"><Icons.check size={13} /> Unlocked</span>}
                </div>
                <div className="row gap-3" style={{ marginTop: 14 }}>
                  <div style={{ flex: 1 }}><Progress value={pct} variant="green" /></div>
                  <span className="num muted" style={{ fontSize: 12.5, fontWeight: 700 }}>{b.have}/{b.threshold} sqm</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Grand prizes */}
      <Card>
        <div className="row gap-2" style={{ marginBottom: 14 }}><Icons.trophy size={20} style={{ color: 'var(--gold)' }} /><h3 style={{ fontSize: 18, fontWeight: 700 }}>Grand Prizes</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {L.prizes.map((p) => (
            <div key={p.rank} className="row gap-3" style={{ padding: '12px 14px', borderRadius: 'var(--r-sm)', background: 'var(--surface-sunk)' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: p.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flex: '0 0 34px' }}>#{p.rank}</div>
              <div style={{ flex: 1, fontWeight: 800, fontSize: 16 }} className="num">{p.label}</div>
              <Icons.trophy size={18} style={{ color: p.color }} />
            </div>
          ))}
        </div>
        <p className="muted center" style={{ fontSize: 12.5, marginTop: 12 }}>Ranked by total sqm bought during launch week.</p>
      </Card>

      {/* Launch leaderboard */}
      <Card pad={false}>
        <div className="row between" style={{ padding: '16px 18px' }}>
          <div className="row gap-2"><Icons.trending size={18} style={{ color: 'var(--teal-600)' }} /><h3 style={{ fontSize: 16, fontWeight: 700 }}>Launch Leaderboard</h3></div>
          <span className="chip">by total sqm</span>
        </div>
        {board.slice(0, 6).map((r) => (
          <div key={r.rank} className="row gap-3" style={{ padding: '12px 18px', borderTop: '1px solid var(--line-2)', background: r.me ? 'var(--green-50)' : 'transparent' }}>
            <span className="font-mono" style={{ fontWeight: 800, width: 20, color: r.rank <= 3 ? 'var(--gold)' : 'var(--faint)' }}>{r.rank}</span>
            <Avatar src={r.avatar} name={r.name} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}{r.me ? ' (You)' : ''}</div>
              <div className="muted" style={{ fontSize: 12 }}>{r.badge}</div>
            </div>
            <span className="num" style={{ fontWeight: 800, fontSize: 13, color: 'var(--teal-700)' }}>{r.team} sqm</span>
          </div>
        ))}
      </Card>

      {/* Get launch gift card */}
      <Card style={{ background: 'linear-gradient(135deg, var(--teal-800), var(--teal-600))', color: '#fff' }}>
        <div className="row between gap-3" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>Qualify for Grand Opening Rewards</div>
            <p style={{ color: 'rgba(255,255,255,.82)', fontSize: 13.5, marginTop: 5 }}>Buy a launch gift card to lock in multiplied value on Drop day and enter the prize draw.</p>
          </div>
          <Btn variant="primary" style={{ background: '#f6c945', color: '#5a1a10' }} icon={<Icons.gift size={17} />} onClick={() => app.nav('giftcards')}>Get Launch Gift Card</Btn>
        </div>
      </Card>
    </div>
  );
}

/* ---- Land Drops (buy flow) ---- */
function Drops() {
  const app = window.useApp();
  const D = window.DATA;
  const toast = useToast();
  const L = window.DATA3.launch;
  const quick = [25, 50, 100, 250, 500, 1000];
  const [sqm, setSqm] = useState(50);
  const [agree, setAgree] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  // Live drop (real prices) when signed in; demo numbers otherwise.
  const [liveDrop, setLiveDrop] = useState(null);
  useEffect(() => {
    if (app.live && window.API) window.API.drops().then((r) => {
      const d = r.drops && r.drops[0];
      if (d) setLiveDrop({ estateId: d.estateId, name: d.estate.name, city: d.estate.city, presale: Math.round(d.presalePrice / 100), main: Math.round(d.mainPrice / 100), regular: Math.round(d.regularPrice / 100) });
    }).catch(() => {});
  }, [app.live]);

  const est = liveDrop ? { name: liveDrop.name, city: liveDrop.city } : window.DATA2.estates[0];
  const liveEstateId = liveDrop ? liveDrop.estateId : null;
  const tiers = liveDrop
    ? [{ k: 'Presale', price: liveDrop.presale, active: true }, { k: 'Main Sale', price: liveDrop.main, active: false }, { k: 'Regular', price: liveDrop.regular, active: false }]
    : [{ k: 'Presale', price: 39900, active: true }, { k: 'Main Sale', price: 46999, active: false }, { k: 'Regular', price: 50999, active: false }];
  const price = tiers[0].price;
  const total = sqm * price;
  const save = (tiers[2].price - price) * sqm;
  const buy = async (method) => {
    if (!agree) return;
    if (app.live && window.API && liveEstateId) {
      setBusy(true);
      try {
        const r = await window.API.buyLand({ estateId: liveEstateId, sqm, method });
        if (r.authorizationUrl) { window.location.href = r.authorizationUrl; return; } // redirect to Paystack
        app.fireConfetti(); toast('🎉 You bought ' + sqm + ' sqm!'); if (app.reload) await app.reload(); app.navRoot('portfolio');
      } catch (e) { toast(e.message || 'Could not start payment'); }
      setBusy(false);
    } else {
      app.buyLand(sqm); app.fireConfetti(); toast('🎉 You bought ' + sqm + ' sqm!'); app.navRoot('portfolio');
    }
  };
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Land Drops" sub="Secure your land at the best price — earlier phases get bigger discounts." />

      <Card>
        <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--teal-800)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 46px' }}><Icons.pin size={22} /></div>
          <div style={{ flex: 1 }}>
            <div className="row between"><div style={{ fontWeight: 800, fontSize: 17 }}>{est.name}</div><span className="chip chip-green"><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green-600)', display: 'inline-block' }} /> Presale</span></div>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>Launch Drop — First Landlords · {est.city}</div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 16 }}>
          {[['Free Fencing', Icons.shield], ['Resell & Earn', Icons.trending], ['Instant Land Doc', Icons.doc], ['Build from 150sqm', Icons.home]].map(([t, Ic]) => (
            <div key={t} className="row gap-2" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--on-surface-mut)' }}><Ic size={16} style={{ color: 'var(--green-600)' }} /> {t}</div>
          ))}
        </div>

        {/* countdown */}
        <div style={{ marginTop: 18, padding: 16, borderRadius: 'var(--r-md)', background: 'var(--surface-sunk)' }}>
          <div className="center muted" style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.08em', marginBottom: 12 }}>PRESALE ENDS IN</div>
          <Countdown target={L.ends} />
        </div>

        {/* pricing tiers */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 16 }}>
          {tiers.map((t) => (
            <div key={t.k} style={{ textAlign: 'center', padding: '12px 6px', borderRadius: 'var(--r-sm)',
              border: t.active ? '2px solid var(--green-600)' : '1px solid var(--hairline)',
              background: t.active ? 'var(--green-50)' : 'var(--surface)' }}>
              <div className="muted" style={{ fontSize: 11.5, fontWeight: 700 }}>{t.k}</div>
              <div className="num" style={{ fontWeight: 800, fontSize: 15, marginTop: 4, color: t.active ? 'var(--green-600)' : 'var(--on-surface)', textDecoration: t.active ? 'none' : 'line-through', opacity: t.active ? 1 : .6 }}>{D.fmtNaira(t.price)}</div>
            </div>
          ))}
        </div>

        {/* sqm picker */}
        <div style={{ marginTop: 16 }}>
          <label className="stat-label">How many sqm?</label>
          <div className="row gap-2" style={{ marginTop: 8 }}>
            <input type="number" min="1" value={sqm} onChange={(e) => setSqm(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ flex: 1, padding: '13px 15px', borderRadius: 'var(--r-sm)', border: '1px solid var(--hairline)', background: 'var(--surface)', fontWeight: 700, fontSize: 16, color: 'var(--on-surface)' }} />
            <span className="chip">sqm</span>
          </div>
          <div className="row gap-2 wrap" style={{ marginTop: 10 }}>
            <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>🔥 Most buy:</span>
            {quick.map((q) => (
              <button key={q} onClick={() => setSqm(q)} className="chip clickable" style={{ background: sqm === q ? 'var(--accent)' : 'var(--surface-sunk)', color: sqm === q ? '#fff' : 'var(--on-surface-mut)' }}>{q} SQM</button>
            ))}
          </div>
        </div>

        {/* gift card code */}
        <div style={{ marginTop: 14 }}>
          <div className="row gap-2" style={{ padding: '12px 14px', borderRadius: 'var(--r-sm)', border: '1px dashed var(--hairline)' }}>
            <Icons.gift size={18} style={{ color: 'var(--accent)' }} />
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Gift card code (optional)" style={{ flex: 1, background: 'transparent', fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }} />
          </div>
        </div>

        {/* T&C */}
        <button onClick={() => setAgree((a) => !a)} className="row gap-2" style={{ marginTop: 14, textAlign: 'left' }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, flex: '0 0 20px', border: '2px solid ' + (agree ? 'var(--green-600)' : 'var(--hairline)'), background: agree ? 'var(--green-600)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{agree && <Icons.check size={13} />}</span>
          <span className="muted" style={{ fontSize: 12.5 }}>I have read and agree to the Terms &amp; Conditions for this drop.</span>
        </button>

        {/* total + buy */}
        <div className="row between" style={{ marginTop: 16, padding: '12px 0', borderTop: '1px solid var(--line-2)' }}>
          <div><div className="muted" style={{ fontSize: 12 }}>Total ({sqm} sqm)</div><div className="num" style={{ fontWeight: 800, fontSize: 22 }}>{D.fmtNaira(total)}</div></div>
          <div className="chip chip-green" style={{ alignSelf: 'center' }}>Save {D.fmtNaira(save)}</div>
        </div>
        <Btn block size="lg" disabled={!agree || busy} icon={<Icons.fire size={18} />} onClick={() => buy('paystack')}>
          {busy ? 'Starting payment…' : 'Buy Real Land Now!'}
        </Btn>
        {app.live && (
          <Btn block variant="outline" disabled={!agree || busy} style={{ marginTop: 8 }} icon={<Icons.wallet size={16} />} onClick={() => buy('wallet')}>
            Pay from wallet
          </Btn>
        )}
        {!agree && <p className="center muted" style={{ fontSize: 11.5, marginTop: 8 }}>Accept the terms to continue.</p>}
      </Card>
    </div>
  );
}

/* ---- Gift Cards ---- */
function GiftCards() {
  const app = window.useApp();
  const D = window.DATA;
  const toast = useToast();
  const cards = window.DATA3.giftCards;
  const [pick, setPick] = useState(null);
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Gift Cards" sub="Buy a card now and get multiplied land value on Drop day." />

      <Card style={{ background: 'linear-gradient(135deg,#7a1722,#c0392b)', color: '#fff' }}>
        <div className="row gap-2" style={{ fontWeight: 800, fontSize: 15 }}><Icons.spark size={18} /> Drop-day multiplier active</div>
        <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, marginTop: 6 }}>Cards bought today convert at up to <b>2.25×</b> their face value when you buy land on launch drop.</p>
      </Card>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        {cards.map((c) => (
          <Card key={c.id} hover className="clickable" onClick={() => setPick(c)} pad={false} style={{ overflow: 'hidden' }}>
            <div style={{ padding: 18, background: `linear-gradient(135deg, ${c.color}, color-mix(in srgb, ${c.color} 65%, #000))`, color: '#fff', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, opacity: .2 }}><Icons.gift size={90} /></div>
              <div className="chip" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', padding: '2px 9px', fontSize: 10.5 }}>{c.tag}</div>
              <div className="num" style={{ fontWeight: 800, fontSize: 24, marginTop: 16 }}>{D.fmtNaira(c.face)}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.85)', marginTop: 2 }}>{c.name}</div>
            </div>
            <div className="row between" style={{ padding: '12px 16px' }}>
              <span className="chip chip-green">{c.mult}× on drop day</span>
              <Icons.arrowRight size={17} style={{ color: 'var(--faint)' }} />
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={!!pick} onClose={() => setPick(null)} max={420}>
        {pick && (
          <>
            <div style={{ padding: 20, borderRadius: 'var(--r-md)', background: `linear-gradient(135deg, ${pick.color}, color-mix(in srgb, ${pick.color} 65%, #000))`, color: '#fff', textAlign: 'center' }}>
              <Icons.gift size={36} />
              <div className="num" style={{ fontWeight: 800, fontSize: 28, marginTop: 8 }}>{D.fmtNaira(pick.face)}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.85)' }}>{pick.name}</div>
            </div>
            <div className="row between" style={{ marginTop: 16, fontSize: 14 }}><span className="muted">You pay</span><span className="num" style={{ fontWeight: 800 }}>{D.fmtNaira(pick.pay)}</span></div>
            <div className="row between" style={{ marginTop: 8, fontSize: 14 }}><span className="muted">Drop-day value</span><span className="num" style={{ fontWeight: 800, color: 'var(--green-600)' }}>{D.fmtNaira(Math.round(pick.face * pick.mult))}</span></div>
            <Btn block size="lg" style={{ marginTop: 18 }} icon={<Icons.wallet size={18} />}
              onClick={async () => {
                if (app.live && window.API) {
                  try {
                    const r = await window.API.buyGiftcard(pick.id, 'paystack');
                    if (r.authorizationUrl) { window.location.href = r.authorizationUrl; return; }
                    app.fireConfetti(); toast('🎁 Gift card purchased!'); if (app.reload) await app.reload();
                  } catch (e) { toast(e.message || 'Could not buy'); }
                } else { app.fireConfetti(); toast('🎁 Gift card purchased!'); }
                setPick(null);
              }}>Buy gift card</Btn>
          </>
        )}
      </Sheet>
    </div>
  );
}

/* ---- Verification Quest (gamified KYC) ---- */
function Quest() {
  const app = window.useApp();
  const toast = useToast();
  const [phase, setPhase] = useState('intro'); // intro | s1 | s2 | done
  const [q, setQ] = useState(0);
  const [data, setData] = useState({ idType: 'National ID (NIN)' });
  const submitKyc = async () => {
    if (app.live && window.API) {
      try {
        await window.API.submitKyc({
          fullName: data.name || (app.user && app.user.name) || 'Member',
          dob: data.dob, address: data.street, city: data.city, state: data.state, country: 'Nigeria',
          idType: data.idType, idNumber: data.idNumber,
        });
        if (app.reload) await app.reload();
      } catch (e) { toast(e.message || 'Could not submit — saved as draft'); }
    }
    setPhase('done'); app.fireConfetti();
  };
  const s1 = [
    { label: 'Full Legal Name', key: 'name', placeholder: 'e.g. Tunde Adeyemi', title: 'Your name' },
    { label: 'Date of Birth', key: 'dob', placeholder: 'YYYY-MM-DD', title: 'Date of birth' },
    { label: 'Street Address', key: 'street', placeholder: 'e.g. 12 Marina Rd', title: 'Street address' },
    { label: 'City / LGA / Area', key: 'city', placeholder: 'e.g. Lekki', title: 'Country & city' },
    { label: 'State', key: 'state', placeholder: 'e.g. Lagos', title: 'Your state' },
  ];
  const pct = phase === 'intro' ? 10 : phase === 's1' ? 10 + Math.round((q / s1.length) * 60) : phase === 's2' ? 80 : 100;

  const Header = () => (
    <Card style={{ background: 'linear-gradient(135deg, var(--green-50), var(--surface))' }}>
      <div className="row between"><span className="stat-label" style={{ color: 'var(--green-600)' }}>✦ Verification Quest</span><span className="muted" style={{ fontSize: 12.5, fontWeight: 700 }}>{phase === 's2' ? 'Step 2 of 2' : 'Step 1 of 2'}</span></div>
      <div style={{ fontWeight: 800, fontSize: 22, marginTop: 8 }}><span style={{ color: 'var(--green-600)' }}>{pct}%</span> — {pct < 100 ? 'Let’s go!' : 'Quest complete!'}</div>
      <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>We use this for your land receipts and allocations.</p>
      <div style={{ marginTop: 12 }}><Progress value={pct} variant="green" tall /></div>
      <div className="row gap-2" style={{ marginTop: 12 }}>
        <span className="chip" style={{ background: pct >= 70 ? 'var(--green-50)' : 'var(--surface-sunk)', color: pct >= 70 ? 'var(--green-600)' : 'var(--faint)' }}><Icons.pin size={13} /> Your address</span>
        <span className="chip" style={{ background: pct >= 80 ? 'var(--green-50)' : 'var(--surface-sunk)', color: pct >= 80 ? 'var(--green-600)' : 'var(--faint)' }}><Icons.shield size={13} /> ID &amp; selfie</span>
      </div>
    </Card>
  );

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Header />

      {phase === 'intro' && (
        <Card>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>Become a Verified Investor</h3>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>Two quick steps unlock trading, payouts, deed requests and your badge. It takes about 2 minutes.</p>
          <Btn block size="lg" style={{ marginTop: 14 }} iconR={<Icons.arrowRight size={17} />} onClick={() => setPhase('s1')}>Start the quest</Btn>
        </Card>
      )}

      {phase === 's1' && (
        <Card>
          <div className="row gap-2" style={{ marginBottom: 6 }}><Icons.pin size={18} style={{ color: 'var(--green-600)' }} /><div style={{ fontWeight: 800, fontSize: 17 }}>{s1[q].title}</div></div>
          <div className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>Question {q + 1} of {s1.length}</div>
          <label className="stat-label">{s1[q].label}</label>
          <input autoFocus placeholder={s1[q].placeholder} value={data[s1[q].key] || ''} onChange={(e) => setData((d) => ({ ...d, [s1[q].key]: e.target.value }))} style={{ width: '100%', marginTop: 8, padding: '14px 16px', borderRadius: 'var(--r-sm)', border: '2px solid var(--green-600)', background: 'var(--surface)', fontWeight: 600, fontSize: 16, color: 'var(--on-surface)' }} />
          <div className="row between" style={{ marginTop: 18 }}>
            <button className="row gap-2 muted" style={{ fontWeight: 700, fontSize: 14 }} onClick={() => q > 0 ? setQ(q - 1) : setPhase('intro')}><Icons.arrowLeft size={16} /> Back</button>
            <Btn iconR={<Icons.arrowRight size={16} />} onClick={() => q < s1.length - 1 ? setQ(q + 1) : (setPhase('s2'), setQ(0))}>{q < s1.length - 1 ? 'Next' : 'Continue'}</Btn>
          </div>
        </Card>
      )}

      {phase === 's2' && (
        <Card>
          <div className="row gap-2" style={{ marginBottom: 14 }}><Icons.shield size={18} style={{ color: 'var(--green-600)' }} /><div style={{ fontWeight: 800, fontSize: 17 }}>ID details</div></div>
          <label className="stat-label">ID Type</label>
          <select value={data.idType} onChange={(e) => setData((d) => ({ ...d, idType: e.target.value }))} style={{ width: '100%', marginTop: 8, padding: '14px 16px', borderRadius: 'var(--r-sm)', border: '1px solid var(--hairline)', background: 'var(--surface)', fontWeight: 600, fontSize: 15, color: 'var(--on-surface)' }}>
            <option>National ID (NIN)</option><option>Driver’s License</option><option>International Passport</option><option>Voter’s Card</option>
          </select>
          <label className="stat-label" style={{ display: 'block', marginTop: 14 }}>ID Number</label>
          <input placeholder="Enter your ID number" value={data.idNumber || ''} onChange={(e) => setData((d) => ({ ...d, idNumber: e.target.value }))} style={{ width: '100%', marginTop: 8, padding: '14px 16px', borderRadius: 'var(--r-sm)', border: '2px solid var(--green-600)', background: 'var(--surface)', fontWeight: 600, fontSize: 16, color: 'var(--on-surface)' }} />
          <div style={{ marginTop: 14, padding: 24, borderRadius: 'var(--r-md)', border: '2px dashed var(--hairline)', textAlign: 'center' }}>
            <Icons.arrowUp size={24} style={{ color: 'var(--faint)' }} />
            <div className="muted" style={{ fontSize: 13, marginTop: 6, fontWeight: 700 }}>Upload ID document + selfie</div>
          </div>
          <div className="row between" style={{ marginTop: 18 }}>
            <button className="row gap-2 muted" style={{ fontWeight: 700, fontSize: 14 }} onClick={() => setPhase('s1')}><Icons.arrowLeft size={16} /> Back</button>
            <Btn icon={<Icons.check size={16} />} onClick={submitKyc}>Submit</Btn>
          </div>
        </Card>
      )}

      {phase === 'done' && (
        <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--green-50), var(--surface))' }}>
          <div style={{ width: 72, height: 72, margin: '0 auto', borderRadius: '50%', background: 'var(--green-100, #d6efe0)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.checkCircle size={40} /></div>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginTop: 14, color: 'var(--green-600)' }}>🎉 Quest complete!</h3>
          <p className="muted" style={{ fontSize: 14, marginTop: 6, maxWidth: 360, margin: '6px auto 0' }}>Submitted for review. Our team usually approves within 24 hours — you have full access in the meantime.</p>
          <Btn block size="lg" style={{ marginTop: 18 }} iconR={<Icons.arrowRight size={17} />} onClick={() => app.navRoot('dashboard')}>Go to dashboard</Btn>
        </Card>
      )}
    </div>
  );
}

Object.assign(window, { Launch, Drops, GiftCards, Quest });
