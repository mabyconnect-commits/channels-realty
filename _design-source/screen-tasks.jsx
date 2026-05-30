/* ============================================================
   TASKS & POINTS  (exports window.Tasks)
   ============================================================ */
function Tasks() {
  const D = window.DATA;
  const app = window.useApp();
  const toast = useToast();
  const [active, setActive] = useState(null);   // task in video/action modal
  const [redeem, setRedeem] = useState(false);

  const redeemableSqm = Math.floor(app.points / D.POINTS_PER_SQM);
  const toNext = D.POINTS_PER_SQM - (app.points % D.POINTS_PER_SQM);

  const kindMeta = {
    video: { icon: <Icons.play />, color: 'var(--orange-500)', bg: 'var(--orange-50)' },
    share: { icon: <Icons.share />, color: 'var(--teal-600)', bg: 'var(--teal-50)' },
    profile: { icon: <Icons.shield />, color: 'var(--green-600)', bg: 'var(--green-50)' },
    webinar: { icon: <Icons.users />, color: 'var(--teal-700)', bg: 'var(--teal-50)' },
    refer: { icon: <Icons.gift />, color: 'var(--orange-600)', bg: 'var(--orange-50)' },
    checkin: { icon: <Icons.fire />, color: '#d9a23e', bg: '#f8efd6' },
  };

  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Tasks & rewards" sub="Complete tasks, earn points, and redeem them for square metres of land." />

      {/* Points hero */}
      <div className="grid d-grid-2" style={{ gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(150deg, #b8841f, #d9a23e)', color: '#fff', padding: 'clamp(20px,4vw,28px)' }}>
          <div style={{ position: 'absolute', top: -50, right: -30, opacity: .2 }}><Icons.bolt size={170} /></div>
          <div style={{ position: 'relative' }}>
            <div className="row gap-2" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.85)' }}><Icons.bolt size={15} /> Your points</div>
            <div className="font-display" style={{ fontSize: 'clamp(36px,7vw,48px)', fontWeight: 800, marginTop: 4 }}><CountNum value={app.points} /></div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.85)', marginTop: 4 }}>{D.POINTS_PER_SQM.toLocaleString()} pts = 1 sqm · {toNext} pts to your next sqm</div>
            <Btn variant="ghost" style={{ background: '#fff', color: '#9a6f15', marginTop: 18 }} disabled={redeemableSqm < 1} onClick={() => setRedeem(true)} icon={<Icons.land size={17} />}>
              Redeem {redeemableSqm} sqm
            </Btn>
          </div>
        </div>

        {/* Streak / progress to next sqm */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Progress to next sqm</h3>
          <div className="row" style={{ alignItems: 'center', gap: 16 }}>
            <Ring value={((app.points % D.POINTS_PER_SQM) / D.POINTS_PER_SQM) * 100} size={96} sw={9} color="var(--gold)">
              <div className="font-display num" style={{ fontSize: 17, fontWeight: 800 }}>{app.points % D.POINTS_PER_SQM}</div>
              <div className="stat-label" style={{ fontSize: 9 }}>/ {D.POINTS_PER_SQM}</div>
            </Ring>
            <div style={{ flex: 1 }}>
              <div className="row gap-2" style={{ marginBottom: 8 }}>
                <span style={{ color: '#d9a23e', display: 'flex' }}><Icons.fire size={18} /></span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>4-day streak</span>
              </div>
              <p className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>Earn {toNext} more points to unlock another square metre of land — free.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Task list */}
      <div className="sec-head" style={{ marginTop: 4 }}><h3>Available tasks</h3><span className="chip">{app.tasksDone.length}/{D.tasks.length} done</span></div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
        {D.tasks.map((t) => {
          const done = app.tasksDone.includes(t.id);
          const m = kindMeta[t.kind];
          return (
            <Card key={t.id} hover={!done} className={done ? '' : 'clickable'} onClick={() => !done && setActive(t)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: done ? .72 : 1 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, flex: '0 0 46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? 'var(--green-50)' : m.bg, color: done ? 'var(--green-600)' : m.color }}>
                {done ? <Icons.checkCircle size={24} /> : m.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.title}</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{t.sub}</div>
              </div>
              <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                <div className="chip chip-gold" style={{ marginBottom: done ? 0 : 6 }}>+{t.pts} pts</div>
                {!done && <div style={{ color: 'var(--accent)', display: 'flex', justifyContent: 'flex-end' }}><Icons.chevR size={18} /></div>}
              </div>
            </Card>
          );
        })}
      </div>

      <TaskModal task={active} onClose={() => setActive(null)} />
      <RedeemSheet open={redeem} onClose={() => setRedeem(false)} sqm={redeemableSqm} />
    </div>
  );
}

function TaskModal({ task, onClose }) {
  const app = window.useApp();
  const toast = useToast();
  const [prog, setProg] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { if (task) { setProg(0); setPlaying(false); } }, [task]);
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => setProg((p) => { if (p >= 100) { clearInterval(iv); return 100; } return p + 4; }), 90);
    return () => clearInterval(iv);
  }, [playing]);
  if (!task) return null;

  const isVideo = task.kind === 'video';
  const complete = () => { app.completeTask(task); toast(`+${task.pts} points earned!`, { icon: <Icons.bolt style={{ color: 'var(--gold)' }} /> }); onClose(); };

  return (
    <Sheet open={!!task} onClose={onClose}>
      <div style={{ padding: '2px 2px' }}>
        {isVideo ? (
          <>
            <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '16/9',
              background: 'linear-gradient(135deg, var(--teal-800), var(--teal-600))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: .15, background: 'repeating-linear-gradient(45deg, #fff, #fff 2px, transparent 2px, transparent 12px)' }} />
              <button onClick={() => setPlaying(true)} style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,.92)', color: 'var(--teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,.3)' }}>
                {playing ? <Icons.bolt size={26} /> : <Icons.play size={30} fill="var(--teal-700)" />}
              </button>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: 'rgba(255,255,255,.25)' }}>
                <div style={{ height: '100%', width: prog + '%', background: 'var(--orange-400)', transition: 'width .1s linear' }} />
              </div>
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 700, marginTop: 16 }}>{task.title}</h3>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>{task.sub}</p>
            <Btn block size="lg" style={{ marginTop: 18 }} disabled={prog < 100} onClick={complete} icon={prog < 100 ? <Icons.clock /> : <Icons.bolt />}>
              {prog < 100 ? (playing ? `Watching… ${prog}%` : 'Press play to start') : `Claim +${task.pts} points`}
            </Btn>
          </>
        ) : (
          <div className="center" style={{ padding: '4px 2px' }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, margin: '0 auto 16px', background: 'var(--orange-50)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {task.kind === 'share' ? <Icons.share size={34} /> : task.kind === 'profile' ? <Icons.shield size={34} /> : task.kind === 'webinar' ? <Icons.users size={34} /> : task.kind === 'checkin' ? <Icons.fire size={34} /> : <Icons.gift size={34} />}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{task.title}</h3>
            <p className="muted" style={{ fontSize: 14.5, marginTop: 6 }}>{task.sub}</p>
            <div className="chip chip-gold" style={{ margin: '16px auto 0' }}>Reward: +{task.pts} points</div>
            <Btn block size="lg" style={{ marginTop: 18 }} onClick={complete} icon={<Icons.check />}>
              {task.kind === 'share' ? 'Copy caption & mark done' : 'Mark complete'}
            </Btn>
          </div>
        )}
      </div>
    </Sheet>
  );
}

function RedeemSheet({ open, onClose, sqm }) {
  const D = window.DATA;
  const app = window.useApp();
  const toast = useToast();
  const [done, setDone] = useState(false);
  useEffect(() => { if (open) setDone(false); }, [open]);
  const confirm = () => { app.redeemPoints(sqm); setDone(true); app.fireConfetti(); };
  return (
    <Sheet open={open} onClose={onClose}>
      {done ? (
        <div className="center" style={{ padding: '12px 4px 8px' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '6px auto 18px', background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spinIn .6s var(--spring)' }}><Icons.land size={44} /></div>
          <h3 style={{ fontSize: 24, fontWeight: 800 }}>{sqm} sqm redeemed!</h3>
          <p className="muted" style={{ fontSize: 15, marginTop: 8 }}>Added to your Channels Gardens holding.</p>
          <Btn block size="lg" style={{ marginTop: 22 }} onClick={onClose}>Done</Btn>
        </div>
      ) : (
        <div className="center" style={{ padding: '4px 2px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, margin: '0 auto 16px', background: '#f8efd6', color: '#9a6f15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.bolt size={36} /></div>
          <h3 style={{ fontSize: 22, fontWeight: 800 }}>Redeem points for land</h3>
          <p className="muted" style={{ fontSize: 14.5, marginTop: 6 }}>Convert {(sqm * D.POINTS_PER_SQM).toLocaleString()} points into {sqm} sqm of land.</p>
          <div className="card card-pad" style={{ marginTop: 18, background: 'var(--surface-2)', textAlign: 'left' }}>
            <div className="row between" style={{ fontSize: 14 }}><span className="muted" style={{ fontWeight: 600 }}>Points used</span><span className="num" style={{ fontWeight: 700 }}>{(sqm * D.POINTS_PER_SQM).toLocaleString()}</span></div>
            <hr className="hr" style={{ margin: '12px 0' }} />
            <div className="row between" style={{ fontSize: 14 }}><span className="muted" style={{ fontWeight: 600 }}>You receive</span><span style={{ fontWeight: 700, color: 'var(--accent)' }}>{sqm} sqm</span></div>
          </div>
          <Btn block size="lg" style={{ marginTop: 18 }} onClick={confirm} icon={<Icons.land />}>Redeem {sqm} sqm</Btn>
        </div>
      )}
    </Sheet>
  );
}

window.Tasks = Tasks;
