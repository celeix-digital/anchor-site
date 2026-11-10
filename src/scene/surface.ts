import { makeCanvas, mixRGB, rgba, rng } from './util'

export type Sky = {
  canvas: HTMLCanvasElement
  h: number
  horizon: number
  lights: { x: number; y: number; phase: number }[]
  sunX: number
}

const HAZE = [178, 150, 168]
const SILHOUETTE = [44, 42, 72]

/** Pre-render the dawn sky, distant port skyline and the sea surface out to the horizon. */
export function buildSky(W: number, H: number, dpr: number, mobile: boolean, cx: number): Sky {
  const r = rng(1939)
  const h = Math.round(H * (mobile ? 0.3 : 0.37))
  const horizon = Math.round(h - H * (mobile ? 0.05 : 0.07))
  const cv = makeCanvas(W * dpr, h * dpr)
  const g = cv.getContext('2d')!
  g.scale(dpr, dpr)

  // Sky
  const sky = g.createLinearGradient(0, 0, 0, horizon)
  sky.addColorStop(0, '#14294a')
  sky.addColorStop(0.35, '#3d4a74')
  sky.addColorStop(0.62, '#8a6f8e')
  sky.addColorStop(0.84, '#d99482')
  sky.addColorStop(1, '#f5c48e')
  g.fillStyle = sky
  g.fillRect(0, 0, W, horizon + 1)

  // Sun, low and off to the side of the anchor
  const sunX = mobile ? W * 0.3 : cx + Math.min(W * 0.22, 380)
  const sunY = horizon - H * 0.012
  const sunR = H * 0.03
  const glow = g.createRadialGradient(sunX, sunY, 0, sunX, sunY, H * 0.32)
  glow.addColorStop(0, 'rgba(255,214,150,0.75)')
  glow.addColorStop(0.15, 'rgba(255,180,120,0.35)')
  glow.addColorStop(1, 'rgba(255,170,120,0)')
  g.fillStyle = glow
  g.fillRect(0, 0, W, horizon)
  g.fillStyle = '#fff1d2'
  g.beginPath()
  g.arc(sunX, sunY, sunR, 0, Math.PI * 2)
  g.fill()

  // Thin clouds lit from below
  for (let i = 0; i < (mobile ? 4 : 8); i++) {
    const x = r() * W
    const y = horizon * (0.25 + r() * 0.5)
    const w = W * (0.08 + r() * 0.16)
    const hh = H * (0.004 + r() * 0.006)
    const cg = g.createLinearGradient(0, y - hh, 0, y + hh)
    cg.addColorStop(0, 'rgba(120,96,130,0.35)')
    cg.addColorStop(1, 'rgba(255,170,140,0.45)')
    g.fillStyle = cg
    g.beginPath()
    g.ellipse(x, y, w, hh, 0, 0, Math.PI * 2)
    g.fill()
  }

  // Sea surface out to the horizon, with glitter under the sun
  const sea = g.createLinearGradient(0, horizon, 0, h)
  sea.addColorStop(0, '#d9a688')
  sea.addColorStop(0.25, '#7d7f98')
  sea.addColorStop(1, '#2c5674')
  g.fillStyle = sea
  g.fillRect(0, horizon, W, h - horizon)
  for (let i = 0; i < 70; i++) {
    const d = r()
    const y = horizon + 2 + d * d * (h - horizon - 4)
    const spread = 6 + d * W * 0.07
    const x = sunX + (r() - 0.5) * spread * 2
    const len = 2 + d * 18 * r()
    g.fillStyle = `rgba(255,226,180,${(0.65 - d * 0.5).toFixed(2)})`
    g.fillRect(x - len / 2, y, len, Math.max(1, d * 2))
  }

  /* ---- Port skyline ---- */
  const s = Math.min(H * (mobile ? 0.085 : 0.11), W * 0.13) // crane height
  const col = (rgb: number[], haze = 0.45) => {
    const m = mixRGB(rgb, HAZE, haze)
    return rgba(m[0], m[1], m[2], 1)
  }
  const sil = col(SILHOUETTE, 0.35)
  const quayY = horizon

  // Quay
  g.fillStyle = col([36, 36, 60], 0.4)
  g.fillRect(0, quayY - s * 0.04, W, s * 0.05)

  // Container stacks
  const boxCols = [
    [140, 74, 60], [62, 106, 122], [176, 138, 78], [90, 96, 122], [122, 62, 78], [70, 120, 96],
  ]
  const stackRow = (x0: number, x1: number) => {
    const bw = s * 0.13
    const bh = s * 0.055
    for (let x = x0; x < x1; x += bw + 1) {
      const n = 1 + Math.floor(r() * 4)
      for (let k = 0; k < n; k++) {
        g.fillStyle = col(boxCols[Math.floor(r() * boxCols.length)], 0.5)
        g.fillRect(x, quayY - s * 0.04 - (k + 1) * (bh + 0.6), bw, bh)
      }
    }
  }

  // Ship at berth
  const shipL = Math.min(W * (mobile ? 0.48 : 0.3), s * 4.6)
  const shipX = mobile ? W * 0.04 : Math.max(W * 0.06, cx - W * 0.38)
  const hullH = s * 0.15
  const hullY = quayY + s * 0.01
  g.fillStyle = sil
  g.beginPath()
  g.moveTo(shipX, hullY - hullH * 0.9)
  g.lineTo(shipX + shipL * 0.96, hullY - hullH * 1.05)
  g.lineTo(shipX + shipL, hullY - hullH * 1.25) // raised bow
  g.lineTo(shipX + shipL * 0.95, hullY)
  g.lineTo(shipX + shipL * 0.03, hullY)
  g.closePath()
  g.fill()
  g.fillStyle = col([120, 54, 50], 0.45)
  g.fillRect(shipX + shipL * 0.02, hullY - hullH * 0.28, shipL * 0.93, hullH * 0.18)
  // accommodation block at the stern
  g.fillStyle = col([214, 210, 214], 0.35)
  g.fillRect(shipX + shipL * 0.04, hullY - hullH - s * 0.3, shipL * 0.08, s * 0.3)
  g.fillRect(shipX + shipL * 0.02, hullY - hullH - s * 0.3, shipL * 0.12, s * 0.03)
  g.fillStyle = sil
  g.fillRect(shipX + shipL * 0.065, hullY - hullH - s * 0.4, shipL * 0.025, s * 0.1)
  // deck containers
  {
    const bw = shipL * 0.04
    const bh = s * 0.05
    for (let x = shipX + shipL * 0.16; x < shipX + shipL * 0.9; x += bw + 0.8) {
      const n = 1 + Math.floor(r() * 3)
      for (let k = 0; k < n; k++) {
        g.fillStyle = col(boxCols[Math.floor(r() * boxCols.length)], 0.45)
        g.fillRect(x, hullY - hullH * 0.95 - (k + 1) * (bh + 0.5), bw, bh)
      }
    }
  }

  // Ship-to-shore cranes, booms reaching out over the ship
  const lights: Sky['lights'] = []
  const crane = (x0: number, boomL: number) => {
    const legW = s * 0.36
    const legH = s * 0.56
    const girderY = quayY - s * 0.64
    const apexX = x0 + legW * 0.55
    g.strokeStyle = sil
    g.fillStyle = sil
    g.lineCap = 'butt'
    g.lineWidth = Math.max(1.2, s * 0.022)
    g.beginPath()
    // legs and portal
    g.moveTo(x0, quayY - s * 0.04)
    g.lineTo(x0, girderY)
    g.moveTo(x0 + legW, quayY - s * 0.04)
    g.lineTo(x0 + legW, girderY)
    g.moveTo(x0, quayY - legH * 0.55)
    g.lineTo(x0 + legW, quayY - legH * 0.55)
    g.moveTo(x0, quayY - legH * 0.55)
    g.lineTo(x0 + legW, girderY)
    g.stroke()
    // girder / boom
    g.lineWidth = Math.max(1.6, s * 0.035)
    g.beginPath()
    g.moveTo(x0 - boomL, girderY)
    g.lineTo(x0 + legW + s * 0.45, girderY)
    g.stroke()
    // A-frame and stays
    g.lineWidth = Math.max(1, s * 0.016)
    g.beginPath()
    g.moveTo(x0 + legW * 0.15, girderY)
    g.lineTo(apexX, quayY - s)
    g.lineTo(x0 + legW * 0.95, girderY)
    g.moveTo(apexX, quayY - s)
    g.lineTo(x0 - boomL * 0.92, girderY)
    g.moveTo(apexX, quayY - s)
    g.lineTo(x0 + legW + s * 0.42, girderY)
    g.stroke()
    // machinery house
    g.fillRect(x0 + legW * 0.6, girderY - s * 0.07, s * 0.24, s * 0.07)
    // trolley and spreader hanging over the ship
    g.fillRect(x0 - boomL * 0.55, girderY, s * 0.06, s * 0.03)
    g.lineWidth = 0.8
    g.beginPath()
    g.moveTo(x0 - boomL * 0.55 + s * 0.03, girderY + s * 0.03)
    g.lineTo(x0 - boomL * 0.55 + s * 0.03, girderY + s * 0.3)
    g.stroke()
    lights.push({ x: apexX, y: quayY - s - 1.5, phase: r() * 6.28 })
    lights.push({ x: x0 - boomL, y: girderY - 1, phase: r() * 6.28 })
  }
  const craneCount = mobile ? 2 : 4
  const cranesStart = shipX + shipL * 0.32
  const gap = mobile ? s * 0.95 : Math.min(s * 1.05, (shipL * 0.8) / craneCount + s * 0.3)
  for (let i = 0; i < craneCount; i++) crane(cranesStart + i * gap, s * (0.62 + r() * 0.12))
  // Yard stacks behind and beyond
  stackRow(cranesStart + craneCount * gap + s * 0.2, cranesStart + craneCount * gap + s * (mobile ? 1.2 : 2.4))
  if (!mobile) stackRow(W * 0.62 + (cx - W / 2), W * 0.62 + (cx - W / 2) + s * 1.6)
  // A low distant shoreline to tie it together
  g.fillStyle = col([50, 50, 80], 0.6)
  g.beginPath()
  g.moveTo(0, quayY - s * 0.03)
  for (let x = 0; x <= W; x += 20) g.lineTo(x, quayY - s * (0.05 + 0.04 * Math.sin(x * 0.013) + 0.02 * Math.sin(x * 0.051)))
  g.lineTo(W, quayY)
  g.lineTo(0, quayY)
  g.closePath()
  g.globalCompositeOperation = 'destination-over'
  g.fill()
  g.globalCompositeOperation = 'source-over'

  // Atmospheric haze sitting on the horizon
  const hz = g.createLinearGradient(0, horizon - s * 1.2, 0, horizon + 2)
  hz.addColorStop(0, 'rgba(245,190,150,0)')
  hz.addColorStop(1, 'rgba(245,190,150,0.28)')
  g.fillStyle = hz
  g.fillRect(0, horizon - s * 1.2, W, s * 1.2 + 2)

  return { canvas: cv, h, horizon, lights, sunX }
}

/* ---------------- Waterline ---------------- */

export class Waterline {
  y = -1e6 // mean line, css px; far above the screen when inactive
  t = 0
  amp = 4
  W = 0
  active = false

  at(x: number) {
    if (!this.active) return -Infinity
    return this.y + this.amp * (Math.sin(x * 0.013 + this.t * 1.5) * 0.6 + Math.sin(x * 0.031 - this.t * 1.1 + 1.3) * 0.4)
  }

  /** Path for the region above the wave (sky side). */
  traceAbove(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.moveTo(0, -10)
    ctx.lineTo(this.W, -10)
    for (let x = this.W; x >= -8; x -= 8) ctx.lineTo(x, this.at(x))
    ctx.closePath()
  }

  traceBelow(ctx: CanvasRenderingContext2D, H: number) {
    ctx.beginPath()
    ctx.moveTo(0, H + 10)
    ctx.lineTo(this.W, H + 10)
    for (let x = this.W; x >= -8; x -= 8) ctx.lineTo(x, this.at(x))
    ctx.closePath()
  }
}

export function drawSky(ctx: CanvasRenderingContext2D, sky: Sky, wl: Waterline, H: number, t: number, ambient: boolean) {
  if (!wl.active || wl.y < -wl.amp * 2) return
  ctx.save()
  wl.traceAbove(ctx)
  ctx.clip()
  const top = wl.y + H * 0.02 - sky.h
  ctx.drawImage(sky.canvas, 0, top, wl.W, sky.h)
  // blinking red aircraft-warning lights on the cranes
  for (const l of sky.lights) {
    const on = ambient ? Math.max(0, Math.sin(t * 2.4 + l.phase)) : 0.6
    if (on < 0.05) continue
    const y = top + l.y
    ctx.fillStyle = rgba(255, 70, 60, 0.25 * on)
    ctx.beginPath()
    ctx.arc(l.x, y, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = rgba(255, 110, 90, 0.95 * on)
    ctx.beginPath()
    ctx.arc(l.x, y, 1.6, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** Bright meniscus along the wave and a soft band of light just beneath it. */
export function drawSurfaceBand(ctx: CanvasRenderingContext2D, wl: Waterline, H: number, strength: number) {
  if (!wl.active || strength <= 0.001) return
  ctx.save()
  wl.traceBelow(ctx, H)
  ctx.clip()
  const g = ctx.createLinearGradient(0, wl.y - wl.amp, 0, wl.y + H * 0.06)
  g.addColorStop(0, rgba(190, 236, 244, 0.32 * strength))
  g.addColorStop(1, rgba(190, 236, 244, 0))
  ctx.fillStyle = g
  ctx.fillRect(0, wl.y - wl.amp * 2, wl.W, H * 0.07)
  ctx.restore()
  ctx.beginPath()
  for (let x = -8; x <= wl.W + 8; x += 8) {
    const y = wl.at(x)
    if (x === -8) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.lineWidth = 1.6
  ctx.strokeStyle = rgba(255, 238, 214, 0.75 * strength)
  ctx.stroke()
}

/** Foam ring where the shank pierces the surface. */
export function drawFoam(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, t: number, a: number) {
  if (a <= 0.01) return
  ctx.save()
  ctx.lineCap = 'round'
  // underside ring (seen through the surface) and the bright top lip
  ctx.strokeStyle = rgba(236, 248, 250, 0.55 * a)
  ctx.lineWidth = Math.max(1.5, w * 0.08)
  ctx.beginPath()
  ctx.ellipse(x, y, w * (1 + 0.06 * Math.sin(t * 3)), w * 0.24, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = rgba(250, 252, 252, 0.85 * a)
  for (let i = 0; i < 14; i++) {
    const ang = (i / 14) * Math.PI * 2 + t * 0.4
    const rr = w * (1.05 + 0.18 * Math.sin(t * 2.3 + i * 1.7))
    const s = Math.max(1, w * (0.05 + 0.04 * Math.sin(t * 3.1 + i)))
    ctx.beginPath()
    ctx.arc(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * 0.26, s, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}
