import { useState } from 'react'
import { demo, thanks, type Interest } from '../content/demo'
import { CONTACT_EMAIL } from '../content/shared'
import { useLocation, usePageMeta } from '../router'
import { Button, Eyebrow, Glyph, d } from '../components/ui'
import { RequestForm } from '../components/blocks'

const interests: Interest[] = ['demo', 'services', 'terminal', 'webinar']

export function BookDemo() {
  usePageMeta(demo.meta.title, demo.meta.description)
  const { search } = useLocation()
  const q = search.get('interest') as Interest | null
  const interest: Interest = q && interests.includes(q) ? q : 'demo'
  const h = demo.hero
  const heading = interest === 'webinar' ? h.heading.webinar : interest === 'services' ? h.heading.services : h.heading.default

  return (
    <>
      <section className="hero page-hero page-hero-solo page-hero-short" aria-labelledby="hero-title">
        <div className="wrap">
          <div className="hero-meta reveal">
            <Eyebrow>{interest === 'webinar' ? h.eyebrow.webinar : h.eyebrow.default}</Eyebrow>
          </div>
          <h1 id="hero-title" className="display hero-title reveal" style={d(60)}>
            {heading}
          </h1>
          <p className="lede hero-sub reveal" style={d(160)}>
            {interest === 'webinar' ? h.sub.webinar : h.sub.default}
          </p>
        </div>
      </section>
      <section className="section section-tight" aria-label="Request form">
        <div className="wrap demo-grid">
          <div className="form-card reveal">
            <RequestForm key={interest} defaultInterest={interest} />
          </div>
          <aside className="demo-aside reveal" style={d(100)}>
            <div className="demo-block">
              <Eyebrow>{demo.after.title}</Eyebrow>
              <ol className="timeline">
                {demo.after.steps.map((s, n) => (
                  <li key={s.t} className={s.done ? 'is-done' : ''}>
                    <span className="timeline-n">{String(n + 1).padStart(2, '0')}</span>
                    <strong>{s.t}</strong>
                    <p>{s.d}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="demo-block">
              <Eyebrow>{demo.pending.title}</Eyebrow>
              <ul className="pending-list">
                {demo.pending.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <p className="fineprint">{demo.pending.note}</p>
            </div>
            <div className="demo-block">
              <Eyebrow>{demo.covers.title}</Eyebrow>
              <ul className="covers-list">
                {demo.covers.items.map((it) => (
                  <li key={it.t}>
                    <Glyph state={it.state} />
                    {it.t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export function ThankYou() {
  const [ready] = useState(() => {
    try {
      return !!sessionStorage.getItem('anchor-request')
    } catch {
      return false
    }
  })
  const c = ready ? thanks.ready : thanks.none
  usePageMeta(ready ? thanks.meta.title : 'Nothing to confirm yet — ANCHOR', ready ? thanks.meta.description : c.body)
  return (
    <section className="section section-navy thanks" aria-labelledby="hero-title">
      <div className="wrap thanks-inner">
        <p className="thanks-eyebrow reveal">
          <Glyph state="human" />
          {c.eyebrow}
        </p>
        <h1 id="hero-title" className="display hero-title reveal" style={d(60)}>
          {c.heading}
        </h1>
        <p className="lede reveal" style={d(140)}>
          {c.body}
        </p>
        {ready && (
          <p className="thanks-fallback reveal" style={d(180)}>
            {thanks.ready.fallback} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        )}
        <div className="actions reveal" style={d(220)}>
          <Button href={thanks.home.href}>{thanks.home.label}</Button>
          <Button href={thanks.form.href} variant="ghost-dark">
            {thanks.form.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
