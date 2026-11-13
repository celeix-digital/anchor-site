import { trustLadder, vision } from '../content/vision'
import { Link, usePageMeta } from '../router'
import { LogoMark } from '../components/Logo'
import { ArrowLink, Badge, Button, CtaPanel, SectionHead, d } from '../components/ui'
import { PageHero } from '../components/blocks'

type Part = 'ring' | 'ticks' | 'tri' | 'dot'

/** The mark with one part picked out, for the anatomy diagram. */
function MarkPart({ on, className }: { on?: Part; className?: string }) {
  const c = (p: Part) => (on && on !== p ? 'mp-dim' : p === 'tri' || p === 'dot' ? 'mp-teal' : 'mp-ink')
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle className={c('ring')} cx="24" cy="24" r="17.2" fill="none" strokeWidth="1.9" />
      <g className={c('ticks')}>
        <rect x="22.8" y="1.4" width="2.4" height="5.2" rx="0.6" />
        <rect x="22.8" y="41.4" width="2.4" height="5.2" rx="0.6" />
        <rect x="1.4" y="22.8" width="5.2" height="2.4" rx="0.6" />
        <rect x="41.4" y="22.8" width="5.2" height="2.4" rx="0.6" />
      </g>
      <path className={c('tri')} d="M24 10.2 L36.3 30.8 L11.7 30.8 Z" fill="none" strokeWidth="2.1" strokeLinejoin="round" />
      <circle className={`${c('dot')} mp-fill`} cx="24" cy="24" r="3.1" />
    </svg>
  )
}

export default function Vision() {
  const v = vision
  usePageMeta(v.meta.title, v.meta.description)
  return (
    <>
      <PageHero
        eyebrow={v.hero.eyebrow}
        lines={v.hero.lines}
        sub={v.hero.sub}
        actions={
          <>
            <Button href={v.hero.primary.href}>{v.hero.primary.label}</Button>
            <Button href={v.hero.secondary.href} variant="secondary">
              {v.hero.secondary.label}
            </Button>
          </>
        }
        visual={
          <div className="datum-visual" aria-hidden="true">
            <div className="datum-grid" />
            <LogoMark className="datum-logo" />
            <span className="datum-coords">{v.hero.coords}</span>
            <span className="datum-sub">{v.hero.datum}</span>
          </div>
        }
      />
      <Mark />
      <Today />
      <Ladder />
      <Principles />
      <CtaPanel id="vision-cta" {...v.cta} />
    </>
  )
}

function Mark() {
  const n = vision.name
  const a = vision.anatomy
  return (
    <section id="mark" className="section section-tint" aria-labelledby="mark-title">
      <div className="wrap">
        <div className="split">
          <SectionHead id="mark-title" eyebrow={n.eyebrow} title={n.heading} />
          <div className="stack reveal" style={d(100)}>
            {n.body.map((t) => (
              <p key={t} className="lede">
                {t}
              </p>
            ))}
          </div>
        </div>
        <div className="anatomy reveal" style={d(120)}>
          <p className="eyebrow">{a.eyebrow}</p>
          <div className="anatomy-grid">
            <ul className="anatomy-parts">
              {a.parts.slice(0, 2).map((p) => (
                <AnatomyPart key={p.k} part={p} />
              ))}
            </ul>
            <div className="anatomy-centre" aria-hidden="true">
              <MarkPart className="anatomy-logo" />
            </div>
            <ul className="anatomy-parts">
              {a.parts.slice(2).map((p) => (
                <AnatomyPart key={p.k} part={p} />
              ))}
            </ul>
          </div>
          <div className="anatomy-tones">
            <span className="tone">
              <span className="tone-tile">
                <LogoMark className="tone-mark tone-mark-light" />
              </span>
              {a.tones[0]}
            </span>
            <span className="tone">
              <LogoMark className="tone-mark" />
              {a.tones[1]}
            </span>
            <span className="tone">
              <MarkPart className="tone-mark tone-mono" />
              {a.tones[2]}
            </span>
            <span className="tone-note">{a.tonesNote}</span>
          </div>
        </div>
        <div className="mark-foot reveal">
          <p>{a.focus}</p>
          <a href={a.source.href} target="_blank" rel="noopener noreferrer" className="arrow-link">
            {a.source.label}
          </a>
        </div>
      </div>
    </section>
  )
}

function AnatomyPart({ part }: { part: { k: Part; t: string; d: string } }) {
  return (
    <li className="anatomy-part">
      <MarkPart on={part.k} className="anatomy-mini" />
      <div>
        <h3 className="h4">{part.t}</h3>
        <p className="copy">{part.d}</p>
      </div>
    </li>
  )
}

function Today() {
  const t = vision.today
  return (
    <section id="today" className="section" aria-labelledby="vtoday-title">
      <div className="wrap">
        <SectionHead id="vtoday-title" eyebrow={t.eyebrow} title={t.heading} />
        <div className="cards-3">
          <article className="card card-live reveal">
            <Badge state="live">{t.live.label}</Badge>
            <h3 className="h3">{t.live.title}</h3>
            <ul className="tick-list">
              {t.live.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </article>
          <article className="card card-design reveal" style={d(100)}>
            <Badge state="design">{t.design.label}</Badge>
            <h3 className="h3">{t.design.title}</h3>
            <p className="copy">
              {t.design.body} <Link href={t.design.link.href}>{t.design.link.label}</Link>
            </p>
          </article>
          <article className="card card-future reveal" style={d(200)}>
            <Badge state="future">{t.future.label}</Badge>
            <h3 className="h3">{t.future.title}</h3>
            <p className="copy">{t.future.body}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function Ladder() {
  const l = trustLadder
  return (
    <section id="trust-ladder" className="section section-navy" aria-labelledby="ladder-title">
      <div className="wrap">
        <SectionHead id="ladder-title" eyebrow={l.eyebrow} title={l.heading} sub={l.body} onDark />
        <div className="ladder-key reveal" aria-hidden="true">
          <span className="ladder-key-live">Live today</span>
          <span className="ladder-key-future">Future direction</span>
        </div>
        <ol className="ladder">
          {l.steps.map((s, n) => (
            <li key={s.t} className={`ladder-step ${s.live ? 'is-live' : 'is-future'} reveal`} style={{ ...d(n * 100), ['--step' as string]: n }}>
              <span className="ladder-n">{String(n + 1).padStart(2, '0')}</span>
              <span className="ladder-state">{s.live ? 'Live today' : 'Future direction'}</span>
              <h3 className="ladder-t">{s.t}</h3>
              <p className="ladder-d">{s.d}</p>
            </li>
          ))}
        </ol>
        <p className="fineprint fineprint-dark reveal">{l.note}</p>
      </div>
    </section>
  )
}

function Principles() {
  const p = vision.principles
  return (
    <section className="section" aria-labelledby="princ-title">
      <div className="wrap">
        <SectionHead id="princ-title" eyebrow={p.eyebrow} title={p.heading} sub={p.body} />
        <ul className="cards-4">
          {p.items.map((it, n) => (
            <li key={it.t} className="principle reveal" style={d(n * 80)}>
              <span className="principle-n">{String(n + 1).padStart(2, '0')}</span>
              <h3 className="h4">{it.t}</h3>
              <p className="copy">{it.d}</p>
            </li>
          ))}
        </ul>
        <p className="aside-link reveal">
          {vision.terminals.lead} <ArrowLink href={vision.terminals.link.href}>{vision.terminals.link.label}</ArrowLink>
        </p>
      </div>
    </section>
  )
}
