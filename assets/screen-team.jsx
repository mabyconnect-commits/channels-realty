/* ============================================================
   TEAM / REFERRALS  (exports window.Team)
   ============================================================ */
function Team() {
  const D = window.DATA;
  const app = window.useApp();
  const toast = useToast();
  const [level, setLevel] = useState('all');
  const tier = D.currentTier(app.teamTotal);
  const next = D.nextTier(app.teamTotal);

  const list = D.team.filter((m) => level === 'all' ? true : m.level === Number(level));

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Your team" sub="Two levels of referrals — earn commission on every plot they buy." />

      {/* Network summary */}
      <div className="grid d-grid-2" style={{ gridTemplateColumns: '1.1fr 1fr', gap: 16 }}>
        <Card>
          <div className="row between" style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Network overview</h3>
            <span className="chip chip-teal">{tier.name}</span>
          </div>
          <div className="row" style={{ alignItems: 'center', gap: 18 }}>
            <Ring value={next ? Math.min(100, ((app.teamTotal - tier.team) / (next.team - tier.team)) * 100) : 100} size={120} sw={12} color="var(--teal-600)">
              <div className="font-display num" style={{ fontSize: 30, fontWeight: 800 }}>{app.teamTotal}</div>
              <div className="stat-label" style={{ fontSize: 10 }}>team</div>
            </Ring>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <NetRow color="var(--teal-600)" label="Level 1 — Direct" value={app.directRefs} rate={tier.l1 + '%'} />
              <NetRow color="var(--orange-500)" label="Level 2 — Indirect" value={app.level2} rate={tier.l2 + '%'} />
              {next && <div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{next.team - app.teamTotal} more to unlock {next.name} ({next.l1}% + {next.l2}%)</div>}
            </div>
          </div>
        </Card>

        {/* Invite card */}
        <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(155deg, var(--teal-700), var(--teal-800))', color: '#fff', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--orange-300)' }}>Grow your channel</div>
            <div className="font-display" style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>Earn ₦4,000 per referral</div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.8)', marginTop: 6 }}>Plus a Lv2 override when your team refers. Share your link anywhere.</p>
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="row gap-2" style={{ background: 'rgba(255,255,255,.12)', borderRadius: 12, padding: '10px 14px', marginBottom: 10 }}>
              <span className="font-mono" style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.user.refLink}</span>
              <button onClick={() => { navigator.clipboard?.writeText('https://' + app.user.refLink); toast('Link copied!'); }} style={{ color: 'var(--orange-300)', display: 'flex' }}><Icons.copy size={17} /></button>
            </div>
            <div className="row gap-2">
              <Btn variant="primary" size="sm" block icon={<Icons.whatsapp size={15} />} onClick={() => app.openShare()}>WhatsApp</Btn>
              <Btn variant="ghost" size="sm" block style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }} icon={<Icons.share size={15} />} onClick={() => app.openShare()}>More</Btn>
            </div>
          </div>
        </div>
      </div>

      {/* Member list */}
      <Card pad={false}>
        <div className="row between wrap" style={{ padding: '16px 20px', gap: 12 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Members ({list.length})</h3>
          <Segmented value={level} onChange={setLevel} options={[{ value: 'all', label: 'All' }, { value: '1', label: 'Level 1' }, { value: '2', label: 'Level 2' }]} />
        </div>
        {list.map((m, i) => (
          <div key={i} className="row gap-3" style={{ padding: '13px 20px', borderTop: '1px solid var(--line-2)' }}>
            <div style={{ position: 'relative', flex: '0 0 44px' }}>
              <Avatar src={m.avatar} name={m.name} size={44} />
              <span style={{ position: 'absolute', bottom: -1, right: -1, width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--surface)', background: m.active ? 'var(--green-500)' : 'var(--faint)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row gap-2">
                <span style={{ fontWeight: 700, fontSize: 14.5 }}>{m.name}</span>
                <span className="chip" style={{ padding: '2px 8px', fontSize: 10.5, background: m.level === 1 ? 'var(--teal-100)' : 'var(--orange-100)', color: m.level === 1 ? 'var(--teal-800)' : 'var(--orange-700)' }}>Lv{m.level}</span>
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{m.refs} referrals · joined {m.joined}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="num" style={{ fontWeight: 700, fontSize: 14 }}>{D.fmtNaira(m.vol)}</div>
              <div className="muted" style={{ fontSize: 11.5 }}>volume</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function NetRow({ color, label, value, rate }) {
  return (
    <div className="row between">
      <div className="row gap-2"><span className="dot" style={{ background: color }} /><span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span></div>
      <div className="row gap-2">
        <span className="num font-display" style={{ fontWeight: 800, fontSize: 17 }}>{value}</span>
        <span className="chip" style={{ padding: '2px 8px', fontSize: 11, background: 'var(--surface-sunk)' }}>{rate}</span>
      </div>
    </div>
  );
}

function PageHead({ title, sub }) {
  return (
    <div className="d-only">
      <h2 style={{ fontSize: 28, fontWeight: 700 }}>{title}</h2>
      {sub && <p className="muted" style={{ fontSize: 15, marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

Object.assign(window, { Team, PageHead });
