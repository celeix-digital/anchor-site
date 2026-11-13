import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { services, zoneGroups, zones } from '../content/services'
import { usePageMeta } from '../router'
import { Badge, Button, Eyebrow, SectionHead, d } from '../components/ui'
import { HeroChart, PageHero, RequestForm } from '../components/blocks'

const pad = (n: number) => String(n).padStart(2, '0')

export default function Services() {
  const s = services
  usePageMeta(s.meta.title, s.meta.description)
  return (
    <>
      <PageHero
        eyebrow={s.hero.eyebrow}
        badge={<Badge state="separate">{s.hero.badge}</Badge>}
        lines={s.hero.lines}
        sub={s.hero.sub}
        actions={
          <>
            <Button href={s.hero.primary.href}>{s.hero.primary.label}</Button>
            <Button href={s.hero.secondary.href} variant="secondary">
              {s.hero.secondary.label}
            </Button>
          </>
        }
        visual={<HeroChart kind="journey" label="Nine zones · One vessel visit" />}
      />
      <Work />
      <Journey />
      <Path />
      <Find />
      <People />
      <section id="contact" className="section" aria-labelledby="contact-title">
        <div className="wrap form-grid">
          <SectionHead id="contact-title" eyebrow={s.contact.eyebrow} title={s.contact.heading} sub={s.contact.body} />
          <div className="form-card reveal" style={d(100)}>
            <RequestForm defaultInterest="services" />
          </div>
        </div>
      </section>
    </>
  )
}

function Work() {
  const w = services.work
  return (
    <section className="section section-tint" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead id="work-title" eyebrow={w.eyebrow} title={w.heading} sub={w.body} />
        <div className="qa-table reveal" style={d(100)}>
          <div className="qa-head" aria-hidden="true">
            <span>{w.colWork}</span>
            <span>{w.colOutput}</span>
          </div>
          <ol>
            {w.items.map((it, n) => (
              <li key={it.title} className="qa-row">
                <div className="qa-intent">
                  <span className="qa-n">{pad(n + 1)}</span>
                  <div>
                    <h3 className="h4">{it.title}</h3>
                    <p className="copy">{it.body}</p>
                  </div>
                </div>
                <p className="qa-output">
                  <span className="sr-only">{w.colOutput}: </span>
                  {it.output}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

// Height of each stop on the chart (0–100), tracing a vessel in and back out.
const depth = [30, 43, 55, 64, 70, 70, 61, 47, 32]
const xOf = (n: number) => ((n + 0.5) / 9) * 100

function Journey() {
  const j = services.journey
  const [i, setI] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const go = (n: number, focus = false) => {
    const next = (n + 9) % 9
    setI(next)
    if (focus) tabs.current[next]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: 8 }
    if (e.key in map) {
      e.preventDefault()
      go(map[e.key], true)
    }
  }
  const z = zones[i]
  const line = (to: number) => zones.slice(0, to + 1).map((_, n) => `${n ? 'L' : 'M'}${xOf(n) * 10} ${depth[n] * 3}`).join(' ')
  const group = zoneGroups.find((g) => i >= g.from && i <= g.to)

  return (
    <section id="zones" className="section section-navy" aria-labelledby="zones-title">
      <div className="wrap">
        <SectionHead id="zones-title" eyebrow={j.eyebrow} title={j.heading} sub={j.body} onDark />
        <p className="journey-tag reveal">
          <span className="journey-tag-chip">{j.tag}</span>
          <span>{j.tagNote}</span>
        </p>
        <div className="journey reveal" style={d(100)}>
          <div className="journey-chart">
            <div className="journey-groups" aria-hidden="true">
              {zoneGroups.map((g) => (
                <div key={g.label} style={{ width: `${((g.to - g.from + 1) / 9) * 100}%` }} className={group === g ? 'is-on' : ''}>
                  {g.label}
                </div>
              ))}
            </div>
            <div className="journey-quay" aria-hidden="true">
              <span>{j.quay}</span>
            </div>
            <svg className="journey-svg" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
              <path d={line(8)} className="journey-path" vectorEffect="non-scaling-stroke" />
              {i > 0 && <path d={line(i)} className="journey-path-on" vectorEffect="non-scaling-stroke" />}
            </svg>
            <div role="tablist" aria-label="Nine-zone vessel journey" className="journey-stops">
              {zones.map((zz, n) => (
                <button
                  key={zz.t}
                  ref={(el) => {
                    tabs.current[n] = el
                  }}
                  role="tab"
                  id={`zone-tab-${n}`}
                  aria-selected={n === i}
                  aria-controls="zone-panel"
                  tabIndex={n === i ? 0 : -1}
                  className={`journey-stop${n === i ? ' is-on' : ''}${n < i ? ' is-past' : ''}`}
                  style={{ '--x': `${xOf(n)}%`, '--y': `${depth[n]}%` } as CSSProperties}
                  onClick={() => go(n)}
                  onKeyDown={onKey}
                >
                  <span className="journey-dot" aria-hidden="true" />
                  <span className="journey-n">{pad(n + 1)}</span>
                  <span className="journey-name">{zz.t}</span>
                </button>
              ))}
            </div>
          </div>
          <div id="zone-panel" role="tabpanel" aria-labelledby={`zone-tab-${i}`} className="journey-panel" key={i}>
            <div>
              <p className="journey-of">
                {j.zoneOf(i + 1)} · <span>{z.s}</span>
              </p>
              <h3 className="display journey-title">{z.t}</h3>
              <p className="journey-desc">{z.d}</p>
            </div>
            <div>
              <Eyebrow onDark>{j.people}</Eyebrow>
              <ul className="journey-people">
                {z.r.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <div className="journey-arrows">
                <button type="button" className="btn btn-ghost-dark btn-sm" onClick={() => go(i - 1)} aria-label="Previous zone">
                  ←
                </button>
                <button type="button" className="btn btn-ghost-dark btn-sm" onClick={() => go(i + 1)} aria-label="Next zone">
                  →
                </button>
              </div>
            </div>
          </div>
          <p className="journey-keys">{j.keys}</p>
        </div>
        <p className="fineprint fineprint-dark reveal">{j.note}</p>
      </div>
    </section>
  )
}

function Path() {
  const p = services.path
  return (
    <section className="section" aria-labelledby="path-title">
      <div className="wrap">
        <SectionHead id="path-title" eyebrow={p.eyebrow} title={p.heading} />
        <ol className="path">
          {p.steps.map((s, n) => (
            <li key={s.tag} className={`path-step path-${n} reveal`} style={d(n * 90)}>
              <span className="path-tag">{s.tag}</span>
              <h3 className="h4">{s.title}</h3>
              <p className="copy">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="aim reveal">{p.note}</p>
      </div>
    </section>
  )
}

function Find() {
  const f = services.find
  return (
    <section className="section section-tint" aria-labelledby="find-title">
      <div className="wrap split">
        <SectionHead id="find-title" eyebrow={f.eyebrow} title={f.heading} sub={f.body} />
        <ol className="num-list num-list-cards reveal" style={d(100)}>
          {f.items.map((it, n) => (
            <li key={it}>
              <span className="num-list-n">{pad(n + 1)}</span>
              <p className="copy">{it}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function People() {
  const p = services.people
  return (
    <section className="section" aria-labelledby="people-title">
      <div className="wrap">
        <SectionHead id="people-title" eyebrow={p.eyebrow} title={p.heading} sub={`${p.groups.join(' · ')}.`} />
        <div className="matrix-wrap reveal" style={d(100)} tabIndex={0} role="region" aria-label={p.heading}>
          <table className="matrix">
            <caption>{p.caption}</caption>
            <thead>
              <tr>
                <th scope="col">{p.stakeholder}</th>
                {zones.map((z, n) => (
                  <th key={z.t} scope="col">
                    <span className="matrix-n">{pad(n + 1)}</span>
                    {z.t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.rows.map((row) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  {zones.map((z) => (
                    <td key={z.t}>{z.r.includes(row) ? <span className="mx-dot" role="img" aria-label={p.dot} /> : <span className="mx-none" role="img" aria-label={p.none} />}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="copy matrix-note reveal">{p.note}</p>
      </div>
    </section>
  )
}
