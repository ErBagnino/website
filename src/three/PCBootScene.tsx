import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

const ACCENT = '#38f0e0'

function phase(t: number, start: number, end: number) {
  return THREE.MathUtils.clamp((t - start) / (end - start), 0, 1)
}

// A small "living" workstation UI drawn onto a canvas texture: a status header, a
// scrolling waveform, a mini neural-node diagram and a couple of terminal lines with
// a blinking cursor. Replaces the old plain-color wipe/rectangle boot effect with
// something that actually reads as a real screen once it's on.
function useDashboardTexture() {
  const state = useRef<{
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    texture: THREE.CanvasTexture
    wave: number[]
    nodes: { x: number; y: number }[]
    scrollLines: string[]
  } | null>(null)

  if (!state.current) {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 300
    const ctx = canvas.getContext('2d')!
    const texture = new THREE.CanvasTexture(canvas)
    const wave = Array.from({ length: 48 }, () => 0.5)
    const nodes = Array.from({ length: 9 }, () => ({ x: Math.random(), y: Math.random() }))
    const scrollLines = [
      '> boot sequence ok',
      '> loading render pipeline',
      '> AI_CORE handshake ok',
      '> optimizing assets',
      '> cache warm',
    ]
    state.current = { canvas, ctx, texture, wave, nodes, scrollLines }
  }
  return state.current
}

function drawDashboard(
  d: ReturnType<typeof useDashboardTexture>,
  t: number,
  reveal: number,
  cursorOn: boolean,
) {
  const { ctx, canvas, wave, nodes, scrollLines } = d
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#031014'
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = 'rgba(56,240,224,0.08)'
  ctx.lineWidth = 1
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }

  ctx.globalAlpha = reveal
  ctx.fillStyle = '#38f0e0'
  ctx.font = '700 20px "Space Grotesk", monospace'
  ctx.fillText('SYSTEM ONLINE', 20, 34)
  ctx.font = '400 12px monospace'
  ctx.fillStyle = 'rgba(56,240,224,0.6)'
  ctx.fillText('AI_CORE · ACTIVE', 20, 54)

  ctx.fillStyle = '#5cf27a'
  ctx.beginPath()
  ctx.arc(w - 24, 26, 6, 0, Math.PI * 2)
  ctx.fill()

  // scrolling waveform
  wave.shift()
  wave.push(0.5 + Math.sin(t * 2.4) * 0.3 + (Math.random() - 0.5) * 0.15)
  ctx.strokeStyle = '#38f0e0'
  ctx.lineWidth = 2
  ctx.beginPath()
  wave.forEach((v, i) => {
    const x = 20 + (i / (wave.length - 1)) * (w - 40)
    const y = 100 + v * 40
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()

  // mini neural-node diagram
  ctx.strokeStyle = 'rgba(56,240,224,0.35)'
  ctx.lineWidth = 1
  nodes.forEach((n, i) => {
    const nx = 40 + n.x * (w * 0.4)
    const ny = 175 + n.y * 70
    nodes.forEach((m, j) => {
      if (j <= i) return
      const mx = 40 + m.x * (w * 0.4)
      const my = 175 + m.y * 70
      if (Math.hypot(nx - mx, ny - my) < 90) {
        ctx.beginPath()
        ctx.moveTo(nx, ny)
        ctx.lineTo(mx, my)
        ctx.stroke()
      }
    })
  })
  nodes.forEach((n) => {
    const nx = 40 + n.x * (w * 0.4)
    const ny = 175 + n.y * 70
    ctx.fillStyle = '#8ef5e8'
    ctx.beginPath()
    ctx.arc(nx, ny, 2.5, 0, Math.PI * 2)
    ctx.fill()
  })

  // terminal lines
  ctx.font = '400 11px monospace'
  const idx = Math.floor(t * 0.6) % scrollLines.length
  for (let i = 0; i < 4; i++) {
    const line = scrollLines[(idx + i) % scrollLines.length]
    ctx.fillStyle = i === 3 ? '#38f0e0' : 'rgba(56,240,224,0.45)'
    ctx.fillText(line, w * 0.46, 190 + i * 18)
  }
  if (cursorOn) {
    ctx.fillStyle = '#38f0e0'
    ctx.fillRect(w * 0.46, 190 + 3 * 18 - 10, 7, 12)
  }
  ctx.globalAlpha = 1
}

function Screen({ settled }: { settled: boolean }) {
  const glowMat = useRef<THREE.MeshStandardMaterial>(null)
  const dash = useDashboardTexture()
  const uiMat = useRef<THREE.MeshBasicMaterial>(null)
  const lastDraw = useRef(0)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (glowMat.current) {
      const base = phase(t, 0.35, 1.6)
      const flicker = !settled && t < 1.9 ? (Math.sin(t * 30) > 0.85 ? 0.5 : 1) : 1
      glowMat.current.emissiveIntensity = base * 1.3 * flicker
    }

    const reveal = phase(t, 1.4, 2.4)
    if (uiMat.current) uiMat.current.opacity = reveal

    if (reveal > 0 && t - lastDraw.current > 0.12) {
      lastDraw.current = t
      drawDashboard(dash, t, reveal, Math.sin(t * 3) > 0)
      dash.texture.needsUpdate = true
    }
  })

  return (
    <group>
      <mesh position={[0, 0.15, 0.06]}>
        <planeGeometry args={[3.2, 1.9]} />
        <meshStandardMaterial ref={glowMat} color="#031014" emissive={ACCENT} emissiveIntensity={0} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.15, 0.075]}>
        <planeGeometry args={[3.05, 1.78]} />
        <meshBasicMaterial ref={uiMat} map={dash.texture} transparent opacity={0} toneMapped={false} />
      </mesh>
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
