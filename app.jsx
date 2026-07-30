/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakSlider, TweakColor, TweakToggle */
const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "a",
  "palette_a": "onyx-gold",
  "palette_b": "carbon-volt",
  "typography": "serif-sans",
  "heroLayout": "split",
  "density": "regular",
  "motion": "subtle",
  "sectionOrder": "services-first"
}/*EDITMODE-END*/;

/* ---------- Avocado wordmark ---------- */
// Rendered as a CSS mask so it adopts --logo-color per direction/palette.
function AvocadoWordmark({ height = 22 }) {
  return (
    <span
      className="brand-mark"
      role="img"
      aria-label="Avocado"
      style={{ height, width: (height * 280) / 48 }}
    />
  );
}

/* ---------- Clickable video (click/tap to toggle sound) ---------- */
function ClickableVideo({ className, ...rest }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const onOtherUnmute = (e) => {
      const v = ref.current;
      if (v && e.detail !== v && !v.muted) {
        v.muted = true;
        setMuted(true);
      }
    };
    document.addEventListener('avocado-video-unmute', onOtherUnmute);
    return () => document.removeEventListener('avocado-video-unmute', onOtherUnmute);
  }, []);

  // Overlay button captures the tap so it works reliably on iOS, where
  // <video> elements don't always fire click. We also call play() inside
  // the gesture so iOS actually starts the audio after unmuting.
  const handleToggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.muted) {
      v.muted = false;
      setMuted(false);
      document.dispatchEvent(new CustomEvent('avocado-video-unmute', { detail: v }));
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          v.muted = true;
          setMuted(true);
          v.play().catch(() => {});
        });
      }
    } else {
      v.muted = true;
      setMuted(true);
    }
  };

  const stateClass = muted ? 'is-muted' : 'is-unmuted';

  return (
    <>
      <video
        ref={ref}
        className={`clickable-video ${stateClass}${className ? ' ' + className : ''}`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        {...rest}
      />
      <button
        type="button"
        className={`video-sound-toggle ${stateClass}`}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        aria-pressed={!muted}
        onClick={handleToggle}
      >
        <span className="video-sound-pill" aria-hidden="true">
          {muted ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M3 10v4h4l5 4V6L7 10H3zm13.59 2L19 9.59 17.41 8 15 10.41 12.59 8 11 9.59 13.41 12 11 14.41 12.59 16 15 13.59 17.41 16 19 14.41z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M3 10v4h4l5 4V6L7 10H3zm10.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </span>
      </button>
    </>
  );
}

/* ---------- Keep autoplay videos running after tab/system resume ---------- */
function useKeepVideosPlaying() {
  useEffect(() => {
    const resumeAll = () => {
      document.querySelectorAll('video').forEach((v) => {
        if (!v.paused) return;
        const p = v.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            v.muted = true;
            v.play().catch(() => {});
          });
        }
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') resumeAll();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', resumeAll);
    window.addEventListener('focus', resumeAll);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', resumeAll);
      window.removeEventListener('focus', resumeAll);
    };
  }, []);
}

/* ---------- Reveal hook ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------- HEADER ---------- */
function Header({ direction, onAuditOpen }) {
  return (
    <header className="site-header">
      <nav className="nav-l">
        <a href="#work" className="ulink">Work</a>
        <a href="#products" className="ulink">Products</a>
        <a href="#approach" className="ulink">Approach</a>
      </nav>
      <a href="#" className="brand-logo" aria-label="Avocado home">
        <AvocadoWordmark height={direction === 'b' ? 18 : 22}/>
      </a>
      <nav className="nav-r">
        <a href="#sectors" className="ulink">Sectors</a>
        <a href="#contact" className="ulink">Contact</a>
        <button type="button" className="header-cta" onClick={onAuditOpen}>
          {direction === 'a' ? 'Book a free audit →' : 'Book audit →'}
        </button>
      </nav>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero({ direction, layout, onAuditOpen }) {
  if (direction === 'a') return <HeroStudio layout={layout} onAuditOpen={onAuditOpen}/>;
  return <HeroOS layout={layout} onAuditOpen={onAuditOpen}/>;
}

function HeroStudio({ layout, onAuditOpen }) {
  return (
    <section className={`hero hero-a layout-${layout}`}>
      <div className="hero-meta-row">
        <div><span className="meta">Established 2021 in Melbourne</span></div>
        <div><span className="live-pill"><span className="dot-live"/> 4 products in market</span></div>
      </div>

      {layout === 'centered' ? (
        <div className="hero-centered">
          <p className="eyebrow">Avocado Digital — A small software studio</p>
          <h1 className="hero-display">
            We build <em className="serif-italic">quietly useful</em><br/>
            software for businesses<br/>
            with <em className="serif-italic">specific&nbsp;problems.</em>
          </h1>
          <p className="hero-lede">
            Bespoke software, curated technology and strategy for Australian small business — plus four products of our own: SocialReels, EzyBiz, CallConcierge and Claudette.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-accent" onClick={onAuditOpen}>
              Book a free tech audit <span className="arrow">→</span>
            </button>
            <a className="ulink" href="#work">See selected work</a>
          </div>
        </div>
      ) : layout === 'fullbleed' ? (
        <div className="hero-fullbleed">
          <h1 className="hero-display hero-display-xl">
            Quietly useful<br/>
            <em className="serif-italic">software</em>, made<br/>
            with care for <em className="serif-italic">small&nbsp;teams.</em>
          </h1>
          <div className="hero-fb-meta">
            <div>
              <span className="meta">Index</span>
              <p>A.01 Workflow Solutions · A.02 Curated Tech · A.03 Strategy Consulting · B.01 SocialReels · B.02 EzyBiz · B.03 CallConcierge · B.04 Claudette</p>
            </div>
            <div>
              <span className="meta">Latest</span>
              <p>SocialReels in private beta. EzyBiz rolling out Teams and smarter SMS replies. CallConcierge bringing custom office phone systems and live Australian answering. Claudette open-sourced on GitHub.</p>
            </div>
            <div>
              <span className="meta">Begin</span>
              <p>
                <a className="ulink" href="#" onClick={(e) => { e.preventDefault(); onAuditOpen(); }}>
                  Book a free tech audit →
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-split">
          <div className="hero-split-left">
            <p className="eyebrow">Avocado Digital — A software &amp; strategy studio</p>
            <h1 className="hero-display">
              Software, built for the way<br/>
              your business <em className="serif-italic">actually&nbsp;works.</em>
            </h1>
            <p className="hero-lede">
              Bespoke software, curated technology and strategy for Australian small business — plus four products of our own.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn btn-accent" onClick={onAuditOpen}>
                Book a free tech audit <span className="arrow">→</span>
              </button>
              <a className="ulink" href="#work">See selected work</a>
            </div>
          </div>
        </div>
      )}

      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          {Array.from({length:2}).map((_,i)=>(
            <div className="hero-marquee-row" key={i}>
              <span>Bespoke software</span><span className="dot">·</span>
              <span>Workflow automation</span><span className="dot">·</span>
              <span>IT strategy</span><span className="dot">·</span>
              <span>Custom integrations</span><span className="dot">·</span>
              <span>Industry tooling</span><span className="dot">·</span>
              <span>SMB operations</span><span className="dot">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroOS({ layout, onAuditOpen }) {
  return (
    <section className={`hero hero-b layout-${layout}`}>
      <div className="hero-meta-row">
        <span className="meta">[01] STUDIO</span>
        <span className="meta">MEL ↔ AU</span>
        <span className="meta">{new Date().getUTCFullYear()} / NOW SHIPPING</span>
      </div>
      {layout === 'centered' ? (
        <div className="hero-centered">
          <h1 className="hero-display">
            Software for the<br/>operating layer of<br/>small business.
          </h1>
          <p className="hero-lede">
            Avocado Digital is a Melbourne studio building precise, durable tools for Australian SMBs — products, integrations, and automations.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-accent" onClick={onAuditOpen}>Book a free tech audit →</button>
            <a className="ulink" href="#products">Browse products</a>
          </div>
        </div>
      ) : layout === 'fullbleed' ? (
        <div className="hero-fullbleed">
          <h1 className="hero-display hero-display-xl">
            The operating<br/>layer for small<br/>business.<span className="dot">.</span>
          </h1>
          <div className="hero-fb-meta">
            <div>
              <span className="meta">/ studio</span>
              <p>Four products in market. A handful of bespoke engagements at any one time. Quiet, considered, durable.</p>
            </div>
            <div>
              <span className="meta">/ now</span>
              <p>SocialReels in private beta. EzyBiz rolling out Teams and smarter SMS replies. CallConcierge bringing custom office phone systems and live Australian answering. Claudette open-sourced on GitHub.</p>
            </div>
            <div>
              <span className="meta">/ contact</span>
              <p>hello@avocadodigital.com.au<br/>03 6358 8887</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-os-split">
          <div className="hero-os-left">
            <h1 className="hero-display">
              Software for the<br/>operating layer<br/>of small business.
            </h1>
            <p className="hero-lede">
              Avocado Digital is a Melbourne studio. We build precise, durable tools — products, integrations, automations — for Australian SMBs.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn btn-accent" onClick={onAuditOpen}>Book a free tech audit →</button>
              <a className="ulink" href="#work">Browse work</a>
            </div>
          </div>
          <div className="hero-os-right">
            <div className="os-spec">
              <div><span className="meta">Discipline</span><b>Software · Strategy · Ops</b></div>
              <div><span className="meta">Scope</span><b>Products &amp; engagements</b></div>
              <div><span className="meta">Sectors</span><b>Trades, services, retail, SMB</b></div>
              <div><span className="meta">Region</span><b>Australia &amp; NZ</b></div>
              <div className="live-row"><span className="meta">Live</span><b>4 products in market</b></div>
            </div>
            <div className="os-media-grid">
              <div className="os-media-cell os-cell-tall">
                <ClickableVideo src="socialreels-reel-2.mp4"/>
                <span className="os-cell-tag">SR-022</span>
              </div>
              <div className="os-media-cell">
                <img src="ezybiz-app-home.jpeg" alt="EzyBiz home"/>
                <span className="os-cell-tag">EZ-001</span>
              </div>
              <div className="os-media-cell">
                <img src="curated-tech.jpeg" alt="Curated tech"/>
                <span className="os-cell-tag">CT-077</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- SERVICES ---------- */
const SERVICES = [
  {
    n: '01', code: 'A.01',
    title: 'Workflow Solutions',
    eyebrow: 'Bespoke software',
    body: 'We design and build internal tools that fit the way your business actually runs — bookings, dispatch, inventory, finance. Replacing spreadsheets, not multiplying them.',
    deliverables: ['Discovery & mapping', 'Custom web apps', 'Integration & migration', 'Ongoing care'],
    media: 'workflow-solutions.jpeg',
    href: 'workflow-solutions.html',
  },
  {
    n: '02', code: 'A.02',
    title: 'Curated Technology',
    eyebrow: 'Right-sized stacks',
    body: 'A considered tech selection for owners who don\'t want a CIO. We assemble, configure, and maintain a stack that matches your size and ambition — and stays out of your way.',
    deliverables: ['Stack audit', 'Vendor selection', 'Implementation', 'Quarterly reviews'],
    media: 'curated-tech.jpeg',
    href: 'curated-tech.html',
  },
  {
    n: '03', code: 'A.03',
    title: 'Strategy Consulting',
    eyebrow: 'Operating advice',
    body: 'Half-day to half-year engagements helping owners decide what to build, what to buy, and what to leave alone. Plain English, written deliverables, no theatre.',
    deliverables: ['Strategy intensives', 'Roadmap shaping', 'Pre-mortems', 'Fractional CTO'],
    media: 'strategy-consulting.jpeg',
    href: 'strategy-consulting.html',
  },
];

function Services({ direction }) {
  return (
    <section id="work" className={`section services dir-${direction}`}>
      <header className="section-head">
        <span className="eyebrow">{direction === 'a' ? '— A. Services' : '/ services'}</span>
        <h2 className="section-title">
          {direction === 'a' ? (
            <>Three ways we work<br/>with <em className="serif-italic">small teams.</em></>
          ) : (
            <>Three ways we work with small&nbsp;teams.</>
          )}
        </h2>
        <p className="section-lede">
          Each engagement is small enough to be considered, long enough to matter. We do not pitch. We write a memo, then we begin.
        </p>
      </header>

      <div className="services-list">
        {SERVICES.map((s) => (
          <article className="service reveal" key={s.n}>
            <div className="service-num">
              <span className="num">{direction === 'a' ? s.n : s.code}</span>
            </div>
            <div className="service-media">
              {s.media && <img src={s.media} alt={s.title}/>}
            </div>
            <div className="service-body">
              <span className="eyebrow service-eyebrow">{s.eyebrow}</span>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-text">{s.body}</p>
            </div>
            <div className="service-deliverables">
              <span className="meta">Deliverables</span>
              <ul>
                {s.deliverables.map((d) => <li key={d}>{d}</li>)}
              </ul>
              <a className="ulink service-link" href={s.href}>Read more <span className="arrow">→</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- PRODUCTS ---------- */
const PRODUCTS = [
  {
    n: '01', code: 'B.01',
    name: 'SocialReels',
    one: 'Short-form video, without the production circus.',
    body: 'A weekly drop of platform-ready short-form video for SMB owners who don\'t have time to be content creators. Briefs in, reels out.',
    tags: ['Beta', 'Reels', 'Content ops'],
    stat: { v: '03 / wk', l: 'Reels per business' },
    video: 'socialreels-reel.mp4',
    href: 'https://socialreels.ai', external: true,
  },
  {
    n: '02', code: 'B.02',
    name: 'EzyBiz',
    one: 'Run a sharp business. Live a big life.',
    body: 'A dedicated business number for consultants, business owners, and independent professionals — with conversational voicemail, in-call appointment booking, smart SMS replies, and automatic contact history. On the clock, it works with you. Off the clock, it keeps your business running.',
    tags: ['iOS', 'Android', 'Web', 'AU & NZ'],
    stat: { v: 'AU & NZ', l: 'Available now' },
    image: 'ezybiz-app-home.jpeg',
    href: 'https://ezybiz.app', external: true,
  },
  {
    n: '03', code: 'B.03',
    name: 'CallConcierge',
    one: 'A complete, custom phone system for your office.',
    body: 'Our bespoke business phone solution for offices, built on the EzyBiz platform. Custom integrations, bespoke hardware, and live Australian answering — so every call to your business is handled your way, by a team in your time zone.',
    tags: ['Offices', 'Bespoke hardware', 'Live AU answering'],
    stat: { v: '100% AU', l: 'Live answering team' },
    image: 'callconcierge-app-icon.png', icon: true, iconBg: '#0a0f1a',
    href: 'callconcierge.html',
  },
  {
    n: '04', code: 'B.04',
    name: 'Claudette',
    one: 'A voice-based IDE for the ambient coder.',
    body: 'An open-source, voice-based IDE that turns speech into a working codebase. Talk through the problem, watch Claudette read, grep, edit, and think — built by our studio, free to use, on GitHub.',
    tags: ['Open source', 'Voice', 'IDE'],
    stat: { v: 'MIT', l: 'Open source on GitHub' },
    image: 'claudette-preview.png',
    href: 'https://github.com/Avocado-Pty-Ltd/Claudette', external: true,
  },
];

function Products({ direction }) {
  return (
    <section id="products" className={`section products dir-${direction}`}>
      <header className="section-head products-head">
        <span className="eyebrow">{direction === 'a' ? '— B. Products' : '/ products'}</span>
        <h2 className="section-title">
          {direction === 'a' ? (
            <>Four products,<br/>each <em className="serif-italic">built for one thing.</em></>
          ) : (
            <>Four products, each built for one thing.</>
          )}
        </h2>
        <p className="section-lede">
          We don't run a portfolio for its own sake. Each product was a problem we kept seeing in client work, until building it ourselves was the only honest answer.
        </p>
      </header>

      <div className="products-grid">
        {PRODUCTS.map((p, i) => (
          <article className={`product reveal product-${i}`} key={p.name}>
            <div className={`product-frame ${p.icon ? 'product-frame-icon' : ''}`} style={p.icon ? {background: p.iconBg} : null}>
              {p.video ? (
                <ClickableVideo src={p.video}/>
              ) : p.image ? (
                <img src={p.image} alt={`${p.name}`} className={p.icon ? 'product-icon' : ''}/>
              ) : (
                <div className="placeholder" style={{aspectRatio:'9/16'}}>{p.name}</div>
              )}
            </div>
            <div className="product-meta">
              <div className="product-meta-row">
                <span className="num">{direction === 'a' ? p.n : p.code}</span>
                <span className="meta">— {p.tags[0]}</span>
              </div>
              <h3 className="product-name">{p.name}</h3>
              <p className="product-one"><em className="serif-italic">{p.one}</em></p>
              <p className="product-body">{p.body}</p>
              <div className="product-tags">
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="product-foot">
                <div className="product-stat">
                  <span className="stat-v">{p.stat.v}</span>
                  <span className="stat-l">{p.stat.l}</span>
                </div>
                <a className="ulink" href={p.href} {...(p.external ? {target:'_blank', rel:'noopener'} : {})}>
                  Visit site <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- IN MOTION (media wall) ---------- */
function InMotion({ direction }) {
  const reels = [
    { src:'socialreels-reel-4.mp4', tag:'SR-040', label:'Recent drop — :15' },
    { src:'socialreels-reel-5.mp4', tag:'SR-050', label:'Recent drop — :36' },
    { src:'socialreels-reel-2.mp4', tag:'SR-022', label:'Recent drop' },
  ];
  return (
    <section className={`section in-motion dir-${direction}`}>
      <header className="section-head">
        <span className="eyebrow">{direction === 'a' ? '— C. In motion' : '/ in motion'}</span>
        <div>
          <h2 className="section-title">
            {direction === 'a'
              ? <>Where the marketing meets<br/>the <em className="serif-italic">machinery.</em></>
              : <>Where marketing meets the machinery.</>}
          </h2>
          <p className="section-lede">A small wall of recent output — brand films from SocialReels, fieldwork from active engagements, and stills from the studio.</p>
        </div>
      </header>

      <div className="reel-strip">
        {reels.map((r) => (
          <figure className="reel-card reveal" key={r.tag}>
            <ClickableVideo src={r.src}/>
            <figcaption>
              <span className="meta">{r.tag}</span>
              <span>{r.label}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------- APPROACH / Manifesto ---------- */
function Approach({ direction }) {
  const items = [
    { n: '01', t: 'Memos before mockups.', b: 'We start every engagement with a written memo — what we heard, what we\'d do, what we wouldn\'t. If the memo is wrong, the work was going to be wrong.' },
    { n: '02', t: 'Small enough to care.', b: 'Avocado Digital is small on purpose. We take fewer engagements, with the people doing the work. No hand-offs to a junior team after the pitch.' },
    { n: '03', t: 'Buy, build, or leave alone.', b: 'Most software problems shouldn\'t become projects. We are happy to talk you out of a build if a better off-the-shelf path exists.' },
    { n: '04', t: 'Durable, not novel.', b: 'We choose boring technology on purpose. The work has to outlast the engagement, including the parts the team is excited about.' },
  ];
  return (
    <section id="approach" className={`section approach dir-${direction}`}>
      <header className="section-head">
        <span className="eyebrow">{direction === 'a' ? '— D. Approach' : '/ approach'}</span>
        <h2 className="section-title">
          {direction === 'a' ? <>Four <em className="serif-italic">small commitments</em><br/>that shape the work.</>
            : <>Four small commitments that shape the work.</>}
        </h2>
      </header>
      <ol className="manifesto">
        {items.map((it) => (
          <li key={it.n} className="manifesto-item reveal">
            <span className="num">{it.n}</span>
            <h3>{it.t}</h3>
            <p>{it.b}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- CLIENTS / SECTORS strip ---------- */
function Sectors({ direction }) {
  const list = ['Lawyers', 'IT consultants', 'Small business owners', 'Allied health', 'Independent retail', 'Veterinary', 'Hospitality'];
  return (
    <section id="sectors" className={`section sectors dir-${direction}`}>
      <header className="section-head">
        <span className="eyebrow">{direction === 'a' ? '— E. Sectors' : '/ sectors we know'}</span>
        <h2 className="section-title">
          {direction === 'a' ? <>Where we tend to <em className="serif-italic">be useful.</em></>
            : <>Where we tend to be useful.</>}
        </h2>
      </header>
      <ul className="sectors-list">
        {list.map((s, i) => (
          <li key={s}><span className="num">{String(i+1).padStart(2,'0')}</span> {s}</li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- CONTACT / CTA ---------- */
function Contact({ direction, onAuditOpen }) {
  return (
    <section id="contact" className={`section contact dir-${direction}`}>
      <div className="contact-inner">
        <span className="eyebrow">{direction === 'a' ? '— F. Begin' : '/ begin'}</span>
        <h2 className="contact-title">
          {direction === 'a' ? (
            <>Book your <em className="serif-italic">free tech audit.</em></>
          ) : (
            <>Book your free tech audit.</>
          )}
        </h2>
        <p className="contact-lede">
          A 30-minute call to map where your business is now, where the friction is, and where a small piece of software might earn its keep. No pitch — written notes, plain English, and an honest answer if we're not the right fit.
        </p>
        <div className="contact-actions">
          <button type="button" className="btn btn-accent" onClick={onAuditOpen}>
            Book a free tech audit <span className="arrow">→</span>
          </button>
          <a className="ulink" href="mailto:hello@avocadodigital.com.au">hello@avocadodigital.com.au</a>
          <a className="ulink" href="tel:+61363588887">03 6358 8887</a>
        </div>
        <div className="contact-foot">
          <div>
            <span className="meta">Email</span>
            <b>hello@avocadodigital.com.au</b>
          </div>
          <div>
            <span className="meta">Phone</span>
            <b>03 6358 8887</b>
          </div>
          <div>
            <span className="meta">Region</span>
            <b>Australia &amp; NZ</b>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- AUDIT MODAL ---------- */
const AUDIT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxH3ufXbJid0j20ZjRH8mbwXt_8VUg36YyNMAHYvnA6_170EzmKKT11e3C9yot_HC9JDw/exec';

const TECH_STACK_OPTIONS = [
  { value: 'spreadsheets', label: 'Spreadsheets (Excel/Google Sheets)' },
  { value: 'accounting',   label: 'Accounting software (Xero, MYOB, QuickBooks)' },
  { value: 'crm',          label: 'CRM (HubSpot, Salesforce, etc.)' },
  { value: 'pm',           label: 'Project management tools' },
  { value: 'industry',     label: 'Industry-specific software' },
  { value: 'paper',        label: 'Mostly paper-based / minimal tech' },
];

function AuditModal({ open, onClose }) {
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ email: '', business_size: '', tech_stack: [], manual_tasks: '', tech_budget: '' });

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleStack = (v) => setForm((f) => ({
    ...f,
    tech_stack: f.tech_stack.includes(v) ? f.tech_stack.filter((x) => x !== v) : [...f.tech_stack, v],
  }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await fetch(AUDIT_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          form_type: 'audit',
          email: form.email,
          business_size: form.business_size,
          tech_stack: form.tech_stack.join(', '),
          manual_tasks: form.manual_tasks,
          tech_budget: form.tech_budget,
        }),
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setForm({ email: '', business_size: '', tech_stack: [], manual_tasks: '', tech_budget: '' });
      }, 2200);
    } catch (err) {
      console.error('Audit submit failed', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="audit-modal-root" role="dialog" aria-modal="true" aria-labelledby="audit-modal-title">
      <div className="audit-modal-overlay" onClick={onClose}/>
      <div className="audit-modal-panel">
        <button type="button" className="audit-modal-close" aria-label="Close" onClick={onClose}>×</button>
        <span className="eyebrow">— Free tech audit</span>
        <h3 id="audit-modal-title" className="audit-modal-title">
          A 30-minute call,<br/>
          <em className="serif-italic">no pitch.</em>
        </h3>
        <p className="audit-modal-lede">
          Answer a few quick questions so we can prepare. We'll write back within two working days with a time and a short brief.
        </p>

        <form className="audit-form" onSubmit={submit}>
          <div className="audit-field">
            <label htmlFor="audit-email"><span className="eyebrow">Email</span></label>
            <input id="audit-email" type="email" required value={form.email}
                   placeholder="you@yourbusiness.com.au"
                   onChange={(e) => update('email', e.target.value)} />
          </div>

          <div className="audit-field">
            <label htmlFor="audit-size"><span className="eyebrow">Business size</span></label>
            <select id="audit-size" required value={form.business_size}
                    onChange={(e) => update('business_size', e.target.value)}>
              <option value="" disabled>Select team size…</option>
              <option value="solo">Just me (solo operator)</option>
              <option value="2-5">2–5 employees</option>
              <option value="6-20">6–20 employees</option>
              <option value="20+">20+ employees</option>
            </select>
          </div>

          <div className="audit-field">
            <span className="eyebrow">Current tech stack</span>
            <div className="audit-checkboxes">
              {TECH_STACK_OPTIONS.map((opt) => (
                <label key={opt.value} className={`audit-check ${form.tech_stack.includes(opt.value) ? 'on' : ''}`}>
                  <input type="checkbox" checked={form.tech_stack.includes(opt.value)}
                         onChange={() => toggleStack(opt.value)} />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="audit-field">
            <label htmlFor="audit-tasks"><span className="eyebrow">Time-consuming manual tasks</span></label>
            <textarea id="audit-tasks" required value={form.manual_tasks} rows={3}
                      placeholder="Data entry, invoicing, scheduling, follow-ups…"
                      onChange={(e) => update('manual_tasks', e.target.value)} />
          </div>

          <div className="audit-field">
            <label htmlFor="audit-budget"><span className="eyebrow">Tech budget</span></label>
            <select id="audit-budget" required value={form.tech_budget}
                    onChange={(e) => update('tech_budget', e.target.value)}>
              <option value="" disabled>Select budget range…</option>
              <option value="100-200">$100–200 / month</option>
              <option value="200-400">$200–400 / month</option>
              <option value="400-1000">$400–1,000 / month</option>
              <option value="1000+">$1,000+ / month</option>
            </select>
          </div>

          <button type="submit" className="btn btn-accent audit-submit"
                  disabled={status === 'submitting' || status === 'success'}>
            {status === 'submitting' && 'Submitting…'}
            {status === 'success'    && "Thanks — we'll be in touch ✓"}
            {status === 'error'      && 'Error — please try again'}
            {status === 'idle'       && <>Book my free audit <span className="arrow">→</span></>}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- FOOTER ---------- */
function Footer({ direction }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <AvocadoWordmark height={direction === 'b' ? 18 : 26}/>
          <p className="meta" style={{marginTop:18}}>
            Avocado Pty Ltd<br/>
            Established 2021 · Melbourne, AU
          </p>
        </div>
        <div>
          <span className="eyebrow">Practice</span>
          <ul>
            <li><a className="ulink" href="workflow-solutions.html">Workflow Solutions</a></li>
            <li><a className="ulink" href="curated-tech.html">Curated Technology</a></li>
            <li><a className="ulink" href="strategy-consulting.html">Strategy</a></li>
          </ul>
        </div>
        <div>
          <span className="eyebrow">Products</span>
          <ul>
            <li><a className="ulink" href="https://socialreels.ai" target="_blank" rel="noopener">SocialReels</a></li>
            <li><a className="ulink" href="https://ezybiz.app" target="_blank" rel="noopener">EzyBiz</a></li>
            <li><a className="ulink" href="callconcierge.html">CallConcierge</a></li>
            <li><a className="ulink" href="https://github.com/Avocado-Pty-Ltd/Claudette" target="_blank" rel="noopener">Claudette</a></li>
          </ul>
        </div>
        <div>
          <span className="eyebrow">Studio</span>
          <ul>
            <li><a className="ulink" href="#approach">Approach</a></li>
            <li><a className="ulink" href="#sectors">Sectors</a></li>
            <li><a className="ulink" href="#contact">Contact</a></li>
            <li><a className="ulink" href="privacy-policy.html">Privacy</a></li>
            <li><a className="ulink" href="terms-of-service.html">Terms</a></li>
            <li><a className="ulink" href="data-residency.html">Data residency</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-foot">
        <span className="meta">© {year} Avocado Pty Ltd · ACN 652 199 687 · ABN 81 652 199 687</span>
        <span className="meta">Made in Australia</span>
      </div>
    </footer>
  );
}

/* ---------- APP ---------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [auditOpen, setAuditOpen] = useState(false);
  const openAudit = () => setAuditOpen(true);
  const closeAudit = () => setAuditOpen(false);
  useReveal();
  useKeepVideosPlaying();

  const palette = t.direction === 'a' ? t.palette_a : t.palette_b;
  const directionAttr = t.direction;

  const sections = useMemo(() => {
    const all = {
      services: <Services direction={t.direction} key="services"/>,
      products: <Products direction={t.direction} key="products"/>,
      motion:   <InMotion direction={t.direction} key="motion"/>,
      approach: <Approach direction={t.direction} key="approach"/>,
      sectors:  <Sectors direction={t.direction} key="sectors"/>,
    };
    const orders = {
      'services-first':  ['services', 'products', 'motion', 'approach', 'sectors'],
      'products-first':  ['products', 'motion', 'services', 'sectors', 'approach'],
      'manifesto-first': ['approach', 'services', 'products', 'motion', 'sectors'],
    };
    return (orders[t.sectionOrder] || orders['services-first']).map((k) => all[k]);
  }, [t.direction, t.sectionOrder]);

  return (
    <div
      data-direction={directionAttr}
      data-palette={palette}
      data-typography={t.typography}
      data-density={t.density}
      data-motion={t.motion}
      className="root"
    >
      <Header direction={t.direction} onAuditOpen={openAudit}/>
      <main>
        <Hero direction={t.direction} layout={t.heroLayout} onAuditOpen={openAudit}/>
        {sections}
        <Contact direction={t.direction} onAuditOpen={openAudit}/>
      </main>
      <Footer direction={t.direction}/>
      <AuditModal open={auditOpen} onClose={closeAudit}/>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Direction" />
        <TweakRadio
          value={t.direction}
          options={[{value:'a', label:'Studio'}, {value:'b', label:'Operating Sys'}]}
          onChange={(v) => setTweak('direction', v)}
        />

        <TweakSection label="Palette" />
        {t.direction === 'a' ? (
          <TweakSelect
            value={t.palette_a}
            options={[
              {value:'onyx-gold', label:'Onyx + Gold'},
              {value:'ink-rose',  label:'Ink + Rose'},
              {value:'onyx-bone', label:'Onyx + Bone'},
            ]}
            onChange={(v) => setTweak('palette_a', v)}
          />
        ) : (
          <TweakSelect
            value={t.palette_b}
            options={[
              {value:'carbon-volt', label:'Carbon + Volt'},
              {value:'ink-cyan',    label:'Ink + Cyan'},
              {value:'ink-amber',   label:'Ink + Amber'},
            ]}
            onChange={(v) => setTweak('palette_b', v)}
          />
        )}

        <TweakSection label="Typography" />
        <TweakSelect
          value={t.typography}
          options={[
            {value:'serif-sans', label:'Cormorant + Manrope'},
            {value:'sans-mono',  label:'Geist + Geist Mono'},
            {value:'serif-mono', label:'Serif + JetBrains Mono'},
          ]}
          onChange={(v) => setTweak('typography', v)}
        />

        <TweakSection label="Hero layout" />
        <TweakRadio
          value={t.heroLayout}
          options={[{value:'split', label:'Split'}, {value:'centered', label:'Centered'}, {value:'fullbleed', label:'Full-bleed'}]}
          onChange={(v) => setTweak('heroLayout', v)}
        />

        <TweakSection label="Density" />
        <TweakRadio
          value={t.density}
          options={[{value:'tight', label:'Tight'}, {value:'regular', label:'Regular'}, {value:'spacious', label:'Spacious'}]}
          onChange={(v) => setTweak('density', v)}
        />

        <TweakSection label="Motion" />
        <TweakRadio
          value={t.motion}
          options={[{value:'off', label:'Off'}, {value:'subtle', label:'Subtle'}, {value:'lively', label:'Lively'}]}
          onChange={(v) => setTweak('motion', v)}
        />

        <TweakSection label="Section order" />
        <TweakSelect
          value={t.sectionOrder}
          options={[
            {value:'services-first',  label:'Services → Products'},
            {value:'products-first',  label:'Products → Services'},
            {value:'manifesto-first', label:'Approach first'},
          ]}
          onChange={(v) => setTweak('sectionOrder', v)}
        />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
