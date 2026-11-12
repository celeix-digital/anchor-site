import { useEffect, useRef } from 'react'
import { DEMO_URL, control, hero, how, live, nav, problem, surface, type Side } from './content'
import { AnchorGlyph } from './components/Logo'

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
      <div className="wrap">
        <h1 id="hero-title" className="display hero-title">
          {hero.lines.map(([a, b], i) => (
            <span key={i} className="hero-line">
              <span className="nowrap">{a}</span> <span className="nowrap">{b}</span>
            </span>
          ))}
        </h1>
        <p className="lede hero-sub">{hero.sub}</p>
        <div className="actions">
          <a className="btn btn-primary" href={DEMO_URL}>
            {hero.primary}
          </a>
          <a className="btn btn-secondary" href="#how">
            {hero.secondary}
          </a>
        </div>
        <figure className="hero-figure">
          <img src={hero.image.src} width={hero.image.width} height={hero.image.height} alt="" fetchPriority="high" decoding="async" />
        </figure>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="section" aria-labelledby="problem-title">
      <div className="wrap split">
        <div>
          <h2 id="problem-title" className="display h2">
            {problem.heading}
          </h2>
          <p className="note">{problem.note}</p>
        </div>
        <div className="stack">
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
  const lanes: Side[] = ['ai', 'team']
  return (
    <section id="how" className="section section-tint" aria-labelledby="how-title">
      <div className="wrap">
        <h2 id="how-title" className="display h2 section-title">
          {how.heading}
        </h2>
        <div className="lanes">
          {lanes.map((side) => (
            <div key={side} className={`lane lane-${side}`}>
              <h3 className="lane-title">{how.lanes[side]}</h3>
              <ol className="lane-steps">
                {how.steps.map((s, i) =>
                  s.side === side ? (
                    <li key={s.title} className="step" value={i + 1}>
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
    <article className={`feature feature-${side}${bleed ? ' feature-bleed' : ''}${zoom ? ' feature-zoom' : ''}`}>
      <div className="feature-text">
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
        <h2 id="live-title" className="display h2 section-title">
          {live.heading}
        </h2>
        <ul className="legend" aria-label="Key">
          <li className="legend-ai">{live.legend.ai}</li>
          <li className="legend-team">{live.legend.team}</li>
        </ul>
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
        <h2 id="control-title" className="sr-only">
          Human control
        </h2>
        <div className="control-pair">
          <p className="display control-statement control-ai">{control.ai}</p>
          <p className="display control-statement control-team">{control.team}</p>
        </div>
        <p className="lede control-closing">{control.closing.join(' ')}</p>
      </div>
    </section>
  )
}

function Cta() {
  return (
    <section id="surface" className="section cta-section" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta-panel">
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
        <a className="brand" href="#top" aria-label={nav.homeLabel}>
          <AnchorGlyph className="brand-glyph" />
          <span className="brand-word">ANCHOR39</span>
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
  return (
    <>
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
