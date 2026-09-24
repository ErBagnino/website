import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ArcReactorScene from '../three/ArcReactorScene'
import Scene3D from '../components/Scene3D'
import { useSeenOnce } from '../lib/persist'
import { useDocumentMeta } from '../lib/seo'

const BOOT_HEADER = 'AVVIO SISTEMA'
const BOOT_LINES = [
  'Inizializzazione interfaccia...',
  'Caricamento profilo personale...',
  'Sincronizzazione neurale...',
  'Sistemi visivi pronti...',
  'Identità riconosciuta.',
]

const PROFILE_ACCENT = '#cfe3e8'

const MODULES = [
  {
    to: '/profile',
    title: 'Profilo & CV',
    subtitle: 'Percorso, esperienze e competenze — in versione interattiva',
    accent: PROFILE_ACCENT,
    icon: 'AG',
  },
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

type Stage = 'booting' | 'gate' | 'hub'

export default function Home() {
  useDocumentMeta({
    title: 'Adam Gabriele Javurek — Portfolio interattivo',
    description:
      'Portfolio personale di Adam Gabriele Javurek: profilo e CV interattivo, progetti Tech & AI, organizzazione di viaggi e bouquet di fiori di filo fatti a mano.',
    path: '/',
  })

  const [seen, markSeen] = useSeenOnce('home')
  const [stage, setStage] = useState<Stage>(seen ? 'gate' : 'booting')
  const [lineIndex, setLineIndex] = useState(seen ? BOOT_LINES.length : 0)

  useEffect(() => {
    if (seen || stage !== 'booting') return
    if (lineIndex >= BOOT_LINES.length) {
      const t = setTimeout(() => {
        setStage('gate')
        markSeen()
      }, 650)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 480)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, lineIndex, seen])

  const reactorSettled = stage !== 'booting'

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-void">
      <div className="hud-grid absolute inset-0 z-0" />
      <div className="absolute inset-0 z-10">
        <Scene3D
          label="Animazione 3D di un reattore energetico stile HUD: l'energia scorre di continuo lungo gli anelli, poi il sistema si allarga verso i bordi dello schermo"
          camera={{ position: [0, 0, 6], fov: 50 }}
        >
          <ArcReactorScene scatter={reactorSettled} instant={seen} />
        </Scene3D>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0 z-15"
        style={{
          background:
            'radial-gradient(ellipse 80% 75% at center, rgba(5,7,12,0.96) 0%, rgba(5,7,12,0.8) 40%, rgba(5,7,12,0.35) 65%, transparent 85%)',
        }}
        initial={{ opacity: seen ? 1 : 0 }}
        animate={{ opacity: reactorSettled ? 1 : 0 }}
        transition={{ duration: 1.2, delay: seen ? 0 : 0.4 }}
      />

      <AnimatePresence mode="wait">
        {stage === 'booting' && (
          <motion.div
            key="boot"
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.6 }}
            className="relative z-20 min-h-screen"
          >
            <div className="absolute bottom-10 left-6 w-[min(88vw,380px)] space-y-1.5 font-display text-xs uppercase tracking-[0.18em] sm:bottom-14 sm:left-10 sm:text-sm">
              <p className="mb-2 text-glow text-accent">[ {BOOT_HEADER} ]</p>
              {BOOT_LINES.slice(0, lineIndex).map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="text-accent/80"
                >
                  &gt; {line}
                </motion.p>
              ))}
              {lineIndex < BOOT_LINES.length && <p className="caret text-accent/60">&gt;</p>}
            </div>

            <button
              onClick={() => {
                setStage('gate')
                markSeen()
              }}
              className="group fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-5 py-3 font-display text-xs uppercase tracking-widest text-white/70 backdrop-blur-md transition hover:border-accent hover:text-accent active:scale-95 sm:bottom-8 sm:right-8"
            >
              Salta intro
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                &rarr;
              </span>
            </button>
          </motion.div>
        )}

        {stage === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.35 } }}
            transition={{ duration: 0.9 }}
            className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 py-16"
          >
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-[11px] uppercase tracking-[0.5em] text-accent/70"
            >
              Portfolio Interattivo
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-4 text-center"
            >
              <span className="block font-display text-sm uppercase tracking-[0.55em] text-white/60 sm:text-base">
                Adam Gabriele
              </span>
              <span className="text-glow mt-1 block font-display text-5xl font-black uppercase tracking-wide text-accent sm:text-7xl">
                Javurek
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              className="mt-5 max-w-md text-center text-sm text-white/60 sm:text-base"
            >
              Cosa vuoi scoprire?
            </motion.p>

            <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46, duration: 0.6 }}
              >
                <Link
                  to="/profile"
                  style={{ ['--accent' as string]: PROFILE_ACCENT }}
                  className="corner-frame group relative block h-full rounded-2xl panel-glass p-8 text-[color:var(--accent)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_var(--accent)]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-current font-display text-sm">
                    AG
                  </div>
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                    Esplora il profilo
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    Conosci il mio percorso: un CV interattivo con esperienze, competenze e formazione.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-[color:var(--accent)] opacity-80 group-hover:opacity-100">
                    Entra <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.6 }}
              >
                <button
                  onClick={() => setStage('hub')}
                  style={{ ['--accent' as string]: '#38f0e0' }}
                  className="corner-frame group relative block h-full w-full rounded-2xl panel-glass p-8 text-left text-[color:var(--accent)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_var(--accent)]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-current text-xl">
                    ▦
                  </div>
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                    Esplora le competenze
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    Tech &amp; AI, viaggi e fiori di filo — tre ambiti in cui posso darti una mano.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-[color:var(--accent)] opacity-80 group-hover:opacity-100">
                    Entra <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {stage === 'hub' && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 py-16"
          >
            <button
              onClick={() => setStage('gate')}
              className="mb-6 font-display text-[10px] uppercase tracking-[0.3em] text-white/45 transition hover:text-white/80"
            >
              &larr; Torna all'ingresso
            </button>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center font-display text-2xl font-black uppercase tracking-wide text-white text-glow text-accent sm:text-4xl"
            >
              Adam G. Javurek
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-4 max-w-xl text-center text-sm text-white/60 sm:text-base"
            >
              Quattro moduli, una sola persona dietro. Scegline uno per scoprire cosa so fare e, se ti va,
              raccontami cosa ti serve.
            </motion.p>

            <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MODULES.map((hub, i) => (
                <motion.div
                  key={hub.to}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 + i * 0.12, duration: 0.6 }}
                >
                  <Link
                    to={hub.to}
                    style={{ ['--accent' as string]: hub.accent }}
                    className="corner-frame group float relative block h-full rounded-2xl panel-glass p-7 text-[color:var(--accent)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_var(--accent)]"
                  >
                    <div
                      style={{ animationDelay: `${i * 0.6}s` }}
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-current font-display text-xl"
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
