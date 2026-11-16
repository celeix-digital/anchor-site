import { about, trustLadder } from '../content/about'
import { usePageMeta } from '../router'
import { LogoMark } from '../components/Logo'
import { Button, CtaPanel, SectionHead, d } from '../components/ui'
import { PageHero } from '../components/blocks'

export default function About() {
  const a = about
  usePageMeta(a.meta.title, a.meta.description)
  return (
    <>
      <PageHero
        lines={a.hero.lines}
        sub={a.hero.sub}
        actions={
          <>
            <Button href={a.hero.primary.href}>{a.hero.primary.label}</Button>
            <Button href={a.hero.secondary.href} variant="secondary">
              {a.hero.secondary.label}
            </Button>
          </>
        }
        visual={
          <div className="datum-visual" aria-hidden="true">
            <div className="datum-grid" />
            <LogoMark className="datum-logo" />
            <span className="datum-coords">{a.hero.coords}</span>
          </div>
        }
      />
      <Name />
      <Build />
      <Ladder />
      <CtaPanel id="about-cta" {...a.cta} />
    </>
  )
}

function Name() {
  const n = about.name
  return (
    <section id="mark" className="section section-tint section-tight" aria-labelledby="mark-title">
      <div className="wrap name-row reveal">
        <LogoMark className="name-row-mark" />
        <div>
          <h2 id="mark-title" className="display h3">
            {n.heading}
          </h2>
          <p className="copy">
            {n.body}{' '}
            <a href={n.source.href} target="_blank" rel="noopener noreferrer">
              {n.source.label}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

function Build() {
  const b = about.build
  return (
    <section className="section" aria-labelledby="build-title">
      <div className="wrap">
        <SectionHead id="build-title" title={b.heading} />
        <ol className="points">
          {b.items.map((it, n) => (
            <li key={it.t} className="point reveal" style={d(n * 60)}>
              <h3 className="h4">
                <span className="point-n">{String(n + 1).padStart(2, '0')}</span>
                {it.t}
              </h3>
              <p className="copy">{it.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Ladder() {
  const l = trustLadder
  return (
    <section id="trust-ladder" className="section section-navy" aria-labelledby="ladder-title">
      <div className="wrap">
        <SectionHead id="ladder-title" title={l.heading} sub={l.body} onDark />
        <ol className="ladder">
          {l.steps.map((s, n) => (
            <li key={s.t} className={`ladder-step ${s.live ? 'is-live' : 'is-future'} reveal`} style={{ ...d(n * 100), ['--step' as string]: n }}>
              <span className="ladder-n">{String(n + 1).padStart(2, '0')}</span>
              <span className="ladder-state">{s.live ? l.now : l.later}</span>
              <h3 className="ladder-t">{s.t}</h3>
              <p className="ladder-d">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
