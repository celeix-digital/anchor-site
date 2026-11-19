// node scripts/strip.mjs <dir> <prefix> <out.png>  — tiles screenshots side by side
import { chromium } from 'playwright'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
const [dir, prefix, out] = process.argv.slice(2)
const order = ['0', '0_03', '0_25', '0_5', '0_75', '0_95', '1']
const files = order.map((o) => `${prefix}-p${o}.png`).filter((f) => readdirSync(dir).includes(f))
const imgs = files.map((f) => `<figure><img src="data:image/png;base64,${readFileSync(join(dir, f)).toString('base64')}"><figcaption>${f}</figcaption></figure>`).join('')
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1600, height: 900 } })
await p.setContent(`<style>body{margin:0;display:flex;gap:8px;background:#fff;font:12px sans-serif}figure{margin:0}img{height:820px;display:block}</style>${imgs}`)
await p.screenshot({ path: resolve(out), fullPage: true })
await b.close()
