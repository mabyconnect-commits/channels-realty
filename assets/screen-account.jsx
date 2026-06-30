/* ============================================================
   PROFILE · KYC · SETTINGS · SECURITY · PAYOUTS
   ============================================================ */
function Profile() {
  const app = window.useApp();
  const D = window.DATA;
  const tier = D.currentTier(app.teamTotal);
  const stats = [
    ['Team', app.teamTotal, Icons.users], ['Land', app.landSqm + ' sqm', Icons.land],
    ['Lifetime', D.fmtNaira(app.lifetime), Icons.wallet], ['Joined', app.user.joined, Icons.clock],
  ];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card style={{ overflow: 'hidden', padding: 0 }} pad={false}>
        <div style={{ height: 96, background: `linear-gradient(120deg, ${tier.color}, color-mix(in srgb, ${tier.color} 55%, #000))` }} />
        <div style={{ padding: '0 22px 22px', marginTop: -42 }}>
          <div className="row between" style={{ alignItems: 'flex-end' }}>
            <Avatar src={app.user.avatar} name={app.user.name} size={84} ring />
            <Btn size="sm" variant="outline" icon={<Icons.spark size={14} />}>Edit</Btn>
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 800, marginTop: 12 }}>{app.user.name}</div>
          <div className="row gap-2" style={{ marginTop: 4 }}>
            <span className="chip chip-accent" style={{ padding: '3px 10px' }}><Icons.trophy size={12} /> {tier.name}</span>
            {app.user.kyc && <span className="chip chip-green" style={{ padding: '3px 10px' }}><Icons.shield size={12} /> Verified</span>}
          </div>
        </div>
      </Card>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
        {stats.map(([l, v, Ic]) => (
          <Card key={l} style={{ padding: 16 }}>
            <Ic size={18} style={{ color: 'var(--accent)' }} />
            <div className="font-display" style={{ fontSize: 18, fontWeight: 800, marginTop: 8 }}>{v}</div>
            <div className="muted" style={{ fontSize: 12 }}>{l}</div>
          </Card>
        ))}
      </div>
      <Card pad={false}>
        {[['Email', app.user.email, Icons.doc], ['Phone', app.user.phone, Icons.bell], ['Referral code', app.user.refCode, Icons.share]].map(([l, v, Ic], i) => (
          <div key={l} className="row gap-3" style={{ padding: '15px 20px', borderTop: i ? '1px solid var(--line-2)' : 'none' }}>
            <Ic size={18} style={{ color: 'var(--muted)' }} />
            <div style={{ flex: 1 }}><div className="muted" style={{ fontSize: 12 }}>{l}</div><div style={{ fontWeight: 700, fontSize: 14.5 }}>{v}</div></div>
          </div>
        ))}
      </Card>
      <div className="grid d-grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Btn variant="outline" block onClick={() => app.nav('kyc')} icon={<Icons.shield size={16} />}>Verification</Btn>
        <Btn variant="outline" block onClick={() => app.nav('security')} icon={<Icons.lock size={16} />}>Security</Btn>
      </div>
    </div>
  );
}

function KYC() {
  const app = window.useApp();
  const toast = useToast();
  const [stepDone, setStepDone] = useState([true, true, false]);
  const steps = [
    { t: 'Email & phone', d: 'Verified', icon: Icons.bell },
    { t: 'Identity (BVN / NIN)', d: 'Verified', icon: Icons.shield },
    { t: 'Government ID + selfie', d: 'Upload to finish', icon: Icons.doc },
  ];
  const pct = Math.round((stepDone.filter(Boolean).length / steps.length) * 100);
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 600, margin: '0 auto', width: '100%' }}>
      <Card>
        <div className="row gap-3" style={{ alignItems: 'center' }}>
          <Ring value={pct} size={84} sw={8} color="var(--green-500)"><div className="num font-display" style={{ fontSize: 17, fontWeight: 800 }}>{pct}%</div></Ring>
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 800 }}>{pct === 100 ? 'Fully verified' : 'Almost there'}</h3>
            <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Verified accounts get higher withdrawal limits and faster payouts.</p>
          </div>
        </div>
      </Card>
      {steps.map((s, i) => (
        <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, flex: '0 0 46px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: stepDone[i] ? 'var(--green-50)' : 'var(--orange-50)', color: stepDone[i] ? 'var(--green-600)' : 'var(--orange-600)' }}>
            {stepDone[i] ? <Icons.checkCircle size={24} /> : <s.icon size={22} />}
          </div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>{s.t}</div><div className="muted" style={{ fontSize: 12.5 }}>{s.d}</div></div>
          {!stepDone[i] && <Btn size="sm" onClick={() => { setStepDone((x) => x.map((v, k) => k === i ? true : v)); toast('Document uploaded for review'); }} icon={<Icons.arrowUp size={14} />}>Upload</Btn>}
        </Card>
      ))}
    </div>
  );
}

function Settings() {
  const app = window.useApp();
  const [tog, setTog] = useState({ push: true, email: true, sms: false, marketing: true, biometric: true });
  const groups = [
    { label: 'Notifications', items: [['push', 'Push notifications'], ['email', 'Email updates'], ['sms', 'SMS alerts'], ['marketing', 'Promotions & tips']] },
    { label: 'Security', items: [['biometric', 'Biometric login']] },
  ];
  const links = [['payouts', 'Payout methods', Icons.bank], ['security', 'Password & 2FA', Icons.lock], ['support', 'Help & support', Icons.info]];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 600, margin: '0 auto', width: '100%' }}>
      {groups.map((g) => (
        <Card key={g.label} pad={false}>
          <div style={{ padding: '16px 20px 4px' }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>{g.label}</h3></div>
          {g.items.map(([k, l]) => (
            <div key={k} className="row between" style={{ padding: '14px 20px' }}>
              <span style={{ fontWeight: 600, fontSize: 14.5 }}>{l}</span>
              <button onClick={() => setTog((s) => ({ ...s, [k]: !s[k] }))} style={{ width: 46, height: 27, borderRadius: 14, background: tog[k] ? 'var(--accent)' : 'var(--surface-sunk)', position: 'relative', transition: 'background .2s' }}>
                <span style={{ position: 'absolute', top: 3, left: tog[k] ? 22 : 3, width: 21, height: 21, borderRadius: '50%', background: '#fff', transition: 'left .2s var(--ease)', boxShadow: 'var(--sh-sm)' }} />
              </button>
            </div>
          ))}
        </Card>
      ))}
      <Card pad={false}>
        {links.map(([id, l, Ic], i) => (
          <button key={id} className="row gap-3 clickable" onClick={() => app.nav(id)} style={{ width: '100%', padding: '15px 20px', borderTop: i ? '1px solid var(--line-2)' : 'none', textAlign: 'left' }}>
            <Ic size={19} style={{ color: 'var(--muted)' }} /><span style={{ flex: 1, fontWeight: 600, fontSize: 14.5 }}>{l}</span><Icons.chevR size={16} style={{ color: 'var(--faint)' }} />
          </button>
        ))}
      </Card>
      <button className="row gap-2" onClick={app.logout} style={{ justifyContent: 'center', color: 'var(--red-500)', fontWeight: 700, fontSize: 14.5, padding: 14 }}><Icons.logout size={17} /> Log out</button>
    </div>
  );
}

function Security() {
  const toast = useToast();
  const [twofa, setTwofa] = useState(true);
  const devices = [
    { name: 'iPhone 14 · Lagos', cur: true, when: 'Active now' },
    { name: 'Chrome · Windows', cur: false, when: '2 days ago' },
    { name: 'Samsung A52 · Abuja', cur: false, when: '1 week ago' },
  ];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 600, margin: '0 auto', width: '100%' }}>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Password</h3>
        <Field2 label="Current password" type="password" />
        <Field2 label="New password" type="password" />
        <Btn block style={{ marginTop: 6 }} onClick={() => toast('Password updated')} icon={<Icons.lock size={16} />}>Update password</Btn>
      </Card>
      <Card>
        <div className="row between">
          <div><h3 style={{ fontSize: 16, fontWeight: 700 }}>Two-factor authentication</h3><p className="muted" style={{ fontSize: 13, marginTop: 4 }}>Extra security on login & withdrawals.</p></div>
          <button onClick={() => setTwofa((v) => !v)} style={{ width: 46, height: 27, borderRadius: 14, background: twofa ? 'var(--green-500)' : 'var(--surface-sunk)', position: 'relative', flex: '0 0 46px' }}>
            <span style={{ position: 'absolute', top: 3, left: twofa ? 22 : 3, width: 21, height: 21, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: 'var(--sh-sm)' }} />
          </button>
        </div>
      </Card>
      <Card pad={false}>
        <div style={{ padding: '16px 20px 4px' }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Active devices</h3></div>
        {devices.map((d, i) => (
          <div key={i} className="row gap-3" style={{ padding: '14px 20px', borderTop: i ? '1px solid var(--line-2)' : 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--surface-sunk)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 40px' }}><Icons.shield size={19} /></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div><div className="muted" style={{ fontSize: 12 }}>{d.when}</div></div>
            {d.cur ? <span className="chip chip-green">This device</span> : <button onClick={() => toast('Device signed out')} style={{ color: 'var(--red-500)', fontWeight: 700, fontSize: 13 }}>Remove</button>}
          </div>
        ))}
      </Card>
    </div>
  );
}

function Payouts() {
  const app = window.useApp();
  const toast = useToast();
  const demo = [
    { name: 'GTBank', acct: '0123 ••• 4821', color: '#e35205', primary: true },
    { name: 'Access Bank', acct: '0455 ••• 1190', color: '#003e7e', primary: false },
  ];
  const [accts, setAccts] = useState(app.live ? [] : demo);
  const [banks, setBanks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ bankCode: '', bankName: '', accountNumber: '' });
  const [busy, setBusy] = useState(false);
  const loadAccts = () => {
    if (app.live && window.API) window.API.accounts().then((r) => setAccts((r.accounts || []).map((a) => ({
      id: a.id, name: a.bankName, acct: '•••• ' + String(a.accountNumber).slice(-4), accountName: a.accountName, color: '#2b5666', primary: a.primary,
    })))).catch(() => {});
  };
  useEffect(() => { loadAccts(); if (app.live && window.API) window.API.banks().then((r) => setBanks(r.banks || [])).catch(() => {}); }, [app.live]);
  const addLive = async () => {
    if (!form.bankCode) return toast('Select your bank');
    if (form.accountNumber.length !== 10) return toast('Enter a valid 10-digit account number');
    setBusy(true);
    try { await window.API.addAccount({ bankCode: form.bankCode, bankName: form.bankName, accountNumber: form.accountNumber }); toast('Account verified & added'); setAdding(false); setForm({ bankCode: '', bankName: '', accountNumber: '' }); loadAccts(); }
    catch (e) { toast(e.message || 'Could not add account'); }
    setBusy(false);
  };
  const ip = { width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 15, color: 'var(--ink)', background: 'var(--surface-2)', border: '1.5px solid var(--hairline)', outline: 'none', marginBottom: 12 };
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 600, margin: '0 auto', width: '100%' }}>
      <PageHead title="Payout methods" sub="Where your commissions and withdrawals are sent." />
      {accts.length === 0 && app.live && <Card style={{ textAlign: 'center', padding: 24 }}><p className="muted" style={{ fontSize: 13.5 }}>No payout account yet — add one to withdraw.</p></Card>}
      {accts.map((b, i) => (
        <Card key={b.id || i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: b.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 48px' }}><Icons.bank size={22} /></div>
          <div style={{ flex: 1 }}><div className="row gap-2"><span style={{ fontWeight: 700, fontSize: 15 }}>{b.name}</span>{b.primary && <span className="chip chip-green" style={{ padding: '1px 8px', fontSize: 10.5 }}>Primary</span>}</div><div className="font-mono muted" style={{ fontSize: 13, marginTop: 2 }}>{b.acct}{b.accountName ? ' · ' + b.accountName : ''}</div></div>
          {!b.primary && !app.live && <button onClick={() => { setAccts((a) => a.map((x, k) => ({ ...x, primary: k === i }))); toast('Primary account updated'); }} style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13 }}>Set primary</button>}
        </Card>
      ))}
      {adding ? (
        app.live ? (
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Add bank account</h3>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 7 }}>Bank</div>
            <select value={form.bankCode} onChange={(e) => { const opt = banks.find((x) => x.code === e.target.value); setForm((f) => ({ ...f, bankCode: e.target.value, bankName: opt ? opt.name : '' })); }} style={ip}>
              <option value="">Select bank…</option>
              {banks.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 7 }}>Account number</div>
            <input value={form.accountNumber} onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="0123456789" style={ip} />
            <div className="row gap-2" style={{ marginTop: 6 }}>
              <Btn block disabled={busy} onClick={addLive}>{busy ? 'Verifying…' : 'Verify & add'}</Btn>
              <Btn variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn>
            </div>
          </Card>
        ) : (
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Add bank account</h3>
            <Field2 label="Bank name" placeholder="e.g. Zenith Bank" />
            <Field2 label="Account number" placeholder="0123456789" />
            <div className="row gap-2" style={{ marginTop: 6 }}>
              <Btn block onClick={() => { setAccts((a) => [...a, { name: 'Zenith Bank', acct: '0123 ••• 9900', color: '#e30613', primary: false }]); setAdding(false); toast('Account added'); }}>Add account</Btn>
              <Btn variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn>
            </div>
          </Card>
        )
      ) : (
        <Btn variant="outline" block onClick={() => setAdding(true)} icon={<Icons.plus size={16} />}>Add new account</Btn>
      )}
    </div>
  );
}

function Field2({ label, type = 'text', placeholder }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 7 }}>{label}</div>
      <input type={type} placeholder={placeholder} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 15, color: 'var(--ink)', background: 'var(--surface-2)', border: '1.5px solid var(--hairline)', outline: 'none' }} />
    </label>
  );
}

Object.assign(window, { Profile, KYC, Settings, Security, Payouts, Field2 });
