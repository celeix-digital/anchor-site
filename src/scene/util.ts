export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smooth = (t: number) => t * t * (3 - 2 * t)
export const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t))
export const easeOut = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t)
/** 0 → 1 → 0 window: rises over [a,b], falls over [c,d]. */
export const band = (v: number, a: number, b: number, c: number, d: number) =>
  smooth(clamp((v - a) / (b - a))) * (1 - smooth(clamp((v - c) / (d - c))))

/** Deterministic PRNG (mulberry32) so pre-rendered layers look the same on every resize. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.ceil(w))
  c.height = Math.max(1, Math.ceil(h))
  return c
}

export const rgba = (r: number, g: number, b: number, a: number) =>
  `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`

export function mixRGB(a: readonly number[], b: readonly number[], t: number) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}
