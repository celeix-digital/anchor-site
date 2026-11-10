import { lerp, makeCanvas, mixRGB, rgba } from './util'

/*
 * Classic stock anchor, drawn procedurally in "anchor units" (u). Origin is the
 * centre of the ring, +y points down the shank. Overall extent:
 *   x: -0.35u … 0.35u (fluke barbs / stock balls), y: -0.095u … 0.96u (ring top … crown).
 */
export const ANCHOR = {
  ringR: 0.068,
  ringW: 0.024,
  stockY: 0.15,
  crownY: 0.905,
  crownBottom: 0.958,
  halfWidth: 0.355,
  top: -0.095,
  /** depth along the shank where the waterline sits at the end */
  waterline: 0.36,
}

export type Palette = {
  dark: number[]
  mid: number[]
  light: number[]
  rim: number[]
  rimA: number
}

const COOL_LO: Palette = { dark: [8, 16, 24], mid: [30, 46, 58], light: [70, 96, 112], rim: [120, 190, 220], rimA: 0.18 }
const COOL_HI: Palette = { dark: [26, 42, 54], mid: [78, 104, 120], light: [158, 188, 204], rim: [200, 240, 255], rimA: 0.42 }
const WARM: Palette = { dark: [52, 36, 34], mid: [128, 88, 70], light: [246, 196, 146], rim: [255, 220, 170], rimA: 0.6 }

export function coolPalette(k: number): Palette {
  return {
    dark: mixRGB(COOL_LO.dark, COOL_HI.dark, k),
    mid: mixRGB(COOL_LO.mid, COOL_HI.mid, k),
    light: mixRGB(COOL_LO.light, COOL_HI.light, k),
    rim: mixRGB(COOL_LO.rim, COOL_HI.rim, k),
    rimA: lerp(COOL_LO.rimA, COOL_HI.rimA, k),
  }
}
export const warmPalette = () => WARM

const c = (rgb: number[], a = 1) => rgba(rgb[0], rgb[1], rgb[2], a)

/** Arm polygon around the quadratic C→Q→E, tapering from w0 to w1. */
function armPath(ctx: CanvasRenderingContext2D, side: 1 | -1) {
  const C = [0, 0.89]
  const Q = [0.27 * side, 0.94]
  const E = [0.268 * side, 0.655]
  const N = 14
  const left: number[] = []
  const right: number[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const mt = 1 - t
    const x = mt * mt * C[0] + 2 * mt * t * Q[0] + t * t * E[0]
    const y = mt * mt * C[1] + 2 * mt * t * Q[1] + t * t * E[1]
    const dx = 2 * mt * (Q[0] - C[0]) + 2 * t * (E[0] - Q[0])
    const dy = 2 * mt * (Q[1] - C[1]) + 2 * t * (E[1] - Q[1])
    const l = Math.hypot(dx, dy) || 1
    const w = lerp(0.034, 0.019, t)
    const nx = -dy / l
    const ny = dx / l
    left.push(x + nx * w, y + ny * w)
    right.push(x - nx * w, y - ny * w)
  }
  ctx.moveTo(left[0], left[1])
  for (let i = 2; i < left.length; i += 2) ctx.lineTo(left[i], left[i + 1])
  for (let i = right.length - 2; i >= 0; i -= 2) ctx.lineTo(right[i], right[i + 1])
  ctx.closePath()
}

/** Arrowhead fluke at the end of an arm. */
function flukePath(ctx: CanvasRenderingContext2D, side: 1 | -1) {
  const s = side
  ctx.moveTo(0.27 * s, 0.54) // bill (tip)
  ctx.quadraticCurveTo(0.33 * s, 0.6, 0.355 * s, 0.694) // outer edge to barb
  ctx.quadraticCurveTo(0.31 * s, 0.672, 0.27 * s, 0.645) // outer barb back to notch
  ctx.quadraticCurveTo(0.225 * s, 0.668, 0.18 * s, 0.69) // notch to inner barb
  ctx.quadraticCurveTo(0.212 * s, 0.6, 0.27 * s, 0.54)
  ctx.closePath()
}

/**
 * Render the upright anchor into a sprite. Returns the canvas plus the pixel
 * position of the ring centre inside it.
 */
export function renderAnchorSprite(unitPx: number, dpr: number, pal: Palette, target?: HTMLCanvasElement) {
  const pad = 0.06
  const wU = ANCHOR.halfWidth * 2 + pad * 2
  const hU = ANCHOR.crownBottom - ANCHOR.top + pad * 2
  const s = unitPx * dpr
  const cv = target ?? makeCanvas(wU * s, hU * s)
  if (target) {
    target.width = Math.ceil(wU * s)
    target.height = Math.ceil(hU * s)
  }
  const ox = (ANCHOR.halfWidth + pad) * s
  const oy = (-ANCHOR.top + pad) * s
  const ctx = cv.getContext('2d')!
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, cv.width, cv.height)
  ctx.setTransform(s, 0, 0, s, ox, oy)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  // Cylindrical shading across x.
  const across = (x0: number, x1: number) => {
    const g = ctx.createLinearGradient(x0, 0, x1, 0)
    g.addColorStop(0, c(pal.dark))
    g.addColorStop(0.32, c(pal.light))
    g.addColorStop(0.55, c(pal.mid))
    g.addColorStop(1, c(pal.dark))
    return g
  }
  const down = (y0: number, y1: number) => {
    const g = ctx.createLinearGradient(0, y0, 0, y1)
    g.addColorStop(0, c(pal.light))
    g.addColorStop(0.45, c(pal.mid))
    g.addColorStop(1, c(pal.dark))
    return g
  }
  const outline = c(pal.dark, 0.9)

  // Arms (behind the shank)
  for (const side of [-1, 1] as const) {
    ctx.beginPath()
    armPath(ctx, side)
    const g = ctx.createLinearGradient(0, 0.62, 0, 0.95)
    g.addColorStop(0, c(pal.light))
    g.addColorStop(0.5, c(pal.mid))
    g.addColorStop(1, c(pal.dark))
    ctx.fillStyle = g
    ctx.fill()
    ctx.lineWidth = 0.006
    ctx.strokeStyle = outline
    ctx.stroke()
  }
  // Flukes
  for (const side of [-1, 1] as const) {
    ctx.beginPath()
    flukePath(ctx, side)
    const g = ctx.createLinearGradient(0.18 * side, 0.54, 0.36 * side, 0.7)
    g.addColorStop(0, c(pal.light))
    g.addColorStop(0.5, c(pal.mid))
    g.addColorStop(1, c(pal.dark))
    ctx.fillStyle = g
    ctx.fill()
    ctx.lineWidth = 0.006
    ctx.strokeStyle = outline
    ctx.stroke()
    // ridge down the fluke
    ctx.beginPath()
    ctx.moveTo(0.27 * side, 0.555)
    ctx.lineTo(0.27 * side, 0.64)
    ctx.lineWidth = 0.006
    ctx.strokeStyle = c(pal.light, 0.5)
    ctx.stroke()
  }

  // Shank: tapered, eye at the top
  ctx.beginPath()
  ctx.moveTo(-0.021, 0.06)
  ctx.lineTo(0.021, 0.06)
  ctx.lineTo(0.034, 0.88)
  ctx.lineTo(-0.034, 0.88)
  ctx.closePath()
  ctx.fillStyle = across(-0.034, 0.034)
  ctx.fill()
  ctx.lineWidth = 0.005
  ctx.strokeStyle = outline
  ctx.stroke()

  // Crown
  ctx.beginPath()
  ctx.arc(0, ANCHOR.crownY, 0.053, 0, Math.PI * 2)
  const cg = ctx.createRadialGradient(-0.018, ANCHOR.crownY - 0.022, 0.005, 0, ANCHOR.crownY, 0.058)
  cg.addColorStop(0, c(pal.light))
  cg.addColorStop(0.6, c(pal.mid))
  cg.addColorStop(1, c(pal.dark))
  ctx.fillStyle = cg
  ctx.fill()
  ctx.lineWidth = 0.005
  ctx.strokeStyle = outline
  ctx.stroke()

  // Eye
  ctx.beginPath()
  ctx.arc(0, 0.052, 0.03, 0, Math.PI * 2)
  ctx.lineWidth = 0.02
  ctx.strokeStyle = c(pal.mid)
  ctx.stroke()

  // Stock: tapered bar with ball ends
  ctx.beginPath()
  ctx.moveTo(-0.3, ANCHOR.stockY - 0.012)
  ctx.quadraticCurveTo(0, ANCHOR.stockY - 0.022, 0.3, ANCHOR.stockY - 0.012)
  ctx.lineTo(0.3, ANCHOR.stockY + 0.012)
  ctx.quadraticCurveTo(0, ANCHOR.stockY + 0.022, -0.3, ANCHOR.stockY + 0.012)
  ctx.closePath()
  ctx.fillStyle = down(ANCHOR.stockY - 0.02, ANCHOR.stockY + 0.02)
  ctx.fill()
  ctx.lineWidth = 0.005
  ctx.strokeStyle = outline
  ctx.stroke()
  for (const side of [-1, 1]) {
    ctx.beginPath()
    ctx.arc(0.318 * side, ANCHOR.stockY, 0.029, 0, Math.PI * 2)
    const bg = ctx.createRadialGradient(0.31 * side, ANCHOR.stockY - 0.012, 0.003, 0.318 * side, ANCHOR.stockY, 0.032)
    bg.addColorStop(0, c(pal.light))
    bg.addColorStop(0.65, c(pal.mid))
    bg.addColorStop(1, c(pal.dark))
    ctx.fillStyle = bg
    ctx.fill()
    ctx.strokeStyle = outline
    ctx.stroke()
  }
  // Collar where the stock passes the shank
  ctx.beginPath()
  ctx.roundRect(-0.046, ANCHOR.stockY - 0.03, 0.092, 0.06, 0.012)
  ctx.fillStyle = across(-0.046, 0.046)
  ctx.fill()
  ctx.strokeStyle = outline
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-0.046, ANCHOR.stockY - 0.012)
  ctx.lineTo(0.046, ANCHOR.stockY - 0.012)
  ctx.moveTo(-0.046, ANCHOR.stockY + 0.012)
  ctx.lineTo(0.046, ANCHOR.stockY + 0.012)
  ctx.lineWidth = 0.004
  ctx.strokeStyle = c(pal.dark, 0.7)
  ctx.stroke()

  // Ring
  ctx.beginPath()
  ctx.arc(0, 0, ANCHOR.ringR, 0, Math.PI * 2)
  ctx.lineWidth = ANCHOR.ringW
  ctx.strokeStyle = c(pal.dark)
  ctx.stroke()
  ctx.lineWidth = ANCHOR.ringW * 0.55
  const rg = ctx.createLinearGradient(-ANCHOR.ringR, -ANCHOR.ringR, ANCHOR.ringR, ANCHOR.ringR)
  rg.addColorStop(0, c(pal.light))
  rg.addColorStop(1, c(pal.mid))
  ctx.strokeStyle = rg
  ctx.stroke()

  // Rim light from above: brighten upper edges.
  ctx.globalCompositeOperation = 'source-atop'
  ctx.lineWidth = 0.01
  ctx.strokeStyle = c(pal.rim, pal.rimA)
  ctx.beginPath()
  ctx.arc(0, 0, ANCHOR.ringR + ANCHOR.ringW * 0.35, Math.PI * 1.08, Math.PI * 1.92)
  ctx.moveTo(-0.3, ANCHOR.stockY - 0.016)
  ctx.quadraticCurveTo(0, ANCHOR.stockY - 0.026, 0.3, ANCHOR.stockY - 0.016)
  ctx.moveTo(-0.024, 0.08)
  ctx.lineTo(-0.036, 0.86)
  ctx.moveTo(0.25, 0.555)
  ctx.quadraticCurveTo(0.21, 0.6, 0.19, 0.675)
  ctx.moveTo(-0.29, 0.555)
  ctx.quadraticCurveTo(-0.33, 0.6, -0.35, 0.68)
  ctx.stroke()
  const top = ctx.createLinearGradient(0, ANCHOR.top, 0, ANCHOR.crownBottom)
  top.addColorStop(0, c(pal.rim, pal.rimA * 0.5))
  top.addColorStop(0.35, c(pal.rim, 0))
  ctx.fillStyle = top
  ctx.fillRect(-0.5, ANCHOR.top, 1, 1.2)
  ctx.globalCompositeOperation = 'source-over'

  return { canvas: cv, ox: ox / dpr, oy: oy / dpr }
}

/* ---------------- Chain ---------------- */

const SAMPLES = 64
const lutX = new Float32Array(SAMPLES + 1)
const lutY = new Float32Array(SAMPLES + 1)
const lutL = new Float32Array(SAMPLES + 1)

export type ChainStyle = {
  link: number // link length in px
  sandY: number // links can't sink below this
  waterY: (x: number) => number // links above this are drawn warm; return -Infinity for none
  cool: Palette
  warm: Palette
}

/**
 * Lays alternating face-on and edge-on links along the cubic Bézier P0..P3,
 * starting at P0 (the anchor ring) and walking towards P3 (off-screen).
 */
export function drawChain(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number, x1: number, y1: number,
  x2: number, y2: number, x3: number, y3: number,
  st: ChainStyle,
  viewH: number,
) {
  // Arc-length table
  let total = 0
  let px = x0
  let py = y0
  lutX[0] = x0
  lutY[0] = y0
  lutL[0] = 0
  for (let i = 1; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    const mt = 1 - t
    const a = mt * mt * mt
    const b = 3 * mt * mt * t
    const cc = 3 * mt * t * t
    const d = t * t * t
    let x = a * x0 + b * x1 + cc * x2 + d * x3
    let y = a * y0 + b * y1 + cc * y2 + d * y3
    if (y > st.sandY) y = st.sandY
    total += Math.hypot(x - px, y - py)
    lutX[i] = x
    lutY[i] = y
    lutL[i] = total
    px = x
    py = y
  }

  const L = st.link
  const pitch = L * 0.66
  const faceRx = L * 0.5
  const faceRy = L * 0.3
  const faceW = L * 0.15
  const edgeW = L * 0.27

  // Two passes: dark body, then a highlight. Cool and warm batches each.
  for (let pass = 0; pass < 2; pass++) {
    for (let warm = 0; warm < 2; warm++) {
      const pal = warm ? st.warm : st.cool
      const faceCol = pass === 0 ? c(pal.dark) : c(pal.light, 0.85)
      const edgeCol = c(pal.dark)
      // face-on links (stroked ellipses)
      ctx.beginPath()
      let seg = 1
      let n = 0
      let any = false
      for (let s = pitch * 0.4; s < total; s += pitch, n++) {
        while (seg < SAMPLES && lutL[seg] < s) seg++
        const l0 = lutL[seg - 1]
        const k = (s - l0) / (lutL[seg] - l0 || 1)
        const x = lutX[seg - 1] + (lutX[seg] - lutX[seg - 1]) * k
        const y = lutY[seg - 1] + (lutY[seg] - lutY[seg - 1]) * k
        if (y < -L * 2 || y > viewH + L * 2) continue
        if ((n & 1) !== 0) continue
        const isWarm = y < st.waterY(x)
        if (isWarm !== (warm === 1)) continue
        const ang = Math.atan2(lutY[seg] - lutY[seg - 1], lutX[seg] - lutX[seg - 1])
        const ca = Math.cos(ang)
        const sa = Math.sin(ang)
        ctx.moveTo(x + faceRx * ca, y + faceRx * sa)
        ctx.ellipse(x, y, faceRx, faceRy, ang, 0, Math.PI * 2)
        any = true
      }
      if (any) {
        ctx.lineWidth = pass === 0 ? faceW : faceW * 0.42
        ctx.strokeStyle = faceCol
        ctx.stroke()
      }
      // edge-on links (round-capped bars)
      ctx.beginPath()
      seg = 1
      n = 0
      any = false
      for (let s = pitch * 0.4; s < total; s += pitch, n++) {
        while (seg < SAMPLES && lutL[seg] < s) seg++
        if ((n & 1) === 0) continue
        const l0 = lutL[seg - 1]
        const k = (s - l0) / (lutL[seg] - l0 || 1)
        const x = lutX[seg - 1] + (lutX[seg] - lutX[seg - 1]) * k
        const y = lutY[seg - 1] + (lutY[seg] - lutY[seg - 1]) * k
        if (y < -L * 2 || y > viewH + L * 2) continue
        const isWarm = y < st.waterY(x)
        if (isWarm !== (warm === 1)) continue
        const ang = Math.atan2(lutY[seg] - lutY[seg - 1], lutX[seg] - lutX[seg - 1])
        const hx = Math.cos(ang) * (faceRx - edgeW * 0.5)
        const hy = Math.sin(ang) * (faceRx - edgeW * 0.5)
        if (pass === 0) {
          ctx.moveTo(x - hx, y - hy)
          ctx.lineTo(x + hx, y + hy)
        } else {
          // highlight runs along one side of the bar
          const ox = -Math.sin(ang) * edgeW * 0.18
          const oy = Math.cos(ang) * edgeW * 0.18
          ctx.moveTo(x - hx * 0.8 - ox, y - hy * 0.8 - oy)
          ctx.lineTo(x + hx * 0.8 - ox, y + hy * 0.8 - oy)
        }
        any = true
      }
      if (any) {
        ctx.lineCap = 'round'
        ctx.lineWidth = pass === 0 ? edgeW : edgeW * 0.42
        ctx.strokeStyle = pass === 0 ? edgeCol : c(pal.light, 0.8)
        ctx.stroke()
      }
    }
  }
}
