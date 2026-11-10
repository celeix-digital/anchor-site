import { useEffect, useRef } from 'react'
import { Engine } from './engine'

/** Mounts the imperative scene engine once. Nothing per-frame goes through React. */
export default function Scene() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const engine = new Engine(root)
    return () => engine.destroy()
  }, [])
  return <div ref={ref} className="scene" aria-hidden="true" />
}
