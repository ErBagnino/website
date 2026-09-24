import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/motion'

const ACCENT = '#38f0e0'

// A brief full-screen HUD "shutter" that covers the viewport at the exact
// moment a route swaps underneath it — a cinematic system-switch beat instead
// of a plain instant page swap, without needing to choreograph exit/enter
// animations for every individual page.
export default function HudTransitionOverlay() {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    if (reduced) return
    setActive(true)
    const t = setTimeout(() => setActive(false), 640)
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
          exit={{ opacity: 0, transition: { duration: 0.22, delay: 0.06 } }}
          transition={{ duration: 0.12 }}
        >
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
          <motion.div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 font-display text-[10px] uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.16, duration: 0.15 }}
          >
            <span className="h-px w-6" style={{ background: ACCENT }} />
            modulo in caricamento
            <span className="h-px w-6" style={{ background: ACCENT }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
