import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

// A much wider, more varied palette than a typical bouquet needs — flowers
// arrive one at a time, cycling through colors in a decorrelated order, so
// the assembly reads as "many different flowers appearing" rather than a
// handful of colors repeating in a visible pattern.
const PETAL_COLORS = [
  '#ff7ab8', '#ffd166', '#c792ea', '#7ad9ff', '#ff9d7a',
  '#9ef2c2', '#ff5c8a', '#f4a3ff', '#ffe0a3', '#b8f0ff',
]

const GOLDEN_ANGLE = 2.399963987

function ease(x: number) {
  return 1 - Math.pow(1 - x, 3)
}

function jitter(seed: number, amount: number) {
  const n = Math.sin(seed * 12.9898) * 43758.5453
  return (n - Math.floor(n) - 0.5) * 2 * amount
}

function Stem({ curve, delay }: { curve: THREE.CatmullRomCurve3; delay: number }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.02, 6, false), [curve])
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((state) => {
    if (mat.current) {
      const t = state.clock.getElapsedTime() - delay
      mat.current.opacity = THREE.MathUtils.clamp(t * 2.2, 0, 1)
    }
  })
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial ref={mat} color="#7d9a52" metalness={0} roughness={0.95} transparent opacity={0} />
    </mesh>
  )
}

// A pipe-cleaner "petal" is modelled as a fat, pinched loop of chenille —
// not a smooth sphere — which is what actually reads as fuzzy wire-and-fibre
// craftwork instead of plastic or glass.
function PetalLoop({ angle, color, delay, seed }: { angle: number; color: string; delay: number; seed: number }) {
  const ref = useRef<THREE.Group>(null)
  const tilt = 0.55 + jitter(seed, 0.18)
  const scaleVariance = 1 + jitter(seed + 5, 0.16)
  const radius = 0.14 + jitter(seed + 9, 0.02)

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() - delay
      const s = ease(THREE.MathUtils.clamp(t * 5, 0, 1)) * scaleVariance
      ref.current.scale.setScalar(s)
    }
  })

  return (
    <group
      ref={ref}
      position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius]}
      rotation={[tilt, angle + jitter(seed + 2, 0.3), jitter(seed + 3, 0.4)]}
      scale={0}
    >
      <mesh>
        <torusGeometry args={[0.075, 0.028, 6, 10, Math.PI * 1.5]} />
        <meshStandardMaterial color={color} roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}

function Flower({ position, color, delay, seed }: { position: THREE.Vector3; color: string; delay: number; seed: number }) {
  const group = useRef<THREE.Group>(null)
  const centerRef = useRef<THREE.Mesh>(null)
  const petals = 6

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.25 + seed
    }
    if (centerRef.current) {
      const t = state.clock.getElapsedTime() - delay - petals * 0.045
      const s = ease(THREE.MathUtils.clamp(t * 5, 0, 1))
      centerRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={group} position={position} rotation={[jitter(seed + 1, 0.4), 0, jitter(seed + 4, 0.3)]}>
      {Array.from({ length: petals }).map((_, i) => (
        <PetalLoop
          key={i}
          angle={(i / petals) * Math.PI * 2 + jitter(seed + i, 0.25)}
          color={color}
          delay={delay + i * 0.045}
          seed={seed * 3.7 + i}
        />
      ))}
      <mesh ref={centerRef} scale={0}>
        <icosahedronGeometry args={[0.075, 0]} />
        <meshStandardMaterial color="#e8c37a" roughness={0.9} metalness={0} />
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
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.5, 0.88, 28, 1, true]} />
        <meshStandardMaterial color="#efe2c8" side={THREE.DoubleSide} roughness={0.85} transparent opacity={0.94} />
      </mesh>
      <mesh position={[0, -0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.02, 8, 24]} />
        <meshStandardMaterial color="#c9a876" roughness={0.7} />
      </mesh>
    </group>
  )
}

export default function BouquetScene() {
  const stems = useMemo(() => {
    const count = 34
    const vaseDelay = 0.5
    const maxRadius = 0.72
    return Array.from({ length: count }).map((_, i) => {
      const angle = i * GOLDEN_ANGLE
      const r = maxRadius * Math.sqrt((i + 0.5) / count)
      const domeFalloff = Math.pow(r / maxRadius, 1.3)
      const height = 1.35 - domeFalloff * 0.6 + jitter(i, 0.08)
      const top = new THREE.Vector3(Math.cos(angle) * r, height, Math.sin(angle) * r)
      const mid = new THREE.Vector3(Math.cos(angle) * r * 0.45, -0.05 + jitter(i + 50, 0.06), Math.sin(angle) * r * 0.45)
      const base = new THREE.Vector3(jitter(i + 80, 0.03), -0.82, jitter(i + 90, 0.03))
      const curve = new THREE.CatmullRomCurve3([base, mid, top])
      return {
        curve,
        top,
        color: PETAL_COLORS[Math.floor(((i * 0.6180339887) % 1) * PETAL_COLORS.length)],
        stemDelay: vaseDelay + i * 0.042,
        flowerDelay: vaseDelay + i * 0.042 + 0.22,
        seed: i,
      }
    })
  }, [])

  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.25
  })

  return (
    <group ref={group}>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 3, 4]} intensity={22} color="#ff9dc4" />
      <pointLight position={[-2, 1, 3]} intensity={10} color="#c9e8ff" />
      <Wrap />
      {stems.map((s, i) => (
        <Stem key={i} curve={s.curve} delay={s.stemDelay} />
      ))}
      {stems.map((s, i) => (
        <Flower key={i} position={s.top} color={s.color} delay={s.flowerDelay} seed={s.seed} />
      ))}
      <ParticleField radius={8} color="#ff7ab8" count={420} size={0.016} />
    </group>
  )
}
