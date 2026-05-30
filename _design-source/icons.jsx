/* ============================================================
   ICONS + LOGO  (exports to window)
   ============================================================ */
const I = ({ d, fill, stroke = 'currentColor', sw = 1.7, size, children, vb = '0 0 24 24', style, className, onClick }) => (
  <svg viewBox={vb} width={size || '1em'} height={size || '1em'} fill={fill || 'none'}
       stroke={fill ? 'none' : stroke} strokeWidth={fill ? 0 : sw}
       strokeLinecap="round" strokeLinejoin="round" style={style} className={className} onClick={onClick}>
    {d ? <path d={d} /> : children}
  </svg>
);

/* ---- Channels logo mark: teal "C" wrapping an orange house roof ---- */
function LogoMark({ size = 36, mono }) {
  const teal = mono === 'white' ? '#ffffff' : mono === 'dark' ? '#1c2429' : 'var(--teal-700, #2b5666)';
  const orange = mono ? (mono === 'white' ? 'rgba(255,255,255,.78)' : '#1c2429') : 'var(--orange-500, #d9742e)';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="Channels">
      {/* C ring (open toward the house) */}
      <path d="M70 22 A34 34 0 1 0 70 78" stroke={teal} strokeWidth="11" fill="none" strokeLinecap="round" />
      {/* roof */}
      <path d="M40 56 L67 33 L94 56 Z" fill={orange} />
      {/* house body */}
      <rect x="52" y="52" width="30" height="16" rx="1.5" fill={orange} />
      {/* window grid (cutout look) */}
      <g stroke={mono === 'white' ? teal : '#fff'} strokeWidth="2">
        <line x1="67" y1="52" x2="67" y2="68" />
        <line x1="52" y1="60" x2="82" y2="60" />
      </g>
    </svg>
  );
}

/* Wordmark lockup */
function Logo({ size = 30, light, sub = true, compact }) {
  const ink = light ? '#ffffff' : 'var(--on-surface, #1c2429)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <LogoMark size={size + 8} mono={light ? 'white' : undefined} />
      {!compact && (
        <div style={{ lineHeight: 1 }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: size * .62, color: ink, letterSpacing: '-.02em' }}>
            Channels
          </div>
          {sub && <div style={{ fontSize: size * .26, fontWeight: 600, letterSpacing: '.12em', color: light ? 'rgba(255,255,255,.6)' : 'var(--on-surface-mut,#6a747b)', marginTop: 3 }}>REALTY</div>}
        </div>
      )}
    </div>
  );
}

/* ---- Icon set ---- */
const Icons = {
  home: (p) => <I {...p} d="M3 10.2 12 3l9 7.2M5 9v11h14V9" />,
  grid: (p) => <I {...p}><rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/></I>,
  users: (p) => <I {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.4A5.5 5.5 0 0 1 20.5 19.2"/></I>,
  trophy: (p) => <I {...p}><path d="M7 4h10v3a5 5 0 0 1-10 0Z"/><path d="M7 5H4.5a2.5 2.5 0 0 0 3.5 4M17 5h2.5a2.5 2.5 0 0 1-3.5 4"/><path d="M12 12v3M9 20h6M10 20l.5-3.5h3L14 20"/></I>,
  flag: (p) => <I {...p} d="M5 21V4m0 0 8 1.5L19 4v9l-6 1.5L5 13" />,
  wallet: (p) => <I {...p}><rect x="3" y="6" width="18" height="13" rx="2.6"/><path d="M3 10h18M16.5 14.5h.5"/></I>,
  play: (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M10 8.5 16 12l-6 3.5Z" fill="currentColor" stroke="none"/></I>,
  bell: (p) => <I {...p} d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" />,
  copy: (p) => <I {...p}><rect x="9" y="9" width="11" height="11" rx="2.2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></I>,
  share: (p) => <I {...p}><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.1 10.9 15.9 7.1M8.1 13.1l7.8 3.8"/></I>,
  arrowUp: (p) => <I {...p} d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: (p) => <I {...p} d="M12 5v14M18 13l-6 6-6-6" />,
  arrowRight: (p) => <I {...p} d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: (p) => <I {...p} d="M19 12H5M11 18l-6-6 6-6" />,
  check: (p) => <I {...p} d="M4 12.5 9.5 18 20 6.5" />,
  checkCircle: (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M8 12.2l2.6 2.6L16 9"/></I>,
  plus: (p) => <I {...p} d="M12 5v14M5 12h14" />,
  close: (p) => <I {...p} d="M6 6l12 12M18 6 6 18" />,
  lock: (p) => <I {...p}><rect x="4.5" y="10.5" width="15" height="10" rx="2.4"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></I>,
  bolt: (p) => <I {...p} d="M13 2 4 14h7l-1 8 9-12h-7Z" fill="currentColor" stroke="none"/>,
  land: (p) => <I {...p}><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3Z"/><path d="M9 4v13M15 7v13"/></I>,
  pin: (p) => <I {...p}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></I>,
  gift: (p) => <I {...p}><rect x="3.5" y="9" width="17" height="11.5" rx="1.6"/><path d="M3.5 13.5h17M12 9v11.5M12 9S10 4.5 7.5 5.5 9.5 9 12 9Zm0 0s2-4.5 4.5-3.5S14.5 9 12 9Z"/></I>,
  ribbon: (p) => <I {...p}><circle cx="12" cy="9" r="5.5"/><path d="M9 13.5 7 22l5-3 5 3-2-8.5"/></I>,
  star: (p) => <I {...p} d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9Z" />,
  fire: (p) => <I {...p} d="M12 3c2 3.5-1 5 .5 7 1 1.3 2.5.5 2.5-1 2.5 1.5 1.5 4 .5 5.5C19 18 17 21 12 21S5 18 5 14.5C5 11 8 9 8 6c1.5 1 2 2.5 1.5 4C10.5 9 10 5.5 12 3Z" />,
  bank: (p) => <I {...p}><path d="M3 9.5 12 4l9 5.5M5 10v8M19 10v8M9 10v8M15 10v8M3 20.5h18"/></I>,
  card: (p) => <I {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.4"/><path d="M3 9.5h18M6.5 14.5h4"/></I>,
  shield: (p) => <I {...p}><path d="M12 3 5 5.5v5C5 16 8 19.5 12 21c4-1.5 7-5 7-10.5v-5Z"/><path d="M9 11.5l2 2 4-4"/></I>,
  trending: (p) => <I {...p} d="M3 16l5-5 4 3 6-7M21 7h-4M21 7v4" />,
  clock: (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></I>,
  eye: (p) => <I {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/></I>,
  logout: (p) => <I {...p} d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M9 12h11m0 0-3-3m3 3-3 3" />,
  menu: (p) => <I {...p} d="M4 7h16M4 12h16M4 17h16" />,
  spark: (p) => <I {...p} d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />,
  whatsapp: (p) => <I {...p}><path d="M3 21l1.6-4.4A8 8 0 1 1 8 20.2L3 21Z"/><path d="M9 9c0 4 2.5 6 6 6" /></I>,
  chevR: (p) => <I {...p} d="M9 6l6 6-6 6" />,
  chevD: (p) => <I {...p} d="M6 9l6 6 6-6" />,
  doc: (p) => <I {...p}><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></I>,
  info: (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></I>,
};

Object.assign(window, { I, Icons, Logo, LogoMark });
