/* ============================================================
   LEADERBOARD · GENEALOGY · EARNINGS ANALYTICS · MARKETING KIT
   ============================================================ */
function Leaderboard() {
  const D = window.DATA;
  const L = window.DATA2.leaderboard;
  const [scope, setScope] = useState('all');
  const top3 = L.slice(0, 3);
  const order = [top3[1], top3[0], top3[2]];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="row between wrap" style={{ gap: 12 }}>
        <PageHead title="Leaderboard" sub="Top channels by team size and earnings this season." />
        <Segmented value={scope} onChange={setScope} options={[{ value: 'all', label: 'All-time' }, { value: 'month', label: 'This month' }]} />
      </div>
      {/* Podium */}
      <div style={{ borderRadius: 'var(--r-xl)', background: 'linear-gradient(160deg, var(--teal-800), var(--teal-600))', padding: '28px 18px 22px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -20, opacity: .12 }}><Icons.trophy size={170} /></div>
        <div className="row" style={{ alignItems: 'flex-end', justifyContent: 'center', gap: 12, position: 'relative' }}>
          {order.map((u, idx) => {
            const place = u.rank;
            const h = place === 1 ? 110 : place === 2 ? 82 : 66;
            const medal = place === 1 ? '#d9a23e' : place === 2 ? '#c7cdd2' : '#cd7f49';
            return (
              <div key={u.name} style={{ textAlign: 'center', flex: 1, maxWidth: 120 }}>
                <Avatar src={u.avatar} name={u.name} size={place === 1 ? 60 : 48} ring />
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 12.5, marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name.split(' ')[0]}</div>
                <div className="num" style={{ color: 'var(--orange-300)', fontSize: 12, fontWeight: 700 }}>{D.fmtNaira(u.earnings)}</div>
                <div style={{ height: h, marginTop: 8, borderRadius: '10px 10px 0 0', background: `linear-gradient(180deg, ${medal}, color-mix(in srgb, ${medal} 60%, transparent))`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8 }}>
                  <span className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{place}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Rest of list */}
      <Card pad={false}>
        {L.map((u) => (
          <div key={u.rank} className="row gap-3" style={{ padding: '13px 18px', borderTop: u.rank > 1 ? '1px solid var(--line-2)' : 'none', background: u.me ? 'var(--orange-50)' : 'transparent' }}>
            <span className="num font-display" style={{ fontSize: 16, fontWeight: 800, width: 26, color: u.rank <= 3 ? 'var(--accent)' : 'var(--faint)' }}>{u.rank}</span>
            <Avatar src={u.avatar} name={u.name} size={42} ring={u.me} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row gap-2"><span style={{ fontWeight: 700, fontSize: 14.5 }}>{u.name}</span>{u.me && <span className="chip chip-accent" style={{ padding: '1px 8px', fontSize: 10 }}>You</span>}</div>
              <div className="muted" style={{ fontSize: 12 }}>{u.badge} · {u.team.toLocaleString()} team</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="num" style={{ fontWeight: 700, fontSize: 14 }}>{D.fmtNaira(u.earnings)}</div>
              <div className={'row gap-2'} style={{ justifyContent: 'flex-end', color: u.up ? 'var(--green-600)' : 'var(--red-500)', fontSize: 11.5, fontWeight: 700 }}>
                {u.up ? <Icons.arrowUp size={11} /> : <Icons.arrowDown size={11} />}{u.up ? 'Rising' : 'Steady'}
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function Genealogy() {
  const D = window.DATA;
  const root = window.DATA2.tree;
  const Node = ({ n, lvl }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 9, minWidth: 130,
        background: lvl === 0 ? 'var(--teal-700)' : 'var(--surface)', borderColor: lvl === 0 ? 'var(--teal-700)' : 'var(--hairline)' }}>
        <Avatar src={n.avatar} name={n.name} size={34} />
        <div><div style={{ fontWeight: 700, fontSize: 13, color: lvl === 0 ? '#fff' : 'var(--ink)' }}>{n.name}</div><div style={{ fontSize: 11, color: lvl === 0 ? 'rgba(255,255,255,.7)' : 'var(--muted)' }}>{n.refs} refs</div></div>
      </div>
      {n.children && n.children.length > 0 && (
        <>
          <div style={{ width: 2, height: 18, background: 'var(--hairline)' }} />
          <div className="row" style={{ gap: 16, alignItems: 'flex-start' }}>
            {n.children.map((c, i) => <Node key={i} n={c} lvl={lvl + 1} />)}
          </div>
        </>
      )}
    </div>
  );
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="My network tree" sub="Visualise your downline across two earning levels." />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
        {[['Direct (Lv1)', 68, 'var(--teal-600)'], ['Indirect (Lv2)', 146, 'var(--orange-500)'], ['Total team', 214, 'var(--gold)']].map(([l, v, c]) => (
          <Card key={l} style={{ padding: 16 }}><div className="dot" style={{ background: c }} /><div className="font-display num" style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>{v}</div><div className="muted" style={{ fontSize: 12.5 }}>{l}</div></Card>
        ))}
      </div>
      <Card style={{ overflowX: 'auto' }} className="hide-scroll">
        <div style={{ minWidth: 'min-content', padding: '10px 0', display: 'flex', justifyContent: 'center' }}>
          <Node n={root} lvl={0} />
        </div>
      </Card>
    </div>
  );
}

function EarningsAnalytics() {
  const D = window.DATA;
  const trend = window.DATA2.earningsTrend;
  const labels = window.DATA2.earningsMonths;
  const max = Math.max(...trend);
  const total = trend.reduce((a, b) => a + b, 0);
  const sources = [['Lv1 commissions', 68, 'var(--orange-500)'], ['Lv2 overrides', 22, 'var(--teal-600)'], ['Milestone bonuses', 10, 'var(--gold)']];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Earnings analytics" sub="Track how your channel income is growing." />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
        {[['Last 7 months', D.fmtNaira(total), 'var(--green-600)'], ['Best month', D.fmtNaira(max), 'var(--accent)'], ['Avg / month', D.fmtNaira(Math.round(total / 7)), 'var(--teal-600)']].map(([l, v, c]) => (
          <Card key={l} style={{ padding: 16 }}><div className="stat-label" style={{ fontSize: 11 }}>{l}</div><div className="font-display num" style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: c }}>{v}</div></Card>
        ))}
      </div>
      {/* Bar chart */}
      <Card>
        <div className="row between" style={{ marginBottom: 18 }}><h3 style={{ fontSize: 17, fontWeight: 700 }}>Monthly earnings</h3><span className="chip chip-green"><Icons.trending size={13} /> +217%</span></div>
        <div className="row" style={{ alignItems: 'flex-end', gap: 'clamp(6px,2vw,16px)', height: 180 }}>
          {trend.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div className="num" style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)' }}>{Math.round(v / 1000)}k</div>
              <div style={{ width: '100%', maxWidth: 40, height: (v / max) * 130, borderRadius: '7px 7px 0 0', background: i === trend.length - 1 ? 'linear-gradient(180deg, var(--orange-400), var(--orange-600))' : 'linear-gradient(180deg, var(--teal-500), var(--teal-700))', transition: 'height 1s var(--ease-out)' }} />
              <div className="muted" style={{ fontSize: 11, fontWeight: 600 }}>{labels[i]}</div>
            </div>
          ))}
        </div>
      </Card>
      {/* Sources */}
      <Card>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Income sources</h3>
        {sources.map(([l, pct, c]) => (
          <div key={l} style={{ marginBottom: 14 }}>
            <div className="row between" style={{ fontSize: 13.5, marginBottom: 6 }}><span className="row gap-2"><span className="dot" style={{ background: c }} /><span style={{ fontWeight: 600 }}>{l}</span></span><span className="num" style={{ fontWeight: 700 }}>{pct}%</span></div>
            <div className="progress"><span style={{ width: pct + '%', background: c }} /></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function MarketingToolkit() {
  const app = window.useApp();
  const toast = useToast();
  const banners = [
    { t: 'Become a Land Owner', s: 'From ₦20,000', c: 'var(--teal-700)' },
    { t: 'Own land by the sqm', s: 'Refer & earn 20%', c: 'var(--orange-500)' },
    { t: 'Real estate to the masses', s: 'Channels Realty', c: 'var(--teal-600)' },
  ];
  const captions = [
    'I just became a land owner with as little as ₦20,000 🏡 You can too — own land by the square metre with Channels Realty. Use my link 👇',
    'Stop paying rent forever. Start owning land you can afford — from ₦20,000. Refer friends and earn instant commission. Join me on Channels 👇',
  ];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Marketing toolkit" sub="Ready-made graphics and captions to grow your channel." />
      <div>
        <div className="sec-head"><h3 style={{ fontSize: 16 }}>Shareable banners</h3></div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14 }}>
          {banners.map((b, i) => (
            <Card key={i} pad={false} hover style={{ overflow: 'hidden' }}>
              <div style={{ aspectRatio: '1', background: `linear-gradient(150deg, ${b.c}, color-mix(in srgb, ${b.c} 55%, #000))`, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', position: 'relative' }}>
                <Logo size={18} light sub={false} />
                <div>
                  <div className="font-display" style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.1 }}>{b.t}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.85)', marginTop: 4 }}>{b.s}</div>
                </div>
                <div className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}>{app.user.refLink}</div>
              </div>
              <div style={{ padding: 10 }}><Btn block size="sm" variant="outline" onClick={() => toast('Banner downloaded')} icon={<Icons.arrowDown size={14} />}>Download</Btn></div>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <div className="sec-head"><h3 style={{ fontSize: 16 }}>Caption templates</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {captions.map((c, i) => (
            <Card key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <p style={{ flex: 1, fontSize: 14, lineHeight: 1.55 }}>{c}</p>
              <Btn size="sm" variant="outline" onClick={() => { navigator.clipboard?.writeText(c + ' https://' + app.user.refLink); toast('Caption copied!'); }} icon={<Icons.copy size={14} />}>Copy</Btn>
            </Card>
          ))}
        </div>
      </div>
      <Card style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--orange-50)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 46px' }}><Icons.share size={22} /></div>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>Your referral link</div><div className="font-mono muted" style={{ fontSize: 12.5 }}>{app.user.refLink}</div></div>
        <Btn size="sm" onClick={() => app.openShare()} icon={<Icons.share size={14} />}>Share</Btn>
      </Card>
    </div>
  );
}

Object.assign(window, { Leaderboard, Genealogy, EarningsAnalytics, MarketingToolkit });
