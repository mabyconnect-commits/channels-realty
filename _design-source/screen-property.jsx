/* ============================================================
   DOCUMENT VAULT · PROPERTY DETAIL
   ============================================================ */
function DocumentVault() {
  const app = window.useApp();
  const toast = useToast();
  const docs = window.DATA2.documents;
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHead title="Document vault" sub="Every legal document for your land — secured and downloadable." />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
        <Card style={{ padding: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--green-50)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}><Icons.checkCircle size={20} /></div>
          <div className="font-display num" style={{ fontSize: 22, fontWeight: 800 }}>{docs.filter(d => d.status !== 'Processing').length}</div>
          <div className="muted" style={{ fontSize: 12.5 }}>Ready documents</div>
        </Card>
        <Card style={{ padding: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--orange-50)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}><Icons.clock size={20} /></div>
          <div className="font-display num" style={{ fontSize: 22, fontWeight: 800 }}>{docs.filter(d => d.status === 'Processing').length}</div>
          <div className="muted" style={{ fontSize: 12.5 }}>In progress</div>
        </Card>
        <Card style={{ padding: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--teal-50)', color: 'var(--teal-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}><Icons.shield size={20} /></div>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 800 }}>C of O</div>
          <div className="muted" style={{ fontSize: 12.5 }}>Estate title</div>
        </Card>
      </div>
      <Card pad={false}>
        <div className="row between" style={{ padding: '16px 20px' }}><h3 style={{ fontSize: 17, fontWeight: 700 }}>All documents</h3></div>
        {docs.map((d) => (
          <div key={d.id} className="row gap-3" style={{ padding: '14px 20px', borderTop: '1px solid var(--line-2)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, flex: '0 0 44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--orange-50)', color: 'var(--orange-600)', position: 'relative' }}>
              <Icons.doc size={22} />
              <span className="font-mono" style={{ position: 'absolute', bottom: 3, fontSize: 7, fontWeight: 700, color: 'var(--orange-700)' }}>{d.type}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{d.date}{d.size !== '—' ? ' · ' + d.size : ''}</div>
            </div>
            {d.status === 'Processing'
              ? <span className="chip chip-gold">Processing</span>
              : <button onClick={() => toast('Downloading ' + d.type + '…')} className="chip clickable" style={{ background: 'var(--surface-sunk)', color: 'var(--accent)' }}><Icons.arrowDown size={14} /> Get</button>}
          </div>
        ))}
      </Card>
    </div>
  );
}

function PropertyDetail() {
  const app = window.useApp();
  const D = window.DATA;
  const p = app.param || app.parcels[0];
  const timeline = [
    { t: 'Purchase confirmed', d: 'Mar 24, 2026', done: true },
    { t: 'Allocation letter issued', d: 'Mar 25, 2026', done: true },
    { t: 'Survey & beaconing', d: 'In progress', done: false },
    { t: 'Deed of assignment', d: 'Pending survey', done: false },
    { t: 'Physical handover', d: 'Upcoming', done: false },
  ];
  const value = p.sqm * D.NGN_PER_SQM;
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <LandPlaceholder h={200} radius="var(--r-xl)" label="">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(27,58,70,.45), rgba(43,86,102,.7))' }} />
        <div style={{ position: 'relative', width: '100%', padding: 24, color: '#fff', alignSelf: 'flex-end' }}>
          <span className={'chip ' + (p.status === 'Allocated' ? 'chip-green' : 'chip-gold')} style={{ marginBottom: 10 }}>{p.status}</span>
          <div className="font-display" style={{ fontSize: 30, fontWeight: 800 }}>{p.sqm} sqm</div>
          <div className="row gap-2" style={{ color: 'rgba(255,255,255,.88)', fontSize: 14, marginTop: 2 }}><Icons.pin size={15} /> {p.estate}, {p.city}</div>
        </div>
      </LandPlaceholder>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
        <Card style={{ padding: 16 }}><div className="stat-label" style={{ fontSize: 11 }}>Est. value</div><div className="font-display num" style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{D.fmtNaira(value)}</div></Card>
        <Card style={{ padding: 16 }}><div className="stat-label" style={{ fontSize: 11 }}>Appreciation</div><div className="font-display" style={{ fontSize: 20, fontWeight: 800, marginTop: 2, color: 'var(--green-600)' }}>+{p.appr}%</div></Card>
        <Card style={{ padding: 16 }}><div className="stat-label" style={{ fontSize: 11 }}>USD value</div><div className="font-display num" style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{D.fmtUSD(value / D.USD_RATE)}</div></Card>
      </div>
      <div className="grid d-grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Ownership timeline</h3>
          {timeline.map((s, i) => (
            <div key={i} className="row gap-3" style={{ position: 'relative', paddingBottom: i < timeline.length - 1 ? 18 : 0 }}>
              {i < timeline.length - 1 && <div style={{ position: 'absolute', left: 11, top: 24, bottom: 0, width: 2, background: s.done ? 'var(--green-500)' : 'var(--hairline)' }} />}
              <div style={{ width: 24, height: 24, borderRadius: '50%', flex: '0 0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.done ? 'var(--green-500)' : 'var(--surface-sunk)', color: s.done ? '#fff' : 'var(--faint)', zIndex: 1 }}>
                {s.done ? <Icons.check size={14} /> : <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--faint)' }} />}
              </div>
              <div><div style={{ fontWeight: 700, fontSize: 14 }}>{s.t}</div><div className="muted" style={{ fontSize: 12.5 }}>{s.d}</div></div>
            </div>
          ))}
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Documents</h3>
            <Btn block variant="outline" onClick={() => app.nav('docs')} icon={<Icons.doc size={16} />} iconR={<Icons.chevR size={15} style={{ marginLeft: 'auto' }} />}>View document vault</Btn>
            <Btn block style={{ marginTop: 10 }} onClick={() => app.nav('market')} icon={<Icons.plus size={16} />}>Buy adjacent land</Btn>
          </Card>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--teal-50)', color: 'var(--teal-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 44px' }}><Icons.clock size={22} /></div>
            <div style={{ fontSize: 13 }}><strong>Book a site inspection</strong><div className="muted" style={{ fontSize: 12 }}>Free VIP tours every Saturday</div></div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DocumentVault, PropertyDetail });
