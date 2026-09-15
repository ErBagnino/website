import { useState, type ComponentProps } from 'react'
import { Canvas } from '@react-three/fiber'
import { hasWebGL } from '../lib/webgl'

interface Scene3DProps extends ComponentProps<typeof Canvas> {
  /** Describes the animation for screen readers and for the no-WebGL fallback. */
  label: string
}

export default function Scene3D({ label, children, ...canvasProps }: Scene3DProps) {
  const [supported] = useState(hasWebGL)

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
    <Canvas role="img" aria-label={label} {...canvasProps}>
      {children}
    </Canvas>
  )
}
