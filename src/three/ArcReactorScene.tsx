import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'

// Boot power-on ramp: 0 before `delay`, flickering climb to 1 over `rampDuration`, steady 1 after.
function bootRamp(t: number, delay: number, rampDuration = 0.9) {
  const local = t - delay
  if (local < 0) return 0
  if (local < rampDuration) {
    const base = Math.min(1, local / rampDuration)
    const flicker = Math.sin(local * 41) > 0.75 || Math.sin(local * 17 + 2) > 0.88 ? 0.25 : 1
    return base * flicker
  }
  return 1
}

const RING_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Continuous traveling energy band around each ring segment (torus UV.x runs along the arc),
// riding on top of a base glow so the ring reads as "powered" and "alive" at the same time.
const RING_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOffset;
  uniform float uSpeed;
  uniform float uPower;
  uniform float uFlash;
  varying vec2 vUv;

  void main() {
    float pos = fract(uTime * uSpeed - uOffset);
    float d = min(abs(vUv.x - pos), 1.0 - abs(vUv.x - pos));
    float pulse = smoothstep(0.14, 0.0, d);
    float base = 0.24;
    float brightness = (base + pulse * 1.6) * uPower * (1.0 + uFlash * 2.0);
    gl_FragColor = vec4(uColor * brightness, 1.0);
  }
`

interface RingProps {
  radius: number
  tube: number
  speed: number
  flowSpeed: number
  tilt: [number, number, number]
  color: string
  segments?: number
  delay: number
  scatter: boolean
  instant: boolean
}

function Ring({ radius, tube, speed, flowSpeed, tilt, color, segments = 4, delay, scatter, instant }: RingProps) {
  const group = useRef<THREE.Group>(null)
  const mats = useRef<(THREE.ShaderMaterial | null)[]>([])
  const scatterProgress = useRef(instant && scatter ? 1 : 0)
  const wasScattered = useRef(instant && scatter)
  const flashStart = useRef(-10)

  const colorVec = useMemo(() => new THREE.Color(color), [color])

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.z += delta * speed

    const t = state.clock.getElapsedTime()
    const target = scatter ? 1 : 0

    if (scatter && !wasScattered.current) flashStart.current = t
    wasScattered.current = scatter

    scatterProgress.current = instant ? target : THREE.MathUtils.damp(scatterProgress.current, target, 2.2, delta)
    const sp = scatterProgress.current
    group.current.scale.setScalar(1 + sp * 1.7)

    const ramp = instant ? 1 : bootRamp(t, delay)
    const power = THREE.MathUtils.lerp(1, 0.12, sp) * ramp
    const flash = Math.max(0, 1 - (t - flashStart.current) / 0.5)

    mats.current.forEach((m) => {
      if (!m) return
      m.uniforms.uTime.value = t
      m.uniforms.uPower.value = power
      m.uniforms.uFlash.value = flash * flash
    })
  })

  return (
    <group ref={group} rotation={tilt}>
      {Array.from({ length: segments }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / segments) * Math.PI * 2]}>
          <torusGeometry args={[radius, tube, 8, 48, (Math.PI * 2) / segments - 0.18]} />
          <shaderMaterial
            ref={(m) => {
              mats.current[i] = m as unknown as THREE.ShaderMaterial
            }}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            vertexShader={RING_VERTEX}
            fragmentShader={RING_FRAGMENT}
            uniforms={{
              uColor: { value: colorVec },
              uTime: { value: 0 },
              uOffset: { value: i / segments },
              uSpeed: { value: flowSpeed },
              uPower: { value: 0 },
              uFlash: { value: 0 },
            }}
          />
        </mesh>
      ))}
    </group>
  )
}

function Core({ scatter, instant }: { scatter: boolean; instant: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const scatterProgress = useRef(instant && scatter ? 1 : 0)
  const wasScattered = useRef(instant && scatter)
  const flashStart = useRef(-10)

  useFrame((state, delta) => {
    if (!ref.current || !mat.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.6
    ref.current.rotation.x = t * 0.3

    const target = scatter ? 1 : 0
    if (scatter && !wasScattered.current) flashStart.current = t
    wasScattered.current = scatter

    scatterProgress.current = instant ? target : THREE.MathUtils.damp(scatterProgress.current, target, 2.2, delta)
    const sp = scatterProgress.current

    const ramp = instant ? 1 : bootRamp(t, 0, 0.7)
    const flash = Math.max(0, 1 - (t - flashStart.current) / 0.5)
    const heartbeat = Math.pow(Math.abs(Math.sin(t * 1.4)), 10)

    const s = (1 + Math.sin(t * 2) * 0.05 + heartbeat * 0.06) * THREE.MathUtils.lerp(1, 0.28, sp)
    ref.current.scale.setScalar(s)
    mat.current.opacity = THREE.MathUtils.lerp(1, 0.05, sp) * ramp
    mat.current.emissiveIntensity =
      THREE.MathUtils.lerp(3, 0.6, sp) * ramp * (1 + heartbeat * 0.8) * (1 + flash * flash * 2.5)
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.85, 1]} />
      <meshStandardMaterial
        ref={mat}
        color="#38f0e0"
        emissive="#38f0e0"
        emissiveIntensity={0}
        wireframe
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  )
}

interface ArcReactorSceneProps {
  scatter?: boolean
  instant?: boolean
}

export default function ArcReactorScene({ scatter = false, instant = false }: ArcReactorSceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 4]} intensity={40} color="#38f0e0" />
      <Core scatter={scatter} instant={instant} />
      <Ring
        radius={1.6}
        tube={0.022}
        speed={0.4}
        flowSpeed={0.6}
        tilt={[0.55, 0, 0.1]}
        color="#38f0e0"
        segments={3}
        delay={0.3}
        scatter={scatter}
        instant={instant}
      />
      <Ring
        radius={2.2}
        tube={0.016}
        speed={-0.28}
        flowSpeed={-0.45}
        tilt={[0.3, 0.5, -0.15]}
        color="#8ef5e8"
        segments={5}
        delay={1.0}
        scatter={scatter}
        instant={instant}
      />
      <Ring
        radius={2.8}
        tube={0.013}
        speed={0.18}
        flowSpeed={0.35}
        tilt={[0.15, -0.35, 0.2]}
        color="#38f0e0"
        segments={7}
        delay={1.7}
        scatter={scatter}
        instant={instant}
      />
      <ParticleField radius={7} color="#38f0e0" count={700} />
    </>
  )
}
