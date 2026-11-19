import { useState } from 'react'
import { demo, thanks, type Interest } from '../content/demo'
import { BOOKING_URL, CONTACT_EMAIL } from '../content/shared'
import { useLocation, usePageMeta } from '../router'
import { Button, Glyph, d } from '../components/ui'

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
          <h1 id="hero-title" className="display hero-title reveal" style={d(60)}>
            {heading}
          </h1>
          <p className="lede hero-sub reveal" style={d(160)}>
            {interest === 'webinar' ? h.sub.webinar : h.sub.default}
          </p>
        </div>
      </section>
      <section className="section section-tight" aria-label={demo.calendar.title}>
        <div className="wrap demo-grid">
          <div className="booking reveal">
            <div className="booking-card">
              <iframe className="booking-frame" src={`${BOOKING_URL}?gv=true`} title={demo.calendar.title} />
            </div>
            <p className="booking-fallback">
              {demo.calendar.fallback}{' '}
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                {demo.calendar.open}
              </a>
              .
            </p>
          </div>
          <aside className="demo-aside reveal" style={d(100)}>
            <div className="demo-block">
              <h2 className="demo-block-title">{demo.after.title}</h2>
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
              <h2 className="demo-block-title">{demo.covers.title}</h2>
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
  usePageMeta(ready ? thanks.meta.title : 'Nothing to confirm yet | ANCHOR', ready ? thanks.meta.description : c.body)
  return (
    <section className="section section-navy thanks" aria-labelledby="hero-title">
      <div className="wrap thanks-inner">
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
