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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none absolute bottom-20 left-1/2 z-20 w-[min(88%,320px)] -translate-x-1/2 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-center backdrop-blur-md"
    >
      <p className="font-display text-[9px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
        [ Adam_AI ]
      </p>
      <p className="mt-1 text-xs text-white/70">{HUD_MESSAGES[index]}</p>
    </motion.div>
  )
}

function ScanStats() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.4 }}
      className="pointer-events-none absolute right-4 top-4 z-20 rounded-xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md"
    >
      <p className="font-display text-[9px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
        Scan · identikit
      </p>
      <div className="mt-2 space-y-1">
        {SCAN_STATS.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-4 text-[11px]">
            <span className="text-white/45">{s.label}</span>
            <span className="text-white/80">{s.value}</span>
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

        <div className="relative z-10 h-[46vh] w-full lg:h-full lg:w-1/2">
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
        <p className="mt-3 max-w-2xl text-white/55">Le esperienze che mi hanno portato fin qui.</p>

        <div className="relative mt-10 space-y-8 border-l pl-8" style={{ borderColor: 'rgba(207,227,232,0.25)' }}>
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.role + exp.period}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative"
            >
              <span
                className="absolute -left-[41px] top-1 h-3 w-3 rounded-full border-2 transition group-hover:scale-125"
                style={{ borderColor: ACCENT, background: '#05070c' }}
              />
              <p className="font-display text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
                {exp.period}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold uppercase tracking-wide text-white">
                {exp.role}
              </h3>
              <p className="text-sm text-white/45">{exp.place}</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">{exp.text}</p>
            </motion.div>
          ))}
        </div>
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
