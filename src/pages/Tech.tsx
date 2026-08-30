import { motion } from 'framer-motion'
import SceneHero from '../components/SceneHero'
import PCBootScene from '../three/PCBootScene'
import WhatsAppButton from '../components/WhatsAppButton'
import BackToHub from '../components/BackToHub'

const ACCENT = '#38f0e0'

const SKILLS = [
  {
    icon: '◈',
    title: 'Loghi & identità visiva',
    text: 'Simboli puliti e riconoscibili, pensati insieme all’AI per esplorare tante direzioni prima di scegliere quella giusta.',
  },
  {
    icon: '▦',
    title: 'Grafiche & social',
    text: 'Post, copertine, locandine: contenuti visivi coerenti per far riconoscere un profilo a colpo d’occhio.',
  },
  {
    icon: '◫',
    title: 'Siti web',
    text: 'Pagine semplici e veloci, costruite su misura — proprio come questa che stai guardando ora.',
  },
  {
    icon: '✧',
    title: 'Contenuti assistiti da AI',
    text: 'Testi, immagini e piccole automazioni per velocizzare il lavoro creativo senza perdere qualità.',
  },
]

export default function Tech() {
  return (
    <div className="bg-void">
      <BackToHub accent={ACCENT} />
      <SceneHero
        scene={<PCBootScene />}
        lines={['AVVIO SISTEMA...', 'CARICAMENTO MODULI GRAFICI...', 'RETI NEURALI ATTIVE', 'SISTEMA PRONTO']}
        eyebrow="Modulo 01"
        title="Tech & AI"
        subtitle="Idee digitali, dalla grafica al sito, con l’intelligenza artificiale come alleata e non come scorciatoia."
        accent={ACCENT}
      />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl"
        >
          Quello che so fare
        </motion.h2>
        <p className="mt-3 max-w-2xl text-white/55">
          Non ho un listino né dei pacchetti preconfezionati: ogni richiesta è diversa, e mi piace affrontarla
          come tale. Qui sotto trovi gli ambiti in cui posso darti una mano.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {SKILLS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="corner-frame panel-glass rounded-2xl p-6 text-accent transition hover:-translate-y-1 hover:shadow-[0_0_30px_-12px_#38f0e0]"
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
          className="corner-frame panel-glass rounded-2xl p-8 text-accent sm:p-10"
        >
          <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">Come lavoro</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Nessuna fattura, nessun contratto chilometrico: parliamo di cosa ti serve, ti faccio vedere qualche
            proposta e andiamo avanti solo se ti convince. È un aiuto tra persone, fatto con cura — la stessa
            che ci metterei per un progetto mio.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <WhatsAppButton
              accent={ACCENT}
              message="Ciao Adam! Ho visto la sezione Tech & AI del tuo portfolio e vorrei parlarti di un'idea (logo / grafica / sito). Ti va di sentirci?"
              label="Parliamone su WhatsApp"
              big
            />
          </div>
        </motion.div>
      </section>
    </div>
  )
}
