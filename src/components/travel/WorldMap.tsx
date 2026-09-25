import { useEffect, useRef, useState } from 'react'
import { getCountries } from '../../lib/countries'
import { DESTINATIONS } from '../../lib/destinations'
import { WORLD_MAP_PATH, WORLD_MAP_VIEWBOX } from '../../lib/worldMapPath'
import Flag from './Flag'

const ACCENT = '#ffb454'
const [VB_X, VB_Y, VB_W, VB_H] = WORLD_MAP_VIEWBOX.split(' ').map(Number)
const VB_CX = VB_X + VB_W / 2
const VB_CY = VB_Y + VB_H / 2
const MAX_SCALE = 5

interface WorldMapProps {
  selected: string[]
  onToggle: (code: string) => void
}

export default function WorldMap({ selected, onToggle }: WorldMapProps) {
  const countries = getCountries()
  const nameOf = (code: string) => countries.find((c) => c.code === code)?.name ?? code

  const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const moved = useRef(false)

  // Horizontal panning wraps around like a 360° panorama instead of stopping
  // at a hard edge — three copies of the map are rendered side by side (see
  // below) and the pan value is folded back into one map-width so a country
  // near the international date line is never "stuck" at the border; you can
  // always keep dragging the same direction to reach it. Vertical panning
  // stays clamped (there's no pole to wrap around to).
  const wrapX = (x: number) => x - VB_W * Math.round(x / VB_W)

  const clamp = (v: { x: number; y: number; scale: number }) => {
    const scale = Math.min(MAX_SCALE, Math.max(1, v.scale))
    const maxPanY = (VB_H / 2) * (1 - 1 / scale)
    return {
      scale,
      x: wrapX(v.x),
      y: Math.min(maxPanY, Math.max(-maxPanY, v.y)),
    }
  }

  // Convert a pointer's screen position to the map's own user-space
  // coordinates, given the current pan/zoom of the inner <g>.
  const pointToWorld = (clientX: number, clientY: number, v: { x: number; y: number; scale: number }) => {
    const rect = containerRef.current!.getBoundingClientRect()
    const fx = VB_X + ((clientX - rect.left) / rect.width) * VB_W
    const fy = VB_Y + ((clientY - rect.top) / rect.height) * VB_H
    return { wx: VB_CX + (fx - VB_CX - v.x) / v.scale, wy: VB_CY + (fy - VB_CY - v.y) / v.scale, fx, fy }
  }

  const zoomAt = (clientX: number, clientY: number, factor: number) => {
    setView((v) => {
      const { wx, wy, fx, fy } = pointToWorld(clientX, clientY, v)
      const scale = Math.min(MAX_SCALE, Math.max(1, v.scale * factor))
      // keep the same world point under the cursor after rescaling
      const x = fx - VB_CX - scale * (wx - VB_CX)
      const y = fy - VB_CY - scale * (wy - VB_CY)
      return clamp({ scale, x, y })
    })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    moved.current = false
    last.current = { x: e.clientX, y: e.clientY }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true
    last.current = { x: e.clientX, y: e.clientY }
    const rect = containerRef.current!.getBoundingClientRect()
    const px = VB_W / rect.width
    const py = VB_H / rect.height
    setView((v) => clamp({ ...v, x: v.x + dx * px, y: v.y + dy * py }))
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  // A native, non-passive listener is required: React's onWheel is attached
  // passively, so e.preventDefault() silently fails there and the page
  // scrolls right along with the intended zoom.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0016))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const zoomBy = (delta: number) => {
    const rect = containerRef.current!.getBoundingClientRect()
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, delta > 0 ? 1.4 : 1 / 1.4)
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-[784/459] w-full touch-none overflow-hidden rounded-xl border border-white/10 bg-black/40"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="group"
        aria-label="Mappa del mondo per selezionare le destinazioni: trascina per spostarti, rotellina o pulsanti per zoomare"
      >
        <svg viewBox={WORLD_MAP_VIEWBOX} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="mapGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="rgba(255,180,84,0.07)" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect x={VB_X} y={VB_Y} width={VB_W} height={VB_H} fill="url(#mapGrid)" />
          <g style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, transformOrigin: `${VB_CX}px ${VB_CY}px` }}>
            {/* three copies side by side so panning wraps around like a 360° panorama instead of stopping at a hard edge */}
            {[-VB_W, 0, VB_W].map((offset) => (
              <g key={offset} transform={`translate(${offset} 0)`}>
                <path d={WORLD_MAP_PATH} fill="rgba(255,180,84,0.16)" stroke="rgba(255,180,84,0.5)" strokeWidth="0.5" />
                {DESTINATIONS.map((d) => {
                  const active = selected.includes(d.code)
                  return (
                    <g
                      key={d.code}
                      transform={`translate(${d.x} ${d.y})`}
                      onClick={() => {
                        if (!moved.current) onToggle(d.code)
                      }}
                      className="cursor-pointer"
                    >
                      <title>{nameOf(d.code)}</title>
                      {active && (
                        <circle r="8" fill="none" stroke={ACCENT} strokeWidth="0.8" opacity="0.6">
                          <animate attributeName="r" values="5;11" dur="1.6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.7;0" dur="1.6s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <circle r={active ? 4.6 : 3} fill={active ? ACCENT : '#e7cf9a'} opacity={active ? 1 : 0.8} stroke="#05070c" strokeWidth="0.5" />
                    </g>
                  )
                })}
              </g>
            ))}
          </g>
        </svg>

        <span className="pointer-events-none absolute bottom-1.5 left-2 text-[8px] text-white/25">
          base mappa: A. MacDonald / F. Lekschas · CC BY-SA
        </span>

        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
          <button
            type="button"
            aria-label="Aumenta zoom"
            onClick={() => zoomBy(0.4)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 hover:border-travel hover:text-travel"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Riduci zoom"
            onClick={() => zoomBy(-0.4)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 hover:border-travel hover:text-travel"
          >
            −
          </button>
        </div>
      </div>

      {/* accessible, keyboard-usable duplicate of the same picks — the map is a shortcut, not the only way in */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {DESTINATIONS.map((d) => {
          const active = selected.includes(d.code)
          const c = countries.find((x) => x.code === d.code)
          return (
            <button
              key={d.code}
              type="button"
              onClick={() => onToggle(d.code)}
              aria-pressed={active}
              style={active ? { background: ACCENT, color: '#05070c', borderColor: ACCENT } : { borderColor: 'rgba(255,180,84,0.3)' }}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-white/70 transition hover:border-travel"
            >
              <Flag code={d.code} size={14} /> {c?.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
