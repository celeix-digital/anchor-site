import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { home } from '../content/home'
import { shots } from '../content/shared'
import { usePageMeta } from '../router'
import { MailIcon } from '../components/Icons'
import { ArrowLink, Banner, Button, CtaPanel, Screen, SectionHead, d } from '../components/ui'

export default function Home() {
  usePageMeta(home.meta.title, home.meta.description)
  return (
    <>
      <Hero />
      <HowItWorks />
      <Problem />
      <Audiences />
      <Banner id="svc-title" {...home.services} />
      <CtaPanel id="home-cta" {...home.cta} />
    </>
  )
}

function Hero() {
  const h = home.hero
  return (
    <section className="hero hero-stacked" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero-copy">
          <h1 id="hero-title" className="display hero-title">
            {h.lines.map((l, i) => (
              <span key={l} className="hero-line reveal" style={d(i * 90)}>
                {l}
              </span>
            ))}
          </h1>
          <p className="lede hero-sub reveal" style={d(200)}>
            {h.sub}
          </p>
          <div className="actions reveal" style={d(280)}>
            <Button href="/book-demo">{h.primary}</Button>
            <Button href={h.secondary.href} variant="secondary">
              {h.secondary.label}
            </Button>
          </div>
        </div>
        <Screen shot={shots.dashboard} eager className="hero-screen reveal reveal-zoom" style={d(340)} />
      </div>
    </section>
  )
}

const STEP_MS = 3500

/**
 * "Follow one email" as a slideshow: it moves on by itself, with the steps as
 * pointers under the screen. It pauses on hover or focus, when off screen, when
 * the visitor presses pause, and never auto-plays under reduced motion. Every
 * slide's image is in the page from the start, so switching never waits on a load.
 */
function HowItWorks() {
  const h = home.how
  const n = h.steps.length
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState(-1) // stays solid underneath while the next slide fades in
  const [held, setHeld] = useState(false) // hover or focus inside
  const [stopped, setStopped] = useState(false) // pause button
  const [seen, setSeen] = useState(false)
  const [reduce, setReduce] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setReduce(mq.matches)
    set()
    mq.addEventListener('change', set)
    const el = root.current
    if (!el || !('IntersectionObserver' in window)) return () => mq.removeEventListener('change', set)
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      threshold: 0.35,
    })
    io.observe(el)
    return () => {
      io.disconnect()
      mq.removeEventListener('change', set)
    }
  }, [])

  const playing = seen && !held && !stopped && !reduce
  const go = (k: number, focus = false) => {
    const next = (k + n) % n
    if (next === i) return
    setPrev(i)
    setI(next)
    if (focus) tabs.current[next]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: n - 1,
    }
    if (e.key in map) {
      e.preventDefault()
      go(map[e.key], true)
    }
  }
  const s = h.steps[i]

  return (
    <section id="how" className="section section-tint" aria-labelledby="how-title">
      <div className="wrap">
        <SectionHead id="how-title" title={h.heading} sub={h.sub} wide />
        {/* The reveal class lives on a wrapper: React rewrites this div's classes as it plays. */}
        <div className="reveal" style={d(100)}>
          <div
            ref={root}
            className={`show${playing ? ' is-playing' : ''}`}
            style={{ ['--step-ms' as string]: `${STEP_MS}ms` }}
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
          >
            <div id="show-panel" role="tabpanel" aria-labelledby={`show-tab-${i}`} className="show-panel">
              <div className="show-stage">
                {h.steps.map((st, k) => (
                  <Screen key={st.n} shot={st.shot} className={`show-slide${k === i ? ' is-on' : k === prev ? ' is-prev' : ''}`} inactive={k !== i} />
                ))}
              </div>
            </div>
            <div className="show-controls">
              <div className="show-dots" role="tablist" aria-label={h.heading}>
                {h.steps.map((st, k) => (
                  <button
                    key={st.n}
                    ref={(el) => {
                      tabs.current[k] = el
                    }}
                    role="tab"
                    id={`show-tab-${k}`}
                    aria-selected={k === i}
                    aria-controls="show-panel"
                    tabIndex={k === i ? 0 : -1}
                    className={`show-dot${k === i ? ' is-on' : ''}${k < i ? ' is-done' : ''}`}
                    onClick={() => go(k)}
                    onKeyDown={onKey}
                  >
                    <span className="show-bar" aria-hidden="true">
                      <span className="show-fill" onAnimationEnd={k === i ? () => go(i + 1) : undefined} />
                    </span>
                    <span className="show-label">
                      <span className="show-label-n">{st.n}</span> <span className="show-label-t">{st.tab}</span>
                    </span>
                  </button>
                ))}
              </div>
              {!reduce && (
                <button type="button" className="show-pause" onClick={() => setStopped((v) => !v)} aria-label={stopped ? 'Play the slideshow' : 'Pause the slideshow'}>
                  {stopped ? (
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M5 3.5v9l7-4.5z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            <div className="show-caption" key={i}>
              <h3 className="h4">
                <span className="show-n">{s.n}</span> {s.title}
              </h3>
              <p className="copy">{s.body}</p>
            </div>
          </div>
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
    </figure>
  )
}

function Audiences() {
  const a = home.audiences
  return (
    <section className="section section-tint" aria-labelledby="aud-title">
      <div className="wrap">
        <SectionHead id="aud-title" title={a.heading} />
        <div className="cards-3">
          {a.cards.map((c, n) => (
            <article key={c.title} className="card reveal" style={d(n * 100)}>
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
