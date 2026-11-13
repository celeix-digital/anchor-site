import { terminals } from '../content/terminals'
import { usePageMeta } from '../router'
import { Badge, Button, Glyph, SectionHead, d } from '../components/ui'
import { HeroChart, PageHero, RequestForm } from '../components/blocks'

export default function Terminals() {
  const t = terminals
  usePageMeta(t.meta.title, t.meta.description)
  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        badge={<Badge state="design">{t.hero.badge}</Badge>}
        lines={t.hero.lines}
        sub={t.hero.sub}
        actions={<Button href={t.hero.primary.href}>{t.hero.primary.label}</Button>}
        notice={
          <>
            <Glyph state="attention" />
            <span>{t.hero.notice}</span>
          </>
        }
        visual={<HeroChart kind="visit" label="Vessel visit · Concept, in design" />}
      />
      <Idea />
      <Intent />
      <section id="shape" className="section" aria-labelledby="shape-title">
        <div className="wrap form-grid">
          <SectionHead id="shape-title" eyebrow={t.shape.eyebrow} title={t.shape.heading} sub={t.shape.body} />
          <div className="form-card reveal" style={d(100)}>
            <RequestForm defaultInterest="terminal" />
          </div>
        </div>
      </section>
    </>
  )
}

function Idea() {
  const i = terminals.idea
  return (
    <section className="section section-tint" aria-labelledby="idea-title">
      <div className="wrap split split-visual">
        <SectionHead id="idea-title" eyebrow={i.eyebrow} title={i.heading} sub={i.body} />
        <div className="reveal" style={d(120)}>
          <Sketch />
        </div>
      </div>
    </section>
  )
}

/** A concept sketch, clearly labelled as such: several agents feeding one visit record. */
function Sketch({ compact }: { compact?: boolean }) {
  const s = terminals.idea.sketch
  return (
    <figure className={`sketch${compact ? ' sketch-compact' : ''}`} aria-label={compact ? undefined : s.note} aria-hidden={compact || undefined}>
      <div className="sketch-head">
        <span className="sketch-label">{s.label}</span>
        <span className="sketch-tag">{s.tag}</span>
      </div>
      <div className="sketch-body">
        <ul className="sketch-agents">
          {s.agents.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <svg className="sketch-lines" viewBox="0 0 40 100" preserveAspectRatio="none" aria-hidden="true">
          {[12.5, 37.5, 62.5, 87.5].map((y) => (
            <path key={y} d={`M0 ${y} C 22 ${y}, 18 50, 40 50`} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className="sketch-record">
          <p className="sketch-record-title">{s.record}</p>
          <p className="sketch-record-sub">{s.visit}</p>
          <dl>
            {s.rows.map((r) => (
              <div key={r.label} className={`sketch-row sketch-${r.state}`}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
          <div className="sketch-conflict">
            {s.sources.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <p className="sketch-settle">
            <Glyph state="human" />
            {s.settle}
          </p>
        </div>
      </div>
      {!compact && <figcaption className="fineprint">{s.note}</figcaption>}
    </figure>
  )
}

function Intent() {
  const i = terminals.intent
  return (
    <section className="section" aria-labelledby="intent-title">
      <div className="wrap">
        <SectionHead id="intent-title" eyebrow={i.eyebrow} title={i.heading} sub={i.body} />
        <div className="qa-table reveal" style={d(100)}>
          <div className="qa-head" aria-hidden="true">
            <span>{i.colIntent}</span>
            <span>{i.colQuestion}</span>
          </div>
          <ol>
            {i.rows.map((r, n) => (
              <li key={r.title} className="qa-row">
                <div className="qa-intent">
                  <span className="qa-n">{String(n + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="h4">{r.title}</h3>
                    <p className="copy">{r.body}</p>
                  </div>
                </div>
                <p className="qa-question">
                  <span className="sr-only">{i.colQuestion}: </span>
                  {r.question}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
