/* ============================================================
   MARKETPLACE · ESTATE DETAIL · PLOT PICKER · CHECKOUT
   ============================================================ */
function Marketplace() {
  const app = window.useApp();
  const D = window.DATA;
  const E = window.DATA2.estates;
  const [filter, setFilter] = useState('all');
  const filters = [['all', 'All'], ['Lagos', 'Lagos'], ['Abuja', 'Abuja'], ['Ogun', 'Ogun']];
  const list = E.filter((e) => filter === 'all' ? true : e.city.includes(filter));
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Marketplace" sub="Browse verified estates and own land by the square metre." />
      <div className="row gap-2 wrap">
        {filters.map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className="chip clickable" style={{ padding: '8px 16px', background: filter === v ? 'var(--primary)' : 'var(--surface-sunk)', color: filter === v ? 'var(--primary-ink)' : 'var(--on-surface-mut)' }}>{l}</button>
        ))}
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
        {list.map((e) => {
          const sold = Math.round(((e.total - e.available) / e.total) * 100);
          return (
            <Card key={e.id} pad={false} hover className="clickable" onClick={() => app.nav('estate', { id: e.id })} style={{ overflow: 'hidden' }}>
              <LandPlaceholder h={150} radius="0">
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(43,86,102,.2), rgba(43,86,102,.55))' }} />
                <div style={{ position: 'absolute', top: 12, left: 12 }}><span className="chip chip-accent" style={{ background: 'rgba(255,255,255,.92)' }}>{e.tag}</span></div>
                <div style={{ position: 'absolute', bottom: 12, right: 12 }}><span className="chip chip-green" style={{ background: 'rgba(255,255,255,.92)' }}><Icons.trending size={12} /> +{e.appr}%/yr</span></div>
              </LandPlaceholder>
              <div style={{ padding: 18 }}>
                <div className="row between" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>{e.name}</div>
                    <div className="row gap-2 muted" style={{ fontSize: 13, marginTop: 2 }}><Icons.pin size={13} /> {e.city}</div>
                  </div>
                  <span className="chip chip-teal" style={{ padding: '3px 9px', fontSize: 11 }}><Icons.shield size={12} /> {e.title}</span>
                </div>
                <div className="row between" style={{ marginTop: 14, marginBottom: 8 }}>
                  <span className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{e.available.toLocaleString()} sqm left</span>
                  <span className="num" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--accent)' }}>{sold}% sold</span>
                </div>
                <Progress value={sold} />
                <div className="row between" style={{ marginTop: 16 }}>
                  <div><span className="num font-display" style={{ fontSize: 20, fontWeight: 800 }}>{D.fmtNaira(e.priceSqm)}</span><span className="muted" style={{ fontSize: 12 }}>/sqm</span></div>
                  <Btn size="sm" iconR={<Icons.arrowRight size={15} />}>View</Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function EstateDetail() {
  const app = window.useApp();
  const D = window.DATA;
  const e = window.DATA2.estates.find((x) => x.id === (app.param?.id || 'gardens')) || window.DATA2.estates[0];
  const sold = Math.round(((e.total - e.available) / e.total) * 100);
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <LandPlaceholder h={230} radius="var(--r-xl)" label="">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(27,58,70,.5), rgba(43,86,102,.7))' }} />
        <div style={{ position: 'relative', width: '100%', padding: 24, color: '#fff', alignSelf: 'flex-end' }}>
          <span className="chip chip-accent" style={{ background: 'rgba(255,255,255,.92)', marginBottom: 12 }}>{e.tag} · {e.title} verified</span>
          <div className="font-display" style={{ fontSize: 'clamp(26px,5vw,34px)', fontWeight: 800 }}>{e.name}</div>
          <div className="row gap-2" style={{ color: 'rgba(255,255,255,.88)', fontSize: 14, marginTop: 4 }}><Icons.pin size={15} /> {e.city}</div>
        </div>
      </LandPlaceholder>

      <div className="grid d-grid-2" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>About this estate</h3>
            <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>{e.blurb}</p>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10, marginTop: 16 }}>
              {e.amen.map((a) => (
                <div key={a} className="row gap-2" style={{ fontSize: 13.5, fontWeight: 600 }}><Icons.checkCircle size={16} style={{ color: 'var(--green-600)' }} /> {a}</div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Location</h3>
            <LandPlaceholder h={160} label="estate map · drop site plan">
              <div style={{ textAlign: 'center' }}>
                <Icons.pin size={30} style={{ color: 'var(--teal-600)' }} />
                <div className="font-mono" style={{ fontSize: 11, color: 'var(--teal-600)', fontWeight: 600, marginTop: 6 }}>{e.city}</div>
              </div>
            </LandPlaceholder>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div className="stat-label">Price per sqm</div>
            <div className="font-display num" style={{ fontSize: 30, fontWeight: 800, margin: '4px 0' }}>{D.fmtNaira(e.priceSqm)}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>≈ {D.fmtUSD(e.priceSqm / D.USD_RATE)} · own from 1 sqm</div>
            <hr className="hr" style={{ margin: '16px 0' }} />
            <div className="row between" style={{ fontSize: 12.5, marginBottom: 8 }}>
              <span className="muted" style={{ fontWeight: 600 }}>{e.available.toLocaleString()} / {e.total.toLocaleString()} sqm left</span>
              <span className="num" style={{ fontWeight: 700, color: 'var(--accent)' }}>{sold}% sold</span>
            </div>
            <Progress value={sold} />
            <Btn block size="lg" style={{ marginTop: 18 }} onClick={() => app.nav('plotpicker', { id: e.id })} icon={<Icons.land />}>Choose your plot</Btn>
            <Btn block variant="outline" style={{ marginTop: 10 }} onClick={() => app.nav('events')} icon={<Icons.clock size={16} />}>Book a site tour</Btn>
          </Card>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 44px' }}><Icons.shield size={22} /></div>
            <div style={{ fontSize: 13 }}><strong>{e.title} verified</strong><div className="muted" style={{ fontSize: 12 }}>Title, survey & deed available</div></div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlotPicker() {
  const app = window.useApp();
  const D = window.DATA;
  const e = window.DATA2.estates.find((x) => x.id === (app.param?.id || 'gardens')) || window.DATA2.estates[0];
  const [sel, setSel] = useState(new Set([12, 13, 22, 23]));
  const COLS = 10, ROWS = 6;
  const taken = new Set([0,1,2,5,8,9,15,18,30,31,44,55,56,57]);
  const sqm = sel.size * 25; // each cell = 25 sqm
  const price = sqm * e.priceSqm;
  const toggle = (i) => { if (taken.has(i)) return; setSel((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; }); };
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title={'Choose your plot — ' + e.name} sub="Tap parcels to build your holding. Each parcel is 25 sqm." />
      <div className="grid d-grid-2" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <Card>
          <div className="row gap-3 wrap" style={{ marginBottom: 16, fontSize: 12.5, fontWeight: 600 }}>
            <span className="row gap-2"><span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--surface-sunk)', border: '1px solid var(--hairline)' }} /> Available</span>
            <span className="row gap-2"><span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--accent)' }} /> Selected</span>
            <span className="row gap-2"><span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--teal-200)' }} /> Taken</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 5, padding: 12, background: 'var(--surface-sunk)', borderRadius: 14,
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(43,86,102,.04) 8px, rgba(43,86,102,.04) 9px)' }}>
            {Array.from({ length: COLS * ROWS }).map((_, i) => {
              const isTaken = taken.has(i), isSel = sel.has(i);
              return <button key={i} onClick={() => toggle(i)} style={{ aspectRatio: '1', borderRadius: 5, cursor: isTaken ? 'not-allowed' : 'pointer',
                background: isSel ? 'var(--accent)' : isTaken ? 'var(--teal-200)' : 'var(--surface)', border: '1px solid', borderColor: isSel ? 'var(--accent)' : 'var(--hairline)',
                transition: 'all .12s', transform: isSel ? 'scale(1.04)' : 'none' }} />;
            })}
          </div>
          <div className="muted center" style={{ fontSize: 12, marginTop: 10 }}>Plan view · Phase 1 · {e.name}</div>
        </Card>
        <Card style={{ position: 'sticky', top: 90, alignSelf: 'flex-start' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Your selection</h3>
          <div className="row between" style={{ marginTop: 16 }}><span className="muted" style={{ fontWeight: 600 }}>Parcels</span><span className="num" style={{ fontWeight: 700 }}>{sel.size}</span></div>
          <div className="row between" style={{ marginTop: 10 }}><span className="muted" style={{ fontWeight: 600 }}>Total land</span><span className="num font-display" style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent)' }}>{sqm} sqm</span></div>
          <div className="row between" style={{ marginTop: 10 }}><span className="muted" style={{ fontWeight: 600 }}>Price/sqm</span><span className="num">{D.fmtNaira(e.priceSqm)}</span></div>
          <hr className="hr" style={{ margin: '16px 0' }} />
          <div className="row between"><span style={{ fontWeight: 700 }}>Total</span><span className="num font-display" style={{ fontWeight: 800, fontSize: 22 }}>{D.fmtNaira(price)}</span></div>
          <Btn block size="lg" style={{ marginTop: 16 }} disabled={sel.size === 0} onClick={() => app.nav('checkout', { sqm, price, estate: e.name })} iconR={<Icons.arrowRight />}>Continue to pay</Btn>
        </Card>
      </div>
    </div>
  );
}

function Checkout() {
  const app = window.useApp();
  const D = window.DATA;
  const toast = useToast();
  const p = app.param || { sqm: 100, price: 1200000, estate: 'Channels Gardens' };
  const [method, setMethod] = useState(0);
  const [step, setStep] = useState(0); // 0 review, 1 processing, 2 done
  const methods = [['Flutterwave', Icons.bolt], ['Debit card', Icons.card], ['Bank transfer', Icons.bank], ['Wallet balance', Icons.wallet]];
  const pay = () => { setStep(1); setTimeout(() => { app.buyLand(p.sqm); setStep(2); app.fireConfetti(); }, 2100); };

  if (step === 2) return (
    <div className="reveal center" style={{ maxWidth: 460, margin: '0 auto', paddingTop: 30 }}>
      <div style={{ width: 96, height: 96, borderRadius: '50%', margin: '0 auto 22px', background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spinIn .6s var(--spring)' }}><Icons.checkCircle size={54} /></div>
      <h2 style={{ fontSize: 28, fontWeight: 800 }}>You're a bigger owner! 🎉</h2>
      <p className="muted" style={{ fontSize: 15.5, marginTop: 10 }}>{p.sqm} sqm in {p.estate} has been added to your holdings. Your allocation letter is on the way.</p>
      <div className="row gap-2" style={{ justifyContent: 'center', marginTop: 24 }}>
        <Btn onClick={() => app.navRoot('milestones')} icon={<Icons.land />}>View my land</Btn>
        <Btn variant="outline" onClick={() => app.navRoot('docs')} icon={<Icons.doc size={16} />}>Documents</Btn>
      </div>
    </div>
  );

  return (
    <div className="reveal" style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Order summary</h3>
        <div className="row between" style={{ fontSize: 14, marginBottom: 10 }}><span className="muted" style={{ fontWeight: 600 }}>Estate</span><span style={{ fontWeight: 700 }}>{p.estate}</span></div>
        <div className="row between" style={{ fontSize: 14, marginBottom: 10 }}><span className="muted" style={{ fontWeight: 600 }}>Land</span><span className="num" style={{ fontWeight: 700 }}>{p.sqm} sqm</span></div>
        <div className="row between" style={{ fontSize: 14 }}><span className="muted" style={{ fontWeight: 600 }}>Documentation</span><span className="num" style={{ fontWeight: 700 }}>{D.fmtNaira(15000)}</span></div>
        <hr className="hr" style={{ margin: '14px 0' }} />
        <div className="row between"><span style={{ fontWeight: 700 }}>Total</span><span className="num font-display" style={{ fontWeight: 800, fontSize: 24 }}>{D.fmtNaira(p.price + 15000)}</span></div>
      </Card>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Payment method</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {methods.map(([m, Ic], i) => (
            <button key={m} onClick={() => setMethod(i)} className="row gap-3" style={{ padding: 14, borderRadius: 14, border: '1.5px solid', borderColor: method === i ? 'var(--accent)' : 'var(--hairline)', background: method === i ? 'var(--orange-50)' : 'var(--surface)', textAlign: 'left' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: method === i ? 'var(--accent)' : 'var(--surface-sunk)', color: method === i ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 40px' }}><Ic size={20} /></div>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 14.5 }}>{m}</span>
              {method === i ? <Icons.checkCircle size={20} style={{ color: 'var(--accent)' }} /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--hairline)' }} />}
            </button>
          ))}
        </div>
      </Card>
      <Btn block size="lg" disabled={step === 1} onClick={pay} icon={step === 1 ? null : <Icons.lock size={17} />}>
        {step === 1 ? 'Processing…' : `Pay ${D.fmtNaira(p.price + 15000)}`}
      </Btn>
      <p className="center muted" style={{ fontSize: 12 }}><Icons.shield size={12} style={{ verticalAlign: -2 }} /> Secured by Flutterwave · 256-bit encryption</p>
    </div>
  );
}

Object.assign(window, { Marketplace, EstateDetail, PlotPicker, Checkout });
