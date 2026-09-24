import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { Canvas } from '@react-three/fiber'
import { hasWebGL } from '../lib/webgl'

interface Scene3DProps extends ComponentProps<typeof Canvas> {
  /** Describes the animation for screen readers and for the no-WebGL fallback. */
  label: string
}

function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.01 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, inView] as const
}

// Weaker/mobile devices render the same three.js scenes at a much higher
// relative cost — capping the pixel ratio keeps frame time in check without
// visibly softening the image on a normal screen.
function devicePixelRatioCap(): [number, number] {
  if (typeof window === 'undefined') return [1, 2]
  const isNarrow = window.innerWidth < 768
  const weakHardware = (navigator as { hardwareConcurrency?: number }).hardwareConcurrency !== undefined && (navigator as { hardwareConcurrency?: number }).hardwareConcurrency! <= 4
  return isNarrow || weakHardware ? [1, 1.5] : [1, 2]
}

export default function Scene3D({ label, children, dpr, frameloop, ...canvasProps }: Scene3DProps) {
  const [supported] = useState(hasWebGL)
  const [containerRef, inView] = useInView<HTMLDivElement>()

  if (!supported) {
    return (
      <div
        role="img"
        aria-label={label}
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 to-transparent p-6 text-center text-sm text-white/50"
      >
        <span className="max-w-xs">{label}</span>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        role="img"
        aria-label={label}
        dpr={dpr ?? devicePixelRatioCap()}
        frameloop={frameloop ?? (inView ? 'always' : 'never')}
        {...canvasProps}
      >
        {children}
      </Canvas>
    </div>
  )
}
