import { useEffect, useRef, useState } from 'react'
import { audiences, footer, nav } from '../content/shared'
import { Link, useLocation } from '../router'
import { LogoMark } from './Logo'
import { Badge, Glyph } from './ui'

export function Nav() {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const { path, hash } = useLocation()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let on = false
    const update = () => {
      const next = window.scrollY > 4
      if (next !== on) {
        on = next
        el.classList.toggle('is-scrolled', on)
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Close the menu on navigation and on Escape.
  useEffect(() => setOpen(false), [path, hash])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const current = (href: string) => (href.startsWith('/#') ? false : path === href)

  return (
    <header ref={ref} className={`nav${open ? ' is-open' : ''}`}>
      <div className="nav-inner">
        <Link className="brand" href="/" aria-label={nav.homeLabel}>
          <LogoMark className="brand-glyph" />
          <span className="brand-word">ANCHOR39</span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {nav.links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={current(l.href) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-primary btn-sm nav-cta" href={nav.cta.href}>
          {nav.cta.label}
        </Link>
        <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="nav-menu" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{nav.menu}</span>
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>
      </div>
      <nav id="nav-menu" className="nav-menu" aria-label="Main" hidden={!open}>
        {nav.links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={current(l.href) ? 'page' : undefined}>
            {l.label}
          </Link>
        ))}
        <Link className="btn btn-primary" href={nav.cta.href}>
          {nav.cta.label}
        </Link>
      </nav>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <ul className="footer-status">
          {audiences.map((a) => (
            <li key={a.title}>
              <Link href={a.href} className="footer-status-card">
                <Badge state={a.state}>{a.label}</Badge>
                <span className="footer-status-title">{a.title}</span>
                <span className="footer-status-body">{a.body}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand" href="/" aria-label={nav.footerHomeLabel}>
              <LogoMark className="brand-glyph" />
              <span className="brand-word">ANCHOR</span>
            </Link>
            <p className="footer-blurb">{footer.blurb}</p>
            <Link className="footer-mark-link" href={footer.markLink.href}>
              {footer.markLink.label}
            </Link>
            <ul className="footer-glyphs" aria-label="What the symbols in the product mean">
              {footer.glyphs.map((g) => (
                <li key={g.state}>
                  <Glyph state={g.state} />
                  <span>
                    {g.label} <span className="footer-glyph-shape">{g.shape}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {footer.columns.map((c) => (
            <nav key={c.title} className="footer-col" aria-label={c.title}>
              <h2 className="footer-col-title">{c.title}</h2>
              <ul>
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-base">
          <p>{footer.legal}</p>
          <p>
            {footer.datum} · <a href={footer.signIn.href}>{footer.signIn.label}</a> {footer.signIn.after}
          </p>
        </div>
      </div>
    </footer>
  )
}
