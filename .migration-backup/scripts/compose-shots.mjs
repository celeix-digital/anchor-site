// Builds the full-app product screenshots in public/product/app-*.webp.
//
// Source: QA runs of the ANCHOR app on synthetic data (~/Downloads/Anchor/qa2/screenshots).
// Each screen gets the expanded sidebar (ANCHOR name + labelled nav) from an analytics run,
// and test-only labels ("QA Admin", "QA-D action thread"...) are relabelled in the app's own
// font (Open Sans) so nothing has to be blurred or cropped away.
//
//   node scripts/compose-shots.mjs [outDir]
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const SRC = join(homedir(), 'Downloads/Anchor/qa2/screenshots')
const OUT = process.argv[2] || 'public/product'
mkdirSync(OUT, { recursive: true })
const data = (f) => 'data:image/png;base64,' + readFileSync(join(SRC, f)).toString('base64')

const SIDEBAR = 'fe11/B1AF-01-step1-default-30days.png'
const user = { name: 'Alex Kim', letter: 'A' }

// Text swaps are [x, y, w, h, text, font, colour, opts]; x/y are in the 1440px source.
const screens = [
  {
    name: 'app-dashboard',
    src: 'fe10/A3F-00-houston-badge.png',
    active: 'Dashboard',
    swaps: [
      [100, 98, 400, 44, 'Good morning, Alex', '600 28px', '#1b2230', { base: 128 }],
      [578, 417, 268, 24, 'Alan Petrossian mentioned you', '500 13px', '#1b2230', { base: 433 }],
      [578, 459, 268, 24, 'Chelsea Odum mentioned you', '500 13px', '#1b2230', { base: 475 }],
      [578, 501, 268, 24, 'Yusuf Karim mentioned you', '500 13px', '#1b2230', { base: 517 }],
    ],
    mobile: [262, 66, 700, 680],
  },
  {
    name: 'app-inbox',
    src: 'fe9/00-explore-inbox.png',
    active: 'Inbox',
    swaps: [],
    mobile: [452, 64, 700, 680],
  },
  {
    name: 'app-classify',
    src: 'fe15/DF-07-1-inbox-open-synthetic-banner-confirm-edit.png',
    active: 'Inbox',
    swaps: [
      [306, 195, 322, 23, 'Pilot boarding, MV CORAL MERIDIAN', '600 14px', '#1b2230', { base: 211 }],
      [306, 219, 200, 21, 'Gulf Coast Pilots', '400 14px', '#9aa3b2', { base: 234 }],
      [306, 251, 212, 20, 'Pilot boards at 06:00, please...', '400 12.5px', '#9aa3b2', { base: 265 }],
      [347, 806, 126, 38, null, null, null, { lines: [['Cargo-Documen...', '400 14px', '#9aa3b2', 822], ['212 KB', '400 13px', '#b3bac6', 839]] }],
    ],
    mobile: [806, 64, 700, 680],
  },
  {
    name: 'app-vessel',
    src: 'fe15/DF-02-3-vessel-page.png',
    active: 'Vessels',
    swaps: [
      [598, 845, 420, 24, 'MV CORAL MERIDIAN — outstanding items', '700 15px', '#1b2230', { base: 862 }],
      [598, 874, 300, 22, 'Alan Petrossian', '400 14px', '#5f6b7c', { base: 890 }],
    ],
    mobile: [262, 64, 700, 680],
  },
  {
    name: 'app-reply',
    src: 'fe13/C1F-10-generate-menu.png',
    active: 'Inbox',
    swaps: [
      [331, 135, 132, 18, 'MV BALTIC SENTINEL', '600 12px', '#2b63d9', { base: 148, sample: [330, 137], fit: true }],
      [314, 165, 100, 15, 'HT-26AUG003', '400 11px', '#5f6b7c', { base: 177, sample: [316, 166] }],
      [377, 188, 250, 22, 'ETA and berthing update', '400 14px', '#1b2230', { base: 204 }],
      [306, 212, 200, 22, 'Charterer', '400 14px', '#9aa3b2', { base: 227 }],
      [655, 80, 560, 30, '[Draft] ETA and berthing update', '500 19px', '#1b2230', { base: 101 }],
      [679, 117, 140, 19, 'MV BALTIC SENTINEL', '600 12.5px', '#2b63d9', { base: 131, sample: [816, 120], fit: true }],
      [838, 116, 130, 22, 'HT-26AUG003', '400 14px', '#3b4555', { base: 132, shift: [966, 116, 240, 22] }],
      [684, 499, 120, 22, 'HOUSTON DESK', '700 14px', '#111111', { base: 515 }],
      [347, 802, 126, 38, null, null, null, { lines: [['Cargo-Documen...', '400 14px', '#9aa3b2', 818], ['212 KB', '400 13px', '#b3bac6', 835]] }],
    ],
    mobile: [806, 64, 700, 680],
  },
  {
    name: 'app-thread',
    src: 'fe9/00-explore-thread.png',
    active: 'Inbox',
    swaps: [],
    mobile: [806, 64, 700, 680],
  },
]

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(
  `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=block"><p style="font-family:'Open Sans'">x</p>`,
)
await page.evaluate(async () => {
  for (const w of [400, 500, 600, 700]) await document.fonts.load(`${w} 14px "Open Sans"`)
})

for (const s of screens) {
  const out = await page.evaluate(
    async ({ s, sidebar, shot, user }) => {
      const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src })
      const [sb, im] = await Promise.all([load(sidebar), load(shot)])

      // 1. Fix the source screen: relabel test data, in source coordinates.
      const src = document.createElement('canvas')
      src.width = 1440
      src.height = 900
      const c = src.getContext('2d')
      c.drawImage(im, 0, 0)
      const px = (x, y) => { const d = c.getImageData(x, y, 1, 1).data; return `rgb(${d[0]},${d[1]},${d[2]})` }
      const swaps = [
        // Signed-in user chip, top right.
        [1318, 14, 82, 24, user.name, '700 15px', '#1b2230', { base: 32 }],
        ...s.swaps,
      ]
      for (const [x, y, w, h, text, font, colour, o = {}] of swaps) {
        const bg = o.sample ? px(...o.sample) : px(x, y)
        let shifted = null
        if (o.shift) { const [sx, sy, sw, sh] = o.shift; shifted = c.getImageData(sx, sy, sw, sh) }
        c.fillStyle = bg
        c.fillRect(x, y, w, h)
        if (shifted) c.fillRect(o.shift[0], o.shift[1], o.shift[2], o.shift[3])
        const draw = (t, f, col, base) => {
          c.font = `${f} "Open Sans"`
          c.fillStyle = col
          c.textBaseline = 'alphabetic'
          c.fillText(t, x + 2, base, o.fit ? w - 4 : undefined)
          return c.measureText(t).width
        }
        if (o.lines) for (const [t, f, col, base] of o.lines) draw(t, f, col, base)
        else {
          const tw = draw(text, font, colour, o.base)
          if (shifted) c.putImageData(shifted, Math.round(x + 2 + tw + 6), o.shift[1])
        }
      }
      // Avatar letter.
      c.fillStyle = px(1281, 31)
      c.beginPath(); c.arc(1293.5, 31.5, 11, 0, Math.PI * 2); c.fill()
      c.fillStyle = '#fff'; c.font = '600 15px "Open Sans"'; c.textAlign = 'center'
      c.fillText(user.letter, 1293.5, 37); c.textAlign = 'start'

      // 2. Expanded sidebar from the analytics run, active item moved.
      const W = 252 + 1356
      const cv = document.createElement('canvas')
      cv.width = W
      cv.height = 900
      const g = cv.getContext('2d')
      g.drawImage(sb, 0, 0, 252, 900, 0, 0, 252, 900)
      g.fillStyle = (() => { const d = g.getImageData(120, 600, 1, 1).data; return `rgb(${d[0]},${d[1]},${d[2]})` })()
      g.fillRect(0, 820, 240, 80)
      g.drawImage(sb, 0, 1920, 240, 70, 0, 826, 240, 70) // Logout at the bottom.
      const rows = { Dashboard: 119, Vessels: 165, Inbox: 211, Analytics: 257 }
      const bgc = g.getImageData(120, 600, 1, 1).data
      const hlc = g.getImageData(218, 257, 1, 1).data
      const remap = (cy, from, to, top = 255) => {
        const box = g.getImageData(10, cy - 20, 221, 41)
        const d = box.data
        for (let i = 0; i < d.length; i += 4) {
          for (let k = 0; k < 3; k++) {
            const t = (d[i + k] - from[k]) / (255 - from[k] || 1)
            d[i + k] = Math.round(to[k] + Math.max(0, t) * (top - to[k]))
          }
        }
        return box
      }
      if (s.active !== 'Analytics') {
        // Repaint the Analytics row as idle, then the target row as active (rounded box).
        g.putImageData(remap(rows.Analytics, hlc, bgc, 200), 10, rows.Analytics - 20)
        const on = remap(rows[s.active], bgc, hlc)
        const tmp = document.createElement('canvas'); tmp.width = 221; tmp.height = 41
        tmp.getContext('2d').putImageData(on, 0, 0)
        g.save(); g.beginPath(); g.roundRect(10, rows[s.active] - 20, 220, 40, 8); g.clip()
        g.drawImage(tmp, 10, rows[s.active] - 20); g.restore()
      }
      g.drawImage(src, 84, 0, 1356, 900, 252, 0, 1356, 900)

      // 3. The ANCHOR39 mark (src/components/Logo.tsx) in place of the app's anchor icon.
      const mark = (cx, cy, size, ring) => {
        const k = size / 48
        g.save(); g.translate(cx - size / 2, cy - size / 2); g.scale(k, k)
        g.strokeStyle = ring; g.lineWidth = 1.9
        g.beginPath(); g.arc(24, 24, 17.2, 0, Math.PI * 2); g.stroke()
        g.fillStyle = ring
        for (const [x, y, w, h] of [[22.8, 1.4, 2.4, 5.2], [22.8, 41.4, 2.4, 5.2], [1.4, 22.8, 5.2, 2.4], [41.4, 22.8, 5.2, 2.4]]) { g.beginPath(); g.roundRect(x, y, w, h, 0.6); g.fill() }
        g.strokeStyle = '#38b0b8'; g.lineWidth = 2.1; g.lineJoin = 'round'
        g.beginPath(); g.moveTo(24, 10.2); g.lineTo(36.3, 30.8); g.lineTo(11.7, 30.8); g.closePath(); g.stroke()
        g.fillStyle = '#38b0b8'; g.beginPath(); g.arc(24, 24, 3.1, 0, Math.PI * 2); g.fill()
        g.restore()
      }
      // Bounding box of the pixels in a region that match a test.
      const bbox = (x0, y0, w, h, test) => {
        const d = g.getImageData(x0, y0, w, h).data
        let [l, t, r, b] = [w, h, -1, -1]
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4
          if (test(d[i], d[i + 1], d[i + 2])) { l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y) }
        }
        return r < 0 ? null : { x: x0 + l, y: y0 + t, w: r - l + 1, h: b - t + 1 }
      }
      // Sidebar tile: keep the rounded tile, white instead of blue, with the mark inside.
      const tile = bbox(0, 8, 64, 80, (r, gg, b) => r + gg + b > 330)
      if (tile) {
        g.fillStyle = `rgb(${bgc[0]},${bgc[1]},${bgc[2]})`
        g.fillRect(tile.x - 2, tile.y - 2, tile.w + 4, tile.h + 4)
        g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(tile.x, tile.y, tile.w, tile.h, 7); g.fill()
        mark(tile.x + tile.w / 2, tile.y + tile.h / 2, Math.min(tile.w, tile.h) - 4, '#0b2a4a')
      }
      // Email signature in the reply screen: blue anchor glyph before "A.N.C.H.O.R".
      if (s.name === 'app-reply') {
        const sig = bbox(840, 515, 70, 65, (r, gg, b) => b > 180 && b - r > 90)
        if (sig) {
          const p = g.getImageData(sig.x - 4, sig.y + sig.h / 2, 1, 1).data
          g.fillStyle = `rgb(${p[0]},${p[1]},${p[2]})`
          g.fillRect(sig.x - 1, sig.y - 1, sig.w + 2, sig.h + 2)
          mark(sig.x + sig.w / 2, sig.y + sig.h / 2, Math.max(sig.w, sig.h) + 2, '#0b2a4a')
        }
      }

      const crop = (x, y, w, h) => {
        const k = document.createElement('canvas'); k.width = w; k.height = h
        k.getContext('2d').drawImage(cv, x, y, w, h, 0, 0, w, h)
        return k.toDataURL('image/webp', 0.84)
      }
      return { full: cv.toDataURL('image/webp', 0.84), mobile: crop(...s.mobile), w: W }
    },
    { s, sidebar: data(SIDEBAR), shot: data(s.src), user },
  )
  writeFileSync(join(OUT, `${s.name}.webp`), Buffer.from(out.full.split(',')[1], 'base64'))
  writeFileSync(join(OUT, `${s.name}-m.webp`), Buffer.from(out.mobile.split(',')[1], 'base64'))
  console.log(s.name, out.w + 'x900')
}
await browser.close()
