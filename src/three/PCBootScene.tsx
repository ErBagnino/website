import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

const ACCENT = '#38f0e0'

function phase(t: number, start: number, end: number) {
  return THREE.MathUtils.clamp((t - start) / (end - start), 0, 1)
}

function Screen({ settled }: { settled: boolean }) {
  const glowMat = useRef<THREE.MeshStandardMaterial>(null)
  const wipe = useRef<THREE.Mesh>(null)
  const wipeMat = useRef<THREE.MeshBasicMaterial>(null)
  const scan = useRef<THREE.Mesh>(null)
  const dashGroup = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const wipeP = phase(t, 0.35, 1.5)
    if (wipe.current) {
      wipe.current.scale.x = Math.max(0.001, wipeP)
      wipe.current.position.x = -1.6 + wipeP * 1.6
    }
    if (wipeMat.current) wipeMat.current.opacity = wipeP < 1 ? 0.9 : 0

    if (glowMat.current) {
      const base = phase(t, 0.35, 1.6)
      const flicker = !settled && t < 1.9 ? (Math.sin(t * 30) > 0.85 ? 0.5 : 1) : 1
      glowMat.current.emissiveIntensity = base * 1.5 * flicker
    }

    if (scan.current) {
      if (settled) {
        scan.current.visible = false
      } else {
        scan.current.visible = t > 1.5
        scan.current.position.y = 0.15 + (((t - 1.5) * 0.7) % 1.9) - 0.95
      }
    }

    if (dashGroup.current) {
      const dashP = phase(t, 2.0, 2.8)
      dashGroup.current.visible = dashP > 0
      dashGroup.current.scale.setScalar(THREE.MathUtils.lerp(0.9, 1, dashP))
      dashGroup.current.children.forEach((c, i) => {
        const mesh = c as THREE.Mesh
        const mat = mesh.material as THREE.MeshStandardMaterial
        if (mat) mat.opacity = THREE.MathUtils.clamp(dashP * 2 - i * 0.15, 0, 0.85)
      })
    }
  })

  const panels = useMemo(
    () => [
      { pos: [-0.95, 0.55, 0.075] as [number, number, number], size: [1.15, 0.32] as [number, number] },
      { pos: [0.35, 0.55, 0.075] as [number, number, number], size: [1.35, 0.32] as [number, number] },
      { pos: [-0.6, 0.05, 0.075] as [number, number, number], size: [1.85, 0.22] as [number, number] },
      { pos: [-0.9, -0.35, 0.075] as [number, number, number], size: [1.25, 0.55] as [number, number] },
      { pos: [0.55, -0.35, 0.075] as [number, number, number], size: [1.2, 0.55] as [number, number] },
    ],
    [],
  )

  return (
    <group>
      <mesh position={[0, 0.15, 0.06]}>
        <planeGeometry args={[3.2, 1.9]} />
        <meshStandardMaterial ref={glowMat} color="#031014" emissive={ACCENT} emissiveIntensity={0} toneMapped={false} />
      </mesh>
      <mesh ref={wipe} position={[-1.6, 0.15, 0.065]} scale={[0.001, 1.9, 1]}>
        <planeGeometry args={[3.2, 1.9]} />
        <meshBasicMaterial ref={wipeMat} color="#bdfff5" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={scan} position={[0, -0.8, 0.078]}>
        <planeGeometry args={[3.1, 0.04]} />
        <meshBasicMaterial color="#bdfff5" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <group ref={dashGroup} position={[0, 0.15, 0.078]}>
        {panels.map((p, i) => (
          <mesh key={i} position={p.pos}>
            <planeGeometry args={p.size} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.2} transparent opacity={0} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Bezel({ settled }: { settled: boolean }) {
  const strips = useRef<(THREE.Mesh | null)[]>([])
  const led = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    strips.current.forEach((m, i) => {
      if (!m) return
      const mat = m.material as THREE.MeshStandardMaterial
      const p = phase(t, 0.1 + i * 0.15, 0.7 + i * 0.15)
      mat.emissiveIntensity = p * 1.5
    })
    if (led.current) {
      const on = phase(t, 2.4, 2.9)
      led.current.emissiveIntensity = settled ? 1.6 : 1.6 * on + Math.sin(t * 6) * 0.1 * (1 - on)
      led.current.color.set(on > 0.5 ? '#5cf27a' : '#38f0e0')
      led.current.emissive.set(on > 0.5 ? '#5cf27a' : '#38f0e0')
    }
  })

  return (
    <group>
      {[-1.9, 1.9].map((x, i) => (
        <mesh
          key={x}
          ref={(m) => {
            strips.current[i] = m
          }}
          position={[x, 0.15, 0]}
        >
          <boxGeometry args={[0.06, 2.2, 0.14]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[1.55, -0.92, 0.09]}>
        <circleGeometry args={[0.035, 16]} />
        <meshStandardMaterial ref={led} color={ACCENT} emissive={ACCENT} emissiveIntensity={0} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Tower({ settled }: { settled: boolean }) {
  const lights = useRef<(THREE.Mesh | null)[]>([])
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    lights.current.forEach((m, i) => {
      if (!m) return
      const mat = m.material as THREE.MeshStandardMaterial
      const on = phase(t, 1.6 + i * 0.2, 2.0 + i * 0.2)
      const pulse = settled ? 0.75 + Math.sin(t * 1.5 + i) * 0.25 : 1
      mat.emissiveIntensity = on * 1.4 * pulse
    })
  })
  return (
    <group position={[-2.35, -1.05, 0.35]}>
      <mesh>
        <boxGeometry args={[0.55, 2.3, 0.9]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.7} roughness={0.35} />
      </mesh>
      {[0.75, 0.5, 0.25].map((y, i) => (
        <mesh
          key={i}
          ref={(m) => {
            lights.current[i] = m
          }}
          position={[0.28, y, 0.46]}
        >
          <boxGeometry args={[0.02, 0.14, 0.02]} />
          <meshStandardMaterial color={i === 0 ? '#5cf27a' : ACCENT} emissive={i === 0 ? '#5cf27a' : ACCENT} emissiveIntensity={0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Keyboard({ settled }: { settled: boolean }) {
  const keys = useRef<(THREE.Mesh | null)[]>([])
  const cols = 12
  const rows = 4
  const keyList = useMemo(() => {
    const list: { x: number; z: number; i: number }[] = []
    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({ x: (c - (cols - 1) / 2) * 0.135, z: (r - (rows - 1) / 2) * 0.135, i: i++ })
      }
    }
    return list
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    keyList.forEach((k) => {
      const m = keys.current[k.i]
      if (!m) return
      const mat = m.material as THREE.MeshStandardMaterial
      const rippleDelay = 1.9 + (k.x + 0.9) * 0.35
      const on = phase(t, rippleDelay, rippleDelay + 0.35)
      mat.emissiveIntensity = on * (settled ? 0.6 : 0.9)
    })
  })

  return (
    <group position={[0, -1.62, 1.05]} rotation={[-0.12, 0, 0]}>
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[1.9, 0.06, 0.75]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.5} roughness={0.4} />
      </mesh>
      {keyList.map((k) => (
        <mesh
          key={k.i}
          ref={(m) => {
            keys.current[k.i] = m
          }}
          position={[k.x, 0.02, k.z]}
        >
          <boxGeometry args={[0.11, 0.03, 0.11]} />
          <meshStandardMaterial color="#111826" emissive={ACCENT} emissiveIntensity={0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Mouse() {
  return (
    <mesh position={[1.35, -1.63, 1.05]} rotation={[-0.1, 0, 0]}>
      <capsuleGeometry args={[0.09, 0.08, 4, 8]} />
      <meshStandardMaterial color="#111826" metalness={0.4} roughness={0.4} />
    </mesh>
  )
}

function Desk() {
  return (
    <mesh position={[0, -1.95, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[9, 6]} />
      <meshStandardMaterial color="#070a10" roughness={0.9} />
    </mesh>
  )
}

function Monitor({ settled }: { settled: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * (settled ? 0.03 : 0.08)
    }
  })
  return (
    <group ref={group}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[3.5, 2.2, 0.12]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.6} roughness={0.35} />
      </mesh>
      <Screen settled={settled} />
      <Bezel settled={settled} />
      <mesh position={[0, -1.25, -0.1]}>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.75, -0.1]}>
        <boxGeometry args={[1.6, 0.08, 0.7]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.7} roughness={0.3} />
      </mesh>
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
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

export default function PCBootScene({ settled = false }: { settled?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 1, 4]} intensity={30} color={ACCENT} />
      <Desk />
      <Monitor settled={settled} />
      <Tower settled={settled} />
      <Keyboard settled={settled} />
      <Mouse />
      <FloatingPanel position={[-2.8, 1.3, -0.5]} delay={2.6} />
      <FloatingPanel position={[2.9, -0.4, -0.5]} delay={3.0} />
      <ParticleField radius={8} color={ACCENT} count={400} size={0.016} />
    </>
  )
}
