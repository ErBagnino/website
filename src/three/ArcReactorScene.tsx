import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

function neonPulse(t: number, delay: number, rampDuration = 0.9) {
  const local = t - delay
  if (local < 0) return 0
  if (local < rampDuration) {
    const base = Math.min(1, local / rampDuration)
    const flicker = Math.sin(local * 41) > 0.75 || Math.sin(local * 17 + 2) > 0.88 ? 0.25 : 1
    return base * flicker
  }
  return 1
}

interface RingProps {
  radius: number
  tube: number
  speed: number
  tilt: [number, number, number]
  color: string
  segments?: number
  delay: number
  scatter: boolean
  instant: boolean
}

function Ring({ radius, tube, speed, tilt, color, segments = 4, delay, scatter, instant }: RingProps) {
  const group = useRef<THREE.Group>(null)
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  const scatterProgress = useRef(instant && scatter ? 1 : 0)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.z += delta * speed

    const t = state.clock.getElapsedTime()
    const target = scatter ? 1 : 0
    scatterProgress.current = instant ? target : THREE.MathUtils.damp(scatterProgress.current, target, 2.2, delta)
    const sp = scatterProgress.current
    group.current.scale.setScalar(1 + sp * 1.7)

    const power = instant ? 1 : neonPulse(t, delay)
    const opacity = THREE.MathUtils.lerp(0.95, 0.14, sp) * power
    const intensity = THREE.MathUtils.lerp(2.4, 0.5, sp) * power
    mats.current.forEach((m) => {
      if (!m) return
      m.opacity = opacity
      m.emissiveIntensity = intensity
    })
  })

  return (
    <group ref={group} rotation={tilt}>
      {Array.from({ length: segments }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / segments) * Math.PI * 2]}>
          <torusGeometry args={[radius, tube, 8, 48, (Math.PI * 2) / segments - 0.18]} />
          <meshStandardMaterial
            ref={(m) => {
              mats.current[i] = m
            }}
            color={color}
            emissive={color}
            emissiveIntensity={0}
            transparent
            opacity={0}
            toneMapped={false}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function Core({ scatter, instant }: { scatter: boolean; instant: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const scatterProgress = useRef(instant && scatter ? 1 : 0)

  useFrame((state, delta) => {
    if (!ref.current || !mat.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.6
    ref.current.rotation.x = t * 0.3

    const target = scatter ? 1 : 0
    scatterProgress.current = instant ? target : THREE.MathUtils.damp(scatterProgress.current, target, 2.2, delta)
    const sp = scatterProgress.current

    const power = instant ? 1 : neonPulse(t, 0, 0.7)
    const s = (1 + Math.sin(t * 2) * 0.05) * THREE.MathUtils.lerp(1, 0.28, sp)
    ref.current.scale.setScalar(s)
    mat.current.opacity = THREE.MathUtils.lerp(1, 0.05, sp) * power
    mat.current.emissiveIntensity = THREE.MathUtils.lerp(3, 0.4, sp) * power
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.85, 1]} />
      <meshStandardMaterial
        ref={mat}
        color="#38f0e0"
        emissive="#38f0e0"
        emissiveIntensity={0}
        wireframe
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  )
}

interface ArcReactorSceneProps {
  scatter?: boolean
  instant?: boolean
}

export default function ArcReactorScene({ scatter = false, instant = false }: ArcReactorSceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 4]} intensity={40} color="#38f0e0" />
      <Core scatter={scatter} instant={instant} />
      <Ring
        radius={1.6}
        tube={0.022}
        speed={0.4}
        tilt={[0.55, 0, 0.1]}
        color="#38f0e0"
        segments={3}
        delay={0.3}
        scatter={scatter}
        instant={instant}
      />
      <Ring
        radius={2.2}
        tube={0.016}
        speed={-0.28}
        tilt={[0.3, 0.5, -0.15]}
        color="#8ef5e8"
        segments={5}
        delay={1.0}
        scatter={scatter}
        instant={instant}
      />
      <Ring
        radius={2.8}
        tube={0.013}
        speed={0.18}
        tilt={[0.15, -0.35, 0.2]}
        color="#38f0e0"
        segments={7}
        delay={1.7}
        scatter={scatter}
        instant={instant}
      />
      <ParticleField radius={7} color="#38f0e0" count={700} />
    </>
  )
}
