// Section-by-section screenshots with reveals forced on.
// Usage: node scripts/sections.mjs [outDir] [url]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const out = process.argv[2] || 'shots/sections'
const url = process.argv[3] || 'http://localhost:5199/'
mkdirSync(out, { recursive: true })
const b = await chromium.launch()
for (const s of [{ n: 'desktop', w: 1440, h: 900 }, { n: 'mobile', w: 390, h: 844, m: true }]) {
  const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1, isMobile: !!s.m })
  const logs = []
  p.on('pageerror', (e) => logs.push(e.message))
  p.on('console', (m) => m.type() === 'error' && logs.push(m.text()))
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.addStyleTag({ content: '*{transition:none!important;animation:none!important}.rail,.skip-link{display:none!important}.nav{position:relative!important}' })
  await p.evaluate(async () => {
    document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in'))
    document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'))
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))))
  })
  const info = await p.evaluate(() => ({ h: document.documentElement.scrollHeight, hs: document.documentElement.scrollWidth > innerWidth }))
  console.log(s.n, JSON.stringify(info), logs.join(' | '))
  const els = await p.$$('main > section, footer')
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: `${out}/${s.n}-${i}.png` })
}
await b.close()
