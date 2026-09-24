import { useRef, useState, type ReactNode } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

const ACCENT = '#8fe0e8'
const HAIR = '#d9bc7e'
const EYE = '#5fe38a'

// The avatar is presented as a holographic scan of Adam rather than an attempt at
// photoreal likeness: a faceted (literally diamond-cut) head and chest lit from
// within plus an additive rim edge — the same emissive-glow language as the rest
// of the site's HUD — with only hair and eyes rendered fully opaque so they read
// as the one "alive" accent against the scanned shell.
function HologramShell({ children }: { children: ReactNode }) {
  return <group>{children}</group>
}

function HoloMaterial({ intensity = 0.7 }: { intensity?: number }) {
  return (
    <meshStandardMaterial
      color={ACCENT}
      emissive={ACCENT}
      emissiveIntensity={intensity}
      transparent
      opacity={0.5}
      roughness={0.35}
      metalness={0.05}
      toneMapped={false}
    />
  )
}

function RimMesh({ geometry, scale = 1.06, opacity = 0.55 }: { geometry: ReactNode; scale?: number; opacity?: number }) {
  return (
    <mesh scale={scale}>
      {geometry}
      <meshBasicMaterial color={ACCENT} side={THREE.BackSide} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function Head({ blink }: { blink: number }) {
  return (
    <group position={[0, 1.32, 0]}>
      <pointLight position={[0, 0, 0]} intensity={3} color={ACCENT} distance={1.2} />

      {/* faceted "diamond-cut" head */}
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <HoloMaterial intensity={0.55} />
      </mesh>
      <RimMesh geometry={<icosahedronGeometry args={[0.42, 1]} />} scale={1.1} />

      {/* hair: a tousled forward tuft, ash-blonde, clustered tight over the crown */}
      <group position={[0.02, 0.32, 0.08]} rotation={[0.15, 0, 0]}>
        {[
          [-0.1, 0, 0.05, 0.75, 0.85],
          [-0.02, 0.02, 0.09, 0.85, 1],
          [0.08, 0, 0.07, 0.8, 0.9],
          [0.15, -0.03, 0, 0.65, 0.7],
          [-0.16, -0.03, -0.02, 0.6, 0.65],
        ].map(([x, y, z, s, h], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[0.55 + i * 0.05, (i - 2) * 0.18, (i - 2) * 0.12]} scale={[s, h, s]}>
            <coneGeometry args={[0.09, 0.2, 6]} />
            <meshStandardMaterial color={HAIR} roughness={0.65} />
          </mesh>
        ))}
      </group>

      {/* eyes */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, -0.02, 0.37]} scale={[1, blink, 1]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={EYE} emissive={EYE} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Bust() {
  return (
    <group>
      <pointLight position={[0, 0.4, 0.3]} intensity={2.2} color={ACCENT} distance={1.6} />

      {/* neck */}
      <mesh position={[0, 0.94, 0]}>
        <cylinderGeometry args={[0.13, 0.16, 0.22, 12]} />
        <HoloMaterial intensity={0.4} />
      </mesh>

      {/* shoulders / chest */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.5, 0.36, 1.0, 16]} />
        <HoloMaterial intensity={0.35} />
      </mesh>
      <RimMesh geometry={<cylinderGeometry args={[0.5, 0.36, 1.0, 16]} />} scale={1.05} opacity={0.4} />

      {/* glowing collar trim */}
      <mesh position={[0, 0.86, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.19, 0.012, 8, 24]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
    </group>
  )
}

interface AvatarSceneProps {
  onInteract?: () => void
}

export default function AvatarScene({ onInteract }: AvatarSceneProps) {
  const rig = useRef<THREE.Group>(null)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const velocity = useRef(0.35)
  const idleSeed = useRef(Math.random() * 10)

  const [blink, setBlink] = useState(1)

  useFrame((state, delta) => {
    if (!rig.current) return
    const t = state.clock.getElapsedTime() + idleSeed.current

    if (dragging.current) {
      // rotation applied directly in the pointer handler; here we just damp velocity toward 0
      velocity.current = THREE.MathUtils.lerp(velocity.current, 0, 0.3)
    } else {
      rig.current.rotation.y += velocity.current * delta
      velocity.current *= 0.94
      if (Math.abs(velocity.current) < 0.02) velocity.current = 0
    }

    // idle breathing + micro head sway, layered on top of the drag/inertia rotation
    const breathe = Math.sin(t * 1.1) * 0.015
    rig.current.position.y = -0.9 + breathe
    rig.current.rotation.x = Math.sin(t * 0.5) * 0.015
    rig.current.rotation.z = Math.sin(t * 0.35) * 0.01

    // occasional blink
    const blinkPhase = (t * 0.3) % 1
    setBlinkIfChanged(blinkPhase < 0.04 ? 0.08 : 1)
  })

  function setBlinkIfChanged(v: number) {
    setBlink((prev) => (Math.abs(prev - v) > 0.01 ? v : prev))
  }

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    dragging.current = true
    lastX.current = e.clientX
    ;(e.target as Element)?.setPointerCapture?.(e.pointerId)
    onInteract?.()
  }
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current || !rig.current) return
    const dx = e.clientX - lastX.current
    lastX.current = e.clientX
    const delta = dx * 0.01
    rig.current.rotation.y += delta
    velocity.current = delta * 40
  }
  const endDrag = () => {
    dragging.current = false
  }

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 2, 3]} intensity={14} color={ACCENT} />
      <pointLight position={[-2, 0, 2]} intensity={5} color={EYE} />

      <group ref={rig} position={[0, -0.9, 0]}>
        <HologramShell>
          <Head blink={blink} />
          <Bust />
        </HologramShell>

        {/* invisible generous hit-area so drag works from anywhere over the bust, incl. touch */}
        <mesh
          position={[0, 0.9, 0.1]}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
        >
          <cylinderGeometry args={[0.75, 0.75, 2.2, 16]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
    </>
  )
}
