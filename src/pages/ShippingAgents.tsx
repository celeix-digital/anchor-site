import { shipping } from '../content/shipping'
import { notScreenshot, shots } from '../content/shared'
import { usePageMeta } from '../router'
import { MailIcon, SparkIcon, TeamIcon } from '../components/Icons'
import { Badge, Button, CtaPanel, Eyebrow, Glyph, SectionHead, ShotFrame, d } from '../components/ui'
import { Feature, PageHero } from '../components/blocks'

export default function ShippingAgents() {
  const s = shipping
  usePageMeta(s.meta.title, s.meta.description)
  return (
    <>
      <PageHero
        eyebrow={s.hero.eyebrow}
        badge={<Badge state="live">{s.hero.badge}</Badge>}
        lines={s.hero.lines}
        sub={s.hero.sub}
        actions={
          <>
            <Button href="/book-demo">{s.hero.primary}</Button>
            <Button href={s.hero.secondary.href} variant="secondary">
              {s.hero.secondary.label}
            </Button>
          </>
        }
        visual={<ShotFrame shot={shots.inbox} title={s.hero.window} fit="wide" className="hero-frame" eager />}
      />
      <Today />
      <Changes />
      <Control />
      <CtaPanel id="sa-cta" {...s.cta} />
    </>
  )
}

function Today() {
  const t = shipping.today
  return (
    <section className="section section-tint" aria-labelledby="today-title">
      <div className="wrap">
        <SectionHead id="today-title" eyebrow={t.eyebrow} title={t.heading} sub={t.body} />
        <figure className="compare reveal" style={d(100)}>
          <div className="compare-panel compare-before">
            <p className="compare-label">{t.before.label}</p>
            <h3 className="h4">{t.before.title}</h3>
            <div className="scatter" aria-hidden="true">
              {t.senders.map((name, n) => (
                <span key={name} className={`scatter-chip scatter-${n}`}>
                  <MailIcon className="scatter-icon" />
                  {name}
                </span>
              ))}
              <span className="scatter-centre">
                {t.before.centre.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
            </div>
          </div>
          <div className="compare-panel compare-after">
            <p className="compare-label">{t.after.label}</p>
            <h3 className="h4">{t.after.title}</h3>
            <div className="gather" aria-hidden="true">
              <ul className="gather-senders">
                {t.senders.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
              <svg className="gather-lines" viewBox="0 0 100 40" preserveAspectRatio="none">
                {[8, 25, 42, 58, 75, 92].map((x) => (
                  <path key={x} d={`M${x} 0 C ${x} 22, 50 18, 50 40`} vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
              <div className="gather-inbox">
                <MailIcon className="gather-icon" />
                <span className="gather-title">{t.after.inbox}</span>
                <span className="gather-call">{t.after.call}</span>
                <span className="gather-count">{t.after.count}</span>
              </div>
            </div>
          </div>
          <figcaption className="fineprint">{t.note}</figcaption>
        </figure>
      </div>
    </section>
  )
}

function Changes() {
  const c = shipping.changes
  return (
    <section id="changes" className="section" aria-labelledby="changes-title">
      <div className="wrap">
        <SectionHead id="changes-title" eyebrow={c.eyebrow} title={c.heading} sub={c.sub} />
        <div className="features">
          {c.features.map((f) => (
            <Feature
              key={f.n}
              side={f.side}
              marker={f.n}
              label={f.label}
              title={f.title}
              caption={f.body}
              image={f.shot}
              bleed={'bleed' in f && f.bleed}
              zoom={'zoom' in f && f.zoom}
            />
          ))}
        </div>
        <p className="fineprint reveal">{notScreenshot}</p>
      </div>
    </section>
  )
}

function Control() {
  const c = shipping.control
  return (
    <section className="section section-tint" aria-labelledby="sa-control-title">
      <div className="wrap">
        <SectionHead id="sa-control-title" eyebrow={c.eyebrow} title={c.heading} sub={c.body} />
        <div className="control-pair">
          <div className="cc cc-ai reveal">
            <p className="cc-head">
              <span className="cc-icon">
                <SparkIcon />
              </span>
              {c.software.title}
            </p>
            <ul className="check-list">
              {c.software.items.map((it) => (
                <li key={it}>
                  <Glyph state="ai" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div className="cc-handoff reveal" style={d(100)} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
            </svg>
          </div>
          <div className="cc cc-team reveal" style={d(180)}>
            <p className="cc-head">
              <span className="cc-icon">
                <TeamIcon />
              </span>
              {c.people.title}
            </p>
            <ul className="check-list">
              {c.people.items.map((it) => (
                <li key={it}>
                  <Glyph state="human" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="not-today reveal" style={d(120)}>
          <Eyebrow>{c.notToday.title}</Eyebrow>
          <ul>
            {c.notToday.items.map((it) => (
              <li key={it.title}>
                <span className="not-today-x" aria-hidden="true" />
                <div>
                  <strong>{it.title}</strong> {it.body}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
