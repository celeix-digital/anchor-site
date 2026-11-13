import { useEffect, useRef } from 'react'
import { DEMO_URL, control, hero, how, live, nav, problem, surface, type Side } from './content'
import { LogoMark } from './components/Logo'
import AnchorRail from './components/AnchorRail'
import { ArrowIcon, MailIcon, SparkIcon, TeamIcon } from './components/Icons'

function Nav() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let on = false
    const update = () => {
      const next = window.scrollY > 4
      if (next !== on) {
        on = next
        el.classList.toggle('is-scrolled', on)
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header ref={ref} className="nav">
      <div className="nav-inner">
        <a className="brand" href="#top" aria-label={nav.homeLabel}>
          <LogoMark className="brand-glyph" />
          <span className="brand-word">ANCHOR39</span>
        </a>
        <nav className="nav-links" aria-label="Main">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-primary btn-sm" href={DEMO_URL}>
          {nav.cta}
        </a>
      </div>
    </header>
  )
}

/** Fade-and-rise as elements enter the viewport. Off under reduced motion. */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const show = (el: Element) => el.classList.add('is-in')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      els.forEach(show)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target)
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` })

function Eyebrow({ children }: { children: string }) {
  return <p className="eyebrow">{children}</p>
}

const SideIcon = ({ side, className }: { side: Side; className?: string }) =>
  side === 'ai' ? <SparkIcon className={className} /> : <TeamIcon className={className} />

function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title" className="display hero-title">
            {hero.lines.map(([a, b], i) => (
              <span key={i} className="hero-line reveal" style={d(60 + i * 90)}>
                <span className="nowrap">{a}</span> <span className="nowrap">{b}</span>
              </span>
            ))}
          </h1>
          <p className="lede hero-sub reveal" style={d(260)}>
            {hero.sub}
          </p>
          <div className="actions reveal" style={d(340)}>
            <a className="btn btn-primary" href={DEMO_URL}>
              {hero.primary}
            </a>
            <a className="btn btn-secondary" href="#how">
              {hero.secondary}
            </a>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  )
}

/** Real product screenshots, layered: the shared inbox with an AI draft waiting for review. */
function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hv-bg reveal" style={d(200)}>
        <svg className="hv-ring" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="17.2" fill="none" stroke="currentColor" strokeWidth="0.9" />
          <g fill="currentColor">
            <rect x="23.4" y="1.4" width="1.2" height="5.2" />
            <rect x="23.4" y="41.4" width="1.2" height="5.2" />
            <rect x="1.4" y="23.4" width="5.2" height="1.2" />
            <rect x="41.4" y="23.4" width="5.2" height="1.2" />
          </g>
        </svg>
      </div>
      <figure className="hv-window reveal reveal-zoom" style={d(380)}>
        <div className="hv-bar">
          <span className="hv-dot" />
          <span className="hv-dot" />
          <span className="hv-dot" />
          <span className="hv-title">{live.inbox.header}</span>
        </div>
        <img src={live.inbox.image.src} width={live.inbox.image.width} height={live.inbox.image.height} alt="" fetchPriority="high" decoding="async" />
      </figure>
      <figure className="hv-card reveal" style={d(620)}>
        <span className="hv-pill">{live.drafts.status}</span>
        <img src={live.drafts.image.src} width={live.drafts.image.width} height={live.drafts.image.height} alt="" decoding="async" />
      </figure>
    </div>
  )
}

function Problem() {
  return (
    <section className="section" aria-labelledby="problem-title">
      <div className="wrap split split-visual">
        <div className="reveal">
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <h2 id="problem-title" className="display h2">
            {problem.heading}
          </h2>
          <p className="note">{problem.note}</p>
          <div className="stack problem-body">
            {problem.body.map((t, i) => (
              <p key={i} className={i === problem.body.length - 1 ? 'emph' : 'copy'}>
                {t}
              </p>
            ))}
          </div>
        </div>
        <InboxFlow />
      </div>
    </section>
  )
}

/** Everyone on the call writing into one shared inbox. Illustrative messages from content.ts. */
function InboxFlow() {
  const threads = [...live.inbox.threads, { from: live.classification.from, subject: live.classification.subject, time: live.classification.time }]
  return (
    <div className="flow reveal" style={d(140)} aria-hidden="true">
      <ul className="flow-parties">
        {problem.parties.map((p, i) => (
          <li key={p} style={d(200 + i * 70)}>
            {p}
          </li>
        ))}
      </ul>
      <svg className="flow-lines" viewBox="0 0 100 40" preserveAspectRatio="none">
        {[10, 30, 50, 70, 90].map((x) => (
          <path key={x} d={`M${x} 0 C ${x} 22, 50 18, 50 40`} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="flow-inbox">
        <div className="flow-head">
          <MailIcon className="flow-head-icon" />
          <span>{live.inbox.header}</span>
          <span className="flow-count">{live.inbox.unread}</span>
        </div>
        <ul className="flow-threads">
          {threads.map((t) => (
            <li key={t.subject}>
              <span className="flow-avatar">{t.from.replace(/^Master, /, '').charAt(0)}</span>
              <span className="flow-text">
                <span className="flow-from">{t.from}</span>
                <span className="flow-subject">{t.subject}</span>
              </span>
              <span className="flow-time">{t.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function How() {
  const lanes: Side[] = ['ai', 'team']
  return (
    <section id="how" className="section section-tint" aria-labelledby="how-title">
      <div className="wrap">
        <div className="reveal">
          <Eyebrow>{how.eyebrow}</Eyebrow>
          <h2 id="how-title" className="display h2 section-title">
            {how.heading}
          </h2>
        </div>
        <div className="lanes">
          {lanes.map((side) => (
            <div key={side} className={`lane lane-${side} reveal`} style={d(side === 'ai' ? 0 : 120)}>
              <h3 className="lane-title">
                <span className="lane-icon">
                  <SideIcon side={side} />
                </span>
                {how.lanes[side]}
              </h3>
              <ol className="lane-steps">
                {how.steps.map((s, i) =>
                  s.side === side ? (
                    <li key={s.title} className="step reveal" value={i + 1} style={d(160 + i * 90)}>
                      <span className="step-num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="h4">
                          <span className="sr-only">Step {i + 1}: </span>
                          {s.title}
                        </h4>
                        <p className="copy">{s.body}</p>
                      </div>
                    </li>
                  ) : null,
                )}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type Shot = { src: string; width: number; height: number; alt: string }

function Feature({ side, title, caption, image, bleed, zoom }: { side: Side; title: string; caption: string; image: Shot; bleed?: boolean; zoom?: boolean }) {
  return (
    <article className={`feature reveal feature-${side}${bleed ? ' feature-bleed' : ''}${zoom ? ' feature-zoom' : ''}`}>
      <div className="feature-text">
        <span className={`tag tag-${side}`}>
          <SideIcon side={side} className="tag-icon" />
          {live.legend[side]}
        </span>
        <h3 className="h3 feature-title">{title}</h3>
        <p className="copy">{caption}</p>
      </div>
      <figure className="shot-panel">
        <img className="shot" src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" />
      </figure>
    </article>
  )
}

function Live() {
  return (
    <section id="live" className="section" aria-labelledby="live-title">
      <div className="wrap">
        <div className="reveal">
          <Eyebrow>{live.eyebrow}</Eyebrow>
          <h2 id="live-title" className="display h2 section-title">
            {live.heading}
          </h2>
        </div>
        <div className="features">
          <Feature side="team" title={live.inbox.title} caption={live.inbox.caption} image={live.inbox.image} bleed />
          <Feature side="ai" title={live.classification.title} caption={live.classification.caption} image={live.classification.image} zoom />
          <Feature side="ai" title={live.drafts.title} caption={live.drafts.caption} image={live.drafts.image} />
          <Feature side="team" title={live.tracking.title} caption={live.tracking.caption} image={live.tracking.image} />
        </div>
      </div>
    </section>
  )
}

function Control() {
  return (
    <section id="control" className="section section-tint" aria-labelledby="control-title">
      <div className="wrap">
        <div className="reveal">
          <Eyebrow>{control.eyebrow}</Eyebrow>
          <h2 id="control-title" className="sr-only">
            Human control
          </h2>
        </div>
        <div className="control-pair">
          <div className="cc cc-ai reveal">
            <p className="cc-head">
              <span className="cc-icon">
                <SparkIcon />
              </span>
              {control.aiLabel}
            </p>
            <p className="display control-statement">{control.ai}</p>
            <ul className="cc-verbs" aria-hidden="true">
              {control.aiVerbs.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
          <div className="cc-handoff reveal" style={d(100)} aria-hidden="true">
            <ArrowIcon />
          </div>
          <div className="cc cc-team reveal" style={d(180)}>
            <p className="cc-head">
              <span className="cc-icon">
                <TeamIcon />
              </span>
              {control.teamLabel}
            </p>
            <p className="display control-statement">{control.team}</p>
            <ul className="cc-verbs" aria-hidden="true">
              {control.teamVerbs.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="lede control-closing reveal" style={d(240)}>
          {control.closing.join(' ')}
        </p>
      </div>
    </section>
  )
}

function Cta() {
  return (
    <section id="surface" className="section cta-section" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta-panel reveal">
          <svg className="cta-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle cx="24" cy="24" r="17.2" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <g fill="currentColor">
              <rect x="23.8" y="1.4" width="0.4" height="5.2" />
              <rect x="23.8" y="41.4" width="0.4" height="5.2" />
              <rect x="1.4" y="23.8" width="5.2" height="0.4" />
              <rect x="41.4" y="23.8" width="5.2" height="0.4" />
            </g>
            <path className="cta-mark-tri" d="M24 10.2 L36.3 30.8 L11.7 30.8 Z" fill="none" strokeWidth="0.35" strokeLinejoin="round" />
            <circle className="cta-mark-dot" cx="24" cy="24" r="1.2" />
          </svg>
          <h2 id="cta-title" className="display h2">
            {surface.heading.split(/(?<=\.) /).map((t) => (
              <span key={t} className="h2-line">
                {t}
              </span>
            ))}
          </h2>
          <p className="lede">{surface.line}</p>
          <a className="btn btn-primary" href={DEMO_URL}>
            {surface.primary}
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <a className="brand" href="#top" aria-label={nav.footerHomeLabel}>
          <LogoMark className="brand-glyph" />
          <span className="brand-word">ANCHOR</span>
        </a>
        <nav className="footer-links" aria-label="Footer">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="footer-copy">{surface.footer}</p>
      </div>
    </footer>
  )
}

export default function App() {
  useReveal()
  return (
    <>
      <AnchorRail />
      <a className="skip-link" href="#main">
        {nav.skip}
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Problem />
        <How />
        <Live />
        <Control />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
