import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ArcReactorScene from '../three/ArcReactorScene'
import Scene3D from '../components/Scene3D'
import { useSeenOnce } from '../lib/persist'
import { useDocumentMeta } from '../lib/seo'

const BOOT_LINES = [
  'INIZIALIZZAZIONE INTERFACCIA...',
  'CARICAMENTO PROFILO OPERATIVO...',
  'RICONOSCIMENTO COMPLETATO',
  'BENVENUTO, VISITATORE',
]

const HUBS = [
  {
    to: '/tech',
    title: 'Tech & AI',
    subtitle: 'Loghi, grafiche e siti creati con l’aiuto dell’intelligenza artificiale',
    accent: '#38f0e0',
    icon: '⚙',
  },
  {
    to: '/travel',
    title: 'Viaggi',
    subtitle: 'Itinerari, hotel e ristoranti pensati su misura per te',
    accent: '#ffb454',
    icon: '✈',
  },
  {
    to: '/flowers',
    title: 'Fiori di Filo',
    subtitle: 'Bouquet fatti a mano con pipe cleaners, per chi non li dimentica',
    accent: '#ff7ab8',
    icon: '❀',
  },
]

export default function Home() {
  useDocumentMeta({
    title: 'Adam Javurek — Portfolio interattivo',
    description:
      'Portfolio personale di Adam Javurek: aiuto con progetti Tech & AI, organizzazione di viaggi e bouquet di fiori di filo fatti a mano. Scrivimi su WhatsApp per parlarne.',
    path: '/',
  })
  const [seen, markSeen] = useSeenOnce('home')
  const [stage, setStage] = useState<'booting' | 'ready'>(seen ? 'ready' : 'booting')
  const [lineIndex, setLineIndex] = useState(seen ? BOOT_LINES.length : 0)

  useEffect(() => {
    if (seen || stage !== 'booting') return
    if (lineIndex >= BOOT_LINES.length) {
      const t = setTimeout(() => {
        setStage('ready')
        markSeen()
      }, 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 620)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, lineIndex, seen])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-void">
      <div className="hud-grid absolute inset-0 z-0" />
      <div className="absolute inset-0 z-10">
        <Scene3D
          label="Animazione 3D di un reattore energetico stile HUD che si accende e poi si allarga verso i bordi dello schermo"
          camera={{ position: [0, 0, 6], fov: 50 }}
        >
          <ArcReactorScene scatter={stage === 'ready'} instant={seen} />
        </Scene3D>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0 z-15"
        style={{
          background:
            'radial-gradient(ellipse 80% 75% at center, rgba(5,7,12,0.96) 0%, rgba(5,7,12,0.8) 40%, rgba(5,7,12,0.35) 65%, transparent 85%)',
        }}
        initial={{ opacity: seen ? 1 : 0 }}
        animate={{ opacity: stage === 'ready' ? 1 : 0 }}
        transition={{ duration: 1.2, delay: seen ? 0 : 0.3 }}
      />

      <AnimatePresence mode="wait">
        {stage === 'booting' && (
          <motion.div
            key="boot"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-20 flex min-h-screen flex-col items-center justify-end pb-24 sm:justify-center sm:pb-0"
          >
            <div className="w-[min(90vw,420px)] space-y-2 font-display text-xs uppercase tracking-[0.2em] text-accent sm:text-sm">
              {BOOT_LINES.slice(0, lineIndex).map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="text-glow text-accent/90"
                >
                  &gt; {line}
                </motion.p>
              ))}
              {lineIndex < BOOT_LINES.length && <p className="caret text-accent/60">&gt;</p>}
            </div>
            <button
              onClick={() => {
                setStage('ready')
                markSeen()
              }}
              className="mt-10 font-display text-[10px] uppercase tracking-widest text-white/50 underline decoration-dotted underline-offset-4 hover:text-white/70"
            >
              salta intro
            </button>
          </motion.div>
        )}

        {stage === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 py-16"
          >
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-[11px] uppercase tracking-[0.4em] text-accent/70"
            >
              Portfolio Interattivo
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-center font-display text-4xl font-black uppercase tracking-wide text-white text-glow text-accent sm:text-6xl"
            >
              Adam Javurek
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 max-w-xl text-center text-sm text-white/60 sm:text-base"
            >
              Tre ambiti, una sola persona dietro. Scegli un modulo per scoprire cosa so fare e, se ti va,
              raccontami cosa ti serve.
            </motion.p>

            <div className="mt-14 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
              {HUBS.map((hub, i) => (
                <motion.div
                  key={hub.to}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                >
                  <Link
                    to={hub.to}
                    style={{ ['--accent' as string]: hub.accent }}
                    className="corner-frame group float relative block h-full rounded-2xl panel-glass p-7 text-[color:var(--accent)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_var(--accent)]"
                  >
                    <div
                      style={{ animationDelay: `${i * 0.6}s` }}
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-current text-2xl"
                    >
                      {hub.icon}
                    </div>
                    <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
                      {hub.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{hub.subtitle}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-[color:var(--accent)] opacity-80 group-hover:opacity-100">
                      Entra <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-16 text-center text-[11px] uppercase tracking-[0.3em] text-white/50"
            >
              Nessun listino, nessun pacchetto. Solo quello che so fare.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
