import { useEffect, useRef } from 'react'

/*
 * A small stock anchor on a chain in the right-hand margin. It hangs low at the
 * top of the page and is hauled up as you scroll, reaching the top by the closing
 * "Anchor clear" section. It swings a little while moving and settles when you
 * stop. Everything is written straight to the DOM from one rAF loop that only
 * runs while something is moving.
 */
export default function AnchorRail() {
  const groupRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const group = groupRef.current
    const anchor = anchorRef.current
    if (!group || !anchor) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    let y = 0
    let ang = 0
    let angV = 0
    let last = 0
    let raf = 0
    let running = false
    let first = true

    const targetY = () => {
      const vh = window.innerHeight
      const h = anchor.getBoundingClientRect().height || 70
      const max = Math.max(1, document.documentElement.scrollHeight - vh)
      const p = Math.min(1, Math.max(0, window.scrollY / max))
      const top = vh * 0.16
      const bottom = vh - h - vh * 0.07
      return bottom + (top - bottom) * p
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      last = now
      const target = targetY()
      const prev = y
      if (first || reduce.matches) {
        y = target
      } else {
        y += (target - y) * (1 - Math.exp(-dt / 0.22))
      }
      const v = first ? 0 : (y - prev) / dt
      if (reduce.matches) {
        ang = 0
        angV = 0
      } else {
        // a damped spring towards a tilt set by speed, so it swings and settles
        const drive = Math.max(-9, Math.min(9, v * 0.022))
        angV += (60 * (drive - ang) - 6.5 * angV) * dt
        ang += angV * dt
      }
      if (first) {
        group.classList.add('is-ready')
        first = false
      }
      group.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
      anchor.style.transform = `rotate(${ang.toFixed(2)}deg)`
      if (Math.abs(target - y) < 0.2 && Math.abs(ang) < 0.04 && Math.abs(angV) < 0.04) {
        running = false
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const kick = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    kick()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    document.fonts?.ready.then(kick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [])

  return (
    <div className="rail" aria-hidden="true">
      <div ref={groupRef} className="rail-group">
        <span className="rail-chain" />
        <svg ref={anchorRef} className="rail-anchor" viewBox="0 0 60 100" focusable="false">
          <defs>
            <linearGradient id="rail-metal" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#0b2a4a" />
              <stop offset="0.38" stopColor="#4a6a88" />
              <stop offset="0.62" stopColor="#1d3e60" />
              <stop offset="1" stopColor="#0b2a4a" />
            </linearGradient>
          </defs>
          {/* ring */}
          <circle cx="30" cy="8" r="5.6" fill="none" stroke="#0b2a4a" strokeWidth="3" />
          {/* arms */}
          <path d="M30 84 Q 10 86 10.5 62" fill="none" stroke="url(#rail-metal)" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M30 84 Q 50 86 49.5 62" fill="none" stroke="url(#rail-metal)" strokeWidth="4.2" strokeLinecap="round" />
          {/* flukes */}
          <path d="M10.5 50 L 3.5 66 L 10.5 61.5 L 17 65.5 Z" fill="#0b2a4a" />
          <path d="M49.5 50 L 56.5 66 L 49.5 61.5 L 43 65.5 Z" fill="#0b2a4a" />
          {/* shank */}
          <path d="M28.2 13 L 31.8 13 L 33.4 82 L 26.6 82 Z" fill="url(#rail-metal)" />
          {/* stock with ball ends */}
          <rect x="9" y="18.5" width="42" height="4" rx="2" fill="#0b2a4a" />
          <circle cx="8.5" cy="20.5" r="3.4" fill="#0b2a4a" />
          <circle cx="51.5" cy="20.5" r="3.4" fill="#0b2a4a" />
          <rect x="26" y="17" width="8" height="7" rx="1.6" fill="#2a4b6c" />
          {/* crown */}
          <circle cx="30" cy="84.5" r="4.6" fill="#0b2a4a" />
        </svg>
      </div>
    </div>
  )
}
