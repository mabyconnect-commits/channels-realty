/* ============================================================
   RANK & BADGES  (exports window.Badges)
   ============================================================ */
function Badges() {
  const D = window.DATA;
  const app = window.useApp();
  const tier = D.currentTier(app.teamTotal);
  const next = D.nextTier(app.teamTotal);
  const curIdx = D.tiers.findIndex((t) => t.id === tier.id);

  const achievements = [
    { id: 'a1', name: 'First Referral', icon: <Icons.users />, got: true, color: 'var(--teal-600)' },
    { id: 'a2', name: 'First Land', icon: <Icons.land />, got: true, color: 'var(--orange-500)' },
    { id: 'a3', name: 'Kit Unlocked', icon: <Icons.gift />, got: true, color: 'var(--orange-600)' },
    { id: 'a4', name: '100 Team', icon: <Icons.trophy />, got: true, color: '#d9a23e' },
    { id: 'a5', name: '7-Day Streak', icon: <Icons.fire />, got: false, color: '#d9a23e' },
    { id: 'a6', name: 'Webinar Host', icon: <Icons.spark />, got: false, color: 'var(--teal-700)' },
  ];

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Rank & badges" sub="Climb the ladder. Each rank raises your commission and unlocks perks." />

      {/* Current rank hero */}
      <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative',
        background: `linear-gradient(150deg, ${tier.color}, color-mix(in srgb, ${tier.color} 55%, #000))`, color: '#fff', padding: 'clamp(22px,4vw,30px)' }}>
        <div style={{ position: 'absolute', top: -40, right: -20, opacity: .16 }}><Icons.trophy size={180} /></div>
        <div className="row gap-4" style={{ position: 'relative', flexWrap: 'wrap' }}>
          <RankBadge tier={tier} size={72} current />
          <div style={{ flex: 1, minWidth: 180 }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,.75)' }}>Current rank</div>
            <div className="font-display" style={{ fontSize: 30, fontWeight: 800, marginTop: 2 }}>{tier.name}</div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', marginTop: 6, maxWidth: 380 }}>{tier.blurb}</p>
          </div>
          <div className="row gap-3">
            <div style={{ background: 'rgba(255,255,255,.16)', borderRadius: 14, padding: '12px 18px', textAlign: 'center' }}>
              <div className="font-display num" style={{ fontSize: 26, fontWeight: 800 }}>{tier.l1}%</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>Level 1</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.16)', borderRadius: 14, padding: '12px 18px', textAlign: 'center' }}>
              <div className="font-display num" style={{ fontSize: 26, fontWeight: 800 }}>{tier.l2}%</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>Level 2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ladder */}
      <Card pad={false}>
        <div style={{ padding: '18px 20px 6px' }}><h3 style={{ fontSize: 17, fontWeight: 700 }}>The rank ladder</h3></div>
        <div style={{ padding: '8px 20px 18px' }}>
          {D.tiers.map((t, i) => {
            const reached = i <= curIdx;
            const isCurrent = t.id === tier.id;
            const isNext = next && t.id === next.id;
            const prog = isNext ? Math.min(100, ((app.teamTotal - tier.team) / (next.team - tier.team)) * 100) : 0;
            return (
              <div key={t.id} className="row gap-3" style={{ padding: '12px 0', position: 'relative' }}>
                {i < D.tiers.length - 1 && <div style={{ position: 'absolute', left: 27, top: 56, bottom: -12, width: 2, background: reached ? t.color : 'var(--hairline)', opacity: reached ? .4 : 1 }} />}
                <RankBadge tier={t} size={54} locked={!reached} current={isCurrent} />
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div className="row between">
                    <div className="row gap-2">
                      <span className="font-display" style={{ fontWeight: 700, fontSize: 16, color: reached ? 'var(--on-surface)' : 'var(--faint)' }}>{t.name}</span>
                      {isCurrent && <span className="chip chip-accent" style={{ padding: '2px 9px', fontSize: 10.5 }}>YOU</span>}
                    </div>
                    <span className="num" style={{ fontWeight: 700, fontSize: 13.5, color: reached ? t.color : 'var(--faint)' }}>{t.l1}% + {t.l2}%</span>
                  </div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{t.team === 0 ? 'Starting rank' : t.team.toLocaleString() + ' team members'}</div>
                  {isNext && (
                    <div style={{ marginTop: 8 }}>
                      <Progress value={prog} variant="teal" />
                      <div className="muted" style={{ fontSize: 11.5, marginTop: 4, fontWeight: 600 }}>{next.team - app.teamTotal} more to unlock</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievements */}
      <div className="sec-head"><h3>Achievements</h3><span className="chip">{achievements.filter(a => a.got).length}/{achievements.length}</span></div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 14 }}>
        {achievements.map((a) => (
          <Card key={a.id} className="center" style={{ padding: 16, opacity: a.got ? 1 : .55 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: a.got ? `color-mix(in srgb, ${a.color} 16%, transparent)` : 'var(--surface-sunk)',
              color: a.got ? a.color : 'var(--faint)' }}>
              {a.got ? a.icon : <Icons.lock size={20} />}
            </div>
            <div style={{ fontWeight: 700, fontSize: 12.5 }}>{a.name}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

window.Badges = Badges;
