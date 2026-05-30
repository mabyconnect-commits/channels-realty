/* ============================================================
   AUTH  (exports window.Auth)
   ============================================================ */
function Auth({ mode: initMode, onComplete, onBack }) {
  const [mode, setMode] = useState(initMode || 'signup');
  const [step, setStep] = useState(0); // signup: 0 details, 1 amount
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', ref: '', amount: 20000 });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
  const isSignup = mode === 'signup';

  const sqm = Math.max(1, Math.round(form.amount / window.DATA.NGN_PER_SQM * 10) / 10);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr', background: 'var(--bg)' }} className="auth-wrap">
      {/* Brand panel (desktop) */}
      <div className="d-only auth-brand" style={{ position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, var(--teal-800), var(--teal-600))', color: '#fff',
        padding: '48px', display: 'none', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ position: 'absolute', bottom: -120, right: -100, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,116,46,.3), transparent 60%)' }} />
        <Logo size={28} light />
        <div style={{ position: 'relative' }}>
          <h2 style={{ color: '#fff', fontSize: 38, fontWeight: 800, lineHeight: 1.08 }}>
            Own land<br />by the square<br />metre.
          </h2>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 17, marginTop: 18, maxWidth: 360, lineHeight: 1.6 }}>
            From ₦20,000. Refer, hit milestones, and earn free land in fast-appreciating estates.
          </p>
          <div className="row gap-3" style={{ marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              {['assets/agent-1.jpg','assets/owner-3.jpg','assets/agent-2.jpg'].map((s, i) => (
                <img key={i} src={s} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', marginLeft: i ? -12 : 0, border: '2px solid var(--teal-700)' }} />
              ))}
            </div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>12,400+ co-owners already building wealth</div>
          </div>
        </div>
        <div style={{ position: 'relative', fontSize: 13, color: 'rgba(255,255,255,.6)' }}>Real estate to the masses.</div>
      </div>

      {/* Form panel */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 20px', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <button onClick={onBack} className="row gap-2 muted" style={{ fontWeight: 700, fontSize: 14, marginBottom: 26 }}>
            <Icons.arrowLeft size={16} /> Back to home
          </button>
          <div className="m-only" style={{ marginBottom: 22 }}><Logo size={30} /></div>

          <h1 style={{ fontSize: 30, fontWeight: 800 }}>{isSignup ? (step === 0 ? 'Create your account' : 'Pick your first plot') : 'Welcome back'}</h1>
          <p className="muted" style={{ marginTop: 8, fontSize: 15 }}>
            {isSignup ? (step === 0 ? 'Start co-owning land in minutes.' : 'Own from as little as ₦20,000 — adjust below.') : 'Log in to your co-own dashboard.'}
          </p>

          {/* Stepper for signup */}
          {isSignup && (
            <div className="row gap-2" style={{ margin: '22px 0 4px' }}>
              {[0, 1].map((s) => (
                <div key={s} style={{ height: 4, flex: 1, borderRadius: 4, background: s <= step ? 'var(--accent)' : 'var(--surface-sunk)', transition: 'background .3s' }} />
              ))}
            </div>
          )}

          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {isSignup && step === 0 && (
              <>
                <Field label="Full name" value={form.name} onChange={set('name')} placeholder="Tunde Adeyemi" />
                <Field label="Email" value={form.email} onChange={set('email')} placeholder="you@email.com" type="email" />
                <Field label="Phone" value={form.phone} onChange={set('phone')} placeholder="0814 152 1450" />
                <Field label="Password" value={form.password} onChange={set('password')} placeholder="••••••••" type="password" />
                <Field label="Referral code (optional)" value={form.ref} onChange={set('ref')} placeholder="e.g. TUNDE2024" />
                <Btn block size="lg" onClick={() => setStep(1)} iconR={<Icons.arrowRight />} style={{ marginTop: 6 }}>Continue</Btn>
              </>
            )}

            {isSignup && step === 1 && (
              <>
                <div className="card card-pad" style={{ background: 'var(--surface)' }}>
                  <div className="row between"><span className="stat-label">Your investment</span><span className="chip chip-accent">{sqm} sqm</span></div>
                  <div className="font-display num" style={{ fontSize: 38, fontWeight: 800, margin: '8px 0 4px' }}>₦{Number(form.amount).toLocaleString()}</div>
                  <div className="muted" style={{ fontSize: 13 }}>≈ {window.DATA.fmtUSD(form.amount / window.DATA.USD_RATE)} · Channels Gardens, Epe</div>
                  <input type="range" min="20000" max="500000" step="20000" value={form.amount} onChange={set('amount')}
                    style={{ width: '100%', marginTop: 16, accentColor: 'var(--accent)' }} />
                  <div className="row between muted" style={{ fontSize: 12, fontWeight: 600 }}><span>₦20k</span><span>₦500k</span></div>
                </div>
                <div className="card card-pad" style={{ background: 'var(--surface)' }}>
                  <div className="stat-label" style={{ marginBottom: 12 }}>Pay with</div>
                  <div className="grid cols-2" style={{ gap: 10 }}>
                    {[['Flutterwave', <Icons.bolt />], ['Card', <Icons.card />], ['Bank transfer', <Icons.bank />], ['USSD', <Icons.spark />]].map(([t, ic], i) => (
                      <div key={t} style={{ border: '1.5px solid', borderColor: i === 0 ? 'var(--accent)' : 'var(--hairline)', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 9, fontWeight: 700, fontSize: 13.5, color: i === 0 ? 'var(--accent)' : 'var(--ink-2)', background: i === 0 ? 'var(--orange-50)' : 'transparent' }}>
                        <span style={{ display: 'flex' }}>{ic}</span>{t}
                      </div>
                    ))}
                  </div>
                </div>
                <Btn block size="lg" onClick={() => onComplete(form)} iconR={<Icons.arrowRight />} style={{ marginTop: 4 }}>
                  Pay ₦{Number(form.amount).toLocaleString()} & enter dashboard
                </Btn>
                <button className="muted center" onClick={() => onComplete(form)} style={{ fontSize: 13.5, fontWeight: 600 }}>Skip — explore dashboard first</button>
              </>
            )}

            {!isSignup && (
              <>
                <Field label="Email or phone" value={form.email} onChange={set('email')} placeholder="you@email.com" />
                <Field label="Password" value={form.password} onChange={set('password')} placeholder="••••••••" type="password" />
                <div className="row between" style={{ fontSize: 13.5 }}>
                  <label className="row gap-2 muted" style={{ fontWeight: 600 }}><input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} /> Remember me</label>
                  <a style={{ color: 'var(--accent)', fontWeight: 700 }}>Forgot password?</a>
                </div>
                <Btn block size="lg" onClick={() => onComplete(form)} iconR={<Icons.arrowRight />} style={{ marginTop: 6 }}>Log in</Btn>
              </>
            )}
          </div>

          <div className="center muted" style={{ marginTop: 24, fontSize: 14.5 }}>
            {isSignup ? 'Already a co-owner? ' : "New to Channels? "}
            <button onClick={() => { setMode(isSignup ? 'login' : 'signup'); setStep(0); }} style={{ color: 'var(--accent)', fontWeight: 700 }}>
              {isSignup ? 'Log in' : 'Create account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', ...p }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 7 }}>{label}</div>
      <input type={type} {...p} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ width: '100%', padding: '13px 15px', borderRadius: 12, fontSize: 15, color: 'var(--ink)',
          background: 'var(--surface)', border: '1.5px solid', borderColor: focus ? 'var(--accent)' : 'var(--hairline)',
          outline: 'none', transition: 'border-color .18s', boxShadow: focus ? '0 0 0 4px var(--orange-50)' : 'none' }} />
    </label>
  );
}

window.Auth = Auth;
