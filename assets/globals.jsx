/* ============================================================
   GLOBAL SLICK UI — promo banner, floating widgets, countdown
   Exports: useCountdown, PromoBanner, TopAffiliatesFab, SupportFab,
            LaunchDashCard, VerifiedInvestorCard, Countdown
   ============================================================ */

/* ---- Live countdown hook ---- */
function useCountdown(target) {
  const calc = () => {
    const ms = Math.max(0, target - Date.now());
    return {
      d: Math.floor(ms / 86400000),
      h: Math.floor((ms % 86400000) / 3600000),
      m: Math.floor((ms % 3600000) / 60000),
      s: Math.floor((ms % 60000) / 1000),
      done: ms <= 0,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

/* ---- Countdown flip display ---- */
function Countdown({ target, light }) {
  const t = useCountdown(target);
  const cell = (v, l) => (
    <div style={{ textAlign: 'center' }}>
      <div className="font-mono" style={{
        fontSize: 'clamp(20px,5vw,30px)', fontWeight: 800, lineHeight: 1,
        background: light ? 'rgba(255,255,255,.16)' : 'var(--surface-sunk)',
        color: light ? '#fff' : 'var(--on-surface)',
        borderRadius: 12, padding: '12px 6px', minWidth: 58 }}>
        {String(v).padStart(2, '0')}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', marginTop: 7,
        color: light ? 'rgba(255,255,255,.7)' : 'var(--on-surface-mut)' }}>{l}</div>
    </div>
  );
  const sep = <div style={{ fontWeight: 800, fontSize: 22, color: light ? 'rgba(255,255,255,.5)' : 'var(--faint)', alignSelf: 'flex-start', marginTop: 12 }}>:</div>;
  return (
    <div className="row" style={{ gap: 8, justifyContent: 'center' }}>
      {cell(t.d, 'DAYS')}{sep}{cell(t.h, 'HRS')}{sep}{cell(t.m, 'MIN')}{sep}{cell(t.s, 'SEC')}
    </div>
  );
}

/* ---- Top promo banner (dismissible, live launch) ---- */
function PromoBanner() {
  const app = window.useApp();
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const B = window.DATA3.banners;
  return (
    <div className="promo-banner" style={{ position: 'relative', zIndex: 30 }}>
      {B.map((b, i) => (
        <div key={b.id} className="row" style={{
          gap: 10, padding: '9px 14px',
          background: b.kind === 'hot'
            ? 'linear-gradient(90deg,#20414d,#2b5666,#20414d)'
            : 'linear-gradient(90deg,#bd6222,#d9742e,#bd6222)',
          color: '#fff', fontWeight: 800, fontSize: 13 }}>
          <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.text}</span>
          <button onClick={() => app.navRoot(b.to)} style={{
            background: b.kind === 'hot' ? '#f6c945' : 'rgba(255,255,255,.18)',
            color: b.kind === 'hot' ? '#5a1a10' : '#fff',
            borderRadius: 999, padding: '5px 13px', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap',
            display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icons.spark size={13} /> {b.cta}
          </button>
          {i === B.length - 1 && (
            <button onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,.85)', display: 'flex' }}><Icons.close size={17} /></button>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---- Floating "Top Affiliates" widget (bottom-left) ---- */
function TopAffiliatesFab() {
  const app = window.useApp();
  const [open, setOpen] = useState(false);
  const list = window.DATA3.topAffiliates;
  return (
    <div style={{ position: 'fixed', left: 14, bottom: 'calc(78px + env(safe-area-inset-bottom))', zIndex: 40 }} className="ta-fab">
      {open && (
        <Card className="reveal" pad={false} style={{ width: 260, marginBottom: 10, overflow: 'hidden', boxShadow: 'var(--sh-lg, 0 20px 50px rgba(0,0,0,.22))' }}>
          <div className="row between" style={{ padding: '12px 14px', borderBottom: '1px solid var(--line-2)' }}>
            <div className="row gap-2" style={{ fontWeight: 800, fontSize: 14 }}><Icons.trophy size={16} style={{ color: 'var(--gold)' }} /> Top Affiliates</div>
            <span className="chip chip-gold" style={{ padding: '2px 8px', fontSize: 10.5 }}>Live</span>
          </div>
          {list.map((a, i) => (
            <div key={i} className="row gap-3" style={{ padding: '10px 14px', borderTop: i ? '1px solid var(--line-2)' : 'none' }}>
              <span className="font-mono" style={{ fontWeight: 800, width: 18, color: i < 3 ? 'var(--gold)' : 'var(--faint)' }}>{i + 1}</span>
              <Avatar src={a.avatar} name={a.name} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div></div>
              <span className="num" style={{ fontWeight: 800, fontSize: 12.5, color: 'var(--teal-700)' }}>{a.sqm} sqm</span>
            </div>
          ))}
          <button onClick={() => { setOpen(false); app.navRoot('leaderboard'); }} className="center" style={{ width: '100%', padding: 11, fontWeight: 800, fontSize: 13, color: 'var(--accent)', borderTop: '1px solid var(--line-2)' }}>View full leaderboard →</button>
        </Card>
      )}
      <button onClick={() => setOpen((o) => !o)} className="row gap-2" style={{
        background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 999,
        padding: '9px 15px', fontWeight: 800, fontSize: 13.5, color: 'var(--on-surface)',
        boxShadow: '0 8px 24px rgba(0,0,0,.14)' }}>
        <Icons.trophy size={16} style={{ color: 'var(--gold)' }} /> Top Affiliates
        {open ? <Icons.chevD size={15} /> : <Icons.chevR size={15} style={{ transform: 'rotate(-90deg)' }} />}
      </button>
    </div>
  );
}

/* ---- Floating support chat (bottom-right) ---- */
function SupportFab() {
  const app = window.useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const quick = ['How do I buy land?', 'Track my KYC', 'Withdrawal help', 'Talk to a human'];
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Support" style={{
        position: 'fixed', right: 16, bottom: 'calc(82px + env(safe-area-inset-bottom))', zIndex: 40,
        width: 58, height: 58, borderRadius: '50%', background: 'var(--teal-700)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 12px 30px color-mix(in srgb, var(--teal-700) 50%, transparent)' }}>
        <Icons.whatsapp size={26} />
        <span style={{ position: 'absolute', top: 4, right: 6, width: 11, height: 11, borderRadius: '50%', background: 'var(--gold)', border: '2px solid var(--teal-700)' }} />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} max={460}>
        <div className="row gap-3" style={{ marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--teal-50)', color: 'var(--teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.whatsapp size={24} /></div>
          <div><div style={{ fontWeight: 800, fontSize: 17 }}>Channels Support</div><div className="muted" style={{ fontSize: 13 }}>Typically replies in a few minutes</div></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {quick.map((q) => (
            <button key={q} onClick={() => { setOpen(false); toast('Support: we’re on it! 💬'); }} className="row between" style={{ padding: '13px 15px', background: 'var(--surface-sunk)', borderRadius: 'var(--r-sm)', fontWeight: 700, fontSize: 14, textAlign: 'left' }}>
              {q} <Icons.chevR size={16} style={{ color: 'var(--faint)' }} />
            </button>
          ))}
        </div>
        <Btn block size="lg" style={{ marginTop: 14 }} icon={<Icons.whatsapp size={18} />} onClick={() => { setOpen(false); toast('Opening WhatsApp…'); }}>Chat on WhatsApp</Btn>
      </Sheet>
    </>
  );
}

/* ---- Verified Investor progress (gamified KYC) ---- */
function VerifiedInvestorCard({ compact }) {
  const app = window.useApp();
  const steps = [
    { k: 'Account created', done: true },
    { k: 'Phone verified', done: true },
    { k: 'Lite KYC submitted', done: app.user.kyc },
    { k: 'Full ID verified', done: app.user.kyc },
  ];
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);
  const verified = pct === 100;
  return (
    <Card style={{ background: verified ? 'linear-gradient(135deg, var(--green-50), var(--surface))' : 'var(--surface)' }}>
      <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, flex: '0 0 46px', background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.shield size={24} /></div>
        <div style={{ flex: 1 }}>
          <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: verified ? 'var(--green-600)' : 'var(--on-surface)' }}>
              {verified ? '✦ Verified Investor' : `${100 - pct}% left to become Verified Investor`}
            </span>
          </div>
          <p className="muted" style={{ fontSize: 13, marginTop: 5 }}>
            {verified ? 'Trading, payouts, deed requests and your badge are unlocked.' : 'Complete KYC to unlock trading, payouts, deed requests and the Verified Investor badge.'}
          </p>
        </div>
        <span className="num" style={{ fontWeight: 800, color: 'var(--green-600)' }}>{pct}%</span>
      </div>
      <div style={{ marginTop: 14 }}><Progress value={pct} variant="green" /></div>
      {!compact && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 14 }}>
          {steps.map((s) => (
            <div key={s.k} className="row gap-2" style={{ fontSize: 12.5, fontWeight: 700, color: s.done ? 'var(--green-600)' : 'var(--faint)' }}>
              {s.done ? <Icons.checkCircle size={15} /> : <span style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--hairline)', display: 'inline-block' }} />}
              {s.k}
            </div>
          ))}
        </div>
      )}
      {!verified && <Btn block size="lg" style={{ marginTop: 14 }} iconR={<Icons.arrowRight size={17} />} onClick={() => app.nav('quest')}>Complete KYC</Btn>}
    </Card>
  );
}

/* ---- Dashboard launch CTA (drop into Dashboard top) ---- */
function LaunchDashCard() {
  const app = window.useApp();
  const L = window.DATA3.launch;
  return (
    <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative',
      background: 'linear-gradient(135deg,#20414d,#2b5666 50%,#d9742e)', color: '#fff' }}>
      <div style={{ position: 'absolute', top: -50, right: -30, opacity: .18 }}><Icons.gift size={170} /></div>
      <div style={{ position: 'relative', padding: 'clamp(18px,4vw,26px)' }}>
        <div className="row gap-2" style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: '.05em' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6ee7a8', boxShadow: '0 0 0 0 #6ee7a8', animation: 'ringPulse 1.8s infinite' }} /> 🔥 LAUNCH IS LIVE
        </div>
        <h3 style={{ color: '#fff', fontSize: 'clamp(20px,4.5vw,26px)', fontWeight: 800, marginTop: 8, lineHeight: 1.15 }}>Win ₦Millions + Free Lands</h3>
        <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 13.5, marginTop: 6 }}>Join the Grand Launch — everybody is a winner.</p>
        <div className="row gap-2 wrap" style={{ marginTop: 16 }}>
          <Btn variant="primary" style={{ background: '#f6c945', color: '#5a1a10' }} icon={<Icons.spark size={16} />} onClick={() => app.navRoot('launch')}>Claim Land</Btn>
          <Btn variant="ghost" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }} icon={<Icons.share size={16} />} onClick={() => app.navRoot('affiliate')}>Get Affiliate Link</Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { useCountdown, Countdown, PromoBanner, TopAffiliatesFab, SupportFab, VerifiedInvestorCard, LaunchDashCard });
