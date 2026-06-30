/* ============================================================
   AFFILIATE HUB — Referrals & Earnings · Landing Pages · Promo Hub
   Exports: Affiliate, LandingPages, PromoHub
   ============================================================ */

/* ---- Referrals & Earnings ---- */
function Affiliate() {
  const app = window.useApp();
  const D = window.DATA;
  const toast = useToast();
  const link = 'https://' + app.user.refLink;
  const fullKyc = Math.round(app.directRefs * 0.7);
  const partial = app.directRefs - fullKyc;
  const signupBonus = fullKyc * 2000;
  const commissions = app.balance;

  const stat = (label, value, sub, accent) => (
    <Card style={{ padding: 16 }}>
      <div className="stat-label">{label}</div>
      <div className="font-display" style={{ fontSize: 24, fontWeight: 800, marginTop: 6, color: accent || 'var(--on-surface)' }}>{value}</div>
      {sub && <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>{sub}</div>}
    </Card>
  );

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Referrals & Earnings" sub="Invite people, earn on every plot they buy, and bank your launch signup bonus." />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
        {stat('Total referred', <CountNum value={app.directRefs} />)}
        {stat('Fully KYC verified', <CountNum value={fullKyc} />, 'Bonus paid only on full KYC', 'var(--green-600)')}
        {stat('Partial verified', <CountNum value={partial} />, 'No bonus yet', 'var(--orange-500)')}
        {stat('Total earned', <CountNaira value={app.lifetime} />, 'Commissions + bonuses', 'var(--teal-700)')}
      </div>

      {/* Referral code + link */}
      <Card>
        <div className="row between gap-3" style={{ flexWrap: 'wrap' }}>
          <div>
            <div className="stat-label">Referral code</div>
            <div className="font-mono" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '.04em', marginTop: 4 }}>{app.user.refCode}</div>
          </div>
          <div className="row gap-2">
            <Btn variant="outline" size="sm" icon={<Icons.share size={15} />} onClick={() => app.openShare()}>Share</Btn>
            <Btn size="sm" icon={<Icons.copy size={15} />} onClick={() => { navigator.clipboard?.writeText(link); toast('Link copied!'); }}>Copy link</Btn>
          </div>
        </div>
        <div className="row gap-2" style={{ marginTop: 14, padding: '12px 14px', borderRadius: 'var(--r-sm)', background: 'var(--surface-sunk)' }}>
          <Icons.share size={16} style={{ color: 'var(--accent)' }} />
          <span className="font-mono" style={{ fontSize: 13, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.user.refLink}</span>
        </div>
        <button onClick={() => app.nav('promo')} className="row gap-2" style={{ marginTop: 12, color: 'var(--accent)', fontWeight: 700, fontSize: 13.5 }}>
          <Icons.spark size={15} /> Visit Promo Hub — banners, videos &amp; AI posts <Icons.arrowRight size={14} />
        </button>
      </Card>

      {/* Signup bonus credit */}
      <Card style={{ background: 'linear-gradient(135deg, #f8efd6, var(--surface))' }}>
        <div className="row gap-2"><Icons.gift size={18} style={{ color: 'var(--gold)' }} /><h3 style={{ fontSize: 16, fontWeight: 800 }}>Signup Bonus Credit</h3></div>
        <div className="num" style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{D.fmtNaira(signupBonus)}</div>
        <p className="muted" style={{ fontSize: 12.5, marginTop: 8 }}>You earn <b>₦2,000</b> for every signup who completes <b>full KYC</b>. This credit applies automatically as a discount when you buy land on a launch drop. It can’t be withdrawn or converted to cash.</p>
        <Btn block size="lg" style={{ marginTop: 14 }} icon={<Icons.land size={17} />} onClick={() => app.nav('drops')}>Use bonus — buy land on drop</Btn>
      </Card>

      {/* Commissions to cash out */}
      <Card style={{ background: 'linear-gradient(135deg, var(--green-50), var(--surface))' }}>
        <div className="row gap-2"><Icons.wallet size={18} style={{ color: 'var(--green-600)' }} /><h3 style={{ fontSize: 16, fontWeight: 800 }}>Available Commissions to Cash Out</h3></div>
        <div className="num" style={{ fontSize: 30, fontWeight: 800, marginTop: 8, color: 'var(--green-600)' }}>{D.fmtNaira(commissions)}</div>
        <p className="muted" style={{ fontSize: 12.5, marginTop: 8 }}>Only land-sale commissions can be withdrawn to your bank or used for any land purchase. Signup bonuses are not included here.</p>
        <div className="row gap-2 wrap" style={{ marginTop: 14 }}>
          <Btn icon={<Icons.bank size={16} />} onClick={() => app.nav('payouts')}>Request payout</Btn>
          <Btn variant="outline" icon={<Icons.land size={16} />} onClick={() => app.nav('drops')}>Use for land</Btn>
        </div>
      </Card>

      {/* Why refer */}
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Why refer friends?</h3>
        {[['Share your link', 'Send your unique link to friends, family or your audience.', Icons.share],
          ['They sign up & buy', 'When they purchase land, you earn a commission on every transaction.', Icons.users],
          ['Get paid instantly', 'Commissions are credited automatically — withdraw anytime.', Icons.bolt]].map(([t, b, Ic], i) => (
          <div key={i} className="row gap-3" style={{ padding: '10px 0', borderTop: i ? '1px solid var(--line-2)' : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-sunk)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 36px' }}><Ic size={18} /></div>
            <div><div style={{ fontWeight: 700, fontSize: 14 }}>{t}</div><div className="muted" style={{ fontSize: 12.5 }}>{b}</div></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ---- My Landing Pages ---- */
function LandingPages() {
  const app = window.useApp();
  const toast = useToast();
  const pages = window.DATA3.landingPages;
  const base = 'https://channels.realty/a/' + app.user.refCode + '/';
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="My Landing Pages" sub="High-converting pages built for you. Share your link and earn on every signup that buys." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pages.map((p) => (
          <Card key={p.id}>
            <span className="chip chip-accent" style={{ padding: '2px 9px', fontSize: 10.5 }}>{p.kind}</span>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 10 }}>{p.name}</h3>
            <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>{p.pitch}</p>
            <div className="row gap-4" style={{ marginTop: 12 }}>
              <div><span className="muted" style={{ fontSize: 11.5, fontWeight: 700 }}>Visits</span> <span className="num" style={{ fontWeight: 800 }}>{p.visits}</span></div>
              <div><span className="muted" style={{ fontSize: 11.5, fontWeight: 700 }}>Signups</span> <span className="num" style={{ fontWeight: 800 }}>{p.signups}</span></div>
              <div><span className="muted" style={{ fontSize: 11.5, fontWeight: 700 }}>Conv</span> <span className="num" style={{ fontWeight: 800, color: 'var(--green-600)' }}>0%</span></div>
            </div>
            <div className="font-mono" style={{ marginTop: 12, padding: '10px 12px', borderRadius: 'var(--r-sm)', background: 'var(--surface-sunk)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{base + p.slug}</div>
            <div className="row gap-2" style={{ marginTop: 12 }}>
              <Btn size="sm" icon={<Icons.copy size={15} />} onClick={() => { navigator.clipboard?.writeText(base + p.slug); toast('Link copied!'); }}>Copy link</Btn>
              <Btn size="sm" variant="outline" icon={<Icons.eye size={15} />} onClick={() => toast('Preview opening…')}>Preview</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---- Promo Hub (AI content generator) ---- */
function PromoHub() {
  const app = window.useApp();
  const toast = useToast();
  const tones = window.DATA3.promoTones;
  const assets = window.DATA3.promoAssets;
  const link = 'https://' + app.user.refLink;
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState(tones[0]);
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);

  const generate = () => {
    setBusy(true); setOut('');
    setTimeout(() => {
      const t = topic.trim() || 'the Channels Realty launch drop';
      const text = `🌍 Own real, titled land in Nigeria — starting from just ₦20,000!\n\n` +
        `${tone.includes('Urgent') ? '⏳ Launch week is ending fast. ' : ''}I'm building wealth with ${t} on Channels Realty 🏡\n\n` +
        `✅ Buy land by the square metre\n✅ Verified C of O estates\n✅ Resell & earn like stocks\n✅ Win ₦Millions this launch\n\n` +
        `Start here 👉 ${link}`;
      setOut(text); setBusy(false);
    }, 700);
  };

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Affiliate Promo Hub" sub="Download ready-to-share assets and generate AI posts with your referral link baked in." />

      <Card>
        <div className="row gap-2" style={{ marginBottom: 12 }}><Icons.spark size={20} style={{ color: 'var(--accent)' }} /><h3 style={{ fontSize: 17, fontWeight: 800 }}>AI Content Generator</h3></div>
        <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>Generate ready-to-post content tailored to each platform — your referral link is auto-included.</p>

        <label className="stat-label">Topic / angle (optional)</label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. New land drop, Insider investor benefits"
          style={{ width: '100%', marginTop: 8, marginBottom: 14, padding: '13px 15px', borderRadius: 'var(--r-sm)', border: '1px solid var(--hairline)', background: 'var(--surface)', fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }} />

        <label className="stat-label">Tone</label>
        <div className="row gap-2 wrap" style={{ marginTop: 8, marginBottom: 14 }}>
          {tones.map((t) => (
            <button key={t} onClick={() => setTone(t)} className="chip clickable" style={{ background: tone === t ? 'var(--accent)' : 'var(--surface-sunk)', color: tone === t ? '#fff' : 'var(--on-surface-mut)' }}>{t}</button>
          ))}
        </div>

        <div className="font-mono" style={{ padding: '10px 12px', borderRadius: 'var(--r-sm)', background: 'var(--surface-sunk)', fontSize: 12, marginBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🔗 {link}</div>

        <Btn block size="lg" icon={<Icons.spark size={17} />} disabled={busy} onClick={generate}>{busy ? 'Generating…' : 'Generate post'}</Btn>

        {out && (
          <div className="reveal" style={{ marginTop: 14 }}>
            <div style={{ padding: 14, borderRadius: 'var(--r-sm)', background: 'var(--surface-sunk)', whiteSpace: 'pre-wrap', fontSize: 13.5, lineHeight: 1.55 }}>{out}</div>
            <div className="row gap-2" style={{ marginTop: 10 }}>
              <Btn size="sm" icon={<Icons.copy size={15} />} onClick={() => { navigator.clipboard?.writeText(out); toast('Post copied!'); }}>Copy</Btn>
              <Btn size="sm" variant="outline" icon={<Icons.whatsapp size={15} />} onClick={() => toast('Opening WhatsApp…')}>Share</Btn>
              <Btn size="sm" variant="ghost" icon={<Icons.spark size={15} />} onClick={generate}>Regenerate</Btn>
            </div>
          </div>
        )}
      </Card>

      <div>
        <div className="sec-head"><h3 style={{ fontSize: 16 }}>Download-ready assets</h3></div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {assets.map((a) => (
            <Card key={a.id} hover>
              <div className="row gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-sunk)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 40px' }}>
                  {a.type === 'Video' ? <Icons.play size={20} /> : a.type === 'Text' ? <Icons.doc size={20} /> : <Icons.eye size={20} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.name}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{a.type} · {a.size}</div>
                </div>
              </div>
              <Btn block size="sm" variant="outline" style={{ marginTop: 12 }} icon={<Icons.arrowDown size={15} />} onClick={() => toast('Downloading ' + a.type + '…')}>Download</Btn>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Affiliate, LandingPages, PromoHub });
