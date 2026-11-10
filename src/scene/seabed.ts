import { makeCanvas, rng } from './util'

export type Kelp = {
  x: number // screen x
  base: number // y offset relative to the layer's ground line (px)
  h: number
  n: number
  phase: number
  w: number
  color: string
}

export type Seabed = {
  back: HTMLCanvasElement
  backH: number
  backGround: number // ground line inside the back canvas (css px)
  front: HTMLCanvasElement
  frontH: number
  frontTop: number // sand surface inside the front canvas (css px)
  vents: { x: number; y: number }[] // vent mouths, in back-layer coords
  kelpBack: Kelp[]
  kelpFront: Kelp[]
}

/**
 * Pre-render the static seabed layers.
 * @param moundX x of the buried fluke at rest (screen px), unit = anchor unit px
 */
export function buildSeabed(W: number, H: number, dpr: number, mobile: boolean, cx: number, moundX: number, unit: number): Seabed {
  const r = rng(39)
  /* ---------- Back layer: ridges, rocks, coral fans, vents ---------- */
  const backH = Math.round(H * (mobile ? 0.34 : 0.4))
  const backGround = Math.round(backH * 0.86)
  const back = makeCanvas(W * dpr, backH * dpr)
  const b = back.getContext('2d')!
  b.scale(dpr, dpr)

  const ridge = (baseY: number, amp: number, freq: number, col0: string, col1: string, seed: number) => {
    const rr = rng(seed)
    const ph = [rr() * 6, rr() * 6, rr() * 6]
    b.beginPath()
    b.moveTo(0, backH)
    for (let x = 0; x <= W + 8; x += 8) {
      const u = x / W
      const y =
        baseY -
        amp * (0.55 + 0.45 * Math.sin(u * freq * 6.28 + ph[0])) * (0.6 + 0.4 * Math.sin(u * freq * 2.3 * 6.28 + ph[1])) -
        amp * 0.15 * Math.sin(u * 23 + ph[2])
      b.lineTo(x, y)
    }
    b.lineTo(W, backH)
    b.closePath()
    const g = b.createLinearGradient(0, baseY - amp, 0, backH)
    g.addColorStop(0, col0)
    g.addColorStop(1, col1)
    b.fillStyle = g
    b.fill()
  }
  ridge(backGround - backH * 0.22, backH * 0.32, 1.3, 'rgba(14,46,72,0.55)', 'rgba(6,22,36,0.9)', 7)
  ridge(backGround - backH * 0.02, backH * 0.2, 2.1, 'rgba(10,32,50,0.9)', 'rgba(4,14,24,1)', 11)

  // Vents: tapered chimneys, kept away from the anchor
  const ventXs = mobile ? [W * 0.16, W * 0.5] : [Math.min(cx - W * 0.3, W * 0.2), Math.max(cx + W * 0.28, W * 0.8)]
  const vents: { x: number; y: number }[] = []
  for (const [i, vx] of ventXs.entries()) {
    const vh = backH * (i === 0 ? 0.26 : 0.19)
    const vw = vh * 0.42
    const top = backGround - vh
    b.beginPath()
    b.moveTo(vx - vw, backGround + 4)
    b.quadraticCurveTo(vx - vw * 0.5, top + vh * 0.4, vx - vw * 0.18, top)
    b.lineTo(vx + vw * 0.18, top)
    b.quadraticCurveTo(vx + vw * 0.55, top + vh * 0.45, vx + vw, backGround + 4)
    b.closePath()
    const g = b.createLinearGradient(vx - vw, 0, vx + vw, 0)
    g.addColorStop(0, '#0a1c2a')
    g.addColorStop(0.4, '#1b3446')
    g.addColorStop(1, '#07141f')
    b.fillStyle = g
    b.fill()
    // knobbly ledges
    b.fillStyle = 'rgba(30,58,74,0.7)'
    for (let k = 0; k < 4; k++) {
      const yy = top + vh * (0.25 + k * 0.18)
      const ww = vw * (0.35 + k * 0.15)
      b.beginPath()
      b.ellipse(vx + (r() - 0.5) * ww * 0.4, yy, ww * 0.5, vh * 0.025, 0, 0, Math.PI * 2)
      b.fill()
    }
    // warm mouth
    const mg = b.createRadialGradient(vx, top + 2, 0, vx, top + 2, vw * 0.6)
    mg.addColorStop(0, 'rgba(120,180,190,0.35)')
    mg.addColorStop(1, 'rgba(120,180,190,0)')
    b.fillStyle = mg
    b.fillRect(vx - vw, top - vw, vw * 2, vw * 2)
    vents.push({ x: vx, y: top })
  }

  // Coral fans
  const fan = (fx: number, fy: number, size: number, col: string) => {
    b.strokeStyle = col
    b.lineCap = 'round'
    const branch = (x: number, y: number, ang: number, len: number, w: number, depth: number) => {
      const x2 = x + Math.cos(ang) * len
      const y2 = y + Math.sin(ang) * len
      b.lineWidth = w
      b.beginPath()
      b.moveTo(x, y)
      b.quadraticCurveTo(x + Math.cos(ang + 0.3) * len * 0.5, y + Math.sin(ang + 0.3) * len * 0.5, x2, y2)
      b.stroke()
      if (depth > 0) {
        const n = 2 + (r() < 0.35 ? 1 : 0)
        for (let i = 0; i < n; i++) {
          const spread = (i / (n - 1 || 1) - 0.5) * 0.9
          branch(x2, y2, ang + spread + (r() - 0.5) * 0.25, len * (0.66 + r() * 0.12), w * 0.68, depth - 1)
        }
      }
    }
    branch(fx, fy, -Math.PI / 2 + (r() - 0.5) * 0.3, size * 0.32, Math.max(1.2, size * 0.035), 4)
  }
  const fanCols = ['rgba(150,82,104,0.55)', 'rgba(96,140,150,0.5)', 'rgba(170,120,96,0.45)', 'rgba(120,96,150,0.45)']
  const fanCount = mobile ? 4 : 9
  for (let i = 0; i < fanCount; i++) {
    let fx = r() * W
    if (Math.abs(fx - cx) < unit * 0.6) fx += unit * 1.2 * (fx < cx ? -1 : 1)
    fan(fx, backGround + 2, backH * (0.16 + r() * 0.14), fanCols[i % fanCols.length])
  }

  // Rocks
  const rocks = mobile ? 5 : 11
  for (let i = 0; i < rocks; i++) {
    const rx = r() * W
    const rw = backH * (0.05 + r() * 0.09)
    const rh = rw * (0.5 + r() * 0.3)
    const g = b.createLinearGradient(0, backGround - rh, 0, backGround)
    g.addColorStop(0, '#1e3a4c')
    g.addColorStop(1, '#081723')
    b.fillStyle = g
    b.beginPath()
    b.ellipse(rx, backGround, rw, rh, 0, Math.PI, 0)
    b.fill()
  }

  /* ---------- Front strip: lit sand with ripples, pebbles and the fluke mound ---------- */
  const frontH = Math.round(H * (mobile ? 0.12 : 0.15))
  const frontTop = Math.round(frontH * 0.22)
  const front = makeCanvas(W * dpr, frontH * dpr)
  const f = front.getContext('2d')!
  f.scale(dpr, dpr)
  const moundW = unit * 0.2
  const moundH = unit * 0.11
  const edge = (x: number) => {
    const dx = (x - moundX) / moundW
    return frontTop + Math.sin(x * 0.011) * 2.5 + Math.sin(x * 0.037 + 1) * 1.2 - moundH * Math.exp(-dx * dx)
  }
  f.beginPath()
  f.moveTo(0, frontH)
  for (let x = 0; x <= W + 4; x += 4) f.lineTo(x, edge(x))
  f.lineTo(W, frontH)
  f.closePath()
  const sg = f.createLinearGradient(0, frontTop - moundH, 0, frontH)
  sg.addColorStop(0, '#3b5358')
  sg.addColorStop(0.18, '#2a3e44')
  sg.addColorStop(1, '#0c171c')
  f.fillStyle = sg
  f.fill()
  // a soft rim where the sand catches light from above
  f.beginPath()
  for (let x = 0; x <= W + 4; x += 4) {
    const y = edge(x) + 1
    if (x === 0) f.moveTo(x, y)
    else f.lineTo(x, y)
  }
  f.lineWidth = 1.5
  f.strokeStyle = 'rgba(150,190,196,0.28)'
  f.stroke()
  // ripples
  f.strokeStyle = 'rgba(8,18,22,0.35)'
  f.lineWidth = 1
  for (let i = 0; i < (mobile ? 18 : 40); i++) {
    const y = frontTop + 6 + r() * (frontH - frontTop - 10)
    const x = r() * W
    const len = 30 + r() * 90
    f.beginPath()
    f.moveTo(x, y)
    f.quadraticCurveTo(x + len * 0.5, y - 3, x + len, y)
    f.stroke()
  }
  // pebbles
  for (let i = 0; i < (mobile ? 30 : 70); i++) {
    const x = r() * W
    const y = frontTop + 4 + r() * (frontH - frontTop - 6)
    const s = 1 + r() * 3.5
    f.fillStyle = r() < 0.5 ? 'rgba(90,112,116,0.55)' : 'rgba(18,30,34,0.6)'
    f.beginPath()
    f.ellipse(x, y, s * 1.3, s, 0, 0, Math.PI * 2)
    f.fill()
  }
  // the disturbed mound over the buried fluke
  const mg = f.createRadialGradient(moundX - moundW * 0.2, frontTop - moundH * 0.8, 1, moundX, frontTop, moundW * 1.3)
  mg.addColorStop(0, 'rgba(120,150,150,0.35)')
  mg.addColorStop(1, 'rgba(120,150,150,0)')
  f.fillStyle = mg
  f.fillRect(moundX - moundW * 1.5, frontTop - moundH * 1.4, moundW * 3, moundH * 2.4)

  /* ---------- Kelp ---------- */
  const kelpBack: Kelp[] = []
  const kelpFront: Kelp[] = []
  const nb = mobile ? 3 : 6
  for (let i = 0; i < nb; i++) {
    let x = (i + 0.3 + r() * 0.4) * (W / nb)
    if (Math.abs(x - cx) < unit * 0.45) x += unit * 0.9 * (x < cx ? -1 : 1)
    kelpBack.push({
      x,
      base: 0,
      h: backH * (0.45 + r() * 0.5),
      n: 12,
      phase: r() * 6.28,
      w: Math.max(2, unit * 0.022),
      color: 'rgba(18,46,46,0.85)',
    })
  }
  const frontXs = mobile ? [W * 0.05] : [W * 0.03, W * 0.93, W * 0.975]
  for (const x of frontXs) {
    kelpFront.push({
      x,
      base: 0,
      h: H * (mobile ? 0.22 : 0.3) * (0.7 + r() * 0.5),
      n: 14,
      phase: r() * 6.28,
      w: Math.max(2.5, unit * 0.03),
      color: 'rgba(34,66,50,0.95)',
    })
  }

  return { back, backH, backGround, front, frontH, frontTop, vents, kelpBack, kelpFront }
}

/** Kelp with a wave travelling up each stalk. One fill per stalk. */
export function drawKelp(ctx: CanvasRenderingContext2D, k: Kelp, groundY: number, t: number, H: number) {
  if (groundY - k.h > H + 20 || groundY < -20) return
  const seg = k.h / k.n
  let x = k.x
  let y = groundY + k.base
  let ang = -Math.PI / 2
  ctx.beginPath()
  // spine as a tapered ribbon: go up the left side, then down the right
  const lx: number[] = KX
  const ly: number[] = KY
  for (let i = 0; i <= k.n; i++) {
    lx[i] = x
    ly[i] = y
    const f = i / k.n
    ang = -Math.PI / 2 + Math.sin(t * 0.85 + k.phase - i * 0.42) * 0.11 * (0.3 + f) + Math.sin(t * 0.37 + k.phase) * 0.05
    x += Math.cos(ang) * seg
    y += Math.sin(ang) * seg
  }
  for (let i = 0; i <= k.n; i++) {
    const w = k.w * (1 - (i / k.n) * 0.7)
    if (i === 0) ctx.moveTo(lx[i] - w, ly[i])
    else ctx.lineTo(lx[i] - w, ly[i])
  }
  for (let i = k.n; i >= 0; i--) {
    const w = k.w * (1 - (i / k.n) * 0.7)
    ctx.lineTo(lx[i] + w, ly[i])
  }
  ctx.closePath()
  // blades
  for (let i = 2; i <= k.n; i += 2) {
    const side = (i >> 1) & 1 ? 1 : -1
    const bx = lx[i]
    const by = ly[i]
    const L = seg * 2.6 * (1 - (i / k.n) * 0.4)
    const sway = Math.sin(t * 1.1 + k.phase + i * 0.6) * 0.2
    const a = -Math.PI / 2 + side * 0.42 + sway
    const tx = bx + Math.cos(a) * L
    const ty = by + Math.sin(a) * L
    const nx = -Math.sin(a) * L * 0.13
    const ny = Math.cos(a) * L * 0.13
    ctx.moveTo(bx, by)
    ctx.quadraticCurveTo((bx + tx) / 2 + nx, (by + ty) / 2 + ny, tx, ty)
    ctx.quadraticCurveTo((bx + tx) / 2 - nx, (by + ty) / 2 - ny, bx, by)
  }
  ctx.fillStyle = k.color
  ctx.fill()
}
const KX: number[] = new Array(32).fill(0)
const KY: number[] = new Array(32).fill(0)
