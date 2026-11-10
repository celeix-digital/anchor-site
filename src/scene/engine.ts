import { ANCHOR, coolPalette, drawChain, renderAnchorSprite, warmPalette, type ChainStyle, type Palette } from './anchor'
import { buildSeabed, drawKelp, type Seabed } from './seabed'
import { Waterline, buildSky, drawFoam, drawSky, drawSurfaceBand, type Sky } from './surface'
import { clamp, easeOut, lerp, mixRGB, smooth } from './util'
import { Water } from './water'
import { Layer, Life } from './life'

const TAU_SMOOTH = 0.15 // seconds; exponential smoothing of scroll progress
const HEAVE = 0.22 // viewports of scroll to heave in
const REST_TILT = (40 * Math.PI) / 180
// Local anchor points (units) that shed bubbles: stock balls, crown, flukes, shank.
const BUBBLE_POINTS = [-0.318, 0.15, 0.318, 0.15, 0, 0.95, -0.27, 0.56, 0.27, 0.56, 0, 0.5, 0, 0.3, -0.33, 0.68, 0.33, 0.68]

type Quality = { gl: number; dpr: number; life: number }
const QUALITY: Quality[] = [
  { gl: 0.7, dpr: 1.75, life: 1 },
  { gl: 0.58, dpr: 1.4, life: 0.7 },
  { gl: 0.5, dpr: 1.0, life: 0.45 },
]

/** Values other parts of the page may want each frame (e.g. the depth gauge). */
export type FrameInfo = { p: number; depth: number; call: number }
export type FrameListener = (info: FrameInfo) => void

export class Engine {
  private root: HTMLElement
  private glCanvas: HTMLCanvasElement
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private water: Water | null
  private raf = 0
  private running = false
  private destroyed = false

  // sizes
  private W = 0
  private H = 0
  private dpr = 1
  private q = 0
  private mobile = false

  // layout (css px)
  private unit = 0
  private cx = 0
  private sandY = 0
  private pivotY = 0
  private restPivotX = 0
  private ringUprightY = 0
  private ringEndY = 0
  private waterFinal = 0

  // scroll
  private vh = 1
  private maxScroll = 1
  private pTarget = 0
  private p = 0
  private first = true

  // time
  private last = 0
  private t = 0
  private ambient = true
  private slowFor = 0
  private frameEMA = 16

  // layers
  private seabed!: Seabed
  private sky!: Sky
  private coolSprite = document.createElement('canvas')
  private warmSprite = document.createElement('canvas')
  private spriteKey = ''
  private warmKey = ''
  private spriteO = { ox: 0, oy: 0, w: 0, h: 0 }
  private cool: Palette = coolPalette(0)
  private warm: Palette = warmPalette()
  private wl = new Waterline()
  private chainStyle: ChainStyle

  private listeners = new Set<FrameListener>()
  private info: FrameInfo = { p: 0, depth: 39, call: 0 }
  private life = new Life()
  private sPrev = 0
  private heavePrev = 0
  private ringPrevX = 0
  private ringPrevY = 0
  private populated = false
  private emitRing = { x: 0, y: 0, rot: 0 }
  private ro: ResizeObserver
  private mql: MediaQueryList
  private fallbackBg = ''

  constructor(root: HTMLElement) {
    this.root = root
    this.glCanvas = document.createElement('canvas')
    this.canvas = document.createElement('canvas')
    this.glCanvas.setAttribute('aria-hidden', 'true')
    this.canvas.setAttribute('aria-hidden', 'true')
    root.append(this.glCanvas, this.canvas)
    this.ctx = this.canvas.getContext('2d')!
    let water: Water | null = null
    try {
      water = Water.create(this.glCanvas)
    } catch (e) {
      console.warn('[scene] WebGL unavailable, using CSS gradient', e)
    }
    this.water = water
    if (!water) {
      this.glCanvas.remove()
      root.classList.add('no-webgl')
    }

    this.mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.ambient = !this.mql.matches
    if (!this.ambient) this.t = 12

    const wl = this.wl
    this.chainStyle = {
      link: 10,
      sandY: 0,
      waterY: (x: number) => wl.at(x),
      cool: this.cool,
      warm: this.warm,
    }

    this.ro = new ResizeObserver(() => this.measureScroll())
    this.ro.observe(document.body)
    window.addEventListener('resize', this.onResize)
    document.addEventListener('visibilitychange', this.onVisibility)
    this.mql.addEventListener('change', this.onMotionPref)
    document.fonts?.ready.then(() => this.measureScroll())

    this.resize()
    this.measureScroll()
    this.start()
  }

  subscribe(fn: FrameListener) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  destroy() {
    this.destroyed = true
    this.stop()
    this.ro.disconnect()
    window.removeEventListener('resize', this.onResize)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.mql.removeEventListener('change', this.onMotionPref)
    this.water?.destroy()
    this.glCanvas.remove()
    this.canvas.remove()
    this.listeners.clear()
  }

  /* ---------------- lifecycle ---------------- */

  private start() {
    if (this.running || this.destroyed) return
    this.running = true
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }
  private stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }
  private onVisibility = () => {
    if (document.hidden) this.stop()
    else this.start()
  }
  private onMotionPref = () => {
    this.ambient = !this.mql.matches
  }
  private onResize = () => {
    this.measureScroll()
    const w = this.root.clientWidth
    const h = this.root.clientHeight
    if (w !== this.W || h !== this.H) this.resize()
  }

  private measureScroll() {
    const de = document.documentElement
    this.vh = window.innerHeight || 1
    this.maxScroll = Math.max(1, de.scrollHeight - this.vh)
  }

  private resize() {
    const W = this.root.clientWidth || window.innerWidth
    const H = this.root.clientHeight || window.innerHeight
    this.W = W
    this.H = H
    const Q = QUALITY[this.q]
    this.dpr = Math.min(window.devicePixelRatio || 1, Q.dpr)
    this.canvas.width = Math.round(W * this.dpr)
    this.canvas.height = Math.round(H * this.dpr)
    this.water?.resize(Math.max(1, Math.round(W * Q.gl)), Math.max(1, Math.round(H * Q.gl)))

    // Layout mirrors the CSS tokens in index.css.
    const iw = window.innerWidth
    this.mobile = iw < 900
    const A = this.mobile ? 0.14 * H : Math.min(0.31 * H, 0.36 * iw)
    const unit = A / (ANCHOR.crownBottom - ANCHOR.top)
    this.unit = unit
    const sar = safeRight()
    const rail = 0.7 * A + 18
    this.cx = this.mobile ? W - sar - rail / 2 : W / 2
    this.sandY = H * (this.mobile ? 0.94 : 0.915)
    this.pivotY = this.sandY + unit * 0.012
    this.restPivotX = this.cx - unit * (this.mobile ? 0.36 : 0.33)
    this.ringUprightY = this.pivotY - ANCHOR.crownBottom * unit
    this.waterFinal = H * (this.mobile ? 0.24 : 0.3)
    this.ringEndY = this.waterFinal - ANCHOR.waterline * unit
    this.wl.W = W
    this.wl.amp = Math.max(2.5, H * 0.006)
    this.chainStyle.link = unit * 0.1

    const moundX = this.restPivotX + unit * 0.43
    this.seabed = buildSeabed(W, H, this.dpr, this.mobile, this.cx, moundX, unit)
    this.sky = buildSky(W, H, this.dpr, this.mobile, this.cx)
    this.life.resize(W, H, this.dpr, this.mobile)
    this.life.setQuality(Q.life)
    this.populated = false
    this.spriteKey = ''
    this.warmKey = ''
  }

  /* ---------------- frame ---------------- */

  private frame = (now: number) => {
    if (!this.running) return
    this.raf = requestAnimationFrame(this.frame)
    const dt = Math.min(0.1, Math.max(0, (now - this.last) / 1000))
    this.last = now
    if (this.ambient) this.t += dt
    this.adapt(dt)

    // Scroll progress, smoothed exponentially so the anchor feels heavy.
    this.pTarget = clamp(window.scrollY / this.maxScroll)
    if (this.first) {
      this.p = this.pTarget
      this.first = false
    } else {
      this.p += (this.pTarget - this.p) * (1 - Math.exp(-dt / TAU_SMOOTH))
      if (Math.abs(this.pTarget - this.p) < 1e-5) this.p = this.pTarget
    }
    this.render(dt)
  }

  private adapt(dt: number) {
    if (dt <= 0 || dt > 0.09) return // ignore stalls (tab switches, GC)
    this.frameEMA += (dt * 1000 - this.frameEMA) * 0.05
    if (this.frameEMA > 24) this.slowFor += dt
    else this.slowFor = Math.max(0, this.slowFor - dt * 0.5)
    if (this.slowFor > 3 && this.q < QUALITY.length - 1) {
      this.q++
      this.slowFor = 0
      this.frameEMA = 16
      this.resize()
    }
  }

  private emitAnchorBubble = (out: Float32Array) => {
    const i = Math.floor(Math.random() * BUBBLE_POINTS.length / 2) * 2
    const e = this.emitRing
    const lx = BUBBLE_POINTS[i] * this.unit
    const ly = BUBBLE_POINTS[i + 1] * this.unit
    const c = Math.cos(e.rot)
    const sn = Math.sin(e.rot)
    out[0] = e.x + lx * c - ly * sn
    out[1] = e.y + lx * sn + ly * c
    return out[1] > this.wl.at(out[0]) + 2
  }

  private emitDrip = (out: Float32Array) => {
    const e = this.emitRing
    const lx = (Math.random() - 0.5) * 0.6 * this.unit
    const ly = (ANCHOR.stockY + 0.02) * this.unit
    const c = Math.cos(e.rot)
    const sn = Math.sin(e.rot)
    out[0] = e.x + lx * c - ly * sn
    out[1] = e.y + lx * sn + ly * c
    return out[1] < this.wl.at(out[0]) - 3
  }

  private render(dt: number) {
    const { W, H, unit, ctx } = this
    const t = this.t
    const s = this.p * this.maxScroll
    const vh = this.vh
    const ldt = this.ambient ? dt : 0
    if (!this.populated) {
      this.life.populate(this.p)
      this.sPrev = s
      this.populated = true
    }
    const dCam = s - this.sPrev
    this.sPrev = s

    // Phases, all derived from the one smoothed progress value.
    const heaveRaw = clamp(s / (HEAVE * vh))
    const heave = smooth(heaveRaw)
    const surf = this.maxScroll > vh ? clamp((s - (this.maxScroll - vh)) / vh) : 0
    const ascRaw = clamp((s - HEAVE * vh) / Math.max(1, this.maxScroll - HEAVE * vh))
    const asc = ascRaw * 0.82 + smooth(ascRaw) * 0.18
    const lift = smooth(clamp(s / (0.4 * vh)))

    // Waterline descends through the final viewport.
    const wl = this.wl
    wl.t = t
    wl.active = surf > 0.001
    wl.y = lerp(-H * 0.06, this.waterFinal, smooth(surf) * 0.7 + easeOut(surf) * 0.3)

    this.life.update({ t, dt: ldt, p: this.p, dCam, wl })

    // Anchor pose
    let ringX: number
    let ringY: number
    let rot: number
    if (heaveRaw < 1) {
      rot = REST_TILT * (1 - heave)
      const pivotX = lerp(this.restPivotX, this.cx, heave)
      ringX = pivotX + Math.sin(rot) * ANCHOR.crownBottom * unit
      ringY = this.pivotY - Math.cos(rot) * ANCHOR.crownBottom * unit
    } else {
      const sw = smooth(clamp(ascRaw / 0.06)) * (1 - 0.7 * surf)
      rot = sw * (0.045 * Math.sin(t * 0.55) + 0.014 * Math.sin(t * 1.3 + 1))
      ringX = this.cx + sw * W * 0.004 * Math.sin(t * 0.55 - 0.6)
      ringY = lerp(this.ringUprightY, this.ringEndY, asc) + sw * H * 0.004 * Math.sin(t * 1.05)
    }

    // Seabed sinks away once the anchor is free.
    const sink = Math.max(0, s - 0.12 * vh)
    const offFront = sink * 0.95
    const offBack = sink * 0.62

    // Metal brightens as it rises.
    const k = Math.round(clamp(0.12 + this.p * 0.88) * 20) / 20
    this.ensureSprites(k, wl.active)

    /* ---- WebGL water ---- */
    if (this.water) {
      this.water.render({
        time: t,
        p: this.p,
        lift,
        anchorX: (this.restPivotX + unit * 0.33) / W,
        anchorY: (this.pivotY - unit * 0.42) / H,
        water: wl.active ? wl.y / H : -1,
        surf,
      })
    } else {
      this.paintFallback()
    }

    /* ---- Canvas 2D, back to front ---- */
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const life = this.life
    life.drawParticles(ctx, Layer.Far, this.p, t)
    life.drawCreatures(ctx, Layer.Far, this.p, t)

    // Seabed back layer and back kelp
    const sb = this.seabed
    const backY = this.sandY - sb.backGround + offBack
    if (backY < H) {
      ctx.drawImage(sb.back, 0, backY, W, sb.backH)
      for (const kk of sb.kelpBack) drawKelp(ctx, kk, backY + sb.backGround, t, H)
    }
    for (let v = 0; v < sb.vents.length; v++) life.vent(v, ldt, sb.vents[v].x, backY + sb.vents[v].y)

    life.drawParticles(ctx, Layer.Mid, this.p, t)
    life.drawCreatures(ctx, Layer.Mid, this.p, t)

    // Sky and port, clipped above the wave line; gulls in the sky
    drawSky(ctx, this.sky, wl, H, t, this.ambient)
    if (wl.active && wl.y > 0) {
      ctx.save()
      wl.traceAbove(ctx)
      ctx.clip()
      life.drawGulls(ctx, wl.y + H * 0.02 - this.sky.h + this.sky.horizon, t, this.ambient)
      ctx.restore()
    }

    // Chain and anchor
    const upX = Math.sin(rot)
    const upY = -Math.cos(rot)
    const cx0 = ringX + upX * ANCHOR.ringR * unit
    const cy0 = ringY + upY * ANCHOR.ringR * unit
    const topY = -H * 0.08
    const x3 = lerp(W * 1.08, ringX, heave)
    const y3 = lerp(-H * 0.12, topY, heave)
    const slack1x = cx0 + unit * 0.12
    const slack1y = this.sandY + unit * 0.7
    const slack2x = Math.min(cx0 + unit * 1.7, W * 1.0)
    const slack2y = this.sandY + unit * 0.7
    const x1 = lerp(slack1x, lerp(cx0, x3, 1 / 3), heave)
    const y1 = lerp(slack1y, lerp(cy0, y3, 1 / 3), heave)
    const x2 = lerp(slack2x, lerp(cx0, x3, 2 / 3), heave)
    const y2 = lerp(slack2y, lerp(cy0, y3, 2 / 3), heave)
    this.chainStyle.sandY = heaveRaw < 1 ? this.sandY - this.chainStyle.link * 0.15 + offFront : 1e9
    this.chainStyle.cool = this.cool
    drawChain(ctx, cx0, cy0, x1, y1, x2, y2, x3, y3, this.chainStyle, H)

    this.drawAnchor(ringX, ringY, rot)

    // Seabed front: sand strip, light pool, anchor shadow, front kelp
    const frontY = this.sandY - sb.frontTop + offFront
    if (frontY < H) {
      ctx.drawImage(sb.front, 0, frontY, W, sb.frontH)
      const sandSurf = frontY + sb.frontTop
      // soft pool of light under the shaft
      const restX = this.restPivotX + unit * 0.33
      const poolA = 0.16 * (1 - lift)
      if (poolA > 0.005) {
        const g = ctx.createRadialGradient(restX, sandSurf, 0, restX, sandSurf, unit * 0.9)
        g.addColorStop(0, `rgba(180,226,236,${poolA.toFixed(3)})`)
        g.addColorStop(1, 'rgba(180,226,236,0)')
        ctx.fillStyle = g
        ctx.fillRect(restX - unit, sandSurf - unit * 0.35, unit * 2, unit * 0.7)
      }
      // shadow
      const above = Math.max(0, sandSurf - (ringY + ANCHOR.crownBottom * unit))
      const shA = 0.45 * (1 - clamp(above / (H * 0.5)))
      if (shA > 0.01) {
        const sx = heaveRaw < 1 ? lerp(restX, this.cx, heave) : ringX
        const rw = unit * (0.45 + above / H)
        const g = ctx.createRadialGradient(sx, sandSurf + 2, 0, sx, sandSurf + 2, rw)
        g.addColorStop(0, `rgba(2,8,14,${shA.toFixed(3)})`)
        g.addColorStop(1, 'rgba(2,8,14,0)')
        ctx.save()
        ctx.translate(sx, sandSurf + 2)
        ctx.scale(1, 0.18)
        ctx.translate(-sx, -(sandSurf + 2))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(sx, sandSurf + 2, rw, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      for (const kk of sb.kelpFront) drawKelp(ctx, kk, sandSurf + 6, t, H)
    }

    // Emitters: anchor bubbles, sand puffs, drips
    this.emitRing.x = ringX
    this.emitRing.y = ringY
    this.emitRing.rot = rot
    const moving = Math.abs(dCam) / Math.max(dt, 1e-3) + Math.hypot(ringX - this.ringPrevX, ringY - this.ringPrevY) / Math.max(dt, 1e-3)
    this.ringPrevX = ringX
    this.ringPrevY = ringY
    life.anchorBubbles(ldt, clamp(moving / (vh * 0.5)) * 45 * QUALITY[this.q].life, this.emitAnchorBubble)
    const sandSurfNow = this.sandY + offFront
    if (this.heavePrev < 0.5 && heaveRaw >= 0.5) {
      life.puff(this.restPivotX + unit * 0.43, sandSurfNow, unit * 0.25, 22)
      life.puff(lerp(this.restPivotX, this.cx, heave), sandSurfNow, unit * 0.1, 8)
    } else if (this.heavePrev > 0.15 && heaveRaw <= 0.15) {
      life.puff(lerp(this.restPivotX, this.cx, heave) + unit * 0.2, sandSurfNow, unit * 0.35, 18)
    }
    this.heavePrev = heaveRaw
    if (wl.active && surf > 0.45) life.drip(ldt, 2.2, this.emitDrip)

    // Sand puffs, bubbles and near creatures, clipped below the wave line
    if (wl.active) {
      ctx.save()
      wl.traceBelow(ctx, H)
      ctx.clip()
    }
    life.drawPuffs(ctx)
    life.drawBubbles(ctx)
    life.drawParticles(ctx, Layer.Near, this.p, t)
    life.drawCreatures(ctx, Layer.Near, this.p, t)
    if (wl.active) ctx.restore()
    life.drawSurfaceFx(ctx, wl)

    // Surface: foam where the shank pierces the water, then the highlight band.
    if (wl.active) {
      const along = (wl.y - ringY) / Math.max(1e-3, -upY)
      if (along > ANCHOR.stockY * unit && along < ANCHOR.crownY * unit) {
        const fx = ringX - upX * along
        drawFoam(ctx, fx, wl.at(fx), unit * 0.12, t, smooth(clamp((surf - 0.35) / 0.3)))
      }
      drawSurfaceBand(ctx, wl, H, smooth(clamp(surf * 3)))
    }

    // Notify listeners (depth gauge etc.)
    if (this.listeners.size) {
      this.info.p = this.p
      this.info.depth = 39 * (1 - asc)
      this.info.call = heaveRaw < 0.08 ? 0 : heaveRaw < 0.97 ? 1 : ascRaw < 0.05 ? 2 : surf < 0.45 ? 3 : surf < 0.93 ? 4 : 5
      for (const fn of this.listeners) fn(this.info)
    }
  }

  private ensureSprites(k: number, needWarm: boolean) {
    const key = `${k}|${this.unit.toFixed(1)}|${this.dpr}`
    if (key !== this.spriteKey) {
      this.cool = coolPalette(k)
      const r = renderAnchorSprite(this.unit, this.dpr, this.cool, this.coolSprite)
      this.spriteO.ox = r.ox
      this.spriteO.oy = r.oy
      this.spriteO.w = this.coolSprite.width / this.dpr
      this.spriteO.h = this.coolSprite.height / this.dpr
      this.spriteKey = key
    }
    const wkey = `${this.unit.toFixed(1)}|${this.dpr}`
    if (needWarm && wkey !== this.warmKey) {
      renderAnchorSprite(this.unit, this.dpr, this.warm, this.warmSprite)
      this.warmKey = wkey
    }
  }

  private drawAnchor(ringX: number, ringY: number, rot: number) {
    const { ctx, wl, H } = this
    const o = this.spriteO
    const blit = (img: HTMLCanvasElement) => {
      ctx.save()
      ctx.translate(ringX, ringY)
      ctx.rotate(rot)
      ctx.drawImage(img, -o.ox, -o.oy, o.w, o.h)
      ctx.restore()
    }
    if (!wl.active || wl.y + wl.amp < ringY - this.unit * 0.12) {
      blit(this.coolSprite)
      return
    }
    // Below the surface stays blue, above it is lit by the sunrise.
    ctx.save()
    wl.traceBelow(ctx, H)
    ctx.clip()
    blit(this.coolSprite)
    ctx.restore()
    ctx.save()
    wl.traceAbove(ctx)
    ctx.clip()
    blit(this.warmSprite)
    ctx.restore()
  }

  private paintFallback() {
    const p = this.p
    const top = p < 0.5 ? mixRGB([11, 42, 74], [14, 74, 114], p / 0.5) : mixRGB([14, 74, 114], [24, 122, 156], (p - 0.5) / 0.5)
    const bot = p < 0.5 ? mixRGB([2, 11, 23], [4, 24, 45], p / 0.5) : mixRGB([4, 24, 45], [8, 56, 90], (p - 0.5) / 0.5)
    const bg = `linear-gradient(to bottom, rgb(${top.map(Math.round).join(',')}), rgb(${bot.map(Math.round).join(',')}))`
    if (bg !== this.fallbackBg) {
      this.fallbackBg = bg
      this.root.style.background = bg
    }
  }
}

function safeRight() {
  const probe = document.createElement('div')
  probe.style.cssText = 'position:fixed;visibility:hidden;padding-right:env(safe-area-inset-right,0px)'
  document.body.appendChild(probe)
  const v = parseFloat(getComputedStyle(probe).paddingRight) || 0
  probe.remove()
  return v
}
