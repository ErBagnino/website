import { forwardRef, useImperativeHandle, useRef, useState, type ReactNode } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

const ACCENT = '#8fe0e8'
const HAIR_TONES = ['#e8c26a', '#b8863a', '#d4a24e']
const EYE = '#4fdc82'
const HEAD_RADIUS = 0.44

// The avatar is presented as a holographic scan of Adam rather than an attempt at
// photoreal likeness: a faceted (literally diamond-cut) head and chest lit from
// within plus an additive rim edge — the same emissive-glow language as the rest
// of the site's HUD — with hair, eyes, brows and mouth rendered fully opaque so
// they read as the "real" parts of him against the scanned, translucent shell.
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

// Hair is a solid short-cropped "cap" (a partial sphere covering crown,
// temples and back) rendered with an UNLIT flat color — it deliberately
// ignores the cyan/green hologram lighting so it reads as true blonde
// instead of picking up a khaki tint — plus a thicker "roll" ring right at
// the hairline (so the edge reads as having real depth, not a knife-thin
// shell) and a few flattened, swept "bangs" breaking up that edge at the
// front. An earlier version scattered many thin cones over the whole scalp
// for texture; at any density that read as spikes/a sea urchin, and an even
// earlier one covered so much of the head in a near-skin tone that it read
// as a bald egg — the fix is a shorter cap, a clearly darker/richer color,
// and a visible rolled edge for volume.
const HAIRLINE_THETA = Math.PI * 0.4 // measured from the crown; stops above the brows

function HairCap() {
  return (
    <mesh position={[0, 0.05, -0.01]} rotation={[0.04, 0, 0]}>
      <sphereGeometry args={[HEAD_RADIUS * 1.015, 24, 16, 0, Math.PI * 2, 0, HAIRLINE_THETA]} />
      <meshBasicMaterial color={HAIR_TONES[0]} toneMapped={false} />
    </mesh>
  )
}

function HairlineRoll() {
  const R = HEAD_RADIUS * 1.015
  const ringY = 0.05 + R * Math.cos(HAIRLINE_THETA)
  const ringRadius = R * Math.sin(HAIRLINE_THETA)
  return (
    <mesh position={[0, ringY, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[ringRadius, 0.045, 10, 28]} />
      <meshBasicMaterial color={HAIR_TONES[1]} toneMapped={false} />
    </mesh>
  )
}

function FringeSwoop() {
  const baseY = 0.05 + HEAD_RADIUS * 1.015 * Math.cos(HAIRLINE_THETA)
  const strands = [
    { x: -0.24, z: 0.2, rz: 0.55, len: 0.16, tone: 1 },
    { x: -0.09, z: 0.28, rz: 0.3, len: 0.18, tone: 2 },
    { x: 0.09, z: 0.28, rz: 0.05, len: 0.17, tone: 0 },
    { x: 0.24, z: 0.2, rz: -0.4, len: 0.15, tone: 1 },
  ]
  return (
    <>
      {strands.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, baseY + 0.02, s.z]}
          rotation={[0.7, i % 2 === 0 ? 0.15 : -0.15, s.rz]}
          scale={[s.len, 0.75, 0.34]}
        >
          <sphereGeometry args={[0.09, 8, 6]} />
          <meshBasicMaterial color={HAIR_TONES[s.tone]} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}

function Hair() {
  return (
    <>
      <HairCap />
      <HairlineRoll />
      <FringeSwoop />
    </>
  )
}

function Head({ blink }: { blink: number }) {
  return (
    <group position={[0, 1.34, 0]}>
      <pointLight position={[0, 0, 0]} intensity={3} color={ACCENT} distance={1.2} />

      {/* faceted "diamond-cut" head — slightly egg-shaped rather than a perfect sphere */}
      <group scale={[1, 1.12, 0.94]}>
        <mesh>
          <icosahedronGeometry args={[HEAD_RADIUS, 1]} />
          <HoloMaterial intensity={0.55} />
        </mesh>
        <RimMesh geometry={<icosahedronGeometry args={[HEAD_RADIUS, 1]} />} scale={1.08} />
        <Hair />
      </group>

      {/* brows */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0.385]} rotation={[0, 0, i === 0 ? 0.12 : -0.12]}>
          <boxGeometry args={[0.13, 0.022, 0.02]} />
          <meshStandardMaterial color="#c99a44" roughness={0.7} />
        </mesh>
      ))}

      {/* eyes */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, -0.02, 0.4]} scale={[1, blink, 1]}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={EYE} emissive={EYE} emissiveIntensity={1.3} toneMapped={false} />
        </mesh>
      ))}

      {/* nose */}
      <mesh position={[0, -0.14, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.035, 0.09, 6]} />
        <HoloMaterial intensity={0.5} />
      </mesh>

      {/* a small warm smile */}
      <mesh position={[0, -0.28, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.012, 6, 12, Math.PI * 0.62]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
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

export interface AvatarSceneHandle {
  /** Nudges the avatar's rotation — used by the keyboard-accessible rotate buttons. */
  spin: (direction: 1 | -1) => void
}

function AvatarScene({ onInteract }: AvatarSceneProps, ref: React.ForwardedRef<AvatarSceneHandle>) {
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

  useImperativeHandle(ref, () => ({
    spin: (direction: 1 | -1) => {
      if (rig.current) rig.current.rotation.y += direction * 0.5
      velocity.current = direction * 1.2
      onInteract?.()
    },
  }))

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 3]} intensity={14} color={ACCENT} />
      <pointLight position={[-2, 0, 2]} intensity={5} color={EYE} />
      <pointLight position={[0, 2.4, 2]} intensity={4} color="#fff3d6" />

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

export default forwardRef(AvatarScene)
