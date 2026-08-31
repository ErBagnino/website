import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

const PETAL_COLORS = ['#ff7ab8', '#ffd166', '#c792ea', '#7ad9ff', '#ff9d7a', '#9ef2c2']

function ease(x: number) {
  return 1 - Math.pow(1 - x, 3)
}

function Stem({ curve, delay }: { curve: THREE.CatmullRomCurve3; delay: number }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 24, 0.018, 6, false), [curve])
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((state) => {
    if (mat.current) {
      const t = state.clock.getElapsedTime() - delay
      mat.current.opacity = THREE.MathUtils.clamp(t * 2.2, 0, 1)
    }
  })
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial ref={mat} color="#8a9a5b" metalness={0.1} roughness={0.6} transparent opacity={0} />
    </mesh>
  )
}

function Petal({ angle, color, delay }: { angle: number; color: string; delay: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() - delay
      const s = ease(THREE.MathUtils.clamp(t * 5, 0, 1))
      ref.current.scale.setScalar(s)
    }
  })
  return (
    <mesh ref={ref} position={[Math.cos(angle) * 0.13, Math.sin(angle) * 0.13, 0]} scale={0}>
      <sphereGeometry args={[0.1, 10, 10]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.4} />
    </mesh>
  )
}

function Flower({ position, color, delay }: { position: THREE.Vector3; color: string; delay: number }) {
  const group = useRef<THREE.Group>(null)
  const centerRef = useRef<THREE.Mesh>(null)
  const petals = 6

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
    if (centerRef.current) {
      const t = state.clock.getElapsedTime() - delay - petals * 0.05
      const s = ease(THREE.MathUtils.clamp(t * 5, 0, 1))
      centerRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={group} position={position}>
      {Array.from({ length: petals }).map((_, i) => (
        <Petal key={i} angle={(i / petals) * Math.PI * 2} color={color} delay={delay + i * 0.05} />
      ))}
      <mesh ref={centerRef} scale={0}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#fff3b0" emissive="#fff3b0" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function Wrap() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      const s = ease(THREE.MathUtils.clamp(t * 2, 0, 1))
      ref.current.scale.setScalar(s)
    }
  })
  return (
    <group ref={ref} scale={0}>
      <mesh position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.95, 1.6, 32, 1, true]} />
        <meshStandardMaterial color="#fdf6ec" side={THREE.DoubleSide} roughness={0.8} transparent opacity={0.92} />
      </mesh>
    </group>
  )
}

export default function BouquetScene() {
  const stems = useMemo(() => {
    const count = 17
    const vaseDelay = 0.55
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + (i % 2) * 0.18
      const ring = i % 3
      const spread = 0.32 + ring * 0.22
      const heightVariance = 1.3 + Math.sin(i * 2.1) * 0.3 + ring * 0.15
      const top = new THREE.Vector3(Math.cos(angle) * spread, heightVariance, Math.sin(angle) * spread)
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(Math.cos(angle) * spread * 0.4, 0, Math.sin(angle) * spread * 0.4),
        top,
      ])
      return {
        curve,
        top,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        stemDelay: vaseDelay + i * 0.055,
        flowerDelay: vaseDelay + i * 0.055 + 0.25,
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
        <Stem key={i} curve={s.curve} delay={s.stemDelay} />
      ))}
      {stems.map((s, i) => (
        <Flower key={i} position={s.top} color={s.color} delay={s.flowerDelay} />
      ))}
      <ParticleField radius={8} color="#ff7ab8" count={500} size={0.018} />
    </group>
  )
}
