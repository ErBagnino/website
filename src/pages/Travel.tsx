import { motion } from 'framer-motion'
import SceneHero from '../components/SceneHero'
import PlaneFlyoverScene from '../three/PlaneFlyoverScene'
import BackToHub from '../components/BackToHub'
import TravelQuiz from '../components/TravelQuiz'

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

export default function Travel() {
  return (
    <div className="bg-void">
      <BackToHub accent={ACCENT} />
      <SceneHero
        scene={<PlaneFlyoverScene />}
        lines={['TRACCIANDO ROTTA...', 'RICERCA DESTINAZIONI...', 'OTTIMIZZAZIONE ITINERARIO...', 'PRONTI AL DECOLLO']}
        eyebrow="Modulo 02"
        title="Viaggi"
        subtitle="Ricerche fatte con cura (e con l’aiuto dell’AI) per viaggi che si ricordano per i motivi giusti."
        accent={ACCENT}
      />

      <section className="mx-auto max-w-5xl px-6 py-24">
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
          cosa. Ecco dove posso essere utile.
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
        >
          <TravelQuiz />
        </motion.div>
      </section>
    </div>
  )
}
