// Renders public/og.png (1200×630) from the live hero. Usage: node scripts/og.mjs [url]
import { chromium } from 'playwright'
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await p.goto(process.argv[2] || 'http://localhost:5199/', { waitUntil: 'networkidle' })
await p.addStyleTag({ content: '.nav-links,.hero .actions{display:none!important} .hero{padding-top:40px!important} .hero-figure{margin-top:36px!important}' })
await p.waitForTimeout(2500)
await p.screenshot({ path: 'public/og.png' })
await b.close()
