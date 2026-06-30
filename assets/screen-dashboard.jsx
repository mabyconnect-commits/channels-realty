/* ============================================================
   DASHBOARD  (exports window.Dashboard)
   ============================================================ */
function Dashboard() {
  const D = window.DATA;
  const app = window.useApp();
  const { user, nav } = app;
  const toast = useToast();
  const tier = D.currentTier(app.teamTotal);
  const next = D.nextTier(app.teamTotal);
  const teamProg = next ? Math.min(100, Math.round(((app.teamTotal - tier.team) / (next.team - tier.team)) * 100)) : 100;

  // next sqm milestone
  const nextMs = D.milestones.find((m) => !app.claimed.includes(m.id) && app.directRefs < m.refs)
    || D.milestones.find((m) => !app.claimed.includes(m.id));
  const msProg = nextMs ? Math.min(100, Math.round((app.directRefs / nextMs.refs) * 100)) : 100;

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Verified Investor + Grand Launch */}
      <VerifiedInvestorCard compact />
      <LaunchDashCard />

      {/* Greeting (desktop) */}
      <div className="d-only row between" style={{ marginTop: 4 }}>
        <div>
          <div className="muted" style={{ fontWeight: 600, fontSize: 14 }}>Welcome back,</div>
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>{user.first} 👋</h2>
        </div>
        <div className="chip chip-accent" style={{ padding: '8px 14px' }}>
          <Icons.trophy size={15} /> {tier.name} · {tier.l1}% + {tier.l2}%
        </div>
      </div>

      {/* HERO BALANCE */}
      <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(150deg, var(--teal-800) 0%, var(--teal-600) 100%)', color: '#fff',
        boxShadow: 'var(--sh-teal)' }}>
        <div style={{ position: 'absolute', top: -90, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,116,46,.32), transparent 62%)' }} />
        <div style={{ position: 'relative', padding: 'clamp(20px,4vw,30px)' }}>
          <div className="row between" style={{ alignItems: 'flex-start' }}>
            <div>
              <div className="row gap-2" style={{ color: 'rgba(255,255,255,.78)', fontSize: 13, fontWeight: 600 }}>
                <Icons.wallet size={15} /> Withdrawable balance
              </div>
              <div className="font-display" style={{ fontSize: 'clamp(34px,7vw,46px)', fontWeight: 800, marginTop: 6, letterSpacing: '-.03em' }}>
                <CountNaira value={app.balance} />
              </div>
              <div className="row gap-3 wrap" style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,.72)', fontWeight: 600 }}>
                <span>Pending: <span className="num">{D.fmtNaira(app.pending)}</span></span>
                <span style={{ opacity: .5 }}>·</span>
                <span>Lifetime: <span className="num">{D.fmtNaira(app.lifetime)}</span></span>
              </div>
            </div>
            <div className="chip d-only" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}>
              <Icons.trending size={15} /> +18% est. appreciation
            </div>
          </div>
          <div className="row gap-3 wrap" style={{ marginTop: 22 }}>
            <Btn variant="primary" onClick={() => nav('wallet')} icon={<Icons.arrowUp />}>Withdraw</Btn>
            <Btn variant="ghost" onClick={() => app.openShare()} icon={<Icons.share />}
              style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}>Share & earn</Btn>
            <Btn variant="ghost" onClick={() => nav('milestones')} icon={<Icons.land />}
              style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }} className="d-only">Claim land</Btn>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
        <StatCard icon={<Icons.users />} label="Team total" value={app.teamTotal} accent="var(--teal-600)" onClick={() => nav('team')} sub={`${app.directRefs} direct · ${app.level2} indirect`} />
        <StatCard icon={<Icons.land />} label="Land owned" value={app.landSqm} suffix=" sqm" accent="var(--orange-500)" onClick={() => nav('milestones')} sub={`≈ ${D.sqmToUSD(app.landSqm)} value`} />
        <StatCard icon={<Icons.bolt />} label="Points" value={app.points} accent="var(--gold)" onClick={() => nav('tasks')} sub={`${Math.floor(app.points / D.POINTS_PER_SQM)} sqm redeemable`} />
        <StatCard icon={<Icons.trophy />} label="Rank" value={tier.name} accent={tier.color} text onClick={() => nav('badges')} sub={next ? `${next.team - app.teamTotal} to ${next.name}` : 'Max rank'} />
      </div>

      {/* TWO COLUMN: rank progress + next milestone */}
      <div className="grid d-grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Rank progress */}
        <Card>
          <div className="row between" style={{ marginBottom: 16 }}>
            <div className="row gap-3">
              <RankBadge tier={tier} size={46} current />
              <div>
                <div className="eyebrow" style={{ color: 'var(--muted)' }}>Your rank</div>
                <div className="font-display" style={{ fontSize: 19, fontWeight: 700 }}>{tier.name}</div>
              </div>
            </div>
            <button className="chip" onClick={() => nav('badges')}>Ranks <Icons.chevR size={13} /></button>
          </div>
          {next ? (
            <>
              <div className="row between" style={{ fontSize: 13, marginBottom: 8 }}>
                <span className="muted" style={{ fontWeight: 600 }}>{app.teamTotal} / {next.team} team to <strong style={{ color: 'var(--ink)' }}>{next.name}</strong></span>
                <span className="num" style={{ fontWeight: 700, color: 'var(--accent)' }}>{teamProg}%</span>
              </div>
              <Progress value={teamProg} variant="teal" tall />
              <div className="row gap-3 wrap" style={{ marginTop: 16 }}>
                <MiniRate label="Lv1 now" value={tier.l1 + '%'} />
                <MiniRate label="Lv2 now" value={tier.l2 + '%'} />
                <MiniRate label={`At ${next.name}`} value={next.l1 + '% + ' + next.l2 + '%'} accent />
              </div>
            </>
          ) : <div className="chip chip-gold">🏆 Top rank reached — Channel Chief</div>}
        </Card>

        {/* Next milestone */}
        <Card>
          <div className="row between" style={{ marginBottom: 16 }}>
            <div className="eyebrow" style={{ color: 'var(--muted)' }}>Next land reward</div>
            <button className="chip" onClick={() => nav('milestones')}>All <Icons.chevR size={13} /></button>
          </div>
          {nextMs ? (
            <div className="row gap-3" style={{ alignItems: 'center' }}>
              <Ring value={msProg} size={92} sw={9}>
                <div className="num font-display" style={{ fontSize: 19, fontWeight: 800 }}>{msProg}%</div>
              </Ring>
              <div style={{ flex: 1 }}>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>{nextMs.title}</div>
                <div className="muted" style={{ fontSize: 13.5, marginTop: 3 }}>{app.directRefs} / {nextMs.refs} referrals</div>
                {msProg >= 100
                  ? <Btn size="sm" style={{ marginTop: 12 }} onClick={() => nav('milestones')} icon={<Icons.gift />}>Claim now</Btn>
                  : <button className="row gap-2" onClick={() => app.openShare()} style={{ marginTop: 12, color: 'var(--accent)', fontWeight: 700, fontSize: 13.5 }}><Icons.share size={15} /> Refer {nextMs.refs - app.directRefs} more</button>}
              </div>
            </div>
          ) : <div className="chip chip-green">All milestones claimed 🎉</div>}
        </Card>
      </div>

      {/* REFERRAL LINK */}
      <Card style={{ background: 'var(--surface)' }}>
        <div className="row between wrap" style={{ gap: 14 }}>
          <div className="row gap-3">
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--orange-100)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 46px' }}><Icons.share size={22} /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Your referral link</div>
              <div className="font-mono muted" style={{ fontSize: 13, marginTop: 2 }}>{user.refLink}</div>
            </div>
          </div>
          <div className="row gap-2">
            <Btn size="sm" variant="outline" icon={<Icons.copy size={15} />} onClick={() => { navigator.clipboard?.writeText('https://' + user.refLink); toast('Link copied!'); }}>Copy</Btn>
            <Btn size="sm" onClick={() => app.openShare()} icon={<Icons.share size={15} />}>Share</Btn>
          </div>
        </div>
      </Card>

      {/* ACTIVITY + PROMO */}
      <div className="grid d-grid-2" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card pad={false}>
          <div className="row between" style={{ padding: '18px 20px 12px' }}>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Recent activity</h3>
            <button className="chip" onClick={() => nav('wallet')}>Wallet <Icons.chevR size={13} /></button>
          </div>
          <div>
            {D.activity.slice(0, 5).map((a, i) => (
              <div key={a.id} className="row gap-3" style={{ padding: '12px 20px', borderTop: '1px solid var(--line-2)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, flex: '0 0 38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: a.type === 'withdraw' ? 'var(--teal-50)' : a.type === 'reward' ? 'var(--orange-50)' : 'var(--green-50)',
                  color: a.type === 'withdraw' ? 'var(--teal-600)' : a.type === 'reward' ? 'var(--orange-600)' : 'var(--green-600)' }}>
                  {a.type === 'withdraw' ? <Icons.arrowUp size={18} /> : a.type === 'reward' ? <Icons.land size={18} /> : <Icons.bolt size={18} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.label}</div>
                  <div className="muted" style={{ fontSize: 12.5 }}>{a.when}</div>
                </div>
                <div className="num" style={{ fontWeight: 700, fontSize: 14.5, color: a.note ? 'var(--orange-600)' : a.positive ? 'var(--green-600)' : 'var(--ink)' }}>
                  {a.note || (a.positive ? '+' : '−') + D.fmtNaira(a.amount)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* PROMO */}
        <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', position: 'relative', minHeight: 200,
          background: 'linear-gradient(160deg, var(--orange-500), var(--orange-600))', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 22 }}>
          <div style={{ position: 'absolute', top: -40, right: -30, opacity: .18 }}><Icons.land size={180} /></div>
          <div style={{ position: 'relative' }}>
            <div className="chip" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', marginBottom: 12 }}>Buy more land</div>
            <div className="font-display" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>Become a bigger land owner</div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.85)', marginTop: 8 }}>Top up from ₦20,000. Lock in today's price before the next estate revaluation.</p>
            <Btn variant="ghost" size="sm" style={{ background: '#fff', color: 'var(--orange-600)', marginTop: 14 }} onClick={() => nav('milestones')} iconR={<Icons.arrowRight size={15} />}>Buy sqm</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, suffix, accent, sub, text, onClick }) {
  return (
    <Card hover className="clickable" onClick={onClick} style={{ padding: 16 }}>
      <div className="row between" style={{ marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `color-mix(in srgb, ${accent} 14%, transparent)`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <Icons.chevR size={15} style={{ color: 'var(--faint)' }} />
      </div>
      <div className="stat-label" style={{ fontSize: 11.5 }}>{label}</div>
      <div className="font-display" style={{ fontSize: text ? 19 : 25, fontWeight: 700, marginTop: 3, color: text ? accent : 'var(--on-surface)' }}>
        {text ? value : <CountNum value={value} suffix={suffix} />}
      </div>
      {sub && <div className="muted" style={{ fontSize: 11.5, marginTop: 3 }}>{sub}</div>}
    </Card>
  );
}

function MiniRate({ label, value, accent }) {
  return (
    <div style={{ background: accent ? 'var(--orange-50)' : 'var(--surface-sunk)', borderRadius: 10, padding: '8px 12px', flex: 1, minWidth: 90 }}>
      <div className="stat-label" style={{ fontSize: 10.5 }}>{label}</div>
      <div className="num font-display" style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: accent ? 'var(--accent)' : 'var(--ink)' }}>{value}</div>
    </div>
  );
}

window.Dashboard = Dashboard;
