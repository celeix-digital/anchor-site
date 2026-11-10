// Usage: node scripts/shots.mjs [baseUrl] [outDir] [--only=desktop|mobile] [--p=0,0.5]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const args = process.argv.slice(2)
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')))
const pos = args.filter((a) => !a.startsWith('--'))
const base = pos[0] || 'http://localhost:5173/'
const out = pos[1] || 'shots'
const ps = (flags.p || '0,0.03,0.25,0.5,0.75,0.95,1').split(',').map(Number)
const sizes = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
].filter((s) => !flags.only || flags.only.split(',').includes(s.name))

mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
for (const s of sizes) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: s.mobile ? 2 : 1,
    isMobile: s.mobile,
    hasTouch: s.mobile,
    reducedMotion: flags.reduced ? 'reduce' : 'no-preference',
  })
  const page = await ctx.newPage()
  const logs = []
  page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`))
  page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1800)
  const info = await page.evaluate(() => ({
    vh: innerHeight,
    total: document.documentElement.scrollHeight,
    ratio: document.documentElement.scrollHeight / innerHeight,
    hscroll: document.documentElement.scrollWidth > innerWidth,
  }))
  console.log(s.name, JSON.stringify(info))
  for (const p of ps) {
    await page.evaluate((p) => {
      const max = document.documentElement.scrollHeight - innerHeight
      window.scrollTo({ top: Math.round(max * p), behavior: 'instant' })
    }, p)
    await page.waitForTimeout(1400)
    await page.screenshot({ path: `${out}/${s.name}-p${String(p).replace('.', '_')}.png` })
  }
  if (logs.length) console.log(logs.join('\n'))
  await ctx.close()
}
await browser.close()
