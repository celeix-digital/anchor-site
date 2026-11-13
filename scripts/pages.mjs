// Per-section screenshots of every route, with reveals forced on.
// Usage: node scripts/pages.mjs [outDir] [baseUrl] [routes,comma,separated] [desktop|mobile]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const out = process.argv[2] || 'shots/pages'
const base = process.argv[3] || 'http://localhost:5199'
const routes = (process.argv[4] || '/,/shipping-agents,/terminal-agents,/services,/vision,/book-demo,/thank-you').split(',')
const only = process.argv[5]
mkdirSync(out, { recursive: true })
const b = await chromium.launch()
const sizes = [
  { n: 'd', w: 1440, h: 900 },
  { n: 'm', w: 390, h: 844, m: true },
].filter((x) => !only || x.n === only[0])
for (const s of sizes) {
  const p = await b.newPage({ viewport: { width: s.w, height: s.h }, isMobile: !!s.m })
  const logs = []
  p.on('pageerror', (e) => logs.push(e.message))
  p.on('console', (m) => m.type() === 'error' && logs.push(m.text()))
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: 'networkidle' })
    await p.addStyleTag({ content: '*{transition:none!important;animation:none!important}.rail,.skip-link{display:none!important}.nav{position:relative!important}' })
    await p.evaluate(async () => {
      document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in'))
      document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'))
      await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((res) => (i.onload = i.onerror = res)))))
    })
    const info = await p.evaluate(() => ({ h: document.documentElement.scrollHeight, hs: document.documentElement.scrollWidth > innerWidth, title: document.title }))
    const name = r === '/' ? 'home' : r.slice(1).replace(/[^a-z0-9]+/gi, '-')
    console.log(s.n, r, JSON.stringify(info), logs.splice(0).join(' | '))
    const els = await p.$$('main > section, footer')
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: `${out}/${name}-${s.n}${i}.png` })
  }
  await p.close()
}
await b.close()
