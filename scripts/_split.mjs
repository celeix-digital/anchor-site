import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
const [src, outPrefix, parts] = process.argv.slice(2)
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1200 } })
const b64 = readFileSync(src).toString('base64')
const n = +parts
for (let i = 0; i < n; i++) {
  await p.setContent(`<style>body{margin:0}div{width:1440px;height:1200px;overflow:hidden;position:relative}img{position:absolute;left:0;width:1440px}</style><div><img id=i src="data:image/png;base64,${b64}"></div>`)
  await p.evaluate(({ i, n }) => { const im = document.getElementById('i'); const h = im.naturalHeight * 1440 / im.naturalWidth; im.style.top = -(h / n) * i + 'px'; document.querySelector('div').style.height = Math.ceil(h / n) + 'px' }, { i, n })
  await p.locator('div').screenshot({ path: `${outPrefix}-${i}.png` })
}
await b.close()
