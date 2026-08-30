import { useEffect, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'

interface SceneHeroProps {
  scene: ReactNode
  lines: string[]
  eyebrow: string
  title: string
  subtitle: string
  accent: string
  cameraPosition?: [number, number, number]
}

export default function SceneHero({
  scene,
  lines,
  eyebrow,
  title,
  subtitle,
  accent,
  cameraPosition = [0, 0, 6],
}: SceneHeroProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    if (lineIndex >= lines.length) {
      const t = setTimeout(() => setShowTitle(true), 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 480)
    return () => clearTimeout(t)
  }, [lineIndex, lines.length])

  return (
    <section className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-void">
      <div className="hud-grid absolute inset-0 z-0" />
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: cameraPosition, fov: 50 }}>{scene}</Canvas>
      </div>

      <div className="pointer-events-none relative z-20 flex w-full flex-col items-center px-6 text-center">
        <AnimatePresence mode="wait">
          {!showTitle ? (
            <motion.div
              key="boot"
              exit={{ opacity: 0 }}
              className="w-[min(90vw,440px)] space-y-2 font-display text-xs uppercase tracking-[0.2em] sm:text-sm"
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
              <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">{subtitle}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showTitle ? 1 : 0 }}
        transition={{ delay: 0.6 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 font-display text-[10px] uppercase tracking-[0.3em] text-white/40"
      >
        scorri per esplorare
        <div className="mx-auto mt-2 h-8 w-[1px] animate-pulse bg-white/30" />
      </motion.div>
    </section>
  )
}
