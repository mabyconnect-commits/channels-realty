/* ============================================================
   MILESTONES & LAND  (exports window.Milestones)
   ============================================================ */
function Milestones() {
  const D = window.DATA;
  const app = window.useApp();
  const [claiming, setClaiming] = useState(null); // milestone being claimed (sheet)

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Milestones & land" sub="Every referral earns ~1 sqm. Hit a milestone and claim free land." />

      {/* Land owned banner */}
      <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative' }}>
        <LandPlaceholder h={170} radius="var(--r-xl)" label="">
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(27,58,70,.92), rgba(43,86,102,.55))' }} />
          <div style={{ position: 'relative', width: '100%', padding: 'clamp(18px,4vw,26px)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div className="row gap-2" style={{ color: 'rgba(255,255,255,.8)', fontSize: 13, fontWeight: 600 }}><Icons.land size={15} /> Total land owned</div>
              <div className="font-display" style={{ fontSize: 'clamp(34px,7vw,46px)', fontWeight: 800, marginTop: 4 }}><CountNum value={app.landSqm} suffix=" sqm" /></div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.78)', marginTop: 2 }}>≈ {D.sqmToUSD(app.landSqm)} · Channels Gardens, Epe, Lagos</div>
            </div>
            <Btn variant="primary" onClick={() => setClaiming({ buy: true })} icon={<Icons.plus />}>Buy more sqm</Btn>
          </div>
        </LandPlaceholder>
      </div>

      {/* Parcels */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
        {app.parcels.map((p) => (
          <Card key={p.id} hover className="clickable" onClick={() => app.nav('property', p)}>
            <div className="row between" style={{ marginBottom: 14 }}>
              <span className="chip chip-teal"><Icons.pin size={13} /> {p.city}</span>
              <span className={'chip ' + (p.status === 'Allocated' ? 'chip-green' : 'chip-gold')}>{p.status}</span>
            </div>
            <div className="font-display" style={{ fontSize: 22, fontWeight: 800 }}>{p.sqm} sqm</div>
            <div className="muted" style={{ fontSize: 13.5 }}>{p.estate}</div>
            <div className="row between" style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line-2)' }}>
              <div><div className="stat-label" style={{ fontSize: 10.5 }}>Est. value</div><div className="num" style={{ fontWeight: 700, fontSize: 15 }}>{D.fmtNaira(p.sqm * D.NGN_PER_SQM)}</div></div>
              <div className="chip chip-green"><Icons.trending size={13} /> +{p.appr}%</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Milestone ladder */}
      <div className="sec-head" style={{ marginTop: 6 }}>
        <h3>Referral milestones</h3>
        <span className="chip chip-accent"><Icons.users size={13} /> {app.directRefs} referrals</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
        {D.milestones.map((m) => {
          const claimed = app.claimed.includes(m.id);
          const reached = app.directRefs >= m.refs;
          const prog = Math.min(100, Math.round((app.directRefs / m.refs) * 100));
          return (
            <Card key={m.id} style={{ position: 'relative', overflow: 'hidden',
              borderColor: reached && !claimed ? 'var(--accent)' : 'var(--hairline)',
              boxShadow: reached && !claimed ? '0 0 0 3px var(--orange-50)' : 'var(--sh-sm)' }}>
              <div className="row gap-3" style={{ marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, flex: '0 0 48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: claimed ? 'var(--green-50)' : m.type === 'kit' ? 'var(--orange-100)' : m.type === 'plot' ? 'var(--teal-100)' : 'var(--orange-50)',
                  color: claimed ? 'var(--green-600)' : m.type === 'plot' ? 'var(--teal-700)' : 'var(--orange-600)' }}>
                  {claimed ? <Icons.checkCircle size={24} /> : m.type === 'kit' ? <Icons.gift size={24} /> : m.type === 'plot' ? <Icons.home size={24} /> : <Icons.land size={24} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-display" style={{ fontSize: 17, fontWeight: 700 }}>{m.title}</div>
                  <div className="muted" style={{ fontSize: 13 }}>{m.refs} referrals{m.reward ? ' · ' + m.reward : ''}</div>
                </div>
              </div>
              <div className="row between" style={{ fontSize: 12.5, marginBottom: 7 }}>
                <span className="muted" style={{ fontWeight: 600 }}>{Math.min(app.directRefs, m.refs)} / {m.refs}</span>
                <span className="num" style={{ fontWeight: 700, color: claimed ? 'var(--green-600)' : 'var(--accent)' }}>{claimed ? 'Claimed' : prog + '%'}</span>
              </div>
              <Progress value={prog} variant={claimed ? 'green' : ''} />
              <div style={{ marginTop: 14 }}>
                {claimed ? (
                  <Btn variant="ghost" size="sm" block disabled icon={<Icons.check size={15} />}>Reward claimed</Btn>
                ) : reached ? (
                  <Btn size="sm" block onClick={() => setClaiming(m)} icon={<Icons.gift size={15} />}>Claim reward</Btn>
                ) : (
                  <Btn variant="outline" size="sm" block onClick={() => app.openShare()} icon={<Icons.share size={15} />}>Refer {m.refs - app.directRefs} more</Btn>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Claim / buy sheet */}
      <ClaimSheet claiming={claiming} onClose={() => setClaiming(null)} />
    </div>
  );
}

function ClaimSheet({ claiming, onClose }) {
  const D = window.DATA;
  const app = window.useApp();
  const toast = useToast();
  const [done, setDone] = useState(false);
  const [amount, setAmount] = useState(20000);
  useEffect(() => { if (claiming) setDone(false); }, [claiming]);
  if (!claiming) return null;

  const isBuy = claiming.buy;
  const sqm = isBuy ? Math.round(amount / D.NGN_PER_SQM * 10) / 10 : (claiming.sqm || 0);

  const confirm = () => {
    if (isBuy) {
      app.buyLand(sqm);
      toast(`+${sqm} sqm added to your land 🌱`);
      onClose();
    } else {
      app.claimMilestone(claiming);
      setDone(true);
      app.fireConfetti();
    }
  };

  return (
    <Sheet open={!!claiming} onClose={onClose}>
      {done ? (
        <div className="center" style={{ padding: '12px 4px 8px' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '6px auto 18px', background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spinIn .6s var(--spring)' }}>
            <Icons.checkCircle size={48} />
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 800 }}>Reward claimed!</h3>
          <p className="muted" style={{ fontSize: 15, marginTop: 8 }}>
            {claiming.type === 'land' || claiming.type === 'plot' ? `${claiming.sqm} sqm added to your Channels Gardens holding.` : claiming.reward}
          </p>
          <Btn block size="lg" style={{ marginTop: 22 }} onClick={onClose}>Done</Btn>
        </div>
      ) : (
        <div style={{ padding: '4px 2px' }}>
          <div className="center">
            <div style={{ width: 72, height: 72, borderRadius: 18, margin: '0 auto 16px', background: 'var(--orange-50)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isBuy ? <Icons.land size={36} /> : claiming.type === 'kit' ? <Icons.gift size={36} /> : <Icons.land size={36} />}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800 }}>{isBuy ? 'Buy more land' : claiming.title}</h3>
            <p className="muted" style={{ fontSize: 14.5, marginTop: 6 }}>{isBuy ? 'Own from ₦20,000. Pay securely with Paystack.' : 'Confirm to add this reward to your account.'}</p>
          </div>

          {isBuy && (
            <div className="card card-pad" style={{ marginTop: 20, background: 'var(--surface-2)' }}>
              <div className="row between"><span className="stat-label">You get</span><span className="chip chip-accent">{sqm} sqm</span></div>
              <div className="font-display num" style={{ fontSize: 34, fontWeight: 800, margin: '6px 0' }}>₦{amount.toLocaleString()}</div>
              <input type="range" min="20000" max="500000" step="20000" value={amount} onChange={(e) => setAmount(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
              <div className="row between muted" style={{ fontSize: 12, fontWeight: 600 }}><span>₦20k</span><span>≈ {D.fmtUSD(amount / D.USD_RATE)}</span></div>
            </div>
          )}

          {!isBuy && (
            <div className="card card-pad" style={{ marginTop: 18, background: 'var(--surface-2)' }}>
              <div className="row between" style={{ fontSize: 14 }}><span className="muted" style={{ fontWeight: 600 }}>Reward</span><span style={{ fontWeight: 700 }}>{claiming.title}</span></div>
              <hr className="hr" style={{ margin: '12px 0' }} />
              <div className="row between" style={{ fontSize: 14 }}><span className="muted" style={{ fontWeight: 600 }}>Allocation</span><span style={{ fontWeight: 700 }}>Channels Gardens, Epe</span></div>
            </div>
          )}

          <Btn block size="lg" style={{ marginTop: 18 }} onClick={confirm} icon={isBuy ? <Icons.bolt /> : <Icons.gift />}>
            {isBuy ? `Pay ₦${amount.toLocaleString()}` : 'Claim reward'}
          </Btn>
        </div>
      )}
    </Sheet>
  );
}

window.Milestones = Milestones;
