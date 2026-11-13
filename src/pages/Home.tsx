import { useRef, useState, type KeyboardEvent } from 'react'
import { home } from '../content/home'
import { notScreenshot, shots } from '../content/shared'
import { zones } from '../content/services'
import { trustLadder } from '../content/vision'
import { Link, usePageMeta } from '../router'
import { LogoMark } from '../components/Logo'
import { MailIcon, SparkIcon, TeamIcon } from '../components/Icons'
import { ArrowLink, Badge, Button, CtaPanel, Eyebrow, SectionHead, ShotFrame, d } from '../components/ui'

export default function Home() {
  usePageMeta(home.meta.title, home.meta.description)
  return (
    <>
      <Hero />
      <HowItWorks />
      <Problem />
      <Audiences />
      <Tomorrow />
      <NameStory />
      <Build />
      <ServicesTeaser />
      <CtaPanel id="home-cta" {...home.cta} />
    </>
  )
}

function Hero() {
  const h = home.hero
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="hero-meta reveal" style={d(0)}>
            <span className="datum">{h.datum}</span>
            {h.badges.map((b, i) => (
              <Badge key={b} state={i === 0 ? 'live' : 'separate'}>
                {b}
              </Badge>
            ))}
          </div>
          <h1 id="hero-title" className="display hero-title">
            {h.lines.map((l, i) => (
              <span key={l} className="hero-line reveal" style={d(60 + i * 90)}>
                {l}
              </span>
            ))}
          </h1>
          <p className="lede hero-sub reveal" style={d(260)}>
            {h.sub}
          </p>
          <div className="actions reveal" style={d(340)}>
            <Button href="/book-demo">{h.primary}</Button>
            <Button href={h.secondary.href} variant="secondary">
              {h.secondary.label}
            </Button>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  )
}

/** Real product screenshots, layered: the shared inbox with an AI draft waiting for review. */
function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hv-bg reveal" style={d(200)}>
        <svg className="hv-ring" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="17.2" fill="none" stroke="currentColor" strokeWidth="0.9" />
          <g fill="currentColor">
            <rect x="23.4" y="1.4" width="1.2" height="5.2" />
            <rect x="23.4" y="41.4" width="1.2" height="5.2" />
            <rect x="1.4" y="23.4" width="5.2" height="1.2" />
            <rect x="41.4" y="23.4" width="5.2" height="1.2" />
          </g>
        </svg>
      </div>
      <figure className="hv-window reveal reveal-zoom" style={d(380)}>
        <div className="hv-bar">
          <span className="hv-dot" />
          <span className="hv-dot" />
          <span className="hv-dot" />
          <span className="hv-title">{home.hero.window}</span>
        </div>
        <img src={shots.inbox.src} width={shots.inbox.width} height={shots.inbox.height} alt="" fetchPriority="high" decoding="async" />
      </figure>
      <figure className="hv-card reveal" style={d(620)}>
        <span className="hv-pill">{home.hero.pill}</span>
        <img src={shots.draft.src} width={shots.draft.width} height={shots.draft.height} alt="" decoding="async" />
      </figure>
    </div>
  )
}

const sideIcon = { ai: SparkIcon, team: TeamIcon, mail: MailIcon }

function HowItWorks() {
  const h = home.how
  const [i, setI] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const go = (n: number, focus = false) => {
    const next = (n + h.steps.length) % h.steps.length
    setI(next)
    if (focus) tabs.current[next]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: h.steps.length - 1 }
    if (e.key in map) {
      e.preventDefault()
      go(map[e.key], true)
    }
  }
  const s = h.steps[i]
  const Icon = sideIcon[s.side]
  return (
    <section id="how" className="section section-tint" aria-labelledby="how-title">
      <div className="wrap">
        <SectionHead id="how-title" eyebrow={h.eyebrow} title={h.heading} sub={h.sub} />
        <div className="steps-tabs reveal" style={d(100)}>
          <div className="steps-list" role="tablist" aria-label={h.heading}>
            {h.steps.map((st, n) => (
              <button
                key={st.n}
                ref={(el) => {
                  tabs.current[n] = el
                }}
                role="tab"
                id={`step-tab-${n}`}
                aria-selected={n === i}
                aria-controls="step-panel"
                tabIndex={n === i ? 0 : -1}
                className={`steps-tab steps-tab-${st.side}${n < i ? ' is-done' : ''}`}
                onClick={() => go(n)}
                onKeyDown={onKey}
              >
                <span className="steps-tab-n">{st.n}</span>
                <span className="steps-tab-label">{st.tab}</span>
              </button>
            ))}
          </div>
          <div id="step-panel" role="tabpanel" aria-labelledby={`step-tab-${i}`} className="steps-panel" key={i}>
            <div className="steps-text">
              <span className={`tag tag-${s.side === 'mail' ? 'mail' : s.side}`}>
                <Icon className="tag-icon" />
                {h.sideLabel[s.side]}
              </span>
              <h3 className="h3">
                <span className="steps-n">{s.n}</span> {s.title}
              </h3>
              <p className="copy">{s.body}</p>
              <div className="steps-nav">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => go(i - 1)} disabled={i === 0}>
                  Back
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => go(i + 1)} disabled={i === h.steps.length - 1}>
                  Next step
                </button>
              </div>
            </div>
            <div className={`steps-shot steps-shot-${s.side}`}>
              <ShotFrame shot={s.shot} fit={s.crop} />
            </div>
          </div>
          <p className="fineprint">{notScreenshot}</p>
        </div>
      </div>
    </section>
  )
}

function Problem() {
  const p = home.problem
  return (
    <section className="section" aria-labelledby="problem-title">
      <div className="wrap split split-visual">
        <div className="reveal">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <h2 id="problem-title" className="display h2">
            {p.heading}
          </h2>
          <p className="copy problem-body">{p.body}</p>
          <ol className="num-list">
            {p.features.map((f, n) => (
              <li key={f.title}>
                <span className="num-list-n">{String(n + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="h4">{f.title}</h3>
                  <p className="copy">{f.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <DayInbox />
      </div>
    </section>
  )
}

/** Six senders, one call, one shared inbox. Fictional messages from the live site. */
function DayInbox() {
  const day = home.problem.day
  return (
    <figure className="flow reveal" style={d(140)}>
      <p className="flow-label">{day.label}</p>
      <ul className="flow-parties" aria-hidden="true">
        {day.messages.map((m) => (
          <li key={m.from}>{m.from}</li>
        ))}
      </ul>
      <svg className="flow-lines" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        {[8, 25, 42, 58, 75, 92].map((x) => (
          <path key={x} d={`M${x} 0 C ${x} 22, 50 18, 50 40`} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="flow-inbox">
        <div className="flow-head">
          <MailIcon className="flow-head-icon" />
          <span>{day.inbox}</span>
        </div>
        <ul className="flow-threads">
          {day.messages.map((t) => (
            <li key={t.time}>
              <span className="flow-avatar" aria-hidden="true">
                {t.from.charAt(0)}
              </span>
              <span className="flow-text">
                <span className="flow-from">{t.from}</span>
                <span className="flow-subject">{t.subject}</span>
              </span>
              <span className="flow-time">{t.time}</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="fineprint">{day.note}</figcaption>
    </figure>
  )
}

function Audiences() {
  const a = home.audiences
  return (
    <section className="section section-tint" aria-labelledby="aud-title">
      <div className="wrap">
        <SectionHead id="aud-title" eyebrow={a.eyebrow} title={a.heading} />
        <div className="cards-3">
          {a.cards.map((c, n) => (
            <article key={c.title} className={`card card-${c.state} reveal`} style={d(n * 100)}>
              <Badge state={c.state}>{c.label}</Badge>
              <h3 className="h3">{c.title}</h3>
              <p className="copy">{c.body}</p>
              <ArrowLink href={c.link.href}>{c.link.label}</ArrowLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Tomorrow() {
  const t = home.tomorrow
  return (
    <section className="section" aria-labelledby="tom-title">
      <div className="wrap">
        <div className="split">
          <SectionHead id="tom-title" eyebrow={t.eyebrow} title={t.heading} />
          <div className="reveal" style={d(100)}>
            <p className="lede">{t.body}</p>
            <div className="link-row">
              {t.links.map((l) => (
                <ArrowLink key={l.href} href={l.href}>
                  {l.label}
                </ArrowLink>
              ))}
            </div>
          </div>
        </div>
        <div className="state-cols reveal" style={d(120)}>
          {t.columns.map((c) => (
            <div key={c.label} className={`state-col state-col-${c.state}`}>
              <Badge state={c.state}>{c.label}</Badge>
              <p className="copy">{c.body}</p>
            </div>
          ))}
        </div>
        <MiniLadder />
        <p className="fineprint reveal">{trustLadder.note}</p>
      </div>
    </section>
  )
}

function MiniLadder() {
  return (
    <ol className="mini-ladder reveal" style={d(160)} aria-label={trustLadder.eyebrow}>
      {trustLadder.steps.map((s, n) => (
        <li key={s.t} className={s.live ? 'is-live' : 'is-future'}>
          <span className="mini-ladder-n">{String(n + 1).padStart(2, '0')}</span>
          <span className="mini-ladder-state">{s.live ? 'Live today' : 'Future direction'}</span>
          <span className="mini-ladder-t">{s.t}</span>
        </li>
      ))}
    </ol>
  )
}

function NameStory() {
  const n = home.name
  return (
    <section className="section section-navy" aria-labelledby="name-title">
      <div className="wrap name-grid">
        <div className="name-mark reveal" aria-hidden="true">
          <LogoMark className="name-logo" />
          <span className="name-coords">39°N</span>
        </div>
        <div className="reveal" style={d(100)}>
          <Eyebrow onDark>{n.eyebrow}</Eyebrow>
          <h2 id="name-title" className="display h2">
            {n.heading}
          </h2>
          <p className="lede">{n.body}</p>
          <ArrowLink href={n.link.href} className="arrow-link-dark">
            {n.link.label}
          </ArrowLink>
        </div>
      </div>
    </section>
  )
}

function Build() {
  const b = home.build
  return (
    <section className="section" aria-labelledby="build-title">
      <div className="wrap">
        <SectionHead id="build-title" title={b.heading} />
        <ul className="cards-4">
          {b.items.map((it, n) => (
            <li key={it.title} className="principle reveal" style={d(n * 80)}>
              <span className="principle-n">{String(n + 1).padStart(2, '0')}</span>
              <h3 className="h4">{it.title}</h3>
              <p className="copy">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ServicesTeaser() {
  const s = home.services
  return (
    <section className="section section-tint" aria-labelledby="svc-title">
      <div className="wrap">
        <div className="split">
          <SectionHead id="svc-title" eyebrow={s.eyebrow} title={s.heading} />
          <div className="reveal" style={d(100)}>
            <p className="lede">{s.body}</p>
            <div className="actions">
              <Button href={s.primary.href}>{s.primary.label}</Button>
              <Button href={s.secondary.href} variant="secondary">
                {s.secondary.label}
              </Button>
            </div>
          </div>
        </div>
        <div className="zone-strip reveal" style={d(140)}>
          <div className="zone-strip-head">
            <span className="zone-strip-label">{s.zonesLabel}</span>
            <ArrowLink href={s.zonesLink.href}>{s.zonesLink.label}</ArrowLink>
          </div>
          <ol className="zone-strip-list">
            {zones.map((z, n) => (
              <li key={z.t}>
                <Link href="/services#zones">
                  <span className="zone-strip-n">{String(n + 1).padStart(2, '0')}</span>
                  <span>{z.t}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
