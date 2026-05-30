/* ============================================================
   NOTIFICATIONS · REWARDS STORE · EVENTS · ACADEMY · CHECK-IN · SUPPORT · NEWS
   ============================================================ */
function Notifications() {
  const app = window.useApp();
  const [items, setItems] = useState(window.DATA2.notifications);
  useEffect(() => { app.markNotifRead(); }, []);
  const meta = {
    commission: [Icons.bolt, 'var(--green-600)', 'var(--green-50)'], milestone: [Icons.land, 'var(--orange-600)', 'var(--orange-50)'],
    team: [Icons.users, 'var(--teal-600)', 'var(--teal-50)'], event: [Icons.clock, 'var(--teal-700)', 'var(--teal-50)'],
    system: [Icons.shield, 'var(--muted)', 'var(--surface-sunk)'], reward: [Icons.trophy, 'var(--gold)', '#f8efd6'],
  };
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640, margin: '0 auto', width: '100%' }}>
      <div className="row between d-only"><h2 style={{ fontSize: 28, fontWeight: 700 }}>Notifications</h2><button className="chip clickable" onClick={() => setItems((x) => x.map((i) => ({ ...i, unread: false })))}>Mark all read</button></div>
      <button className="chip clickable m-only" style={{ alignSelf: 'flex-end' }} onClick={() => setItems((x) => x.map((i) => ({ ...i, unread: false })))}>Mark all read</button>
      <Card pad={false}>
        {items.map((n, i) => {
          const [Ic, c, bg] = meta[n.type] || meta.system;
          return (
            <div key={n.id} className="row gap-3" style={{ padding: '15px 18px', borderTop: i ? '1px solid var(--line-2)' : 'none', background: n.unread ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'transparent', position: 'relative' }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, flex: '0 0 42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color: c }}><Ic size={20} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row between"><span style={{ fontWeight: 700, fontSize: 14 }}>{n.title}</span><span className="muted nowrap" style={{ fontSize: 11.5, marginLeft: 8 }}>{n.time}</span></div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{n.body}</div>
              </div>
              {n.unread && <span style={{ position: 'absolute', top: 18, right: 14, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function RewardsStore() {
  const app = window.useApp();
  const toast = useToast();
  const store = window.DATA2.store;
  const icon = { land: Icons.land, wallet: Icons.wallet, bolt: Icons.bolt, gift: Icons.gift, pin: Icons.pin, trending: Icons.trending };
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ borderRadius: 'var(--r-xl)', background: 'linear-gradient(150deg, #b8841f, #d9a23e)', color: '#fff', padding: 'clamp(20px,4vw,26px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -20, opacity: .18 }}><Icons.gift size={150} /></div>
        <div style={{ position: 'relative' }}>
          <div className="row gap-2" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.85)' }}><Icons.bolt size={15} /> Available points</div>
          <div className="font-display num" style={{ fontSize: 'clamp(34px,7vw,44px)', fontWeight: 800, marginTop: 4 }}><CountNum value={app.points} /></div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', marginTop: 2 }}>Redeem points for land, cash, airtime and more.</div>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
        {store.map((s) => {
          const Ic = icon[s.icon] || Icons.gift;
          const can = app.points >= s.cost;
          return (
            <Card key={s.id} hover>
              <div className="row between" style={{ marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--orange-50)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={22} /></div>
                {s.tag && <span className="chip chip-green" style={{ padding: '2px 8px', fontSize: 10.5 }}>{s.tag}</span>}
              </div>
              <div className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>{s.name}</div>
              <div className="row between" style={{ marginTop: 14 }}>
                <span className="chip chip-gold"><Icons.bolt size={12} /> {s.cost.toLocaleString()}</span>
                <Btn size="sm" disabled={!can} onClick={() => { app.spendPoints(s.cost); toast('Redeemed: ' + s.name + ' 🎁'); app.fireConfetti(); }}>{can ? 'Redeem' : 'Locked'}</Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Events() {
  const app = window.useApp();
  const toast = useToast();
  const [events, setEvents] = useState(window.DATA2.events);
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="Events & webinars" sub="Learn from the best and register for site tours." />
      {events.map((e) => (
        <Card key={e.id} hover style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, flex: '0 0 64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: e.live ? 'var(--orange-500)' : 'var(--teal-50)', color: e.live ? '#fff' : 'var(--teal-700)' }}>
            <span className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>{e.date.split(' ')[2]}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' }}>{e.date.split(' ')[1]}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row gap-2" style={{ marginBottom: 3 }}>
              {e.live && <span className="chip" style={{ background: 'var(--red-50)', color: 'var(--red-500)', padding: '1px 8px', fontSize: 10 }}>● LIVE SOON</span>}
              <span className="chip" style={{ padding: '1px 8px', fontSize: 10 }}>{e.type}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{e.title}</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{e.time} · {e.host} · {e.seats} seats</div>
          </div>
          <Btn size="sm" variant={e.registered ? 'ghost' : 'primary'} disabled={e.registered}
            onClick={() => { setEvents((x) => x.map((v) => v.id === e.id ? { ...v, registered: true } : v)); toast('Registered for ' + e.title); }}>
            {e.registered ? 'Registered' : 'Register'}
          </Btn>
        </Card>
      ))}
    </div>
  );
}

function Academy() {
  const app = window.useApp();
  const courses = window.DATA2.courses;
  const overall = Math.round(courses.reduce((a, c) => a + c.progress, 0) / courses.length);
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Academy" sub="Free courses to master land investing and referrals." />
      <Card style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Ring value={overall} size={84} sw={8} color="var(--teal-600)"><div className="num font-display" style={{ fontSize: 17, fontWeight: 800 }}>{overall}%</div></Ring>
        <div style={{ flex: 1 }}><h3 style={{ fontSize: 18, fontWeight: 800 }}>Keep learning</h3><p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Complete courses to earn certificates and bonus points.</p></div>
      </Card>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
        {courses.map((c) => (
          <Card key={c.id} pad={false} hover style={{ overflow: 'hidden' }}>
            <div style={{ height: 96, background: `linear-gradient(150deg, ${c.color}, color-mix(in srgb, ${c.color} 55%, #000))`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.play size={36} fill="rgba(255,255,255,.9)" stroke="none" />
              <span className="chip" style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,.9)', padding: '2px 8px', fontSize: 10.5 }}>{c.level}</span>
              {c.progress === 100 && <span className="chip chip-green" style={{ position: 'absolute', top: 10, left: 10, padding: '2px 8px', fontSize: 10.5 }}>✓ Done</span>}
            </div>
            <div style={{ padding: 16 }}>
              <div className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>{c.title}</div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{c.lessons} lessons · {c.dur}</div>
              <div style={{ marginTop: 12 }}><Progress value={c.progress} variant="teal" /></div>
              <Btn size="sm" block style={{ marginTop: 12 }} variant={c.progress === 100 ? 'outline' : 'primary'} icon={c.progress > 0 && c.progress < 100 ? <Icons.play size={14} /> : null}>
                {c.progress === 0 ? 'Start course' : c.progress === 100 ? 'Review' : 'Continue'}
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CheckIn() {
  const app = window.useApp();
  const toast = useToast();
  const [checked, setChecked] = useState([true, true, true, true, false, false, false]);
  const [spinning, setSpinning] = useState(false);
  const [rot, setRot] = useState(0);
  const [spun, setSpun] = useState(false);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const rewards = [10, 10, 20, 20, 30, 30, 50];
  const todayIdx = checked.findIndex((c) => !c);
  const doCheck = () => { setChecked((x) => x.map((v, i) => i === todayIdx ? true : v)); app.addPoints(rewards[todayIdx]); toast(`+${rewards[todayIdx]} points · day ${todayIdx + 1}!`); };
  const spin = () => {
    if (spun) return; setSpinning(true);
    const prize = [50, 20, 100, 30, 200, 10][Math.floor(Math.random() * 6)];
    const turns = 5 * 360 + Math.floor(Math.random() * 360);
    setRot((r) => r + turns);
    setTimeout(() => { setSpinning(false); setSpun(true); app.addPoints(prize); toast(`You won ${prize} points! 🎉`); app.fireConfetti(); }, 2600);
  };
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 600, margin: '0 auto', width: '100%' }}>
      <Card>
        <div className="row between" style={{ marginBottom: 16 }}>
          <div className="row gap-2"><Icons.fire size={22} style={{ color: '#d9742e' }} /><h3 style={{ fontSize: 18, fontWeight: 800 }}>{checked.filter(Boolean).length}-day streak</h3></div>
          <span className="chip chip-gold">+{rewards[todayIdx] || 50} today</span>
        </div>
        <div className="row gap-2" style={{ justifyContent: 'space-between' }}>
          {days.map((d, i) => (
            <div key={d} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '1', maxWidth: 44, margin: '0 auto', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: checked[i] ? 'var(--green-500)' : i === todayIdx ? 'var(--orange-50)' : 'var(--surface-sunk)', color: checked[i] ? '#fff' : i === todayIdx ? 'var(--orange-600)' : 'var(--faint)',
                border: i === todayIdx ? '2px solid var(--accent)' : 'none' }}>
                {checked[i] ? <Icons.check size={18} /> : <span className="num" style={{ fontSize: 12, fontWeight: 700 }}>+{rewards[i]}</span>}
              </div>
              <div className="muted" style={{ fontSize: 10.5, fontWeight: 600, marginTop: 5 }}>{d}</div>
            </div>
          ))}
        </div>
        <Btn block size="lg" style={{ marginTop: 18 }} disabled={todayIdx === -1} onClick={doCheck} icon={<Icons.fire size={17} />}>{todayIdx === -1 ? 'All checked in! 🎉' : 'Check in today'}</Btn>
      </Card>

      {/* Spin to win */}
      <Card className="center">
        <h3 style={{ fontSize: 18, fontWeight: 800 }}>Daily spin</h3>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>One free spin a day. Win up to 200 points!</p>
        <div style={{ position: 'relative', width: 200, height: 200, margin: '20px auto 0' }}>
          <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', zIndex: 2, color: 'var(--accent)' }}><Icons.chevD size={28} /></div>
          <div style={{ width: 200, height: 200, borderRadius: '50%', transition: 'transform 2.5s cubic-bezier(.17,.67,.3,1)', transform: `rotate(${rot}deg)`,
            background: 'conic-gradient(var(--orange-400) 0 60deg, var(--teal-600) 60deg 120deg, var(--gold) 120deg 180deg, var(--teal-700) 180deg 240deg, var(--orange-600) 240deg 300deg, var(--green-500) 300deg 360deg)',
            border: '6px solid var(--surface)', boxShadow: 'var(--sh-md), 0 0 0 3px var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sh-sm)' }}><Icons.bolt size={22} style={{ color: 'var(--accent)' }} /></div>
          </div>
        </div>
        <Btn size="lg" style={{ marginTop: 20 }} disabled={spinning || spun} onClick={spin} icon={<Icons.spark size={17} />}>{spun ? 'Come back tomorrow' : spinning ? 'Spinning…' : 'Spin now'}</Btn>
      </Card>
    </div>
  );
}

function Support() {
  const [open, setOpen] = useState(0);
  const toast = useToast();
  const faqs = window.DATA2.faqs;
  const channels = [['Live chat', Icons.share, 'var(--orange-500)'], ['Call us', Icons.bell, 'var(--teal-600)'], ['WhatsApp', Icons.whatsapp, 'var(--green-600)']];
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 680, margin: '0 auto', width: '100%' }}>
      <PageHead title="Help & support" sub="Find answers fast or reach our team anytime." />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
        {channels.map(([l, Ic, c]) => (
          <Card key={l} hover className="center clickable" onClick={() => toast('Connecting you to ' + l + '…')} style={{ padding: 18 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, margin: '0 auto 10px', background: `color-mix(in srgb, ${c} 14%, transparent)`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={22} /></div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{l}</div>
          </Card>
        ))}
      </div>
      <Card pad={false}>
        <div style={{ padding: '16px 20px 4px' }}><h3 style={{ fontSize: 17, fontWeight: 700 }}>Frequently asked</h3></div>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderTop: '1px solid var(--line-2)' }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="row between clickable" style={{ width: '100%', padding: '15px 20px', textAlign: 'left', gap: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 14.5 }}>{f.q}</span>
              <span style={{ color: 'var(--accent)', transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flex: '0 0 auto' }}><Icons.chevD size={18} /></span>
            </button>
            {open === i && <div className="muted" style={{ padding: '0 20px 16px', fontSize: 14, lineHeight: 1.6 }}>{f.a}</div>}
          </div>
        ))}
      </Card>
    </div>
  );
}

function News() {
  const news = window.DATA2.news;
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHead title="News & updates" sub="What's happening across Channels Realty." />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
        {news.map((a) => (
          <Card key={a.id} pad={false} hover style={{ overflow: 'hidden' }}>
            <LandPlaceholder h={120} radius="0" label="">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg, rgba(43,86,102,.15), rgba(217,116,46,.25))' }} />
              <span className="chip chip-accent" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,.92)' }}>{a.tag}</span>
            </LandPlaceholder>
            <div style={{ padding: 18 }}>
              <div className="muted" style={{ fontSize: 12, fontWeight: 600 }}>{a.date}</div>
              <div className="font-display" style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{a.title}</div>
              <p className="muted" style={{ fontSize: 13.5, marginTop: 6, lineHeight: 1.55 }}>{a.body}</p>
              <button className="row gap-2" style={{ marginTop: 12, color: 'var(--accent)', fontWeight: 700, fontSize: 13.5 }}>Read more <Icons.arrowRight size={14} /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Notifications, RewardsStore, Events, Academy, CheckIn, Support, News });
