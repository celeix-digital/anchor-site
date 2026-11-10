import { useEffect, useRef } from 'react'
import { DEMO_URL, control, hero, how, live, nav, problem, surface } from './content'
import { AnchorGlyph } from './components/Logo'
import { ClassificationMock, DraftMock, InboxMock, TrackingMock } from './components/Mockups'
import Scene from './scene/Scene'

function Nav() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let on = false
    const update = () => {
      const next = window.scrollY > 8
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
          <AnchorGlyph className="brand-glyph" />
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

function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title" className="display hero-title" tabIndex={-1}>
          {hero.lines.map(([a, b], i) => (
            <span key={i} className="hero-line" style={{ ['--i' as string]: i }}>
              <span className="nowrap">{a}</span> <span className="nowrap">{b}</span>
            </span>
          ))}
        </h1>
        <p className="hero-sub lede">{hero.sub}</p>
        <div className="actions hero-actions">
          <a className="btn btn-primary" href={DEMO_URL}>
            {hero.primary}
          </a>
          <a className="btn btn-ghost" href="#how">
            {hero.secondary}
          </a>
        </div>
      </div>
      <p className="hero-cue">
        <span className="cue-line" aria-hidden="true" />
        {hero.cue}
      </p>
    </section>
  )
}

function Problem() {
  return (
    <section className="section problem" aria-labelledby="problem-title">
      <div className="spine-grid">
        <div className="col-left">
          <h2 id="problem-title" className="display h2">
            {problem.heading}
          </h2>
          <p className="note">{problem.note}</p>
        </div>
        <div className="col-right problem-body">
          {problem.body.map((t, i) => (
            <p key={i} className={i === problem.body.length - 1 ? 'emph' : 'copy'}>
              {t}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function How() {
  return (
    <section id="how" className="section how" aria-labelledby="how-title">
      <div className="spine-grid">
        <h2 id="how-title" className="display h2 col-left">
          {how.heading}
        </h2>
      </div>
      <div className="spine-grid lanes">
        <p className="lane lane-ai col-left">{how.lanes.ai}</p>
        <p className="lane lane-team col-right">{how.lanes.team}</p>
      </div>
      <ol className="steps">
        {how.steps.map((s, i) => (
          <li key={s.title} className={`step step-${s.side} spine-grid`}>
            <div className={`step-card ${s.side === 'ai' ? 'col-left' : 'col-right'}`}>
              <span className="leader" aria-hidden="true" />
              <span className="ring-marker" aria-hidden="true" />
              <span className="step-num" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="h3">
                <span className="sr-only">
                  Step {i + 1}, {s.side === 'ai' ? how.lanes.ai.toLowerCase() : how.lanes.team.toLowerCase()}:{' '}
                </span>
                {s.title}
              </h3>
              <p className="copy">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Feature({
  title,
  caption,
  side,
  children,
}: {
  title: string
  caption: string
  side: 'ai' | 'team'
  children: React.ReactNode
}) {
  return (
    <article className={`feature feature-${side}`}>
      {children}
      <h3 className="h3 feature-title">{title}</h3>
      <p className="copy feature-caption">{caption}</p>
    </article>
  )
}

function Live() {
  return (
    <section id="live" className="section live" aria-labelledby="live-title">
      <div className="spine-grid">
        <h2 id="live-title" className="display h2 col-left">
          {live.heading}
        </h2>
      </div>
      <div className="spine-grid features">
        <div className="col-left feature-stack">
          <Feature side="ai" title={live.classification.title} caption={live.classification.caption}>
            <ClassificationMock />
          </Feature>
          <Feature side="ai" title={live.drafts.title} caption={live.drafts.caption}>
            <DraftMock />
          </Feature>
        </div>
        <div className="col-right feature-stack feature-stack-offset">
          <Feature side="team" title={live.inbox.title} caption={live.inbox.caption}>
            <InboxMock />
          </Feature>
          <Feature side="team" title={live.tracking.title} caption={live.tracking.caption}>
            <TrackingMock />
          </Feature>
        </div>
      </div>
    </section>
  )
}

function Control() {
  return (
    <section id="control" className="section control" aria-labelledby="control-title">
      <h2 id="control-title" className="sr-only">
        Human control
      </h2>
      <div className="spine-grid control-pair">
        <p className="display control-statement control-ai col-left">{control.ai}</p>
        <p className="display control-statement control-team col-right">{control.team}</p>
      </div>
      <div className="spine-grid control-closing">
        <p className="lede col-left">{control.closing[0]}</p>
        <p className="lede col-right">{control.closing[1]}</p>
      </div>
    </section>
  )
}

function Surface() {
  const sink = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('hero-title')?.focus({ preventScroll: true })
  }
  return (
    <section id="surface" className="surface" aria-labelledby="surface-title">
      <div className="surface-cta">
        <h2 id="surface-title" className="display h2">
          {surface.heading.split(/(?<=\.) /).map((t) => (
            <span key={t} className="h2-line">
              {t}
            </span>
          ))}
        </h2>
        <p className="lede">{surface.line}</p>
        <div className="actions surface-actions">
          <a className="btn btn-primary" href={DEMO_URL}>
            {surface.primary}
          </a>
          <button type="button" className="btn btn-ghost" onClick={sink}>
            {surface.secondary}
          </button>
        </div>
      </div>
      <footer className="footer">
        <p>{surface.footer}</p>
      </footer>
    </section>
  )
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        {nav.skip}
      </a>
      <Scene />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Problem />
        <How />
        <Live />
        <Control />
        <Surface />
      </main>
    </>
  )
}
