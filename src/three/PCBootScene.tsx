import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

function Screen() {
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((state) => {
    if (mat.current) {
      const t = state.clock.getElapsedTime()
      const boot = Math.min(1, t / 2.2)
      mat.current.emissiveIntensity = boot * (1.6 + Math.sin(t * 8) * 0.05 * boot)
    }
  })
  return (
    <mesh position={[0, 0.15, 0.06]}>
      <planeGeometry args={[3.2, 1.9]} />
      <meshStandardMaterial ref={mat} color="#031014" emissive="#38f0e0" emissiveIntensity={0} toneMapped={false} />
    </mesh>
  )
}

function ScanLines() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      ref.current.position.y = 0.15 + ((t * 0.6) % 1.9) - 0.95
    }
  })
  return (
    <mesh ref={ref} position={[0, -0.8, 0.07]}>
      <planeGeometry args={[3.15, 0.05]} />
      <meshBasicMaterial color="#8ef5e8" transparent opacity={0.5} toneMapped={false} />
    </mesh>
  )
}

function Monitor() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.08
    }
  })
  return (
    <group ref={group}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[3.5, 2.2, 0.12]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.6} roughness={0.35} />
      </mesh>
      <Screen />
      <ScanLines />
      <mesh position={[0, -1.25, -0.1]}>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.75, -0.1]}>
        <boxGeometry args={[1.6, 0.08, 0.7]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.7} roughness={0.3} />
      </mesh>
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, 0.15, 0]}>
          <boxGeometry args={[0.06, 2.2, 0.14]} />
          <meshStandardMaterial color="#38f0e0" emissive="#38f0e0" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function FloatingPanel({ position, delay }: { position: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() - delay
      ref.current.visible = t > 0
      ref.current.position.y = position[1] + Math.sin((t + delay) * 1.2) * 0.08
      ref.current.rotation.y = Math.sin(t * 0.5) * 0.3
    }
  })
  return (
    <group ref={ref} position={position}>
      <mesh>
        <planeGeometry args={[0.7, 0.45]} />
        <meshBasicMaterial color="#38f0e0" wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

export default function PCBootScene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 1, 4]} intensity={30} color="#38f0e0" />
      <Monitor />
      <FloatingPanel position={[-2.8, 1, -0.5]} delay={1.4} />
      <FloatingPanel position={[2.8, -0.6, -0.5]} delay={1.9} />
      <FloatingPanel position={[-2.6, -1.2, -1]} delay={2.3} />
      <ParticleField radius={8} color="#38f0e0" count={500} size={0.018} />
    </>
  )
}
