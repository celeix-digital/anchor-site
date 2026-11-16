import AnchorRail from './components/AnchorRail'
import { Footer, Nav } from './components/Layout'
import { Button, useReveal } from './components/ui'
import { nav } from './content/shared'
import { useEffect } from 'react'
import { redirect, useInitialHash, useLocation, usePageMeta } from './router'
import Home from './pages/Home'
import ShippingAgents from './pages/ShippingAgents'
import Terminals from './pages/Terminals'
import Services from './pages/Services'
import About from './pages/About'
import { BookDemo, ThankYou } from './pages/BookDemo'

const routes: Record<string, () => React.JSX.Element> = {
  '/': Home,
  '/shipping-agents': ShippingAgents,
  '/terminal-agents': Terminals,
  '/services': Services,
  '/about': About,
  '/book-demo': BookDemo,
  '/thank-you': ThankYou,
}

function NotFound() {
  usePageMeta('Page not found | ANCHOR', 'This page does not exist.')
  return (
    <section className="section page-hero-solo" aria-labelledby="hero-title">
      <div className="wrap">
        <h1 id="hero-title" className="display hero-title">
          Off the chart.
        </h1>
        <p className="lede hero-sub">We couldn’t find that page.</p>
        <div className="actions" style={{ marginTop: 28 }}>
          <Button href="/">Back to the homepage</Button>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const { path, search } = useLocation()
  // The Vision page is now About.
  useEffect(() => {
    if (path === '/vision') redirect('/about' + window.location.search + window.location.hash)
  }, [path])
  const Page = routes[path === '/vision' ? '/about' : path] ?? NotFound
  useReveal(path + search.toString())
  useInitialHash()
  return (
    <>
      <AnchorRail key={path} />
      <a className="skip-link" href="#main">
        {nav.skip}
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Page />
      </main>
      <Footer />
    </>
  )
}
