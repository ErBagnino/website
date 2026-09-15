import { motion } from 'framer-motion'
import { useMemo } from 'react'
import SceneHero from '../components/SceneHero'
import BouquetScene from '../three/BouquetScene'
import WhatsAppButton from '../components/WhatsAppButton'
import BackToHub from '../components/BackToHub'
import GalleryGrid from '../components/GalleryGrid'
import { useDocumentMeta } from '../lib/seo'

const ACCENT = '#ff7ab8'

const STYLES = [
  {
    icon: '❀',
    title: 'Bouquet classico',
    text: 'Una composizione piena, pensata per un regalo che si nota — e che non appassisce mai.',
  },
  {
    icon: '✿',
    title: 'Mini bouquet',
    text: 'Piccolo, delicato, perfetto da tenere su una scrivania o infilare in una borsa.',
  },
  {
    icon: '❁',
    title: 'Fiore singolo',
    text: 'Un pensiero minimo ma curato, quando basta un solo gesto.',
  },
  {
    icon: '✾',
    title: 'Su misura',
    text: 'Colori, forma e dimensione decisi insieme a te, per un’idea più personale.',
  },
]

function FloralBackground() {
  const blobs = useMemo(
    () => [
      { top: '10%', left: '15%', size: 260, color: 'rgba(255,122,184,0.16)' },
      { top: '55%', left: '75%', size: 320, color: 'rgba(199,146,234,0.14)' },
      { top: '75%', left: '20%', size: 220, color: 'rgba(126,217,255,0.1)' },
      { top: '20%', left: '65%', size: 200, color: 'rgba(255,209,102,0.1)' },
    ],
    [],
  )
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 30% 20%, #2a1030 0%, #180c22 45%, #0a0612 100%)' }}
      />
      {blobs.map((b, i) => (
        <div
          key={i}
          className="float absolute rounded-full blur-3xl"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: b.color,
            animationDelay: `${i * 1.3}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function Flowers() {
  useDocumentMeta({
    title: 'Fiori di Filo | Adam Javurek — Bouquet fatti a mano',
    description:
      'Bouquet fatti a mano con pipe cleaners, il filo morbido rivestito in metallo: fiori che non appassiscono mai. Scrivimi su WhatsApp per un bouquet su misura.',
    path: '/flowers',
  })

  return (
    <div className="bg-void">
      <BackToHub accent={ACCENT} />
      <SceneHero
        sceneKey="flowers"
        scene={() => <BouquetScene />}
        sceneLabel="Animazione 3D di un bouquet di fiori di filo che si compone pezzo per pezzo dentro un vaso di carta"
        lines={['PREPARAZIONE MATERIALI...', 'COMPOSIZIONE BOUQUET...', 'RIFINITURA PETALI...', 'BOUQUET PRONTO']}
        eyebrow="Modulo 03"
        title="Fiori di Filo"
        subtitle="Bouquet fatti a mano con pipe cleaners: metallo morbido e tessuto, pensati per durare per sempre."
        accent={ACCENT}
        cameraPosition={[0, 0.3, 6]}
        background={<FloralBackground />}
        contentId="flowers-content"
      />

      <section id="flowers-content" className="mx-auto max-w-5xl px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl"
        >
          Fiori che non appassiscono
        </motion.h2>
        <p className="mt-3 max-w-2xl text-white/55">
          È un lavoretto manuale che faccio nel tempo libero: piego, intreccio e compongo a mano ogni fiore con
          pipe cleaners, un filo morbido rivestito che si piega in qualsiasi forma. Il risultato è un piccolo
          bouquet che resta bello per anni.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {STYLES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="corner-frame panel-glass rounded-2xl p-6 text-flora transition hover:-translate-y-1 hover:shadow-[0_0_30px_-12px_#ff7ab8]"
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

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl"
        >
          Qualche bouquet fatto
        </motion.h2>
        <p className="mt-3 max-w-2xl text-white/55">Un piccolo assaggio di quelli creati finora.</p>
        <div className="mt-8">
          {/* TODO: sostituire con foto reali — carica i file in /public/gallery/
              con questi nomi esatti (jpg, png o webp) e i placeholder tratteggiati
              spariranno da soli, sostituiti dalla foto vera. */}
          <GalleryGrid
            accent={ACCENT}
            items={[
              { src: '/gallery/flowers-bouquet-1.jpg', alt: 'Bouquet di fiori di filo, esempio 1', caption: 'Bouquet — esempio 1' },
              { src: '/gallery/flowers-bouquet-2.jpg', alt: 'Bouquet di fiori di filo, esempio 2', caption: 'Bouquet — esempio 2' },
              { src: '/gallery/flowers-bouquet-3.jpg', alt: 'Bouquet di fiori di filo, esempio 3', caption: 'Bouquet — esempio 3' },
              { src: '/gallery/flowers-mini-1.jpg', alt: 'Mini bouquet di fiori di filo', caption: 'Mini bouquet' },
            ]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="corner-frame panel-glass rounded-2xl p-8 text-flora sm:p-10"
        >
          <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">Vuoi un bouquet?</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Raccontami per chi è, che colori preferisce e per quale occasione — il resto lo penso io. Nessun
            catalogo fisso, nessun negozio: è un piccolo regalo che faccio volentieri, non un prodotto in vendita.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <WhatsAppButton
              accent={ACCENT}
              message="Ciao Adam! Ho visto i tuoi bouquet di fiori di filo (pipe cleaners) e mi piacerebbe chiederti di crearne uno. Ti va di parlarne?"
              label="Scrivimi per un bouquet"
              big
            />
          </div>
        </motion.div>
      </section>
    </div>
  )
}
