/* ============================================================
   WALLET  (exports window.Wallet, window.ShareSheet)
   ============================================================ */
function Wallet() {
  const D = window.DATA;
  const app = window.useApp();
  const [withdraw, setWithdraw] = useState(false);
  const [filter, setFilter] = useState('all');
  const [tx, setTx] = useState(null);
  useEffect(() => {
    if (app.live && window.API) window.API.wallet().then((r) => setTx((r.transactions || []).map((t) => ({
      id: t.id, label: t.label, when: new Date(t.createdAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      amount: Math.round(Math.abs(t.amount) / 100), positive: t.amount > 0,
      type: t.amount < 0 ? 'withdraw' : (t.type === 'BONUS' ? 'reward' : 'commission'),
    })))).catch(() => {});
  }, [app.live]);
  const source = (app.live && tx) ? tx : D.activity;
  const ledger = source.filter((a) => filter === 'all' ? true : filter === 'in' ? a.positive : !a.positive);

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Wallet" sub="Withdraw your commission anytime, or buy more land." />

      {/* Balance card */}
      <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(150deg, var(--teal-800), var(--teal-600))', color: '#fff', padding: 'clamp(22px,4vw,30px)', boxShadow: 'var(--sh-teal)' }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,116,46,.3), transparent 60%)' }} />
        <div style={{ position: 'relative' }}>
          <div className="row between" style={{ alignItems: 'flex-start' }}>
            <div>
              <div className="row gap-2" style={{ color: 'rgba(255,255,255,.78)', fontSize: 13, fontWeight: 600 }}><Icons.wallet size={15} /> Withdrawable balance</div>
              <div className="font-display" style={{ fontSize: 'clamp(34px,7vw,46px)', fontWeight: 800, marginTop: 6 }}><CountNaira value={app.balance} /></div>
            </div>
            <div className="font-mono d-only" style={{ background: 'rgba(255,255,255,.14)', padding: '8px 12px', borderRadius: 10, fontSize: 12, letterSpacing: '.1em' }}>•••• 4821</div>
          </div>
          <div className="row gap-3 wrap" style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,.72)', fontWeight: 600 }}>
            <span>Pending: <span className="num">{D.fmtNaira(app.pending)}</span></span><span style={{ opacity: .5 }}>·</span>
            <span>Lifetime earned: <span className="num">{D.fmtNaira(app.lifetime)}</span></span>
          </div>
          <div className="row gap-3 wrap" style={{ marginTop: 22 }}>
            <Btn variant="primary" onClick={() => setWithdraw(true)} icon={<Icons.arrowUp />}>Withdraw</Btn>
            <Btn variant="ghost" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }} onClick={() => app.nav('fund')} icon={<Icons.plus />}>Add money</Btn>
            <Btn variant="ghost" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }} onClick={() => app.nav('milestones')} icon={<Icons.land />}>Buy land</Btn>
          </div>
        </div>
      </div>

      {/* Commission explainer */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
        {[
          { l: 'Per ₦20k sale', v: D.fmtNaira(4000), s: '20% Level 1', i: <Icons.bolt />, c: 'var(--orange-500)' },
          { l: 'Upline override', v: D.fmtNaira(1000), s: '5% Level 2', i: <Icons.users />, c: 'var(--teal-600)' },
          { l: 'This month', v: D.fmtNaira(186000), s: '+12% vs last', i: <Icons.trending />, c: 'var(--green-600)' },
        ].map((x) => (
          <Card key={x.l} style={{ padding: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `color-mix(in srgb, ${x.c} 14%, transparent)`, color: x.c, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{x.i}</div>
            <div className="stat-label" style={{ fontSize: 11 }}>{x.l}</div>
            <div className="font-display num" style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{x.v}</div>
            <div className="muted" style={{ fontSize: 12 }}>{x.s}</div>
          </Card>
        ))}
      </div>

      {/* Transactions */}
      <Card pad={false}>
        <div className="row between wrap" style={{ padding: '16px 20px', gap: 12 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Transactions</h3>
          <Segmented value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, { value: 'in', label: 'Earned' }, { value: 'out', label: 'Withdrawn' }]} />
        </div>
        {ledger.map((a) => (
          <div key={a.id} className="row gap-3" style={{ padding: '13px 20px', borderTop: '1px solid var(--line-2)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, flex: '0 0 40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: a.type === 'withdraw' ? 'var(--teal-50)' : a.type === 'reward' ? 'var(--orange-50)' : 'var(--green-50)',
              color: a.type === 'withdraw' ? 'var(--teal-600)' : a.type === 'reward' ? 'var(--orange-600)' : 'var(--green-600)' }}>
              {a.type === 'withdraw' ? <Icons.arrowUp size={18} /> : a.type === 'reward' ? <Icons.land size={18} /> : <Icons.arrowDown size={18} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{a.label}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{a.when}</div>
            </div>
            <div className="num" style={{ fontWeight: 700, fontSize: 14.5, color: a.note ? 'var(--orange-600)' : a.positive ? 'var(--green-600)' : 'var(--ink)' }}>
              {a.note || (a.positive ? '+' : '−') + D.fmtNaira(a.amount)}
            </div>
          </div>
        ))}
      </Card>

      <WithdrawSheet open={withdraw} onClose={() => setWithdraw(false)} />
    </div>
  );
}

function WithdrawSheet({ open, onClose }) {
  const D = window.DATA;
  const app = window.useApp();
  const toast = useToast();
  const [step, setStep] = useState(0); // 0 amount, 1 processing, 2 done
  const [amount, setAmount] = useState(50000);
  const [bank, setBank] = useState(0);
  useEffect(() => { if (open) { setStep(0); setAmount(Math.min(50000, app.balance)); } }, [open]);

  const [liveAccts, setLiveAccts] = useState([]);
  useEffect(() => {
    if (open && app.live && window.API) window.API.accounts().then((r) => setLiveAccts((r.accounts || []).map((a) => ({
      id: a.id, name: a.bankName, acct: '•••• ' + String(a.accountNumber).slice(-4), color: '#2b5666',
    })))).catch(() => {});
  }, [open, app.live]);
  const demoBanks = [
    { name: 'GTBank', acct: '•••• 4821', color: '#e35205' },
    { name: 'Access Bank', acct: '•••• 1190', color: '#003e7e' },
  ];
  const banks = app.live ? liveAccts : demoBanks;

  const submit = async () => {
    if (app.live && window.API) {
      setStep(1);
      try {
        await window.API.requestPayout({ amount, accountId: banks[bank] && banks[bank].id });
        app.doWithdraw(amount); setStep(2); if (app.reload) app.reload();
      } catch (e) { setStep(0); toast(e.message || 'Withdrawal failed'); }
    } else {
      setStep(1);
      setTimeout(() => { app.doWithdraw(amount); setStep(2); }, 2000);
    }
  };

  return (
    <Sheet open={open} onClose={step === 1 ? () => {} : onClose}>
      {step === 0 && (
        <div style={{ padding: '2px 2px' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800 }}>Withdraw funds</h3>
          <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>Available: <strong style={{ color: 'var(--ink)' }}>{D.fmtNaira(app.balance)}</strong></p>

          <div className="card card-pad" style={{ marginTop: 18, background: 'var(--surface-2)' }}>
            <div className="stat-label">Amount</div>
            <div className="row" style={{ alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span className="font-display" style={{ fontSize: 30, fontWeight: 800 }}>₦</span>
              <input type="number" value={amount} onChange={(e) => setAmount(Math.min(app.balance, Math.max(0, +e.target.value)))}
                style={{ border: 'none', background: 'transparent', fontSize: 30, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', width: '100%', outline: 'none', color: 'var(--ink)' }} />
            </div>
            <div className="row gap-2 wrap" style={{ marginTop: 12 }}>
              {[10000, 50000, 100000, app.balance].map((v, i) => (
                <button key={i} onClick={() => setAmount(v)} className="chip clickable" style={{ background: amount === v ? 'var(--orange-100)' : 'var(--surface-sunk)', color: amount === v ? 'var(--orange-700)' : 'var(--muted)' }}>
                  {i === 3 ? 'Max' : '₦' + (v / 1000) + 'k'}
                </button>
              ))}
            </div>
          </div>

          <div className="stat-label" style={{ margin: '18px 0 10px' }}>Withdraw to</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {banks.map((b, i) => (
              <button key={i} onClick={() => setBank(i)} className="row gap-3" style={{ padding: 14, borderRadius: 14, border: '1.5px solid', borderColor: bank === i ? 'var(--accent)' : 'var(--hairline)', background: bank === i ? 'var(--orange-50)' : 'var(--surface)', textAlign: 'left' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: b.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 40px' }}><Icons.bank size={20} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{b.name}</div>
                  <div className="font-mono muted" style={{ fontSize: 12.5 }}>{b.acct} · {app.user.name}</div>
                </div>
                {bank === i ? <Icons.checkCircle size={20} style={{ color: 'var(--accent)' }} /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--hairline)' }} />}
              </button>
            ))}
          </div>
          {app.live && banks.length === 0 && (
            <button onClick={() => { onClose(); app.nav('payouts'); }} className="row gap-2 center" style={{ width: '100%', padding: 12, color: 'var(--accent)', fontWeight: 700, fontSize: 13.5, justifyContent: 'center' }}>
              <Icons.plus size={15} /> Add a bank account to withdraw
            </button>
          )}
          <Btn block size="lg" style={{ marginTop: 18 }} disabled={amount < 1000 || (app.live && banks.length === 0)} onClick={submit} icon={<Icons.bolt />}>
            Withdraw {D.fmtNaira(amount)}
          </Btn>
          <p className="center muted" style={{ fontSize: 12, marginTop: 10 }}>{app.live ? 'Powered by Paystack · arrives in minutes' : 'Powered by Flutterwave · arrives in minutes'}</p>
        </div>
      )}

      {step === 1 && (
        <div className="center" style={{ padding: '24px 8px' }}>
          <div style={{ width: 60, height: 60, margin: '0 auto 20px', borderRadius: '50%', border: '4px solid var(--surface-sunk)', borderTopColor: 'var(--accent)', animation: 'spin .8s linear infinite' }} />
          <h3 style={{ fontSize: 20, fontWeight: 700 }}>Processing withdrawal…</h3>
          <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>Securely transferring via Flutterwave</p>
        </div>
      )}

      {step === 2 && (
        <div className="center" style={{ padding: '12px 4px 8px' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '6px auto 18px', background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spinIn .6s var(--spring)' }}><Icons.checkCircle size={48} /></div>
          <h3 style={{ fontSize: 24, fontWeight: 800 }}>Withdrawal sent!</h3>
          <p className="muted" style={{ fontSize: 15, marginTop: 8 }}>{D.fmtNaira(amount)} is on its way to {banks[bank].name} {banks[bank].acct}.</p>
          <Btn block size="lg" style={{ marginTop: 22 }} onClick={onClose}>Done</Btn>
        </div>
      )}
    </Sheet>
  );
}

/* ---- Global share sheet ---- */
function ShareSheet({ open, onClose }) {
  const app = window.useApp();
  const toast = useToast();
  const link = 'https://' + app.user.refLink;
  const channels = [
    { name: 'WhatsApp', icon: <Icons.whatsapp />, color: '#25D366' },
    { name: 'Copy link', icon: <Icons.copy />, color: 'var(--teal-600)' },
    { name: 'Facebook', icon: <Icons.share />, color: '#1877F2' },
    { name: 'Instagram', icon: <Icons.spark />, color: '#E1306C' },
  ];
  const act = (c) => { navigator.clipboard?.writeText(link); toast(c.name === 'Copy link' ? 'Link copied!' : `Shared to ${c.name}!`); onClose(); };
  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ padding: '2px 2px' }}>
        <div className="center">
          <div style={{ width: 64, height: 64, borderRadius: 18, margin: '0 auto 14px', background: 'var(--orange-50)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.share size={30} /></div>
          <h3 style={{ fontSize: 21, fontWeight: 800 }}>Share & earn ₦4,000</h3>
          <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>For every person who buys land through your link.</p>
        </div>
        <div className="row gap-2" style={{ background: 'var(--surface-sunk)', borderRadius: 12, padding: '12px 14px', margin: '18px 0' }}>
          <span className="font-mono" style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.user.refLink}</span>
          <button onClick={() => { navigator.clipboard?.writeText(link); toast('Link copied!'); }} style={{ color: 'var(--accent)', display: 'flex' }}><Icons.copy size={18} /></button>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {channels.map((c) => (
            <button key={c.name} onClick={() => act(c)} className="center" style={{ padding: '14px 6px', borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--hairline)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', margin: '0 auto 8px', background: `color-mix(in srgb, ${c.color} 16%, transparent)`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.icon}</div>
              <div style={{ fontSize: 11.5, fontWeight: 700 }}>{c.name}</div>
            </button>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

Object.assign(window, { Wallet, ShareSheet });
