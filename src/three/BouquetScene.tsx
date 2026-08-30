import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

const PETAL_COLORS = ['#ff7ab8', '#ffd166', '#c792ea', '#7ad9ff']

function Stem({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 24, 0.02, 6, false), [curve])
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#8a9a5b" metalness={0.1} roughness={0.6} />
    </mesh>
  )
}

function Flower({ position, color, delay }: { position: THREE.Vector3; color: string; delay: number }) {
  const group = useRef<THREE.Group>(null)
  const petals = 6

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime() - delay
      const s = THREE.MathUtils.clamp(t * 1.6, 0, 1)
      const eased = 1 - Math.pow(1 - s, 3)
      group.current.scale.setScalar(eased)
      group.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <group ref={group} position={position} scale={0}>
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.13, Math.sin(angle) * 0.13, 0]}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.4} />
          </mesh>
        )
      })}
      <mesh>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#fff3b0" emissive="#fff3b0" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function Wrap() {
  return (
    <mesh position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.85, 1.6, 32, 1, true]} />
      <meshStandardMaterial color="#fdf6ec" side={THREE.DoubleSide} roughness={0.8} transparent opacity={0.92} />
    </mesh>
  )
}

export default function BouquetScene() {
  const stems = useMemo(() => {
    const count = 9
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2
      const spread = 0.55 + (i % 3) * 0.18
      const top = new THREE.Vector3(
        Math.cos(angle) * spread,
        1.5 + Math.sin(i * 1.7) * 0.35,
        Math.sin(angle) * spread,
      )
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(Math.cos(angle) * spread * 0.4, 0, Math.sin(angle) * spread * 0.4),
        top,
      ])
      return {
        curve,
        top,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        delay: 0.4 + i * 0.18,
      }
    })
  }, [])

  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.25
  })

  return (
    <group ref={group}>
      <ambientLight intensity={0.55} />
      <pointLight position={[2, 3, 4]} intensity={25} color="#ff7ab8" />
      <pointLight position={[-2, 1, 3]} intensity={12} color="#7ad9ff" />
      <Wrap />
      {stems.map((s, i) => (
        <Stem key={i} curve={s.curve} />
      ))}
      {stems.map((s, i) => (
        <Flower key={i} position={s.top} color={s.color} delay={s.delay} />
      ))}
      <ParticleField radius={8} color="#ff7ab8" count={500} size={0.018} />
    </group>
  )
}
