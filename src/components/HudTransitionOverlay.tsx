import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/motion'

const ACCENT = '#38f0e0'

// Short boot-log style lines, echoing Home's own intro sequence, so a route
// change reads as a small reprise of that same "system" coming back online
// rather than an unrelated transition effect.
const LINES = [
  'SINCRONIZZAZIONE MODULO...',
  'CARICAMENTO INTERFACCIA...',
  'INIZIALIZZAZIONE VISTA...',
  'INDICIZZAZIONE DATI...',
]

function usePickLine(active: boolean) {
  const idxRef = useRef(0)
  return useMemo(() => {
    if (!active) return LINES[0]
    idxRef.current = (idxRef.current + 1) % LINES.length
    return LINES[idxRef.current]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}

// A brief full-screen HUD "shutter" that covers the viewport at the exact
// moment a route swaps underneath it — a cinematic system-switch beat, in
// the same visual language as the Home boot sequence (reactor rings, HUD
// grid, boot-log lines), instead of an unrelated effect or an instant swap.
export default function HudTransitionOverlay() {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(false)
  const isFirst = useRef(true)
  const line = usePickLine(active)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    if (reduced) return
    setActive(true)
    const t = setTimeout(() => setActive(false), 680)
    return () => clearTimeout(t)
  }, [location.pathname, reduced])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-void"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22, delay: 0.08 } }}
          transition={{ duration: 0.12 }}
        >
          <div className="hud-grid absolute inset-0" />

          <motion.div
            className="absolute inset-x-0 top-0"
            style={{ height: '50%', borderBottom: `1px solid ${ACCENT}`, boxShadow: `0 1px 20px 0 ${ACCENT}` }}
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.26, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0"
            style={{ height: '50%', borderTop: `1px solid ${ACCENT}`, boxShadow: `0 -1px 20px 0 ${ACCENT}` }}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.26, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* a quick reactor-ring pulse at the center, echoing the Home boot core */}
          <svg viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx="50"
                cy="50"
                r="6"
                fill="none"
                stroke={ACCENT}
                strokeWidth="1"
                initial={{ r: 6, opacity: 0.9 }}
                animate={{ r: 46, opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.05 + i * 0.09, ease: 'easeOut' }}
              />
            ))}
            <motion.circle
              cx="50"
              cy="50"
              r="4"
              fill={ACCENT}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.3, delay: 0.05 }}
            />
          </svg>

          <motion.div
            className="absolute left-1/2 top-[58%] flex -translate-x-1/2 items-center gap-3 font-display text-[10px] uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.18, duration: 0.15 }}
          >
            <span className="caret">&gt; {line}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
