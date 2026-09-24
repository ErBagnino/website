import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scene3D from './Scene3D'
import { useSeenOnce } from '../lib/persist'
import { usePrefersReducedMotion } from '../lib/motion'

interface SceneHeroProps {
  sceneKey: string
  scene: (settled: boolean) => ReactNode
  /** Describes this hero's 3D animation for screen readers and the no-WebGL fallback. */
  sceneLabel: string
  lines: string[]
  eyebrow: string
  title: string
  subtitle: string
  accent: string
  cameraPosition?: [number, number, number]
  background?: ReactNode
  contentId?: string
}

export default function SceneHero({
  sceneKey,
  scene,
  sceneLabel,
  lines,
  eyebrow,
  title,
  subtitle,
  accent,
  cameraPosition = [0, 0, 6],
  background,
  contentId = 'content',
}: SceneHeroProps) {
  const [, markSeen] = useSeenOnce(`hero:${sceneKey}`)
  const reducedMotion = usePrefersReducedMotion()
  // Snapshot "already seen" at mount time only — markSeen() below flips the live
  // value reactively, but that must never retroactively change how *this* visit behaves.
  const wasSeen = useRef((() => {
    try {
      return sessionStorage.getItem(`seen:hero:${sceneKey}`) === '1'
    } catch {
      return false
    }
  })()).current

  const [lineIndex, setLineIndex] = useState(wasSeen ? lines.length : 0)
  const [showTitle, setShowTitle] = useState(wasSeen)
  const [settled, setSettled] = useState(wasSeen)
  const userScrolled = useRef(false)

  useEffect(() => {
    if (wasSeen) return
    if (lineIndex >= lines.length) {
      const t = setTimeout(() => setShowTitle(true), 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 420)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex, lines.length])

  useEffect(() => {
    if (!showTitle || wasSeen) return
    markSeen()
    const t = setTimeout(() => setSettled(true), 1400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTitle])

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40) userScrolled.current = true
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!settled || wasSeen || reducedMotion) return
    const t = setTimeout(() => {
      if (!userScrolled.current) {
        document.getElementById(contentId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 450)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled, contentId, reducedMotion])

  return (
    <section className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-void lg:flex-row">
      <div className="absolute inset-0 z-0">{background}</div>

      <div className="relative z-10 h-[42%] w-full lg:h-full lg:w-1/2">
        <Scene3D label={sceneLabel} camera={{ position: cameraPosition, fov: 50 }}>
          {scene(settled)}
        </Scene3D>
      </div>

      <div className="relative z-20 flex flex-1 flex-col items-start justify-center px-6 py-8 lg:w-1/2 lg:px-14">
        <AnimatePresence mode="wait">
          {!showTitle ? (
            <motion.div
              key="boot"
              exit={{ opacity: 0 }}
              className="w-full max-w-md space-y-2 font-display text-xs uppercase tracking-[0.2em] sm:text-sm"
              style={{ color: accent }}
            >
              {lines.slice(0, lineIndex).map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="text-glow"
                >
                  &gt; {line}
                </motion.p>
              ))}
              {lineIndex < lines.length && <p className="caret opacity-60">&gt;</p>}
            </motion.div>
          ) : (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-lg"
            >
              <span
                style={{ color: accent }}
                className="font-display text-[11px] uppercase tracking-[0.4em] opacity-80"
              >
                {eyebrow}
              </span>
              <h1
                style={{ color: accent }}
                className="text-glow mt-3 font-display text-4xl font-black uppercase tracking-wide text-white sm:text-6xl"
              >
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-sm text-white/60 sm:text-base">{subtitle}</p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => {
                  userScrolled.current = true
                  document.getElementById(contentId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="mt-8 flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.3em] text-white/50 transition hover:text-white/80"
              >
                scorri per esplorare
                <span aria-hidden className="animate-pulse">
                  &darr;
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
