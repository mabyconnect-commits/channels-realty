/* ============================================================
   LANDING PAGE  (exports window.Landing)
   ============================================================ */
function Landing({ onAuth }) {
  const D = window.DATA;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f);
  }, []);

  const steps = [
    { n: '01', t: 'Sign up free', d: 'Create your co-own account in under 2 minutes. No agent, no paperwork queue.', icon: <Icons.users /> },
    { n: '02', t: 'Own from 1 sqm', d: 'Buy land by the square metre — from as little as ₦20,000 — in fast-appreciating estates.', icon: <Icons.land /> },
    { n: '03', t: 'Refer & hit milestones', d: 'Earn 20% instant commission and unlock free land as your network grows.', icon: <Icons.trophy /> },
    { n: '04', t: 'Claim your land', d: 'Watch your sqm add up, claim rewards, and get a real allocation in Epe, Lagos.', icon: <Icons.flag /> },
  ];

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all .3s var(--ease)',
        background: scrolled ? 'color-mix(in srgb, var(--bg) 85%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--hairline)' : '1px solid transparent' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size={30} />
          <nav className="d-only" style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            {['How it works', 'Rewards', 'Earnings', 'Owners'].map((x) => (
              <a key={x} href={'#' + x.toLowerCase().replace(/ /g, '')} style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink-2)' }}>{x}</a>
            ))}
          </nav>
          <div className="row gap-3">
            <button className="d-only" onClick={() => onAuth('login')} style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>Log in</button>
            <Btn size="sm" onClick={() => onAuth('signup')} iconR={<Icons.arrowRight />}>Get started</Btn>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 120 }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,116,46,.16), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 200, left: -160, width: 460, height: 460, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(43,86,102,.12), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 22px 70px', position: 'relative',
          display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,.95fr)', gap: 50, alignItems: 'center' }} className="hero-grid">
          <div>
            <div className="chip chip-accent reveal reveal-1" style={{ marginBottom: 22 }}>
              <Icons.spark size={15} /> Real estate to the masses
            </div>
            <h1 className="reveal reveal-2" style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.02 }}>
              Own land by the<br />square metre.<br />
              <span style={{ color: 'var(--accent)' }}>From ₦20,000.</span>
            </h1>
            <p className="reveal reveal-3" style={{ fontSize: 'clamp(16px,1.6vw,19px)', color: 'var(--ink-2)', maxWidth: 480, marginTop: 22, lineHeight: 1.6 }}>
              Join the Channels Co-Own Program. Buy fractions of fast-appreciating land,
              refer friends for instant commission, and earn <strong>free square metres</strong> as you hit milestones.
            </p>
            <div className="reveal reveal-4 row gap-3 wrap" style={{ marginTop: 30 }}>
              <Btn size="lg" onClick={() => onAuth('signup')} iconR={<Icons.arrowRight />}>Start co-owning</Btn>
              <Btn size="lg" variant="outline" onClick={() => document.getElementById('howitworks').scrollIntoView({ behavior: 'smooth' })} icon={<Icons.play />}>See how it works</Btn>
            </div>
            <div className="reveal reveal-5 row gap-4 wrap" style={{ marginTop: 36 }}>
              {[['12,400+', 'Co-owners'], ['₦2.4B', 'Land sold'], ['18%+', 'Avg. appreciation']].map(([a, b]) => (
                <div key={b}>
                  <div className="font-display" style={{ fontSize: 26, fontWeight: 700 }}>{a}</div>
                  <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>
          {/* App preview mock */}
          <div className="reveal reveal-4 d-only" style={{ position: 'relative' }}>
            <HeroPhone />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 22px', display: 'flex', gap: 34, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[[<Icons.shield />, 'Verified C of O & survey'], [<Icons.bolt />, 'Instant 20% commission'], [<Icons.card />, 'Pay with Paystack'], [<Icons.land />, 'Real allocation in Epe, Lagos']].map(([ic, t], i) => (
            <div key={i} className="row gap-2" style={{ color: 'var(--ink-2)', fontWeight: 600, fontSize: 14 }}>
              <span style={{ color: 'var(--accent)', display: 'flex' }}>{ic}</span>{t}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="howitworks" style={{ maxWidth: 1180, margin: '0 auto', padding: '84px 22px' }}>
        <div className="center" style={{ marginBottom: 50 }}>
          <div className="eyebrow">How it works</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, marginTop: 10 }}>Four steps to land ownership</h2>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))' }}>
          {steps.map((s, i) => (
            <Card key={s.n} hover style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{s.n}</div>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--teal-50)', color: 'var(--teal-700)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '18px 0 16px', fontSize: 24 }}>{s.icon}</div>
              <h3 style={{ fontSize: 19, fontWeight: 700 }}>{s.t}</h3>
              <p className="muted" style={{ fontSize: 14.5, marginTop: 8, lineHeight: 1.55 }}>{s.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* REWARDS — milestones */}
      <section id="rewards" style={{ background: 'var(--teal-700)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 0%, rgba(217,116,46,.25), transparent 50%)' }} />
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '84px 22px', position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', gap: 50, alignItems: 'center' }} className="hero-grid">
          <div>
            <div className="eyebrow" style={{ color: 'var(--orange-300)' }}>Milestone rewards</div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, marginTop: 12 }}>
              Every referral earns you <span style={{ color: 'var(--orange-400)' }}>free land.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 17, marginTop: 16, lineHeight: 1.6, maxWidth: 440 }}>
              Each person you bring earns ~1 sqm toward your milestones. Hit 100 referrals and claim
              150 sqm. Plus bonus kits, full plots and VIP site tours along the way.
            </p>
            <Btn variant="primary" size="lg" style={{ marginTop: 28 }} onClick={() => onAuth('signup')} iconR={<Icons.arrowRight />}>Claim your first sqm</Btn>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {D.milestones.map((m, i) => (
              <div key={m.id} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)',
                borderRadius: 18, padding: 18, backdropFilter: 'blur(6px)' }}>
                <div className="row between" style={{ marginBottom: 12 }}>
                  <span style={{ color: 'var(--orange-300)', display: 'flex' }}>
                    {m.type === 'kit' ? <Icons.gift size={22} /> : m.type === 'plot' ? <Icons.home size={22} /> : <Icons.land size={22} />}
                  </span>
                  <span className="font-mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{m.refs} refs</span>
                </div>
                <div className="font-display" style={{ fontSize: 17, fontWeight: 700 }}>{m.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EARNINGS — commission ladder */}
      <section id="earnings" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,9vw,84px) 22px' }}>
        <div className="grid hero-grid" style={{ gridTemplateColumns: 'minmax(0,.9fr) minmax(0,1.1fr)', gap: 'clamp(28px,5vw,50px)', alignItems: 'center' }}>
          <div>
            <div className="eyebrow">Earn as you grow</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, marginTop: 12 }}>
              Up to <span style={{ color: 'var(--accent)' }}>30%</span> across two levels
            </h2>
            <p className="muted" style={{ fontSize: 17, marginTop: 16, lineHeight: 1.6 }}>
              On a ₦20,000 sale you earn <strong style={{ color: 'var(--ink)' }}>₦4,000 instantly</strong> — withdrawable
              anytime. Your upline earns a smaller override, and your rate climbs as your team grows.
            </p>
            <div className="card card-pad" style={{ marginTop: 24, background: 'var(--surface)' }}>
              <div className="row gap-3">
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--orange-100)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.bolt size={22} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Instant payout</div>
                  <div className="muted" style={{ fontSize: 13.5 }}>Withdraw your ₦4,000 commission the moment it lands.</div>
                </div>
              </div>
            </div>
          </div>
          <Card pad={false} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px clamp(14px,4vw,22px)', borderBottom: '1px solid var(--hairline)', display: 'grid', gridTemplateColumns: '1.5fr .9fr .8fr .8fr', gap: 6, fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              <span>Rank</span><span>Team</span><span className="center">Lv1</span><span className="center">Lv2</span>
            </div>
            {D.tiers.map((t, i) => (
              <div key={t.id} style={{ padding: '14px clamp(14px,4vw,22px)', borderBottom: i < D.tiers.length - 1 ? '1px solid var(--line-2)' : 'none',
                display: 'grid', gridTemplateColumns: '1.5fr .9fr .8fr .8fr', gap: 6, alignItems: 'center' }}>
                <div className="row gap-2" style={{ minWidth: 0 }}><span className="dot" style={{ background: t.color, flex: '0 0 auto' }} /><span style={{ fontWeight: 700, fontSize: 'clamp(13px,3.6vw,14.5px)', lineHeight: 1.2 }}>{t.name}</span></div>
                <span className="num muted" style={{ fontSize: 13.5 }}>{t.team === 0 ? 'Start' : t.team.toLocaleString()}+</span>
                <span className="num center" style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--accent)' }}>{t.l1}%</span>
                <span className="num center" style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--teal-600)' }}>{t.l2}%</span>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* OWNERS — testimonials */}
      <section id="owners" style={{ background: 'var(--surface)', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '84px 22px' }}>
          <div className="center" style={{ marginBottom: 46 }}>
            <div className="eyebrow">Real owners</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, marginTop: 10 }}>From ₦20,000 to land owner</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            {D.testimonials.map((t) => (
              <Card key={t.name} hover>
                <div style={{ color: 'var(--orange-300)', display: 'flex', gap: 2, marginBottom: 14 }}>
                  {[0,1,2,3,4].map((i) => <Icons.star key={i} size={17} fill="var(--orange-400)" />)}
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink)', fontWeight: 500 }}>“{t.quote}”</p>
                <div className="row gap-3" style={{ marginTop: 20 }}>
                  <Avatar src={t.avatar} name={t.name} size={44} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.name}</div>
                    <div className="muted" style={{ fontSize: 13 }}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '84px 22px' }}>
        <div style={{ borderRadius: 30, overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(135deg, var(--teal-800), var(--teal-600))', padding: 'clamp(40px,6vw,72px)', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: -80, right: -40, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,116,46,.3), transparent 65%)' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ color: '#fff', fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 800 }}>Your plot is waiting.</h2>
            <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 18, marginTop: 14, maxWidth: 520, margin: '14px auto 0' }}>
              Join 12,400+ Nigerians building wealth one square metre at a time.
            </p>
            <Btn size="lg" variant="primary" style={{ marginTop: 30 }} onClick={() => onAuth('signup')} iconR={<Icons.arrowRight />}>Create free account</Btn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--hairline)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Logo size={26} />
          <div className="muted" style={{ fontSize: 13 }}>© 2026 Channels Realty Innovation Ltd · Real estate to the masses</div>
          <div className="row gap-3 muted" style={{ fontSize: 13, fontWeight: 600 }}>
            <span>@Channels_realty</span><span>·</span><span>channels.realty</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Mini phone preview used in hero */
function HeroPhone() {
  const D = window.DATA;
  return (
    <div style={{ width: 290, margin: '0 auto', borderRadius: 38, padding: 10, background: 'var(--ink)',
      boxShadow: '0 40px 90px rgba(28,36,41,.3)', transform: 'rotate(2deg)' }}>
      <div style={{ borderRadius: 30, overflow: 'hidden', background: 'var(--bg)' }}>
        <div style={{ background: 'linear-gradient(150deg, var(--teal-700), var(--teal-600))', padding: '22px 18px 26px', color: '#fff' }}>
          <div className="row between" style={{ marginBottom: 18 }}>
            <Logo size={20} light />
            <Icons.bell size={18} style={{ color: 'rgba(255,255,255,.8)' }} />
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>Withdrawable balance</div>
          <div className="font-display num" style={{ fontSize: 30, fontWeight: 800, marginTop: 4 }}>₦142,500</div>
          <div className="row gap-2" style={{ marginTop: 14 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,.16)', borderRadius: 12, padding: '8px 10px', fontSize: 11, fontWeight: 700 }}>↗ Withdraw</div>
            <div style={{ flex: 1, background: 'var(--orange-500)', borderRadius: 12, padding: '8px 10px', fontSize: 11, fontWeight: 700 }}>Share link</div>
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <div className="row between" style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 13 }}>150 sqm milestone</span>
            <span className="font-mono" style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>68%</span>
          </div>
          <Progress value={68} />
          <div style={{ marginTop: 16, background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 14, padding: 12 }}>
            <div className="row gap-2">
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--orange-100)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.bolt size={16} /></div>
              <div style={{ fontSize: 11.5 }}><strong>+₦4,000</strong><div className="muted" style={{ fontSize: 10.5 }}>Lv1 commission · just now</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Landing = Landing;
