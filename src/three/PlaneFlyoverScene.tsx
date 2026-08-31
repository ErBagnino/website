import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

const ACCENT = '#ffb454'

function Plane() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    const cycle = 10
    const flyDuration = 6.5
    const tc = t % cycle
    const progress = Math.min(tc / flyDuration, 1)
    const x = THREE.MathUtils.lerp(-8.5, 8.5, progress)
    const bob = Math.sin(t * 0.7) * 0.3 + Math.sin(t * 0.23 + 1) * 0.15
    const zDrift = Math.sin(t * 0.42) * 0.5

    group.current.position.set(x, bob, zDrift)

    const climbRate = Math.cos(t * 0.7) * 0.7 * 0.3 + Math.cos(t * 0.23 + 1) * 0.15 * 0.23
    group.current.rotation.z = THREE.MathUtils.clamp(-climbRate * 0.6, -0.3, 0.3)
    group.current.rotation.x = Math.sin(t * 0.7) * 0.04
    group.current.rotation.y = Math.sin(t * 0.42) * 0.1
    group.current.visible = tc <= flyDuration + 0.15
  })

  const body = { color: '#f7f9fb', emissive: '#8fa3b5', emissiveIntensity: 0.18, metalness: 0.25, roughness: 0.4 }

  return (
    <group ref={group} scale={0.85}>
      {/* fuselage, nose pointing +X */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.2, 1.3, 6, 12]} />
        <meshStandardMaterial {...body} />
      </mesh>
      <mesh position={[0.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.2, 0.45, 12]} />
        <meshStandardMaterial {...body} />
      </mesh>

      {/* cockpit glass */}
      <mesh position={[0.55, 0.13, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
        <meshStandardMaterial color="#9fe6ff" emissive="#9fe6ff" emissiveIntensity={0.6} transparent opacity={0.75} />
      </mesh>

      {/* wings */}
      <mesh position={[-0.05, -0.02, 0]}>
        <boxGeometry args={[0.55, 0.04, 2.3]} />
        <meshStandardMaterial {...body} />
      </mesh>
      <mesh position={[-0.05, -0.02, 0.9]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[0.4, 0.03, 0.5]} />
        <meshStandardMaterial {...body} />
      </mesh>
      <mesh position={[-0.05, -0.02, -0.9]} rotation={[0, -0.25, 0]}>
        <boxGeometry args={[0.4, 0.03, 0.5]} />
        <meshStandardMaterial {...body} />
      </mesh>

      {/* tail — smaller, swept fin */}
      <mesh position={[-0.82, 0.16, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.22, 0.28, 0.025]} />
        <meshStandardMaterial {...body} />
      </mesh>
      <mesh position={[-0.8, 0.02, 0]}>
        <boxGeometry args={[0.22, 0.025, 0.42]} />
        <meshStandardMaterial {...body} />
      </mesh>

      {/* livery stripe */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[1.75, 0.05, 0.42]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>

      {/* engines */}
      {[0.75, -0.75].map((z, i) => (
        <mesh key={i} position={[-0.05, -0.24, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.32, 10]} />
          <meshStandardMaterial color="#22303f" metalness={0.6} roughness={0.3} emissive={ACCENT} emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* nav light */}
      <mesh position={[-0.84, 0.02, 0.24]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ff5566" emissive="#ff5566" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x -= delta * 0.3
      if (ref.current.position.x < -13) ref.current.position.x = 13
    }
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      {[0, 0.5, -0.45, 0.9].map((x, i) => (
        <mesh key={i} position={[x, Math.abs(x) * 0.15, 0]}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial color="#3a3355" transparent opacity={0.45} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export default function PlaneFlyoverScene() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 9 }).map(() => ({
        position: [Math.random() * 24 - 12, Math.random() * 3.5 - 0.5, -3 - Math.random() * 5] as [
          number,
          number,
          number,
        ],
        scale: 0.6 + Math.random() * 1,
      })),
    [],
  )
  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[2, 3, 6]} intensity={26} color="#fff6e8" />
      <pointLight position={[0, 2, 5]} intensity={14} color={ACCENT} />
      <pointLight position={[-4, -2, 3]} intensity={8} color="#7ad9ff" />
      <Plane />
      {clouds.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}
      <ParticleField radius={9} color="#ffe3b0" count={350} size={0.014} />
    </>
  )
}
