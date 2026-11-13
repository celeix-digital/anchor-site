import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

/*
 * A very small client-side router. Paths are plain URLs; Vercel rewrites every
 * unknown path to index.html (see vercel.json), and Vite's dev server does the same.
 */

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

function subscribe(l: () => void) {
  listeners.add(l)
  window.addEventListener('popstate', l)
  return () => {
    listeners.delete(l)
    window.removeEventListener('popstate', l)
  }
}

const getLocation = () => window.location.pathname + window.location.search + window.location.hash

export function useLocation() {
  const href = useSyncExternalStore(subscribe, getLocation, () => '/')
  const url = new URL(href, 'http://x')
  return { path: url.pathname.replace(/\/+$/, '') || '/', search: url.searchParams, hash: url.hash }
}

function scrollToHash(hash: string) {
  const el = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
  if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  return !!el
}

export function navigate(to: string) {
  const url = new URL(to, window.location.href)
  const samePage = url.pathname === window.location.pathname && url.search === window.location.search
  if (samePage && url.hash) {
    history.pushState(null, '', url.hash)
    scrollToHash(url.hash)
    emit()
    return
  }
  history.pushState(null, '', url.pathname + url.search + url.hash)
  emit()
  // After the new page renders, go to the hash target or the top.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (!(url.hash && scrollToHash(url.hash))) window.scrollTo(0, 0)
      document.getElementById('main')?.focus({ preventScroll: true })
    }),
  )
}

/** On first load, honour a hash once the page has rendered. */
export function useInitialHash() {
  useEffect(() => {
    if (window.location.hash) requestAnimationFrame(() => scrollToHash(window.location.hash))
  }, [])
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** An <a> that routes internally for same-origin paths. */
export function Link({ href, onClick, ...rest }: LinkProps) {
  const internal = href.startsWith('/') || href.startsWith('#')
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (!internal || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={handle} {...rest} />
}

/** Sets the document title and description for a page. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
