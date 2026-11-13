import AnchorRail from './components/AnchorRail'
import { Footer, Nav } from './components/Layout'
import { Button, useReveal } from './components/ui'
import { nav } from './content/shared'
import { useInitialHash, useLocation, usePageMeta } from './router'
import Home from './pages/Home'
import ShippingAgents from './pages/ShippingAgents'
import Terminals from './pages/Terminals'
import Services from './pages/Services'
import Vision from './pages/Vision'
import { BookDemo, ThankYou } from './pages/BookDemo'

const routes: Record<string, () => React.JSX.Element> = {
  '/': Home,
  '/shipping-agents': ShippingAgents,
  '/terminal-agents': Terminals,
  '/services': Services,
  '/vision': Vision,
  '/book-demo': BookDemo,
  '/thank-you': ThankYou,
}

function NotFound() {
  usePageMeta('Page not found — ANCHOR', 'This page does not exist.')
  return (
    <section className="section page-hero-solo" aria-labelledby="hero-title">
      <div className="wrap">
        <p className="eyebrow">404</p>
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
  const Page = routes[path] ?? NotFound
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
