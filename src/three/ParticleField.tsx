import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({
  count = 900,
  radius = 9,
  color = '#38f0e0',
  size = 0.02,
  speed = 0.02,
}: {
  count?: number
  radius?: number
  color?: string
  size?: number
  speed?: number
}) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Kept out of the inner ~60% of the radius: with size-attenuated points,
      // anything that spawns close to the camera/subject renders as a large
      // square that can obscure the 3D scene in front of it — pushing the
      // whole field out to an outer shell keeps it as background atmosphere.
      const r = radius * (0.6 + Math.random() * 0.4)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count, radius])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed
      ref.current.rotation.x += delta * speed * 0.2
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
