import { band, clamp, makeCanvas, rgba, rng } from './util'
import type { Waterline } from './surface'

/*
 * Procedural sea life in three parallax layers, plus marine snow and
 * bioluminescent specks. Fish are pre-rendered into small sprite sheets
 * (one row of tail-flex frames per variety) so the hot loop is drawImage only.
 * Everything lives in fixed pools allocated up front.
 */

const FRAMES = 8
const TAU = Math.PI * 2

export const enum Layer {
  Far = 0,
  Mid = 1,
  Near = 2,
}

const LAYERS = [
  { cam: 0.22, size: 0.5, alpha: 0.38, count: 12, speed: 0.45, snow: 70, specks: 26 },
  { cam: 0.5, size: 0.9, alpha: 0.72, count: 8, speed: 0.75, snow: 45, specks: 16 },
  { cam: 0.92, size: 1.55, alpha: 1, count: 4, speed: 1.15, snow: 18, specks: 0 },
]

/* ---------------- depth bands ---------------- */
const deepBand = (p: number) => band(p, -1, -0.5, 0.3, 0.42)
const midBand = (p: number) => band(p, 0.16, 0.26, 0.74, 0.86)
const shallowBand = (p: number) => band(p, 0.46, 0.56, 1.5, 2)

/* ---------------- fish sprites ---------------- */

type FishOpts = {
  back: string
  belly: string
  fin: string
  ratio: number
  dorsal?: boolean
  stripes?: string
  photophores?: boolean
  lateral?: boolean
}

type Sheet = { c: HTMLCanvasElement; cw: number; ch: number; len: number; dpr: number }

function fishSheet(len: number, dpr: number, o: FishOpts): Sheet {
  const L = len
  const h = L * o.ratio
  const cwCss = L * 1.18
  const chCss = h * 2.3
  const cw = Math.ceil(cwCss * dpr)
  const ch = Math.ceil(chCss * dpr)
  const c = makeCanvas(cw * FRAMES, ch)
  const g = c.getContext('2d')!
  for (let i = 0; i < FRAMES; i++) {
    const flex = Math.sin((i / FRAMES) * TAU) * 0.38
    g.setTransform(dpr, 0, 0, dpr, i * cw + (cwCss / 2 + L * 0.06) * dpr, (chCss / 2) * dpr)
    const tx = -0.28 * L
    const tailY = Math.sin(flex) * h * 0.08
    // tail fin
    g.save()
    g.translate(tx, tailY)
    g.rotate(flex)
    g.beginPath()
    g.moveTo(0.03 * L, -h * 0.09)
    g.quadraticCurveTo(-0.1 * L, -h * 0.2, -0.21 * L, -h * 0.52)
    g.quadraticCurveTo(-0.13 * L, 0, -0.21 * L, h * 0.52)
    g.quadraticCurveTo(-0.1 * L, h * 0.2, 0.03 * L, h * 0.09)
    g.closePath()
    g.fillStyle = o.fin
    g.fill()
    g.restore()
    // dorsal fin
    if (o.dorsal) {
      g.beginPath()
      g.moveTo(0.14 * L, -h * 0.4)
      g.quadraticCurveTo(0.02 * L, -h * 1.05, -0.2 * L, -h * 0.36)
      g.closePath()
      g.fillStyle = o.fin
      g.fill()
    }
    // body
    g.beginPath()
    g.moveTo(0.5 * L, h * 0.03)
    g.bezierCurveTo(0.43 * L, -h * 0.56, 0.0, -h * 0.62, tx, -h * 0.1 + tailY)
    g.lineTo(tx, h * 0.1 + tailY)
    g.bezierCurveTo(0.0, h * 0.6, 0.4 * L, h * 0.52, 0.5 * L, h * 0.03)
    g.closePath()
    const grad = g.createLinearGradient(0, -h * 0.55, 0, h * 0.55)
    grad.addColorStop(0, o.back)
    grad.addColorStop(0.45, o.back)
    grad.addColorStop(0.75, o.belly)
    grad.addColorStop(1, o.belly)
    g.fillStyle = grad
    g.fill()
    g.save()
    g.clip()
    if (o.stripes) {
      g.fillStyle = o.stripes
      for (const sx of [0.22, 0.02, -0.17]) g.fillRect(sx * L, -h, L * 0.055, h * 2)
    }
    if (o.lateral) {
      g.fillStyle = 'rgba(255,255,255,0.35)'
      g.fillRect(-0.28 * L, -h * 0.02, 0.7 * L, Math.max(0.6, h * 0.05))
    }
    // gill line
    g.strokeStyle = 'rgba(0,0,0,0.18)'
    g.lineWidth = Math.max(0.5, L * 0.012)
    g.beginPath()
    g.arc(0.38 * L, 0, h * 0.42, Math.PI * 0.62, Math.PI * 1.38)
    g.stroke()
    g.restore()
    // pectoral fin
    g.beginPath()
    g.moveTo(0.22 * L, h * 0.12)
    g.quadraticCurveTo(0.08 * L, h * 0.22 + flex * h * 0.15, 0.06 * L, h * 0.38)
    g.quadraticCurveTo(0.16 * L, h * 0.28, 0.22 * L, h * 0.12)
    g.fillStyle = o.fin
    g.fill()
    // photophores along the belly
    if (o.photophores) {
      for (let k = 0; k < 7; k++) {
        const px = (0.3 - k * 0.08) * L
        const py = h * (0.3 - Math.abs(k - 3) * 0.015)
        const rg = g.createRadialGradient(px, py, 0, px, py, h * 0.16)
        rg.addColorStop(0, 'rgba(170,250,255,0.95)')
        rg.addColorStop(0.35, 'rgba(110,220,255,0.55)')
        rg.addColorStop(1, 'rgba(110,220,255,0)')
        g.fillStyle = rg
        g.fillRect(px - h * 0.16, py - h * 0.16, h * 0.32, h * 0.32)
      }
    }
    // eye
    g.fillStyle = 'rgba(232,240,238,0.95)'
    g.beginPath()
    g.arc(0.36 * L, -h * 0.08, h * 0.12, 0, TAU)
    g.fill()
    g.fillStyle = '#0a1316'
    g.beginPath()
    g.arc(0.37 * L, -h * 0.08, h * 0.068, 0, TAU)
    g.fill()
  }
  return { c, cw, ch, len: L, dpr }
}

function whaleSprite(len: number, dpr: number) {
  const L = len
  const c = makeCanvas(L * 1.1 * dpr, L * 0.42 * dpr)
  const g = c.getContext('2d')!
  g.setTransform(dpr, 0, 0, dpr, L * 0.55 * dpr, L * 0.2 * dpr)
  g.fillStyle = '#04111d'
  g.beginPath()
  // body (facing +x), long and tapering with a raised head
  g.moveTo(0.5 * L, -0.01 * L)
  g.bezierCurveTo(0.46 * L, -0.08 * L, 0.2 * L, -0.11 * L, -0.05 * L, -0.08 * L)
  g.bezierCurveTo(-0.25 * L, -0.06 * L, -0.38 * L, -0.03 * L, -0.43 * L, -0.005 * L)
  // flukes
  g.lineTo(-0.5 * L, -0.07 * L)
  g.quadraticCurveTo(-0.47 * L, -0.01 * L, -0.53 * L, 0.03 * L)
  g.lineTo(-0.43 * L, 0.012 * L)
  g.bezierCurveTo(-0.3 * L, 0.04 * L, -0.1 * L, 0.09 * L, 0.1 * L, 0.085 * L)
  g.bezierCurveTo(0.3 * L, 0.08 * L, 0.45 * L, 0.05 * L, 0.5 * L, -0.01 * L)
  g.fill()
  // long pectoral flipper
  g.beginPath()
  g.moveTo(0.22 * L, 0.06 * L)
  g.quadraticCurveTo(0.12 * L, 0.16 * L, 0.02 * L, 0.19 * L)
  g.quadraticCurveTo(0.12 * L, 0.12 * L, 0.16 * L, 0.06 * L)
  g.fill()
  return { c, w: L * 1.1, h: L * 0.42 }
}

/* ---------------- creatures ---------------- */

const enum Kind {
  None = 0,
  Lantern,
  Jelly,
  School,
  Reef,
}

const MAX_SCHOOL = 16

type Creature = {
  kind: Kind
  layer: Layer
  x: number
  y: number
  vx: number
  dir: number
  len: number
  phase: number
  tail: number
  hue: number
  sheet: Sheet | null
  n: number
  ox: Float32Array
  oy: Float32Array
  op: Float32Array
  wait: number
}

function newCreature(layer: Layer): Creature {
  return {
    kind: Kind.None,
    layer,
    x: 0,
    y: 0,
    vx: 0,
    dir: 1,
    len: 10,
    phase: 0,
    tail: 0,
    hue: 0,
    sheet: null,
    n: 0,
    ox: new Float32Array(MAX_SCHOOL),
    oy: new Float32Array(MAX_SCHOOL),
    op: new Float32Array(MAX_SCHOOL),
    wait: 0,
  }
}

/* ---------------- particles & effects pools ---------------- */

const MAX_BUBBLES = 220
const MAX_PUFFS = 48
const MAX_DRIPS = 24
const MAX_RINGS = 24

export type LifeFrame = {
  t: number
  dt: number // ambient dt (0 under reduced motion)
  p: number
  dCam: number // change in smoothed scroll px since last frame
  wl: Waterline
}

export class Life {
  private W = 0
  private H = 0
  private dpr = 1
  private k = 1 // screen size factor
  private mobile = false
  private quality = 1
  private r = rng(7)

  private creatures: Creature[][] = [[], [], []]
  private whale = { on: false, x: 0, y: 0, vx: 0, len: 0, cool: 4 }
  private whaleImg: { c: HTMLCanvasElement; w: number; h: number } | null = null

  private sheets: Record<string, Sheet> = {}
  private reefKeys = ['gold', 'goldStripe', 'coral', 'green', 'greenStripe']

  // marine snow & specks per layer: x, y, size, phase
  private snow: Float32Array[] = []
  private specks: Float32Array[] = []

  // bubbles: x, y, r, vy, phase, cam, alive
  private bx = new Float32Array(MAX_BUBBLES)
  private by = new Float32Array(MAX_BUBBLES)
  private br = new Float32Array(MAX_BUBBLES)
  private bv = new Float32Array(MAX_BUBBLES)
  private bp = new Float32Array(MAX_BUBBLES)
  private bc = new Float32Array(MAX_BUBBLES)
  private bAlive = new Uint8Array(MAX_BUBBLES)
  private bNext = 0

  // sand puffs: x, y, vx, vy, age, life, size
  private px = new Float32Array(MAX_PUFFS)
  private py = new Float32Array(MAX_PUFFS)
  private pvx = new Float32Array(MAX_PUFFS)
  private pvy = new Float32Array(MAX_PUFFS)
  private pa = new Float32Array(MAX_PUFFS)
  private pl = new Float32Array(MAX_PUFFS)
  private ps = new Float32Array(MAX_PUFFS)
  private pNext = 0
  private puffImg: HTMLCanvasElement | null = null

  // drips: x, y, vy, age (hang), alive
  private dx = new Float32Array(MAX_DRIPS)
  private dy = new Float32Array(MAX_DRIPS)
  private dv = new Float32Array(MAX_DRIPS)
  private da = new Float32Array(MAX_DRIPS)
  private dAlive = new Uint8Array(MAX_DRIPS)
  private dNext = 0
  private dripTimer = 0

  // rings at the surface (bubble pops, drip ripples): x, age, size
  private rx = new Float32Array(MAX_RINGS)
  private ra = new Float32Array(MAX_RINGS)
  private rs = new Float32Array(MAX_RINGS)
  private rAlive = new Uint8Array(MAX_RINGS)
  private rNext = 0

  // gulls: x, y(rel. horizon), phase, speed, size
  private gulls = new Float32Array(5 * 5)
  private gullCount = 0

  private ventTimers = [0, 0]
  private ambientBubbleTimer = 0
  private anchorBubbleAcc = 0

  resize(W: number, H: number, dpr: number, mobile: boolean) {
    this.W = W
    this.H = H
    this.dpr = dpr
    this.mobile = mobile
    this.k = clamp(Math.min(H / 900, W / 900 + 0.25), 0.55, 1.5)
    this.buildSprites()
    const r = this.r
    for (let l = 0; l < 3; l++) {
      const cfg = LAYERS[l]
      if (!this.creatures[l].length) for (let i = 0; i < cfg.count; i++) this.creatures[l].push(newCreature(l as Layer))
      const sn = new Float32Array(cfg.snow * 4)
      for (let i = 0; i < cfg.snow; i++) {
        sn[i * 4] = r() * W
        sn[i * 4 + 1] = r() * H
        sn[i * 4 + 2] = (0.6 + r() * (l + 1) * 0.7) * Math.max(0.8, this.k)
        sn[i * 4 + 3] = r() * TAU
      }
      this.snow[l] = sn
      const sp = new Float32Array(Math.max(1, cfg.specks) * 4)
      for (let i = 0; i < cfg.specks; i++) {
        sp[i * 4] = r() * W
        sp[i * 4 + 1] = r() * H
        sp[i * 4 + 2] = 1 + r() * 1.6 * (l + 1)
        sp[i * 4 + 3] = r() * TAU
      }
      this.specks[l] = sp
    }
    this.gullCount = mobile ? 3 : 5
    for (let i = 0; i < this.gullCount; i++) {
      const o = i * 5
      this.gulls[o] = r() * W
      this.gulls[o + 1] = H * (0.04 + r() * 0.11)
      this.gulls[o + 2] = r() * TAU
      this.gulls[o + 3] = (8 + r() * 14) * this.k * (r() < 0.5 ? -1 : 1)
      this.gulls[o + 4] = H * (0.008 + r() * 0.007)
    }
  }

  /** Called once the engine knows the starting progress, so the first frame is populated. */
  populate(p: number) {
    for (let l = 0; l < 3; l++) {
      for (const c of this.creatures[l]) this.spawn(c, p, 'any')
    }
  }

  setQuality(q: number) {
    this.quality = q
  }

  private buildSprites() {
    const d = Math.min(this.dpr, 2)
    const base = 1.6 * this.k
    const S = this.sheets
    S.lantern = fishSheet(38 * base, d, { back: '#16232f', belly: '#3d5566', fin: 'rgba(40,62,78,0.8)', ratio: 0.34, photophores: true })
    S.silver = fishSheet(26 * base, d, { back: '#3d566b', belly: '#dfeaf0', fin: 'rgba(170,196,210,0.55)', ratio: 0.3, lateral: true })
    S.gold = fishSheet(56 * base, d, { back: '#a67a22', belly: '#f2d27e', fin: 'rgba(214,170,74,0.85)', ratio: 0.46, dorsal: true })
    S.goldStripe = fishSheet(56 * base, d, { back: '#9a7020', belly: '#f0cc72', fin: 'rgba(200,156,64,0.85)', ratio: 0.48, dorsal: true, stripes: 'rgba(58,40,14,0.55)' })
    S.coral = fishSheet(54 * base, d, { back: '#a54a40', belly: '#f0a38c', fin: 'rgba(214,118,98,0.8)', ratio: 0.44, dorsal: true })
    S.green = fishSheet(58 * base, d, { back: '#25705e', belly: '#a6dcc2', fin: 'rgba(80,150,124,0.8)', ratio: 0.42, dorsal: true })
    S.greenStripe = fishSheet(58 * base, d, { back: '#21685a', belly: '#9bd6bb', fin: 'rgba(76,146,120,0.8)', ratio: 0.44, dorsal: true, stripes: 'rgba(214,240,222,0.4)' })
    this.whaleImg = whaleSprite(this.W * (this.mobile ? 0.75 : 0.42), d)
    // soft sand blob for puffs
    const pr = 48
    const pc = makeCanvas(pr * 2, pr * 2)
    const pg = pc.getContext('2d')!
    const rg = pg.createRadialGradient(pr, pr, 0, pr, pr, pr)
    rg.addColorStop(0, 'rgba(150,170,164,0.9)')
    rg.addColorStop(0.5, 'rgba(120,142,138,0.45)')
    rg.addColorStop(1, 'rgba(110,130,126,0)')
    pg.fillStyle = rg
    pg.fillRect(0, 0, pr * 2, pr * 2)
    this.puffImg = pc
  }

  /* ---------------- spawning ---------------- */

  private pick(layer: Layer, p: number): Kind {
    const r = this.r
    const wd = deepBand(p)
    const wm = midBand(p)
    const ws = shallowBand(p)
    const wLan = wd * 1.0
    const wJel = wd * (layer === Layer.Near ? 0.5 : 0.4)
    const wSch = wm * (layer === Layer.Near ? 0.25 : 0.9)
    const wRee = ws * (layer === Layer.Far ? 0.6 : 1.1)
    const total = wLan + wJel + wSch + wRee
    if (total < 0.05) return Kind.None
    let x = r() * total
    if ((x -= wLan) < 0) return Kind.Lantern
    if ((x -= wJel) < 0) return Kind.Jelly
    if ((x -= wSch) < 0) return Kind.School
    return Kind.Reef
  }

  private spawn(c: Creature, p: number, edge: 'any' | 'top' | 'bottom' | 'side') {
    const r = this.r
    const { W, H } = this
    const cfg = LAYERS[c.layer]
    c.kind = this.pick(c.layer, p)
    if (c.kind === Kind.None) {
      c.wait = 0.5 + r() * 1.5
      return
    }
    c.dir = r() < 0.5 ? -1 : 1
    c.phase = r() * TAU
    c.tail = 6 + r() * 4
    const sz = cfg.size * this.k
    switch (c.kind) {
      case Kind.Lantern:
        c.sheet = this.sheets.lantern
        c.len = 38 * sz * (0.8 + r() * 0.4)
        c.vx = c.dir * (14 + r() * 12) * cfg.speed * this.k
        break
      case Kind.Jelly:
        c.sheet = null
        c.len = 26 * sz * (0.7 + r() * 0.6) // bell radius
        c.vx = (r() - 0.5) * 6 * this.k
        c.hue = r() < 0.5 ? 0 : 1
        break
      case Kind.School: {
        c.sheet = this.sheets.silver
        c.len = 27 * sz * (0.85 + r() * 0.3)
        c.vx = c.dir * (22 + r() * 14) * cfg.speed * this.k
        const n = Math.max(5, Math.round((c.layer === Layer.Near ? 7 : 14) * this.quality))
        c.n = Math.min(MAX_SCHOOL, n)
        const R = c.len * 3.2
        for (let i = 0; i < c.n; i++) {
          const a = r() * TAU
          const d = Math.sqrt(r())
          c.ox[i] = Math.cos(a) * d * R * 1.6
          c.oy[i] = Math.sin(a) * d * R * 0.7
          c.op[i] = r() * TAU
        }
        break
      }
      case Kind.Reef: {
        const key = this.reefKeys[Math.floor(r() * this.reefKeys.length)]
        c.sheet = this.sheets[key]
        c.len = 56 * sz * (0.75 + r() * 0.5)
        c.vx = c.dir * (16 + r() * 16) * cfg.speed * this.k
        break
      }
    }
    const m = this.extent(c)
    if (edge === 'any') {
      c.x = r() * W
      c.y = H * (0.05 + r() * 0.9)
    } else if (edge === 'top') {
      c.x = r() * W
      c.y = -m
    } else if (edge === 'bottom') {
      c.x = r() * W
      c.y = H + m
    } else {
      c.x = c.vx >= 0 ? -m : W + m
      c.y = H * (0.08 + r() * 0.84)
      if (c.kind === Kind.Jelly) c.x = r() * W
      if (c.kind === Kind.Jelly) c.y = H + m
    }
  }

  private extent(c: Creature) {
    if (c.kind === Kind.School) return c.len * 3.2 * 1.6 + c.len
    if (c.kind === Kind.Jelly) return c.len * 3.5
    return c.len
  }

  /* ---------------- update ---------------- */

  update(f: LifeFrame) {
    const { W, H } = this
    const dt = f.dt
    const r = this.r
    for (let l = 0; l < 3; l++) {
      const cfg = LAYERS[l]
      const shift = f.dCam * cfg.cam
      const n = Math.max(1, Math.round(cfg.count * this.quality))
      const list = this.creatures[l]
      for (let i = 0; i < list.length; i++) {
        const c = list[i]
        if (i >= n) {
          c.kind = Kind.None
          continue
        }
        if (c.kind === Kind.None) {
          c.wait -= dt > 0 ? dt : Math.abs(shift) > 0.5 ? 0.05 : 0
          if (c.wait <= 0) this.spawn(c, f.p, Math.abs(f.dCam) > 0.5 ? (f.dCam > 0 ? 'top' : 'bottom') : 'side')
          continue
        }
        c.y += shift
        c.phase += dt * c.tail * 0.35
        if (c.kind === Kind.Jelly) {
          c.phase += dt * 1.1
          const pulse = Math.max(0, Math.sin(c.phase))
          c.y -= (5 + 34 * pulse * pulse) * this.k * cfg.speed * dt
          c.x += c.vx * dt
        } else {
          c.x += c.vx * dt
          c.y += Math.sin(c.phase * 0.21) * 4 * this.k * dt
        }
        const m = this.extent(c)
        if (c.x < -m * 1.2 || c.x > W + m * 1.2 || c.y < -m * 1.5 || c.y > H + m * 1.5) {
          c.kind = Kind.None
          c.wait = 0.2 + r() * 1.2
        }
      }
      // marine snow drifts slowly down, and down faster as you rise
      const sn = this.snow[l]
      for (let i = 0; i < sn.length; i += 4) {
        sn[i + 1] += shift + dt * (3 + l * 3) * this.k
        sn[i] += Math.sin(f.t * 0.3 + sn[i + 3]) * dt * 2
        if (sn[i + 1] > H + 4) sn[i + 1] -= H + 8
        else if (sn[i + 1] < -4) sn[i + 1] += H + 8
        if (sn[i] < -4) sn[i] += W + 8
        else if (sn[i] > W + 4) sn[i] -= W + 8
      }
      const sp = this.specks[l]
      for (let i = 0; i < cfg.specks * 4; i += 4) {
        sp[i + 1] += shift - dt * 2
        if (sp[i + 1] > H + 4) sp[i + 1] -= H + 8
        else if (sp[i + 1] < -4) sp[i + 1] += H + 8
      }
    }

    // the occasional whale, far away, in mid-water
    const wh = this.whale
    const wm = midBand(f.p)
    if (wh.on) {
      wh.x += wh.vx * dt
      wh.y += f.dCam * LAYERS[0].cam * 0.6
      const w = this.whaleImg ? this.whaleImg.w : 0
      if (wh.x < -w || wh.x > W + w || wh.y > H + w * 0.5 || wh.y < -w * 0.5) {
        wh.on = false
        wh.cool = 25 + r() * 20
      }
    } else if (dt > 0 && wm > 0.5 && this.quality > 0.5) {
      wh.cool -= dt
      if (wh.cool <= 0 && this.whaleImg) {
        wh.on = true
        const dir = r() < 0.5 ? -1 : 1
        wh.vx = dir * W * 0.012
        wh.x = dir > 0 ? -this.whaleImg.w * 0.5 : W + this.whaleImg.w * 0.5
        wh.y = H * (0.25 + r() * 0.35)
      }
    }

    // bubbles
    for (let i = 0; i < MAX_BUBBLES; i++) {
      if (!this.bAlive[i]) continue
      this.by[i] += f.dCam * this.bc[i] - this.bv[i] * dt
      this.bp[i] += dt * 4
      const x = this.bx[i] + Math.sin(this.bp[i]) * this.br[i] * 0.6
      if (f.wl.active && this.by[i] <= f.wl.at(x) + 1) {
        this.bAlive[i] = 0
        this.ring(x, this.br[i] * 2.2)
      } else if (this.by[i] < -10 || this.by[i] > H + 40) this.bAlive[i] = 0
    }
    if (dt > 0) {
      this.ambientBubbleTimer -= dt
      if (this.ambientBubbleTimer <= 0) {
        this.ambientBubbleTimer = 0.5 + r() * 1.4
        const x = r() * W
        for (let j = 0; j < 3; j++) this.bubble(x + (r() - 0.5) * 8, H + 6 + j * 9, 1.4 + r() * 2.2, 0.9)
      }
    }

    // sand puffs
    for (let i = 0; i < MAX_PUFFS; i++) {
      if (this.pa[i] >= this.pl[i]) continue
      const a = (this.pa[i] += Math.max(dt, 1 / 60))
      const drag = Math.exp(-dt * 1.6)
      this.pvx[i] *= drag
      this.pvy[i] = this.pvy[i] * drag + 4 * dt * this.k
      this.px[i] += this.pvx[i] * dt
      this.py[i] += this.pvy[i] * dt + f.dCam * 0.95
      this.ps[i] *= 1 + dt * 0.35 * (1 - a / this.pl[i])
    }

    // drips and rings
    for (let i = 0; i < MAX_DRIPS; i++) {
      if (!this.dAlive[i]) continue
      if (this.da[i] < 0.35) {
        this.da[i] += dt
        continue
      }
      this.dv[i] += 1300 * this.k * dt
      this.dy[i] += this.dv[i] * dt
      const surface = f.wl.at(this.dx[i])
      if (this.dy[i] >= surface) {
        this.dAlive[i] = 0
        this.ring(this.dx[i], 7 * this.k)
      }
    }
    for (let i = 0; i < MAX_RINGS; i++) {
      if (!this.rAlive[i]) continue
      this.ra[i] += dt > 0 ? dt : 1 / 60
      if (this.ra[i] > 0.9) this.rAlive[i] = 0
    }

    // gulls drift across the sky
    for (let i = 0; i < this.gullCount; i++) {
      const o = i * 5
      this.gulls[o] += this.gulls[o + 3] * dt
      this.gulls[o + 2] += dt * (5 + (i % 3))
      if (this.gulls[o] > W + 40) this.gulls[o] = -40
      else if (this.gulls[o] < -40) this.gulls[o] = W + 40
    }
  }

  /* ---------------- emitters ---------------- */

  bubble(x: number, y: number, rad: number, cam: number) {
    const i = this.bNext
    this.bNext = (this.bNext + 1) % MAX_BUBBLES
    this.bx[i] = x
    this.by[i] = y
    this.br[i] = rad * this.k
    this.bv[i] = (26 + rad * 14) * this.k
    this.bp[i] = this.r() * TAU
    this.bc[i] = cam
    this.bAlive[i] = 1
  }

  /** Vent bubbles: call each frame with vent mouth positions on screen. */
  vent(v: number, dt: number, x: number, y: number) {
    if (dt <= 0 || y > this.H + 20 || y < -20) return
    this.ventTimers[v] -= dt
    if (this.ventTimers[v] <= 0) {
      const r = this.r
      this.ventTimers[v] = 0.08 + r() * (v === 0 ? 0.22 : 0.4)
      this.bubble(x + (r() - 0.5) * 6, y, 1.1 + r() * 2.4, 0.62)
    }
  }

  /** Bubbles shed by the anchor while it moves; rate in bubbles per second. */
  anchorBubbles(dt: number, rate: number, emit: (out: Float32Array) => boolean) {
    if (dt <= 0 || rate <= 0) return
    this.anchorBubbleAcc += rate * dt
    while (this.anchorBubbleAcc >= 1) {
      this.anchorBubbleAcc -= 1
      if (emit(TMP)) this.bubble(TMP[0], TMP[1], 1.2 + this.r() * 2.6, 0.92)
    }
  }

  puff(x: number, y: number, spread: number, n: number) {
    const r = this.r
    for (let j = 0; j < n; j++) {
      const i = this.pNext
      this.pNext = (this.pNext + 1) % MAX_PUFFS
      const a = Math.PI + r() * Math.PI
      const sp = (20 + r() * 60) * this.k
      this.px[i] = x + (r() - 0.5) * spread
      this.py[i] = y - r() * 4
      this.pvx[i] = Math.cos(a) * sp * 1.4
      this.pvy[i] = Math.sin(a) * sp
      this.pa[i] = 0
      this.pl[i] = 2.2 + r() * 1.6
      this.ps[i] = (10 + r() * 16) * this.k
    }
  }

  drip(dt: number, rate: number, emit: (out: Float32Array) => boolean) {
    if (dt <= 0 || rate <= 0) return
    this.dripTimer -= dt
    if (this.dripTimer > 0) return
    this.dripTimer = (0.4 + this.r() * 0.9) / rate
    if (!emit(TMP)) return
    const i = this.dNext
    this.dNext = (this.dNext + 1) % MAX_DRIPS
    this.dx[i] = TMP[0]
    this.dy[i] = TMP[1]
    this.dv[i] = 0
    this.da[i] = 0
    this.dAlive[i] = 1
  }

  private ring(x: number, size: number) {
    const i = this.rNext
    this.rNext = (this.rNext + 1) % MAX_RINGS
    this.rx[i] = x
    this.ra[i] = 0
    this.rs[i] = size
    this.rAlive[i] = 1
  }

  /* ---------------- drawing ---------------- */

  drawParticles(ctx: CanvasRenderingContext2D, l: Layer, p: number, t: number) {
    const cfg = LAYERS[l]
    const sn = this.snow[l]
    const count = Math.round((sn.length / 4) * (0.5 + 0.5 * this.quality))
    ctx.beginPath()
    for (let i = 0; i < count * 4; i += 4) {
      const s = sn[i + 2]
      ctx.rect(sn[i], sn[i + 1], s, s)
    }
    ctx.fillStyle = rgba(206, 228, 236, (0.16 + l * 0.12) * (0.6 + 0.4 * p))
    ctx.fill()

    const deep = deepBand(p)
    if (cfg.specks && deep > 0.02) {
      const sp = this.specks[l]
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath()
        for (let i = 0; i < cfg.specks * 4; i += 4) {
          const tw = Math.sin(t * 1.3 + sp[i + 3])
          if ((tw > 0.2) !== (pass === 1)) continue
          const s = sp[i + 2] * (pass ? 1 : 0.7)
          ctx.moveTo(sp[i] + s, sp[i + 1])
          ctx.arc(sp[i], sp[i + 1], s, 0, TAU)
        }
        ctx.fillStyle = rgba(120, 236, 255, deep * (pass ? 0.75 : 0.3) * (0.5 + l * 0.25))
        ctx.fill()
      }
      // soft halo, drawn as one wide faint pass instead of shadowBlur
      ctx.beginPath()
      for (let i = 0; i < cfg.specks * 4; i += 4) {
        if (Math.sin(t * 1.3 + sp[i + 3]) <= 0.2) continue
        const s = sp[i + 2] * 3
        ctx.moveTo(sp[i] + s, sp[i + 1])
        ctx.arc(sp[i], sp[i + 1], s, 0, TAU)
      }
      ctx.fillStyle = rgba(120, 236, 255, deep * 0.12)
      ctx.fill()
    }
  }

  drawCreatures(ctx: CanvasRenderingContext2D, l: Layer, p: number, t: number) {
    const dpr = this.dpr
    const cfg = LAYERS[l]
    if (l === Layer.Far && this.whale.on && this.whaleImg) {
      const wh = this.whale
      const img = this.whaleImg
      const dir = wh.vx >= 0 ? 1 : -1
      ctx.globalAlpha = 0.5 * midBand(p)
      ctx.setTransform(dpr * dir, 0, 0, dpr, wh.x * dpr, (wh.y + Math.sin(t * 0.2) * 6) * dpr)
      ctx.drawImage(img.c, -img.w / 2, -img.h / 2, img.w, img.h)
    }
    const list = this.creatures[l]
    for (let i = 0; i < list.length; i++) {
      const c = list[i]
      if (c.kind === Kind.None) continue
      const fade = c.kind === Kind.Lantern || c.kind === Kind.Jelly ? deepBand(p) : c.kind === Kind.School ? midBand(p) : shallowBand(p)
      const a = cfg.alpha * fade
      if (a < 0.02) continue
      ctx.globalAlpha = a
      if (c.kind === Kind.Jelly) {
        this.drawJelly(ctx, c, t)
      } else if (c.kind === Kind.School && c.sheet) {
        for (let m = 0; m < c.n; m++) {
          const ph = c.op[m] + t
          const x = c.x + c.ox[m] + Math.sin(ph * 0.9) * c.len * 0.5
          const y = c.y + c.oy[m] + Math.sin(ph * 0.7 + 1) * c.len * 0.3
          this.blit(ctx, c.sheet, x, y, c.len, c.dir, c.phase * 3 + c.op[m])
        }
      } else if (c.sheet) {
        this.blit(ctx, c.sheet, c.x, c.y, c.len, c.dir, c.phase)
      }
    }
    ctx.globalAlpha = 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // glints on the silver fish, batched
    ctx.beginPath()
    let any = false
    for (const c of list) {
      if (c.kind !== Kind.School) continue
      for (let m = 0; m < c.n; m++) {
        const g = Math.sin(t * 0.8 + c.op[m] * 9)
        if (g < 0.985) continue
        const ph = c.op[m] + t
        const x = c.x + c.ox[m] + Math.sin(ph * 0.9) * c.len * 0.5
        const y = c.y + c.oy[m] + Math.sin(ph * 0.7 + 1) * c.len * 0.3
        const s = c.len * 0.18 * (g - 0.985) * 60
        ctx.moveTo(x + s, y)
        ctx.arc(x, y, s, 0, TAU)
        any = true
      }
    }
    if (any) {
      ctx.fillStyle = rgba(255, 255, 255, 0.8 * cfg.alpha * midBand(p))
      ctx.fill()
    }
  }

  private blit(ctx: CanvasRenderingContext2D, sh: Sheet, x: number, y: number, len: number, dir: number, phase: number) {
    const dpr = this.dpr
    const s = len / sh.len
    let fr = Math.floor(((phase / TAU) % 1) * FRAMES)
    if (fr < 0) fr += FRAMES
    ctx.setTransform(dpr * s * dir, 0, 0, dpr * s, x * dpr, y * dpr)
    const w = sh.cw / sh.dpr
    const h = sh.ch / sh.dpr
    ctx.drawImage(sh.c, fr * sh.cw, 0, sh.cw, sh.ch, -w / 2, -h / 2, w, h)
  }

  private drawJelly(ctx: CanvasRenderingContext2D, c: Creature, t: number) {
    const dpr = this.dpr
    const r = c.len
    const sq = 1 + 0.14 * Math.sin(c.phase)
    const bh = r * 0.85 * (1 - 0.12 * Math.sin(c.phase))
    ctx.setTransform(dpr, 0, 0, dpr, c.x * dpr, c.y * dpr)
    const w = r * sq
    // tentacles
    ctx.lineCap = 'round'
    ctx.beginPath()
    for (let k = 0; k < 6; k++) {
      const x0 = (k / 5 - 0.5) * w * 1.5
      ctx.moveTo(x0, 0)
      for (let j = 1; j <= 8; j++) {
        const y = j * r * 0.42
        const x = x0 + Math.sin(c.phase * 0.8 - j * 0.6 + k * 1.3 + t * 0.4) * r * 0.16 * (j / 8)
        ctx.lineTo(x, y)
      }
    }
    ctx.lineWidth = Math.max(0.6, r * 0.04)
    ctx.strokeStyle = c.hue ? 'rgba(200,180,255,0.4)' : 'rgba(160,230,255,0.4)'
    ctx.stroke()
    // oral arms
    ctx.beginPath()
    for (let k = -1; k <= 1; k += 2) {
      ctx.moveTo(k * w * 0.12, 0)
      ctx.quadraticCurveTo(k * w * 0.3 + Math.sin(c.phase + k) * r * 0.2, r * 0.9, k * w * 0.08, r * 1.6)
    }
    ctx.lineWidth = Math.max(1, r * 0.12)
    ctx.strokeStyle = c.hue ? 'rgba(230,190,240,0.35)' : 'rgba(190,240,250,0.35)'
    ctx.stroke()
    // bell
    ctx.beginPath()
    ctx.moveTo(-w, 0)
    ctx.bezierCurveTo(-w, -bh * 1.35, w, -bh * 1.35, w, 0)
    for (let k = 4; k >= 1; k--) {
      const x1 = w - ((4 - k + 0.5) / 4) * 2 * w
      const x2 = w - ((4 - k + 1) / 4) * 2 * w
      ctx.quadraticCurveTo(x1, -r * 0.12, x2, 0)
    }
    ctx.closePath()
    const g = ctx.createRadialGradient(0, -bh * 0.7, 0, 0, -bh * 0.4, w * 1.2)
    if (c.hue) {
      g.addColorStop(0, 'rgba(240,210,255,0.6)')
      g.addColorStop(1, 'rgba(150,120,220,0.14)')
    } else {
      g.addColorStop(0, 'rgba(210,250,255,0.6)')
      g.addColorStop(1, 'rgba(100,190,230,0.14)')
    }
    ctx.fillStyle = g
    ctx.fill()
    ctx.lineWidth = Math.max(0.6, r * 0.05)
    ctx.strokeStyle = c.hue ? 'rgba(235,215,255,0.55)' : 'rgba(205,245,255,0.55)'
    ctx.stroke()
  }

  drawPuffs(ctx: CanvasRenderingContext2D) {
    const img = this.puffImg
    if (!img) return
    for (let i = 0; i < MAX_PUFFS; i++) {
      if (this.pa[i] >= this.pl[i]) continue
      const u = this.pa[i] / this.pl[i]
      const a = 0.55 * Math.min(1, u * 8) * Math.pow(1 - u, 1.4)
      if (a < 0.01) continue
      const s = this.ps[i] * (1 + u * 2.2)
      ctx.globalAlpha = a
      ctx.drawImage(img, this.px[i] - s, this.py[i] - s, s * 2, s * 2)
    }
    ctx.globalAlpha = 1
  }

  drawBubbles(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    for (let i = 0; i < MAX_BUBBLES; i++) {
      if (!this.bAlive[i]) continue
      const r = this.br[i]
      const x = this.bx[i] + Math.sin(this.bp[i]) * r * 0.6
      const y = this.by[i]
      const wob = 1 + Math.sin(this.bp[i] * 1.7) * 0.08
      ctx.moveTo(x + r * wob, y)
      ctx.ellipse(x, y, r * wob, r / wob, 0, 0, TAU)
    }
    ctx.fillStyle = 'rgba(190,235,248,0.12)'
    ctx.fill()
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(210,244,252,0.6)'
    ctx.stroke()
    ctx.beginPath()
    for (let i = 0; i < MAX_BUBBLES; i++) {
      if (!this.bAlive[i]) continue
      const r = this.br[i]
      const x = this.bx[i] + Math.sin(this.bp[i]) * r * 0.6 - r * 0.35
      const y = this.by[i] - r * 0.35
      const s = Math.max(0.6, r * 0.28)
      ctx.moveTo(x + s, y)
      ctx.arc(x, y, s, 0, TAU)
    }
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.fill()
  }

  /** Drips (above the surface) and rings on the surface. */
  drawSurfaceFx(ctx: CanvasRenderingContext2D, wl: Waterline) {
    ctx.beginPath()
    let any = false
    for (let i = 0; i < MAX_DRIPS; i++) {
      if (!this.dAlive[i]) continue
      const x = this.dx[i]
      const y = this.dy[i]
      const hang = Math.min(1, this.da[i] / 0.35)
      const r = 1.6 * this.k * (0.6 + 0.4 * hang)
      const stretch = 1 + Math.min(2.2, this.dv[i] / (500 * this.k))
      ctx.moveTo(x + r, y)
      ctx.ellipse(x, y, r, r * stretch, 0, 0, TAU)
      any = true
    }
    if (any) {
      ctx.fillStyle = 'rgba(255,236,206,0.9)'
      ctx.fill()
    }
    if (!wl.active) return
    ctx.beginPath()
    any = false
    for (let i = 0; i < MAX_RINGS; i++) {
      if (!this.rAlive[i]) continue
      const u = this.ra[i] / 0.9
      const x = this.rx[i]
      const y = wl.at(x)
      const rr = this.rs[i] * (0.4 + u * 1.6)
      ctx.moveTo(x + rr, y)
      ctx.ellipse(x, y, rr, rr * 0.28, 0, 0, TAU)
      any = true
    }
    if (any) {
      ctx.lineWidth = 1.2
      ctx.strokeStyle = 'rgba(240,250,252,0.5)'
      ctx.stroke()
    }
  }

  /** Gulls in the sky, positioned relative to the horizon line. */
  drawGulls(ctx: CanvasRenderingContext2D, horizonY: number, t: number, ambient: boolean) {
    ctx.beginPath()
    for (let i = 0; i < this.gullCount; i++) {
      const o = i * 5
      const x = this.gulls[o]
      const y = horizonY - this.gulls[o + 1] + Math.sin(t * 0.5 + i) * 3
      const s = this.gulls[o + 4]
      const ph = this.gulls[o + 2]
      // flap in bursts, glide in between
      const glide = ambient ? Math.sin(ph * 0.17) > 0.3 : true
      const f = glide ? 0.25 : Math.sin(ph * 2.2)
      const tipY = -s * 0.55 * f
      ctx.moveTo(x - s * 1.6, y + tipY)
      ctx.quadraticCurveTo(x - s * 0.7, y - s * 0.45 - f * s * 0.2, x, y)
      ctx.quadraticCurveTo(x + s * 0.7, y - s * 0.45 - f * s * 0.2, x + s * 1.6, y + tipY)
    }
    ctx.lineWidth = Math.max(1.2, this.k * 1.6)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'rgba(40,34,56,0.85)'
    ctx.stroke()
  }
}

const TMP = new Float32Array(2)
