import { useState, type FormEvent, type ReactNode } from 'react'
import { CONTACT_EMAIL, type Shot } from '../content/shared'
import { form, type Interest } from '../content/demo'
import { navigate } from '../router'
import { MailIcon, SparkIcon, TeamIcon } from './Icons'
import { Eyebrow, d } from './ui'

/** Inner-page hero: copy on the left, an optional visual on the right. */
export function PageHero({ eyebrow, badge, lines, sub, actions, visual, notice }: { eyebrow: string; badge?: ReactNode; lines: readonly string[]; sub: string; actions?: ReactNode; visual?: ReactNode; notice?: ReactNode }) {
  return (
    <section className={`hero page-hero${visual ? '' : ' page-hero-solo'}`} aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="hero-meta reveal">
            <Eyebrow>{eyebrow}</Eyebrow>
            {badge}
          </div>
          <h1 id="hero-title" className="display hero-title">
            {lines.map((l, i) => (
              <span key={l} className="hero-line reveal" style={d(60 + i * 90)}>
                {l}
              </span>
            ))}
          </h1>
          <p className="lede hero-sub reveal" style={d(240)}>
            {sub}
          </p>
          {actions && (
            <div className="actions reveal" style={d(320)}>
              {actions}
            </div>
          )}
          {notice && (
            <div className="notice reveal" style={d(380)}>
              {notice}
            </div>
          )}
        </div>
        {visual && (
          <div className="page-hero-visual reveal reveal-zoom" style={d(300)}>
            {visual}
          </div>
        )}
      </div>
    </section>
  )
}

const sideIcon = { ai: SparkIcon, team: TeamIcon, mail: MailIcon }
const sideText = { ai: 'What the AI does', team: 'What your team does' }

/** A full-width row: text on one side, a real screenshot on the other. */
export function Feature({ side, title, caption, image, bleed, zoom, marker, label }: { side: 'ai' | 'team'; title: string; caption: string; image: Shot; bleed?: boolean; zoom?: boolean; marker?: string; label?: string }) {
  const Icon = sideIcon[side]
  return (
    <article className={`feature reveal feature-${side}${bleed ? ' feature-bleed' : ''}${zoom ? ' feature-zoom' : ''}`}>
      <div className="feature-text">
        <div className="feature-meta">
          {marker && (
            <span className="feature-marker" aria-hidden="true">
              {marker}
            </span>
          )}
          {label && <span className="feature-label">{label}</span>}
        </div>
        <span className={`tag tag-${side}`}>
          <Icon className="tag-icon" />
          {sideText[side]}
        </span>
        <h3 className="h3 feature-title">{title}</h3>
        <p className="copy">{caption}</p>
      </div>
      <figure className="shot-panel">
        <img className="shot" src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" />
      </figure>
    </article>
  )
}

type Values = { interest: Interest; name: string; email: string; company: string; port: string; role: string; message: string; website: string; consent: boolean }
type Errors = Partial<Record<keyof Values, string>>

/**
 * The request form from the live site. With no backend here, a valid request is
 * handed to the visitor's email app as a pre-filled message.
 */
export function RequestForm({ defaultInterest = 'demo' }: { defaultInterest?: Interest }) {
  const [v, setV] = useState<Values>({ interest: defaultInterest, name: '', email: '', company: '', port: '', role: '', message: '', website: '', consent: false })
  const [errors, setErrors] = useState<Errors>({})
  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((p) => ({ ...p, [k]: val }))
  const f = form.fields

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (v.website) return // honeypot
    const err: Errors = {}
    if (!v.name.trim()) err.name = form.errors.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) err.email = form.errors.email
    if (!v.company.trim()) err.company = form.errors.company
    if (!v.port.trim()) err.port = form.errors.port
    if (!v.role.trim()) err.role = form.errors.role
    if (!v.consent) err.consent = form.errors.consent
    setErrors(err)
    const first = Object.keys(err)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    const interest = form.interests.find((i) => i.value === v.interest)?.label ?? v.interest
    const body = [
      `Interest: ${interest}`,
      `Name: ${v.name}`,
      `Work email: ${v.email}`,
      `Company: ${v.company}`,
      `Port(s): ${v.port}`,
      `Role: ${v.role}`,
      v.message ? `\n${v.message}` : '',
    ].join('\n')
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject(interest, v.company))}&body=${encodeURIComponent(body)}`
    try {
      sessionStorage.setItem('anchor-request', JSON.stringify({ interest, at: Date.now() }))
    } catch {
      /* storage can be unavailable; the thank-you page copes */
    }
    window.location.href = href
    navigate('/thank-you')
  }

  const field = (k: 'name' | 'email' | 'company' | 'port' | 'role', label: string, extra: Record<string, string | number> = {}, hint?: string) => (
    <div className={`field-wrap field-${k}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input
        id={`f-${k}`}
        className="field"
        value={v[k]}
        onChange={(e) => set(k, e.target.value)}
        aria-invalid={!!errors[k]}
        aria-describedby={[hint ? `f-${k}-hint` : '', errors[k] ? `f-${k}-err` : ''].filter(Boolean).join(' ') || undefined}
        {...extra}
      />
      {hint && (
        <p id={`f-${k}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {errors[k] && (
        <p id={`f-${k}-err`} className="field-err">
          {errors[k]}
        </p>
      )}
    </div>
  )

  return (
    <form className="req-form" onSubmit={submit} noValidate>
      <p className="req-how">{form.how}</p>
      <fieldset className="req-interest">
        <legend>{form.interestLabel}</legend>
        <div className="req-options">
          {form.interests.map((i) => (
            <label key={i.value} className={`req-option${v.interest === i.value ? ' is-on' : ''}`}>
              <input type="radio" name="interest" value={i.value} checked={v.interest === i.value} onChange={() => set('interest', i.value)} />
              {i.label}
            </label>
          ))}
        </div>
        {v.interest === 'terminal' && <p className="field-hint">{form.terminalNote}</p>}
      </fieldset>
      <div className="req-grid">
        {field('name', f.name, { autoComplete: 'name', maxLength: 120 })}
        {field('email', f.email, { type: 'email', autoComplete: 'email', maxLength: 254 })}
        {field('company', f.company, { autoComplete: 'organization', maxLength: 160 })}
        {field('port', f.port, { maxLength: 160 })}
        {field('role', f.role, { autoComplete: 'organization-title', maxLength: 120 }, f.roleHint)}
        <div className="field-wrap field-message">
          <label htmlFor="f-message">{f.message}</label>
          <textarea id="f-message" className="field" rows={4} maxLength={2000} value={v.message} onChange={(e) => set('message', e.target.value)} />
          <p className="field-count" aria-live="polite">
            {v.message.length} / 2000
          </p>
        </div>
      </div>
      <div className="req-honey" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set('website', e.target.value)} />
      </div>
      <label className="req-consent">
        <input id="f-consent" type="checkbox" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'f-consent-err' : undefined} />
        <span>{form.consent}</span>
      </label>
      {errors.consent && (
        <p id="f-consent-err" className="field-err">
          {errors.consent}
        </p>
      )}
      <div className="req-submit">
        <button type="submit" className="btn btn-primary">
          {form.submit}
        </button>
        <span className="field-hint">{form.submitNote}</span>
      </div>
    </form>
  )
}

/** Decorative navy chart panel for inner-page heroes. */
export function HeroChart({ kind, label }: { kind: 'visit' | 'journey'; label: string }) {
  const depth = [30, 43, 55, 64, 70, 70, 61, 47, 32]
  const pts = depth.map((y, n) => [40 + n * 40, 60 + y * 3.2] as const)
  return (
    <div className="datum-visual hero-chart" aria-hidden="true">
      <div className="datum-grid" />
      <svg className="hero-chart-svg" viewBox="0 0 400 360">
        {kind === 'visit' ? (
          <>
            <rect x="40" y="262" width="320" height="34" rx="4" className="hc-quay" />
            <path d="M92 214 H308 L288 252 H112 Z" className="hc-ship" />
            <rect x="244" y="178" width="44" height="36" rx="3" className="hc-ship" />
            {[
              [70, 70],
              [160, 46],
              [240, 46],
              [330, 70],
            ].map(([x, y], n) => (
              <g key={n}>
                <path d={`M${x} ${y + 16} C ${x} 150, 200 140, 200 210`} className="hc-link" />
                <circle cx={x} cy={y} r="16" className="hc-node" />
                <text x={x} y={y + 5} className="hc-text">
                  {'ABCD'[n]}
                </text>
              </g>
            ))}
            <circle cx="200" cy="214" r="7" className="hc-dot" />
          </>
        ) : (
          <>
            <rect x="196" y="300" width="128" height="30" rx="3" className="hc-quay" />
            <path d={pts.map(([x, y], n) => `${n ? 'L' : 'M'}${x} ${y}`).join(' ')} className="hc-route" />
            {pts.map(([x, y], n) => (
              <g key={n}>
                <circle cx={x} cy={y} r="11" className={n < 5 ? 'hc-node hc-node-on' : 'hc-node'} />
                <text x={x} y={y + 4} className="hc-text hc-text-sm">
                  {String(n + 1).padStart(2, '0')}
                </text>
              </g>
            ))}
          </>
        )}
      </svg>
      <span className="datum-sub hero-chart-label">{label}</span>
    </div>
  )
}
