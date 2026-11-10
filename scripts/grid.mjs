import { chromium } from 'playwright'
import { readFileSync, readdirSync } from 'node:fs'
const [dir, out, ...names] = process.argv.slice(2)
const imgs = names.map((f) => `<figure><img src="data:image/png;base64,${readFileSync(`${dir}/${f}`).toString('base64')}"><figcaption>${f}</figcaption></figure>`).join('')
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1800, height: 900 } })
await p.setContent(`<style>body{margin:0;display:flex;gap:8px;align-items:flex-start;font:12px sans-serif}figure{margin:0}img{height:560px;display:block}</style>${imgs}`)
await p.screenshot({ path: out, fullPage: true })
await b.close()
