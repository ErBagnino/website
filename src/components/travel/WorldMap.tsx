import { useRef, useState } from 'react'
import { getCountries } from '../../lib/countries'
import { DESTINATIONS } from '../../lib/destinations'

const ACCENT = '#ffb454'

// Stylized, deliberately non-cartographic continent silhouettes — a "holographic
// grid map" rather than an attempt at real coastlines, matching the rest of the
// site's HUD language while staying light (no external map tiles/assets).
const CONTINENTS = [
  'M180 70 C 140 60,120 100,130 140 C 100 160,90 200,130 230 C 170 250,220 235,250 210 C 290 220,320 190,300 150 C 330 120,300 80,260 75 C 230 55,200 55,180 70 Z',
  'M320 235 C 300 260,290 300,300 340 C 290 370,310 400,340 395 C 360 410,390 390,385 360 C 400 330,390 290,370 260 C 365 235,340 225,320 235 Z',
  'M470 90 C 460 70,490 55,520 60 C 550 50,580 60,590 80 C 610 85,615 105,595 115 C 600 135,570 145,545 135 C 520 150,490 140,480 120 C 460 115,460 100,470 90 Z',
  'M490 165 C 470 180,465 210,480 240 C 470 270,480 310,500 340 C 495 365,510 390,535 385 C 555 400,580 380,575 350 C 595 320,590 280,570 250 C 580 220,570 190,545 175 C 525 155,500 155,490 165 Z',
  'M600 70 C 620 50,670 45,710 55 C 760 40,830 50,870 80 C 920 85,950 110,930 140 C 950 165,920 190,880 180 C 860 210,810 215,780 195 C 740 210,690 200,670 170 C 630 175,600 150,605 120 C 585 100,590 80,600 70 Z',
  'M880 320 C 870 305,890 290,915 295 C 945 285,975 300,970 325 C 985 340,970 360,945 355 C 920 370,895 355,890 335 C 875 335,875 325,880 320 Z',
  'M975 355 C 970 345,985 340,995 350 C 1000 360,990 370,978 365 Z',
]

interface WorldMapProps {
  selected: string[]
  onToggle: (code: string) => void
}

export default function WorldMap({ selected, onToggle }: WorldMapProps) {
  const countries = getCountries()
  const nameOf = (code: string) => countries.find((c) => c.code === code)?.name ?? code

  const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const moved = useRef(false)

  const clamp = (v: { x: number; y: number; scale: number }) => {
    const scale = Math.min(3, Math.max(1, v.scale))
    const maxPan = (scale - 1) * 260
    return {
      scale,
      x: Math.min(maxPan, Math.max(-maxPan, v.x)),
      y: Math.min(maxPan * 0.5, Math.max(-maxPan * 0.5, v.y)),
    }
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
    setView((v) => clamp({ ...v, x: v.x + dx * 0.8, y: v.y + dy * 0.8 }))
  }
  const onPointerUp = () => {
    dragging.current = false
  }
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setView((v) => clamp({ ...v, scale: v.scale - e.deltaY * 0.0016 }))
  }
  const zoomBy = (delta: number) => setView((v) => clamp({ ...v, scale: v.scale + delta }))

  return (
    <div>
      <div
        className="relative aspect-[1000/520] w-full touch-none overflow-hidden rounded-xl border border-white/10 bg-black/40"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
        role="group"
        aria-label="Mappa del mondo per selezionare le destinazioni: trascina per spostarti, rotellina o pulsanti per zoomare"
      >
        <svg viewBox="0 0 1000 520" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="rgba(255,180,84,0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="520" fill="url(#mapGrid)" />
          <g
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, transformOrigin: '500px 260px' }}
          >
            {CONTINENTS.map((d, i) => (
              <path key={i} d={d} fill="rgba(255,180,84,0.14)" stroke="rgba(255,180,84,0.4)" strokeWidth="1.2" />
            ))}
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
                  {active && <circle r="10" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.6">
                    <animate attributeName="r" values="6;13" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0" dur="1.6s" repeatCount="indefinite" />
                  </circle>}
                  <circle r={active ? 5.5 : 3.5} fill={active ? ACCENT : '#e7cf9a'} opacity={active ? 1 : 0.75} />
                </g>
              )
            })}
          </g>
        </svg>

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
              className="rounded-full border px-3 py-1 text-xs text-white/70 transition hover:border-travel"
            >
              {c?.flag} {c?.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
