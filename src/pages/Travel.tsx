import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import SceneHero from '../components/SceneHero'
import PlaneFlyoverScene from '../three/PlaneFlyoverScene'
import BackToHub from '../components/BackToHub'
import BeachTransition from '../components/BeachTransition'
import { useDocumentMeta } from '../lib/seo'

const ACCENT = '#ffb454'

const HELPS = [
  {
    icon: '⌂',
    title: 'Hotel su misura',
    text: 'Dal più economico al migliore rapporto qualità-prezzo, fino alla struttura top per chi vuole coccolarsi.',
  },
  {
    icon: '✈',
    title: 'Voli',
    text: 'Confronto rotte e orari per trovare la soluzione più sensata, senza scali assurdi o sorprese.',
  },
  {
    icon: '⌘',
    title: 'Itinerari giorno per giorno',
    text: 'Un percorso realistico, con i tempi giusti tra un posto e l’altro — niente corse assurde per vedere tutto.',
  },
  {
    icon: '❖',
    title: 'Ristoranti locali',
    text: 'Posti veri, dove si mangia bene senza il conto da turista — quelli che cerco anche per me.',
  },
]

function DuskSky() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        top: `${Math.random() * 55}%`,
        left: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 1.6,
        delay: Math.random() * 3,
      })),
    [],
  )
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #050810 0%, #0b1526 28%, #1c2c46 50%, #5c4a3c 78%, #ffb454 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(255,180,84,0.35), transparent 70%)' }}
      />
      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-white"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  )
}

export default function Travel() {
  useDocumentMeta({
    title: 'Viaggi | Adam Gabriele Javurek — Itinerari, hotel e ristoranti su misura',
    description:
      'Una mano gratuita per organizzare il tuo viaggio: hotel, voli, itinerari, ristoranti locali ed esperienze, con l’aiuto dell’AI. Compila il questionario su WhatsApp.',
    path: '/travel',
  })

  return (
    <div className="bg-void">
      <BackToHub accent={ACCENT} />
      <SceneHero
        sceneKey="travel"
        scene={() => <PlaneFlyoverScene />}
        sceneLabel="Animazione 3D di un aereo che vola tra le nuvole in un cielo al tramonto"
        lines={['TRACCIANDO ROTTA...', 'RICERCA DESTINAZIONI...', 'OTTIMIZZAZIONE ITINERARIO...', 'PRONTI AL DECOLLO']}
        eyebrow="Modulo 02"
        title="Viaggi"
        subtitle="Ricerche fatte con cura (e con l’aiuto dell’AI) per viaggi che si ricordano per i motivi giusti."
        accent={ACCENT}
        background={<DuskSky />}
        contentId="travel-content"
      />

      <BeachTransition />

      <section id="travel-content" className="mx-auto max-w-5xl px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl"
        >
          In cosa posso darti una mano
        </motion.h2>
        <p className="mt-3 max-w-2xl text-white/55">
          Organizzare viaggi mi piace davvero: ci passo ore per hobby, quindi tanto vale mettere a frutto la
          cosa. Nessun servizio in vendita: è una mano che offro volentieri, gratis, a chi la vuole.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {HELPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="corner-frame panel-glass rounded-2xl p-6 text-travel transition hover:-translate-y-1 hover:shadow-[0_0_30px_-12px_#ffb454]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-current text-xl">
                {s.icon}
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="corner-frame panel-glass rounded-2xl p-8 text-center text-travel sm:p-14"
        >
          <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            Componi la tua richiesta
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/55">
            Un questionario guidato in pochi passaggi — destinazione su una mappa interattiva, date, stile, budget e
            preferenze. Alla fine preparo io il messaggio con tutti i dettagli, tu premi solo invio.
          </p>
          <Link
            to="/travel/questionnaire"
            style={{ background: ACCENT }}
            className="mt-8 inline-block rounded-full px-8 py-3 font-display text-sm uppercase tracking-widest text-void transition hover:scale-105"
          >
            Inizia la tua richiesta
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
