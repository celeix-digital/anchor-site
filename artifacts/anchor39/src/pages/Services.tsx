import { services } from '../content/services'
import { usePageMeta } from '../router'
import { Button, SectionHead, d } from '../components/ui'
import { HeroChart, PageHero, RequestForm } from '../components/blocks'

const pad = (n: number) => String(n).padStart(2, '0')

export default function Services() {
  const s = services
  usePageMeta(s.meta.title, s.meta.description)
  return (
    <>
      <PageHero
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
      <Path />
      <Find />
      <section id="contact" className="section" aria-labelledby="contact-title">
        <div className="wrap form-grid">
          <SectionHead id="contact-title" title={s.contact.heading} sub={s.contact.body} />
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
        <SectionHead id="work-title" title={w.heading} sub={w.body} />
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

function Path() {
  const p = services.path
  return (
    <section className="section" aria-labelledby="path-title">
      <div className="wrap">
        <SectionHead id="path-title" title={p.heading} />
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
        <SectionHead id="find-title" title={f.heading} sub={f.body} />
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
