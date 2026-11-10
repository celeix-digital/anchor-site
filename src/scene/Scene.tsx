import { useEffect, useRef } from 'react'
import { gauge } from '../content'
import { Engine } from './engine'

const TICKS = 14 // one every 3 m from 0 to 39

/** Mounts the imperative scene engine once. Nothing per-frame goes through React. */
export default function Scene() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const readRef = useRef<HTMLSpanElement>(null)
  const callsRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const root = sceneRef.current
    if (!root) return
    const engine = new Engine(root)

    // Depth gauge: written straight to the DOM from the engine's frame callback.
    const track = trackRef.current
    const marker = markerRef.current
    const read = readRef.current
    const calls = callsRef.current
    let trackH = track?.clientHeight ?? 0
    const ro = new ResizeObserver(() => {
      trackH = track?.clientHeight ?? 0
      lastY = -1
    })
    if (track) ro.observe(track)
    let lastY = -1
    let lastM = -1
    let lastCall = -1
    const off = engine.subscribe(({ depth, call }) => {
      if (!marker || !read || !trackH) return
      const y = Math.round((depth / 39) * trackH * 2) / 2
      if (y !== lastY) {
        lastY = y
        marker.style.transform = `translate3d(0, ${y}px, 0)`
      }
      const m = Math.round(depth)
      if (m !== lastM) {
        lastM = m
        read.textContent = `${m} m`
      }
      if (call !== lastCall) {
        lastCall = call
        calls?.querySelectorAll<HTMLElement>('li').forEach((el) => el.classList.toggle('is-active', Number(el.dataset.i) === call))
      }
    })
    return () => {
      off()
      ro.disconnect()
      engine.destroy()
    }
  }, [])

  return (
    <>
      <div ref={sceneRef} className="scene" aria-hidden="true" />
      <div className="gauge" aria-hidden="true">
        <div className="gauge-scale">
          <div ref={trackRef} className="gauge-track">
            {Array.from({ length: TICKS }, (_, i) => (
              <span key={i} className={`gauge-tick${i % 3 === 0 ? ' is-major' : ''}`} style={{ top: `${(i / (TICKS - 1)) * 100}%` }} />
            ))}
            <div ref={markerRef} className="gauge-marker">
              <span ref={readRef} className="gauge-read">
                39 m
              </span>
            </div>
          </div>
        </div>
        <ol ref={callsRef} className="gauge-calls">
          {gauge.calls
            .map((label, i) => (
              <li key={label} data-i={i} className={i === 0 ? 'is-active' : undefined}>
                {label}
              </li>
            ))
            .reverse()}
        </ol>
      </div>
    </>
  )
}
