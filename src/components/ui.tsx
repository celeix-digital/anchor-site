import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { Link } from '../router'
import type { Shot } from '../content/shared'
import { ArrowIcon } from './Icons'

/** Stagger delay for reveal transitions. */
export const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` }) as CSSProperties

/** Fade-and-rise as elements enter the viewport. Re-run when the page changes. */
export function useReveal(key: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'))
    const show = (el: Element) => el.classList.add('is-in')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      els.forEach(show)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target)
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}

/** The product's state family: hollow ring (AI-drafted), solid disc (reviewed by a person), open cross (needs attention). */
export function Glyph({ state, className = '' }: { state: 'ai' | 'human' | 'attention'; className?: string }) {
  return (
    <svg className={`glyph glyph-${state} ${className}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {state === 'ai' && <circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" strokeWidth="2" />}
      {state === 'human' && <circle cx="8" cy="8" r="6" fill="currentColor" />}
      {state === 'attention' && <path d="M8 2.5v4M8 9.5v4M2.5 8h4M9.5 8h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  )
}

export function SectionHead({ title, id, sub, onDark, wide }: { title: ReactNode; id: string; sub?: ReactNode; onDark?: boolean; wide?: boolean }) {
  return (
    <div className={`section-head reveal${wide ? ' section-head-wide' : ''}${onDark ? ' section-head-dark' : ''}`}>
      <h2 id={id} className="display h2">
        {title}
      </h2>
      {sub && <div className="lede section-sub">{sub}</div>}
    </div>
  )
}

/** A text link with an arrow. */
export function ArrowLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link className={`arrow-link ${className}`} href={href}>
      {children}
      <ArrowIcon className="arrow-link-icon" />
    </Link>
  )
}

export function Button({ href, children, variant = 'primary', small }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost-dark'; small?: boolean }) {
  return (
    <Link className={`btn btn-${variant}${small ? ' btn-sm' : ''}`} href={href}>
      {children}
    </Link>
  )
}

/**
 * A real product screen, shown edge to edge with no window chrome. Phones get a
 * tighter crop of the same screen so the text stays readable.
 */
type Box = readonly [x: number, y: number, w: number, h: number]
const pct = (v: number, of: number) => `${(v / of) * 100}%`

/** A product screen. `mark` draws a highlight box: `d` in desktop pixels, `m` in the phone crop (700×680). */
export function Screen({
  shot,
  eager,
  inactive,
  className = '',
  style,
  mark,
}: {
  shot: Shot
  eager?: boolean
  inactive?: boolean
  className?: string
  style?: CSSProperties
  mark?: { d: Box; m: Box }
}) {
  const box = mark && {
    '--l': pct(mark.d[0], shot.width),
    '--t': pct(mark.d[1], shot.height),
    '--w': pct(mark.d[2], shot.width),
    '--h': pct(mark.d[3], shot.height),
    '--ml': pct(mark.m[0], 700),
    '--mt': pct(mark.m[1], 680),
    '--mw': pct(mark.m[2], 700),
    '--mh': pct(mark.m[3], 680),
  }
  return (
    <figure className={`screen ${className}`} style={style} aria-hidden={inactive || undefined}>
      <picture>
        {shot.mobile && <source media="(max-width: 640px)" srcSet={shot.mobile} />}
        <img
          src={shot.src}
          width={shot.width}
          height={shot.height}
          alt={inactive ? '' : shot.alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
        />
      </picture>
      {box && <span className="screen-mark" aria-hidden="true" style={box as CSSProperties} />}
    </figure>
  )
}

/** A full-width light banner with a heading, one line and actions. */
export function Banner({ heading, body, primary, secondary, id }: { heading: string; body: string; primary: { href: string; label: string }; secondary?: { href: string; label: string }; id: string }) {
  return (
    <section className="section banner-section" aria-labelledby={id}>
      <div className="wrap">
        <div className="banner reveal">
          <div>
            <h2 id={id} className="display h2">
              {heading}
            </h2>
            <p className="lede">{body}</p>
          </div>
          <div className="actions">
            <Button href={primary.href}>{primary.label}</Button>
            {secondary && (
              <Button href={secondary.href} variant="secondary">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Closing navy panel with the compass mark behind it. */
export function CtaPanel({ heading, body, primary, secondary, id }: { heading: string[]; body: string; primary: { href: string; label: string }; secondary?: { href: string; label: string }; id: string }) {
  return (
    <section className="section cta-section" aria-labelledby={id}>
      <div className="wrap">
        <div className="cta-panel reveal">
          <CompassMark className="cta-mark" />
          <h2 id={id} className="display h2">
            {heading.map((t) => (
              <span key={t} className="h2-line">
                {t}
              </span>
            ))}
          </h2>
          <p className="lede">{body}</p>
          <div className="actions">
            <Button href={primary.href}>{primary.label}</Button>
            {secondary && (
              <Button href={secondary.href} variant="ghost-dark">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** The logo's geometry in thin lines, for large decorative use. */
export function CompassMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="17.2" fill="none" stroke="currentColor" strokeWidth="0.3" />
      <g fill="currentColor">
        <rect x="23.8" y="1.4" width="0.4" height="5.2" />
        <rect x="23.8" y="41.4" width="0.4" height="5.2" />
        <rect x="1.4" y="23.8" width="5.2" height="0.4" />
        <rect x="41.4" y="23.8" width="5.2" height="0.4" />
      </g>
      <path className="cta-mark-tri" d="M24 10.2 L36.3 30.8 L11.7 30.8 Z" fill="none" strokeWidth="0.35" strokeLinejoin="round" />
      <circle className="cta-mark-dot" cx="24" cy="24" r="1.2" />
    </svg>
  )
}
