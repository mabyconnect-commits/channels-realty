/* ============================================================
   UI PRIMITIVES  (exports to window)
   ============================================================ */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

/* ---- Animated number (count up) ---- */
function useCountUp(target, dur = 800, start = 0) {
  const [val, setVal] = useState(target);   // rest at correct value (static-safe)
  useEffect(() => {
    let raf, t0;
    const from = start;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(from + (target - from) * e);
      if (p < 1) raf = requestAnimationFrame(step); else setVal(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}
function CountNaira({ value, className }) {
  const v = useCountUp(value);
  return <span className={'num ' + (className || '')}>₦{Math.round(v).toLocaleString('en-NG')}</span>;
}
function CountNum({ value, className, suffix }) {
  const v = useCountUp(value);
  return <span className={'num ' + (className || '')}>{Math.round(v).toLocaleString('en-NG')}{suffix || ''}</span>;
}

/* ---- Toast ---- */
const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((msg, opts = {}) => {
    const id = Math.random();
    setItems((x) => [...x, { id, msg, icon: opts.icon }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), opts.dur || 2600);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-wrap">
        {items.map((i) => (
          <div className="toast" key={i.id}>
            {i.icon || <Icons.checkCircle style={{ color: 'var(--orange-400)' }} />}
            {i.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => useContext(ToastCtx);

/* ---- Confetti burst ---- */
function Confetti({ run, onDone }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (run) { setOn(true); const t = setTimeout(() => { setOn(false); onDone && onDone(); }, 2600); return () => clearTimeout(t); }
  }, [run]);
  if (!on) return null;
  const colors = ['#d9742e', '#2b5666', '#3f7c91', '#e68a4d', '#d9a23e', '#36a368'];
  const pieces = Array.from({ length: 90 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * .5;
    const dur = 1.6 + Math.random() * 1.4;
    const c = colors[i % colors.length];
    const rot = Math.random() * 360;
    const w = 6 + Math.random() * 6;
    return <i key={i} style={{ left: left + '%', background: c, width: w, height: w * 1.6,
      transform: `rotate(${rot}deg)`, animationDuration: dur + 's', animationDelay: delay + 's',
      borderRadius: Math.random() > .6 ? '50%' : '1px' }} />;
  });
  return <div className="confetti">{pieces}</div>;
}

/* ---- Button ---- */
function Btn({ variant = 'primary', size, block, icon, iconR, children, className = '', style, onClick, disabled, type = 'button', title }) {
  const cls = `btn btn-${variant} ${size ? 'btn-' + size : ''} ${block ? 'btn-block' : ''} ${className}`;
  return (
    <button type={type} className={cls} style={style} onClick={onClick} disabled={disabled} title={title}>
      {icon}{children}{iconR}
    </button>
  );
}

/* ---- Card ---- */
function Card({ pad = true, hover, className = '', style, children, onClick, id }) {
  return (
    <div id={id} onClick={onClick}
      className={`card ${pad ? 'card-pad' : ''} ${hover ? 'card-hover' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ---- Progress ---- */
function Progress({ value, variant = '', tall }) {
  return <div className={`progress ${variant} ${tall ? 'tall' : ''}`}><span style={{ width: Math.min(100, value) + '%' }} /></div>;
}

/* ---- Ring progress (SVG) ---- */
function Ring({ value, size = 120, sw = 11, color = 'var(--orange-500)', track = 'var(--surface-sunk)', children, label }) {
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(value), 60); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (v/100)*c} style={{ transition: 'stroke-dashoffset 1.1s var(--ease-out)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

/* ---- Avatar ---- */
function Avatar({ src, name, size = 40, ring }) {
  const initials = (name || '?').split(' ').map((s) => s[0]).slice(0, 2).join('');
  return src
    ? <img src={src} alt={name} className={`avatar ${ring ? 'avatar-ring' : ''}`} style={{ width: size, height: size }} />
    : <div className={`avatar ${ring ? 'avatar-ring' : ''}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * .38, color: 'var(--teal-700)', background: 'var(--teal-100)' }}>{initials}</div>;
}

/* ---- Sheet / modal ---- */
function Sheet({ open, onClose, children, max }) {
  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; }
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="sheet" style={max ? { maxWidth: max } : null} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ---- Rank badge medallion ---- */
function RankBadge({ tier, size = 56, locked, current }) {
  const color = tier.color;
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: `0 0 ${size}px` }}>
      <div style={{
        width: size, height: size, borderRadius: '30% 30% 30% 30% / 30% 30% 30% 30%',
        background: locked ? 'var(--surface-sunk)' : `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 60%, #000))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: locked ? 'none' : `0 8px 20px color-mix(in srgb, ${color} 45%, transparent)`,
        border: locked ? '1.5px dashed var(--hairline)' : '2px solid rgba(255,255,255,.25)',
        transform: 'rotate(45deg)',
        animation: current ? 'ringPulse 2.4s infinite' : 'none',
      }}>
        <div style={{ transform: 'rotate(-45deg)', color: locked ? 'var(--faint)' : '#fff', display: 'flex' }}>
          {locked ? <Icons.lock size={size * .34} /> : <Icons.trophy size={size * .4} fill="#fff" />}
        </div>
      </div>
    </div>
  );
}

/* ---- Striped image placeholder ---- */
function LandPlaceholder({ label = 'land plot', h = 160, radius = 'var(--r-md)', children }) {
  return (
    <div style={{ height: h, borderRadius: radius, position: 'relative', overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, var(--teal-50), var(--teal-50) 14px, var(--teal-100) 14px, var(--teal-100) 28px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--hairline)' }}>
      {children || <span className="font-mono" style={{ fontSize: 12, color: 'var(--teal-600)', fontWeight: 600, letterSpacing: '.05em' }}>{label}</span>}
    </div>
  );
}

/* ---- Stat tile ---- */
function Stat({ label, children, icon, accent }) {
  return (
    <div>
      <div className="row gap-2" style={{ marginBottom: 6 }}>
        {icon && <span style={{ color: accent || 'var(--accent)', display: 'flex' }}>{icon}</span>}
        <span className="stat-label">{label}</span>
      </div>
      <div className="font-display" style={{ fontSize: 26, fontWeight: 700, color: 'var(--on-surface)' }}>{children}</div>
    </div>
  );
}

/* ---- Segmented control ---- */
function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--surface-sunk)', borderRadius: 'var(--r-pill)', padding: 4, gap: 2 }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          style={{ padding: '8px 16px', borderRadius: 'var(--r-pill)', fontWeight: 700, fontSize: 13.5,
            color: value === o.value ? '#fff' : 'var(--on-surface-mut)',
            background: value === o.value ? 'var(--primary)' : 'transparent', transition: 'all .2s var(--ease)' }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, {
  useCountUp, CountNaira, CountNum, ToastProvider, useToast, Confetti,
  Btn, Card, Progress, Ring, Avatar, Sheet, RankBadge, LandPlaceholder, Stat, Segmented,
});
