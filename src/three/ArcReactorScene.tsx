import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

function Ring({
  radius,
  tube,
  speed,
  tilt,
  color,
  segments = 4,
}: {
  radius: number
  tube: number
  speed: number
  tilt: [number, number, number]
  color: string
  segments?: number
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed
  })
  return (
    <group ref={ref} rotation={tilt}>
      {Array.from({ length: segments }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / segments) * Math.PI * 2]}>
          <torusGeometry args={[radius, tube, 8, 48, (Math.PI * 2) / segments - 0.18]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.2}
            toneMapped={false}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function Core() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      ref.current.rotation.y = t * 0.6
      ref.current.rotation.x = t * 0.3
      const s = 1 + Math.sin(t * 2) * 0.05
      ref.current.scale.setScalar(s)
    }
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.85, 1]} />
      <meshStandardMaterial
        color="#38f0e0"
        emissive="#38f0e0"
        emissiveIntensity={3}
        wireframe
        toneMapped={false}
      />
    </mesh>
  )
}

export default function ArcReactorScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 4]} intensity={40} color="#38f0e0" />
      <Core />
      <Ring radius={1.6} tube={0.022} speed={0.4} tilt={[0.55, 0, 0.1]} color="#38f0e0" segments={3} />
      <Ring radius={2.2} tube={0.016} speed={-0.28} tilt={[0.3, 0.5, -0.15]} color="#8ef5e8" segments={5} />
      <Ring radius={2.8} tube={0.013} speed={0.18} tilt={[0.15, -0.35, 0.2]} color="#38f0e0" segments={7} />
      <ParticleField radius={7} color="#38f0e0" count={700} />
    </>
  )
}
