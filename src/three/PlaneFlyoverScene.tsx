import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

function Plane() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime()
      const cycle = 8
      const flyDuration = 5
      const tc = t % cycle
      const x = tc <= flyDuration ? THREE.MathUtils.lerp(-9, 9, tc / flyDuration) : 9
      group.current.position.x = x
      group.current.position.y = Math.sin(t * 0.8) * 0.25
      group.current.rotation.z = Math.sin(t * 0.8) * 0.05
      group.current.rotation.y = Math.PI / 2
    }
  })
  return (
    <group ref={group} rotation={[0, Math.PI / 2, 0]} scale={0.9}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.22, 1.6, 6, 12]} />
        <meshStandardMaterial color="#f4f6f8" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.7, 0.06, 0.5]} />
        <meshStandardMaterial color="#ffb454" emissive="#ffb454" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.7, 0.12, 0]}>
        <boxGeometry args={[0.45, 0.4, 0.06]} />
        <meshStandardMaterial color="#ffb454" emissive="#ffb454" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.75, 0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.22, 0.4, 8]} />
        <meshStandardMaterial color="#f4f6f8" metalness={0.4} roughness={0.35} />
      </mesh>
      {[-0.05, -0.05].map((z, i) => (
        <mesh key={i} position={[-0.5, 0, i === 0 ? 0.42 : -0.42]}>
          <cylinderGeometry args={[0.05, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#38f0e0" emissive="#38f0e0" emissiveIntensity={1.4} />
        </mesh>
      ))}
    </group>
  )
}

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.position.x -= delta * 0.35
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      {[0, 0.5, -0.45, 0.9].map((x, i) => (
        <mesh key={i} position={[x, Math.abs(x) * 0.2, 0]}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial color="#1a2230" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  )
}

export default function PlaneFlyoverScene() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 8 }).map(() => ({
        position: [Math.random() * 20 - 10, Math.random() * 4 - 1, -3 - Math.random() * 4] as [
          number,
          number,
          number,
        ],
        scale: 0.6 + Math.random() * 0.9,
      })),
    [],
  )
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 5]} intensity={25} color="#ffb454" />
      <Plane />
      {clouds.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}
      <ParticleField radius={9} color="#ffb454" count={500} size={0.018} />
    </>
  )
}
