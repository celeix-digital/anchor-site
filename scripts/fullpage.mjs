// Full-page screenshots. Usage: node scripts/fullpage.mjs [url] [outDir]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const url = process.argv[2] || 'http://localhost:5199/'
const out = process.argv[3] || 'shots/full'
mkdirSync(out, { recursive: true })
const b = await chromium.launch()
for (const s of [{ n: 'desktop', w: 1440, h: 900, d: 1 }, { n: 'mobile', w: 390, h: 844, d: 2, m: true }]) {
  const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: s.d, isMobile: !!s.m })
  const logs = []
  p.on('console', (m) => m.type() === 'error' && logs.push(m.text()))
  p.on('pageerror', (e) => logs.push(e.message))
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } window.scrollTo(0, 0) })
  await p.waitForTimeout(500)
  const info = await p.evaluate(() => ({ h: document.documentElement.scrollHeight, hscroll: document.documentElement.scrollWidth > innerWidth }))
  await p.screenshot({ path: `${out}/${s.n}.png`, fullPage: true })
  console.log(s.n, JSON.stringify(info), logs.join(' | '))
}
await b.close()
