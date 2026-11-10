// Per-frame JS cost of the scene at several scroll points. Usage: node scripts/perf.mjs [url]
import { chromium } from 'playwright'
const url = (process.argv[2] || 'http://localhost:5199/') + '?debug'
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] })
for (const vp of [{ w: 1440, h: 900, d: 2 }, { w: 390, h: 844, d: 3 }]) {
  const p = await b.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.d })
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1500)
  const gl = await p.evaluate(() => { const g = document.createElement('canvas').getContext('webgl'); const e = g && g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'none' })
  const rows = []
  for (const pp of [0, 0.15, 0.5, 0.95, 1]) {
    await p.evaluate((pp) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * pp), pp)
    await p.waitForTimeout(2500)
    rows.push(await p.evaluate((pp) => ({ p: pp, ...window.__scene, renderMs: +window.__scene.renderMs.toFixed(2) }), pp))
  }
  console.log(`${vp.w}x${vp.h}@${vp.d}x  renderer: ${gl}`)
  for (const r of rows) console.log('  ', JSON.stringify(r))
  await p.close()
}
await b.close()
