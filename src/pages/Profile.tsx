import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BackToHub from '../components/BackToHub'
import Scene3D from '../components/Scene3D'
import AvatarScene, { type AvatarSceneHandle } from '../three/AvatarScene'
import WhatsAppButton from '../components/WhatsAppButton'
import { useDocumentMeta } from '../lib/seo'

const ACCENT = '#cfe3e8'

const HUD_MESSAGES = [
  'Puoi trascinarmi per guardarmi a 360°.',
  'Vuoi sapere cosa ho combinato finora?',
  'Sono anche bagnino di salvataggio, giuro.',
  'Scorri per il percorso completo.',
]

const SCAN_STATS = [
  { label: 'Altezza', value: '~170 cm' },
  { label: 'Peso', value: '~74 kg' },
  { label: 'Capelli', value: 'Biondi' },
  { label: 'Occhi', value: 'Verdi' },
]

const EXPERIENCES = [
  {
    period: '2022 — Presente',
    role: 'Web Designer & Front-End Developer',
    place: 'Freelance · Remoto',
    text: 'Gestione autonoma di progetti nel rispetto di scadenze, con precisione e affidabilità in ogni fase del lavoro.',
  },
  {
    period: 'Mag 2026 — In corso',
    role: 'Bagnino di Salvataggio in Piscina',
    place: 'Camping Vittoria · Rosolina Mare (RO)',
    text: 'Rispetto rigoroso delle procedure di sicurezza e igiene, capacità di gestire situazioni di pressione con prontezza e professionalità, primo soccorso BLSD.',
  },
  {
    period: 'Lug — Ago 2025',
    role: 'Assistente Operativo & Spiaggia',
    place: 'Camping Vittoria · Rosolina Mare (RO)',
    text: 'Assistenza diretta al pubblico e gestione degli spazi operativi, allestimento e cura dell’ambiente nel rispetto di ordine e pulizia, con spirito di squadra e buona volontà di lavoro.',
  },
  {
    period: '2021 — 2025',
    role: 'Customer Service & Front Desk',
    place: 'Agenzia Adriatico · Rosolina (RO)',
    text: 'Accoglienza e assistenza diretta al cliente, gestione delle richieste con cortesia e professionalità, cura costante per la qualità del servizio e la soddisfazione degli ospiti.',
  },
  {
    period: '2021 — 2024',
    role: 'Bagnino di Salvataggio',
    place: 'Alto Adriatiko · Rosolina Mare (RO)',
    text: 'Affidabilità e puntualità nel rispetto rigoroso dei turni, con forte attitudine al lavoro di squadra.',
  },
]

const SKILLS = [
  'Servizio in Sala & Accoglienza',
  'Rispetto Norme HACCP',
  'Lavoro in Team',
  'Buona Volontà & Proattività',
  'Flessibilità Oraria',
  'Web Design & Front-End',
  'Comunicazione & Ascolto',
  'Gestione dello Stress',
  'Problem Solving',
  'Primo Soccorso (BLSD)',
]

const LANGUAGES = [
  { name: 'Italiano', level: 'Madrelingua' },
  { name: 'Ceco', level: 'Madrelingua' },
  { name: 'Inglese', level: 'C1' },
]

const EDUCATION = [
  { title: 'Liceo Scientifico Galileo Galilei', place: 'Adria (RO)', period: '2019 — 2026' },
  { title: 'Certificazione Inglese C1', place: 'Cambridge Assessment English', period: '2022' },
  { title: 'Brevetto Salvataggio MIP & Abilitazione BLSD', place: 'Primo soccorso e sicurezza', period: '' },
]

const INTERESTS = ['Puntualità', 'Occhio per il design', 'Attitudine interculturale', 'Home gym & nutrizione']

// Six traits, each mapped to a region of a stylized brain diagram (see BrainMap
// below) — broader than a plain bullet list, and written so someone skimming
// without hovering anything still gets the full picture.
const PERSONALITY = [
  {
    angle: -60,
    color: '#ff7ab8',
    title: 'Creatività & occhio per il design',
    text: 'Che sia un sito, un logo o dei fiori fatti a mano, curo i dettagli finché il risultato non mi convince davvero.',
  },
  {
    angle: 0,
    color: '#b389f5',
    title: 'Curiosità & problem solving',
    text: 'Mi piace capire come funzionano le cose — da lì l’interesse, coltivato da autodidatta, per il web design e l’intelligenza artificiale.',
  },
  {
    angle: 60,
    color: '#8fe0e8',
    title: 'Squadra & affidabilità',
    text: 'Preferisco un buon lavoro di gruppo a un successo individuale, e ci tengo a essere puntuale — qualcuno su cui si può contare.',
  },
  {
    angle: 120,
    color: '#cfe3e8',
    title: 'Ospitalità & calma sotto pressione',
    text: 'Il mio obiettivo in accoglienza è far sentire l’ospite visto e tranquillo, non solo "servito" — e restare lucido quando il turno si complica.',
  },
  {
    angle: 180,
    color: '#4fdc82',
    title: 'Comunicazione & empatia',
    text: 'Che sia dietro un banco reception o su una spiaggia affollata, ascolto prima di rispondere e noto in fretta cosa serve all’altra persona.',
  },
  {
    angle: 240,
    color: '#ffb454',
    title: 'Estroversione & iniziativa',
    text: 'Parlare con persone nuove non mi pesa — mi viene naturale, anche nei momenti più caotici, e spesso sono io a rompere il ghiaccio.',
  },
]

const BRAIN_CX = 170
const BRAIN_CY = 110
const BRAIN_OUTLINE =
  'M 60 70 C 55 40, 100 15, 145 20 C 175 5, 225 10, 245 30 C 280 35, 310 65, 300 100 C 320 110, 315 150, 285 165 C 295 190, 255 205, 225 195 C 210 215, 165 215, 150 198 C 120 210, 80 200, 75 175 C 45 175, 30 140, 40 105 C 25 95, 35 75, 60 70 Z'

function polarPoint(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: BRAIN_CX + radius * Math.cos(rad), y: BRAIN_CY + radius * Math.sin(rad) }
}

// A stylized "neural scan" of the personality traits above: one wedge per
// trait, clipped to a hand-drawn brain silhouette so the colored regions
// never spill outside it regardless of wedge geometry, with a leader line and
// a short label reaching just past the outline — same annotated-scan language
// as the Scan · identikit panel in the hero.
function BrainMap() {
  return (
    <div className="relative mx-auto mt-8 aspect-[340/240] w-full max-w-xl">
      <svg aria-hidden viewBox="0 0 340 240" className="h-full w-full overflow-visible">
        <defs>
          <clipPath id="brainClip">
            <path d={BRAIN_OUTLINE} />
          </clipPath>
        </defs>
        <g clipPath="url(#brainClip)">
          {PERSONALITY.map((p) => {
            const a0 = polarPoint(200, p.angle - 30)
            const a1 = polarPoint(200, p.angle + 30)
            return (
              <path
                key={p.title}
                d={`M ${BRAIN_CX} ${BRAIN_CY} L ${a0.x} ${a0.y} A 200 200 0 0 1 ${a1.x} ${a1.y} Z`}
                fill={p.color}
                opacity={0.4}
              />
            )
          })}
        </g>
        <path d={BRAIN_OUTLINE} fill="none" stroke="rgba(207,227,232,0.55)" strokeWidth="1.6" />
        <path
          d="M 170 20 C 150 55, 190 80, 170 110 C 150 140, 190 165, 175 198"
          fill="none"
          stroke="rgba(207,227,232,0.3)"
          strokeWidth="1.2"
          strokeDasharray="2 4"
        />
        {PERSONALITY.map((p) => {
          const s0 = polarPoint(95, p.angle)
          const s1 = polarPoint(118, p.angle)
          return (
            <g key={p.title}>
              <line x1={s0.x} y1={s0.y} x2={s1.x} y2={s1.y} stroke={p.color} strokeWidth="1.2" opacity={0.8} />
              <circle cx={s0.x} cy={s0.y} r={3} fill={p.color} />
            </g>
          )
        })}
      </svg>
      {PERSONALITY.map((p) => {
        const pt = polarPoint(120, p.angle)
        const leftPct = (pt.x / 340) * 100
        const topPct = (pt.y / 240) * 100
        const onRight = Math.cos((p.angle * Math.PI) / 180) >= 0
        return (
          <span
            key={p.title}
            className={`absolute max-w-[9.5rem] -translate-y-1/2 font-display text-[9px] uppercase leading-tight tracking-wider sm:max-w-[10.5rem] sm:text-[10px] ${
              onRight ? 'text-left' : 'text-right'
            }`}
            style={{
              color: p.color,
              ...(onRight ? { left: `${leftPct}%` } : { right: `${100 - leftPct}%` }),
              top: `${topPct}%`,
            }}
          >
            {p.title}
          </span>
        )
      })}
    </div>
  )
}

function HudMessage() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 2200)
    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!visible) return
    const cycle = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % HUD_MESSAGES.length)
        setVisible(true)
      }, 400)
    }, 6000)
    return () => clearInterval(cycle)
  }, [visible])

  return (
    <motion.div
      initial={{ opacity: 0, x: '-50%', y: 8 }}
      animate={{ opacity: visible ? 1 : 0, x: '-50%', y: visible ? 0 : 8 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none absolute bottom-20 left-1/2 z-20 w-[min(88%,320px)] rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-center backdrop-blur-md"
    >
      <p className="font-display text-[9px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
        [ Adam_AI ]
      </p>
      <p className="mt-1 text-xs text-white/70">{HUD_MESSAGES[index]}</p>
    </motion.div>
  )
}

const TIMELINE_ALIGN: Array<'left' | 'right' | 'center'> = ['left', 'right', 'center']
const TIMELINE_X: Record<'left' | 'right' | 'center', number> = { left: 8, right: 92, center: 50 }

function TimelineDot({ x }: { x: number }) {
  return (
    <span
      aria-hidden
      className="absolute top-0 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition group-hover:scale-125"
      style={{ left: `${x}%`, borderColor: ACCENT, background: '#05070c' }}
    />
  )
}

// Bridges two consecutive dots with a soft S-curve at their exact x-positions,
// so the line always passes through the dot rather than approximating it —
// a fixed-height segment between rows keeps this correct regardless of how
// tall any given card's text ends up being.
function TimelineConnector({ from, to }: { from: number; to: number }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="h-16 w-full sm:h-20">
      <path
        d={`M ${from} 0 C ${from} 55, ${to} 45, ${to} 100`}
        fill="none"
        stroke="rgba(207,227,232,0.28)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ScanStats() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.4 }}
      className="pointer-events-none absolute right-3 top-3 z-20 min-w-[130px] rounded-xl border border-white/10 bg-black/45 px-3 py-2.5 backdrop-blur-md sm:right-5 sm:top-5 sm:min-w-[190px] sm:rounded-2xl sm:px-5 sm:py-4"
    >
      <p className="font-display text-[9px] uppercase tracking-[0.3em] sm:text-xs" style={{ color: ACCENT }}>
        Scan · identikit
      </p>
      <div className="mt-1.5 space-y-1 sm:mt-3 sm:space-y-2">
        {SCAN_STATS.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-3 text-[10px] sm:gap-5 sm:text-sm">
            <span className="text-white/50">{s.label}</span>
            <span className="font-medium text-white/90">{s.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function Profile() {
  const avatarRef = useRef<AvatarSceneHandle>(null)
  useDocumentMeta({
    title: 'Profilo & CV | Adam Gabriele Javurek',
    description:
      'Il percorso, le esperienze e le competenze di Adam Gabriele Javurek in un CV interattivo: accoglienza, salvataggio, sviluppo web e molto altro.',
    path: '/profile',
  })

  return (
    <div className="bg-void">
      <BackToHub accent={ACCENT} />

      <section className="relative flex h-auto w-full flex-col overflow-hidden lg:h-[100svh] lg:flex-row">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-void" />
          <div className="hud-grid absolute inset-0" />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 75% 40%, rgba(207,227,232,0.1), transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 lg:w-1/2 lg:px-16">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-[11px] uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
          >
            Identità
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-glow mt-3 font-display text-4xl font-black uppercase tracking-wide text-white sm:text-6xl"
            style={{ color: ACCENT }}
          >
            Adam Gabriele
            <br />
            Javurek
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-md text-sm leading-relaxed text-white/65 sm:text-base"
          >
            Professionista dinamico e affidabile, con esperienza in accoglienza, servizio al cliente e
            gestione della sala. Cura del dettaglio, cortesia e prontezza nel soddisfare le richieste, con
            piena disponibilità e voglia di crescere — nel tempo libero mi occupo anche di web design e
            front-end.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50"
          >
            <span>📍 Rosolina (RO)</span>
            <span>🚗 Automunito · Patente B</span>
            <span>✅ Disponibilità immediata</span>
            <a href="mailto:adamjavurek1@gmail.com" className="transition hover:text-white/80">
              ✉ adamjavurek1@gmail.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <WhatsAppButton
              accent={ACCENT}
              message="Ciao Adam! Ho visto il tuo profilo/CV sul portfolio e vorrei parlarne."
              label="Contattami"
            />
            <span className="text-xs text-white/35">Tutto il mio CV è qui sotto — niente da scaricare.</span>
          </motion.div>
        </div>

        <div className="relative z-10 h-[46vh] w-full touch-none lg:h-full lg:w-1/2">
          <Scene3D
            label="Avatar 3D olografico di Adam: trascinalo per ruotarlo a 360 gradi"
            camera={{ position: [0, 0.1, 3.4], fov: 42 }}
          >
            <AvatarScene ref={avatarRef} />
          </Scene3D>
          <ScanStats />
          <HudMessage />
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
            <button
              type="button"
              onClick={() => avatarRef.current?.spin(-1)}
              aria-label="Ruota l'avatar verso sinistra"
              style={{ color: ACCENT, borderColor: 'rgba(207,227,232,0.35)' }}
              className="panel-glass flex h-9 w-9 items-center justify-center rounded-full border transition hover:scale-105"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => avatarRef.current?.spin(1)}
              aria-label="Ruota l'avatar verso destra"
              style={{ color: ACCENT, borderColor: 'rgba(207,227,232,0.35)' }}
              className="panel-glass flex h-9 w-9 items-center justify-center rounded-full border transition hover:scale-105"
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl"
        >
          Percorso
        </motion.h2>
        <p className="mt-3 max-w-2xl text-white/55">
          Le esperienze che mi hanno portato fin qui — mai in linea retta, ma sempre nella stessa direzione.
        </p>

        <div className="mt-10">
          {EXPERIENCES.map((exp, i) => {
            const align = TIMELINE_ALIGN[i % TIMELINE_ALIGN.length]
            const x = TIMELINE_X[align]
            const prevAlign = i > 0 ? TIMELINE_ALIGN[(i - 1) % TIMELINE_ALIGN.length] : null
            return (
              <div key={exp.role + exp.period}>
                {prevAlign && <TimelineConnector from={TIMELINE_X[prevAlign]} to={x} />}
                <div
                  className={`relative flex ${align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'}`}
                >
                  <TimelineDot x={x} />
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`group relative max-w-sm rounded-xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm ${
                      align === 'left' ? 'ml-3 sm:ml-6' : align === 'right' ? 'mr-3 text-right sm:mr-6' : 'mt-6 text-center'
                    }`}
                  >
                    <p className="font-display text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
                      {exp.period}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-white">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-white/45">{exp.place}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{exp.text}</p>
                  </motion.div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="corner-frame panel-glass rounded-2xl p-7 sm:p-9"
          style={{ color: ACCENT }}
        >
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">Personalità · scan neurale</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
            Il lato del CV che non sta in una lista di competenze — sei zone, sei modi diversi in cui si vede chi
            sono, oltre al ruolo che ricopro in un dato momento.
          </p>

          <BrainMap />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PERSONALITY.map((p) => (
              <div key={p.title} className="flex gap-3 rounded-xl border border-white/10 p-4">
                <span aria-hidden className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: p.color }} />
                <div>
                  <p className="font-display text-xs uppercase tracking-widest text-white">{p.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/50">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="corner-frame panel-glass rounded-2xl p-7"
            style={{ color: ACCENT }}
          >
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">Competenze</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <span key={s} className="rounded-full border px-3 py-1.5 text-xs text-white/70" style={{ borderColor: 'rgba(207,227,232,0.3)' }}>
                  {s}
                </span>
              ))}
            </div>

            <h3 className="mt-7 font-display text-sm font-bold uppercase tracking-widest text-white">Lingue</h3>
            <div className="mt-4 space-y-2">
              {LANGUAGES.map((l) => (
                <div key={l.name} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{l.name}</span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                    {l.level}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="corner-frame panel-glass rounded-2xl p-7"
            style={{ color: ACCENT }}
          >
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">Formazione</h3>
            <div className="mt-4 space-y-4">
              {EDUCATION.map((e) => (
                <div key={e.title}>
                  <p className="text-sm font-medium text-white/80">{e.title}</p>
                  <p className="text-xs text-white/45">
                    {e.place}
                    {e.period ? ` · ${e.period}` : ''}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mt-7 font-display text-sm font-bold uppercase tracking-widest text-white">Curiosità</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {INTERESTS.map((s) => (
                <span key={s} className="rounded-full border px-3 py-1.5 text-xs text-white/70" style={{ borderColor: 'rgba(207,227,232,0.3)' }}>
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="corner-frame panel-glass rounded-2xl p-8 sm:p-10"
          style={{ color: ACCENT }}
        >
          <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">Progetti creativi</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Per loghi, grafiche, siti e progetti realizzati con l’aiuto dell’AI, dai un’occhiata al modulo{' '}
            <Link to="/tech" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Tech &amp; AI
            </Link>
            .
          </p>
        </motion.div>
      </section>
    </div>
  )
}
