/* ============================================================
   FUND WALLET · PAYMENT PLANS · STATEMENTS
   ============================================================ */
function FundWallet() {
  const app = window.useApp();
  const D = window.DATA;
  const toast = useToast();
  const [amount, setAmount] = useState(50000);
  const [method, setMethod] = useState(0);
  const [step, setStep] = useState(0);
  const methods = [['Paystack', Icons.bolt], ['Debit card', Icons.card], ['Bank transfer', Icons.bank], ['USSD', Icons.spark]];
  const fund = async () => {
    if (app.live && window.API) {
      setStep(1);
      try {
        const r = await window.API.fundWallet(amount);
        if (r.authorizationUrl) { window.location.href = r.authorizationUrl; return; } // redirect to Paystack
        app.fund(amount); setStep(2);
      } catch (e) { setStep(0); toast(e.message || 'Could not start funding'); }
    } else {
      setStep(1); setTimeout(() => { app.fund(amount); setStep(2); }, 1800);
    }
  };

  if (step === 2) return (
    <div className="reveal center" style={{ maxWidth: 460, margin: '0 auto', paddingTop: 30 }}>
      <div style={{ width: 92, height: 92, borderRadius: '50%', margin: '0 auto 20px', background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spinIn .6s var(--spring)' }}><Icons.checkCircle size={50} /></div>
      <h2 style={{ fontSize: 26, fontWeight: 800 }}>Wallet funded</h2>
      <p className="muted" style={{ fontSize: 15, marginTop: 8 }}>{D.fmtNaira(amount)} added. New balance: {D.fmtNaira(app.balance)}.</p>
      <Btn style={{ marginTop: 22 }} onClick={() => app.navRoot('wallet')} icon={<Icons.wallet size={16} />}>Go to wallet</Btn>
    </div>
  );

  return (
    <div className="reveal" style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <Card>
        <div className="stat-label">Amount to add</div>
        <div className="row" style={{ alignItems: 'baseline', gap: 4, marginTop: 4 }}>
          <span className="font-display" style={{ fontSize: 30, fontWeight: 800 }}>₦</span>
          <input type="number" value={amount} onChange={(e) => setAmount(Math.max(0, +e.target.value))} style={{ border: 'none', background: 'transparent', fontSize: 30, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', width: '100%', outline: 'none', color: 'var(--ink)' }} />
        </div>
        <div className="row gap-2 wrap" style={{ marginTop: 14 }}>
          {[20000, 50000, 100000, 250000].map((v) => (
            <button key={v} onClick={() => setAmount(v)} className="chip clickable" style={{ background: amount === v ? 'var(--orange-100)' : 'var(--surface-sunk)', color: amount === v ? 'var(--orange-700)' : 'var(--muted)' }}>₦{(v / 1000)}k</button>
          ))}
        </div>
      </Card>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Pay with</h3>
        <div className="grid cols-2" style={{ gap: 10 }}>
          {methods.map(([m, Ic], i) => (
            <button key={m} onClick={() => setMethod(i)} className="row gap-2" style={{ padding: 13, borderRadius: 12, border: '1.5px solid', borderColor: method === i ? 'var(--accent)' : 'var(--hairline)', background: method === i ? 'var(--orange-50)' : 'var(--surface)', fontWeight: 700, fontSize: 14, color: method === i ? 'var(--accent)' : 'var(--ink-2)' }}>
              <Ic size={18} /> {m}
            </button>
          ))}
        </div>
      </Card>
      <Btn block size="lg" disabled={step === 1 || amount < 1000} onClick={fund} icon={step === 1 ? null : <Icons.plus size={17} />}>
        {step === 1 ? 'Processing…' : `Add ${D.fmtNaira(amount)}`}
      </Btn>
    </div>
  );
}

function PaymentPlans() {
  const app = window.useApp();
  const D = window.DATA;
  const toast = useToast();
  const [months, setMonths] = useState(6);
  const [sqm, setSqm] = useState(300);
  const total = sqm * D.NGN_PER_SQM;
  const monthly = Math.round(total / months);
  const plans = [
    { id: 'active', estate: 'Channels Gardens', sqm: 150, paid: 4, total: 6, monthly: 300000 },
  ];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Payment plans" sub="Spread your land purchase over monthly installments — no interest." />
      {/* Active plan */}
      <Card>
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Active plan</h3>
          <span className="chip chip-green">On track</span>
        </div>
        {plans.map((p) => (
          <div key={p.id}>
            <div className="row between" style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700 }}>{p.sqm} sqm · {p.estate}</span>
              <span className="num muted" style={{ fontSize: 13, fontWeight: 600 }}>{p.paid}/{p.total} paid</span>
            </div>
            <Progress value={(p.paid / p.total) * 100} variant="green" tall />
            <div className="row between" style={{ marginTop: 14 }}>
              <div><div className="stat-label" style={{ fontSize: 10.5 }}>Next due</div><div className="num font-display" style={{ fontSize: 18, fontWeight: 800 }}>{D.fmtNaira(p.monthly)}</div><div className="muted" style={{ fontSize: 11.5 }}>Jun 1, 2026</div></div>
              <Btn size="sm" onClick={() => toast('Installment paid 🎉')} icon={<Icons.bolt size={14} />}>Pay now</Btn>
            </div>
          </div>
        ))}
      </Card>

      {/* Plan builder */}
      <Card>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Start a new plan</h3>
        <div className="row between"><span className="stat-label">Land size</span><span className="chip chip-accent">{sqm} sqm</span></div>
        <input type="range" min="50" max="1000" step="50" value={sqm} onChange={(e) => setSqm(+e.target.value)} style={{ width: '100%', marginTop: 10, accentColor: 'var(--accent)' }} />
        <div className="stat-label" style={{ marginTop: 16, marginBottom: 10 }}>Duration</div>
        <div className="row gap-2 wrap">
          {[3, 6, 9, 12].map((m) => (
            <button key={m} onClick={() => setMonths(m)} className="chip clickable" style={{ padding: '8px 16px', background: months === m ? 'var(--primary)' : 'var(--surface-sunk)', color: months === m ? 'var(--primary-ink)' : 'var(--muted)' }}>{m} months</button>
          ))}
        </div>
        <div className="card card-pad" style={{ background: 'var(--surface-2)', marginTop: 18 }}>
          <div className="row between" style={{ fontSize: 14, marginBottom: 8 }}><span className="muted" style={{ fontWeight: 600 }}>Total</span><span className="num" style={{ fontWeight: 700 }}>{D.fmtNaira(total)}</span></div>
          <div className="row between"><span style={{ fontWeight: 700 }}>Monthly</span><span className="num font-display" style={{ fontWeight: 800, fontSize: 22, color: 'var(--accent)' }}>{D.fmtNaira(monthly)}</span></div>
        </div>
        <Btn block size="lg" style={{ marginTop: 16 }} onClick={() => { toast('Payment plan started!'); app.navRoot('milestones'); }} icon={<Icons.card size={17} />}>Start this plan</Btn>
      </Card>
    </div>
  );
}

function Statements() {
  const D = window.DATA;
  const toast = useToast();
  const months = [
    { m: 'May 2026', earned: 186000, withdrawn: 120000, txns: 14 },
    { m: 'April 2026', earned: 152000, withdrawn: 100000, txns: 11 },
    { m: 'March 2026', earned: 204000, withdrawn: 180000, txns: 18 },
    { m: 'February 2026', earned: 98000, withdrawn: 60000, txns: 7 },
  ];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Statements" sub="Monthly summaries of your earnings and withdrawals." />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
        <Card style={{ padding: 18 }}><div className="stat-label" style={{ fontSize: 11 }}>Total earned (YTD)</div><div className="font-display num" style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: 'var(--green-600)' }}>{D.fmtNaira(640000)}</div></Card>
        <Card style={{ padding: 18 }}><div className="stat-label" style={{ fontSize: 11 }}>Total withdrawn</div><div className="font-display num" style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{D.fmtNaira(460000)}</div></Card>
        <Card style={{ padding: 18 }}><div className="stat-label" style={{ fontSize: 11 }}>Tax documents</div><Btn size="sm" variant="outline" style={{ marginTop: 8 }} onClick={() => toast('Generating 2025 summary…')} icon={<Icons.doc size={14} />}>2025 summary</Btn></Card>
      </div>
      <Card pad={false}>
        <div className="row between" style={{ padding: '16px 20px' }}><h3 style={{ fontSize: 17, fontWeight: 700 }}>Monthly statements</h3></div>
        {months.map((s, i) => (
          <div key={i} className="row gap-3" style={{ padding: '15px 20px', borderTop: '1px solid var(--line-2)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--teal-50)', color: 'var(--teal-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 44px' }}><Icons.doc size={20} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{s.m}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{s.txns} transactions · <span style={{ color: 'var(--green-600)' }}>+{D.fmtNaira(s.earned)}</span></div>
            </div>
            <button onClick={() => toast('Downloading ' + s.m + ' statement…')} className="chip clickable" style={{ background: 'var(--surface-sunk)', color: 'var(--accent)' }}><Icons.arrowDown size={14} /> PDF</button>
          </div>
        ))}
      </Card>
    </div>
  );
}

Object.assign(window, { FundWallet, PaymentPlans, Statements });
