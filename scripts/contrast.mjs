// Measures text contrast against the brightest water behind each text element, with text shadows
// included (glyphs made transparent) and the sea-life canvas hidden.
// Usage: node scripts/contrast.mjs [url] [--only=desktop|mobile]
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const url = args.find((a) => !a.startsWith('--')) || 'http://localhost:5199/'
const only = (args.find((a) => a.startsWith('--only=')) || '').slice(7)
const SEL = 'main h1, main h2, main p, main h3, .lane, .footer p, .nav-links a, .brand-word, .gauge li, .gauge-read'
const sizes = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
].filter((s) => !only || s.name === only)

const browser = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist'] })
const worst = {}
for (const s of sizes) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)
  for (let p = 0; p <= 1.0001; p += 0.05) {
    await page.evaluate((p) => window.scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * p)), p)
    await page.waitForTimeout(700)
    const items = await page.evaluate((SEL) => {
      const out = []
      for (const el of document.querySelectorAll(SEL)) {
        if (el.closest('.mock, .step-card, .btn, .skip-link, .sr-only') || el.classList.contains('sr-only')) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none') continue
        let op = 1
        for (let e = el; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity)
        const m = cs.color.match(/\d+(\.\d+)?/g).map(Number)
        const rng = document.createRange()
        rng.selectNodeContents(el)
        for (const r of rng.getClientRects()) {
          if (r.width < 4 || r.bottom < 0 || r.top > innerHeight) continue
          // skip text the frosted nav covers
          if (!el.closest('.nav') && r.top < 70) continue
          out.push({ id: (el.className || el.tagName) + ': ' + el.textContent.trim().slice(0, 32), x: r.left, y: r.top, w: r.width, h: r.height, c: m.slice(0, 3), a: (m[3] ?? 1) * op, size: parseFloat(cs.fontSize) })
        }
      }
      return out
    }, SEL)
    // Keep text shadows (they are part of the design), hide glyphs and the sea-life canvas.
    await page.addStyleTag({ content: '.mock, .step-card, .btn, .feature .mock {visibility:hidden !important} main *, .gauge *, .nav-links a, .brand-word {color: transparent !important} .gauge-marker::before{display:none} .scene canvas:last-child{visibility:hidden !important} *{transition:none !important} /*measure*/' })
    const shot = await page.screenshot()
    await page.evaluate(() => document.querySelectorAll('style').forEach((st) => st.textContent.includes('/*measure*/') && st.remove()))
    const res = await page.evaluate(async ({ b64, items }) => {
      const img = new Image()
      img.src = 'data:image/png;base64,' + b64
      await img.decode()
      const cv = document.createElement('canvas')
      cv.width = img.width
      cv.height = img.height
      const g = cv.getContext('2d')
      g.drawImage(img, 0, 0)
      const lin = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      const lum = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b)
      return items.map((it) => {
        const x = Math.max(0, Math.floor(it.x)), y = Math.max(0, Math.floor(it.y))
        const w = Math.min(cv.width - x, Math.ceil(it.w)), h = Math.min(cv.height - y, Math.ceil(it.h))
        if (w <= 0 || h <= 0) return null
        const d = g.getImageData(x, y, w, h).data
        const Ls = []
        const px = []
        for (let i = 0; i < d.length; i += 4) { Ls.push(lum(d[i], d[i + 1], d[i + 2])); px.push(i) }
        const order = Ls.map((l, i) => i).sort((a, b) => Ls[a] - Ls[b])
        const k = order[Math.floor(order.length * 0.95)]
        const bg = [d[px[k]], d[px[k] + 1], d[px[k] + 2]]
        const fg = it.c.map((c, i) => c * it.a + bg[i] * (1 - it.a))
        const L1 = lum(...fg), L2 = lum(...bg)
        return { id: it.id, size: it.size, ratio: (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05) }
      }).filter(Boolean)
    }, { b64: shot.toString('base64'), items })
    for (const r of res) {
      const key = `${s.name} ${r.id}`
      if (!worst[key] || r.ratio < worst[key].ratio) worst[key] = { ...r, p: +p.toFixed(2) }
    }
  }
  await page.close()
}
await browser.close()
const list = Object.entries(worst).sort((a, b) => a[1].ratio - b[1].ratio)
for (const [k, v] of list.slice(0, 25)) console.log(v.ratio.toFixed(2).padStart(6), `p=${v.p}`, `${v.size}px`, k)
console.log('elements below 4.5:', list.filter(([, v]) => v.ratio < 4.5).length, 'of', list.length)
