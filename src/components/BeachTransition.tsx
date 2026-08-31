import { motion } from 'framer-motion'

function Palm({ x, scale = 1, flip = false }: { x: string; scale?: number; flip?: boolean }) {
  return (
    <div
      className="beach-sway absolute bottom-0 origin-bottom"
      style={{ left: x, transform: `scale(${scale}) ${flip ? 'scaleX(-1)' : ''}` }}
    >
      <svg width="90" height="150" viewBox="0 0 90 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M45 150 C 40 100, 55 70, 48 30" stroke="#1c2e2a" strokeWidth="6" strokeLinecap="round" />
        {[
          'M48 32 C 20 20, 5 28, 0 15',
          'M48 32 C 25 10, 20 -5, 8 -10',
          'M48 32 C 45 5, 55 -10, 50 -20',
          'M48 32 C 65 12, 80 8, 90 -5',
          'M48 32 C 68 22, 85 30, 95 22',
        ].map((d, i) => (
          <path key={i} d={d} stroke="#20372f" strokeWidth="9" strokeLinecap="round" fill="none" />
        ))}
      </svg>
    </div>
  )
}

export default function BeachTransition() {
  return (
    <div className="relative h-[46vh] w-full overflow-hidden sm:h-[52vh]">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #7a5230 0%, #d9a65c 12%, #ffd77a 22%, #4fb3a8 42%, #1c7b83 68%, #0c4a55 100%)',
        }}
      />

      <svg
        className="wave-scroll absolute left-0 top-[26%] h-[70%] w-[200%] opacity-70"
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 C 200 120, 400 0, 600 60 S 1000 120, 1200 60 S 1600 0, 1600 60 L1600 400 L0 400 Z"
          fill="#0e5a63"
        />
      </svg>
      <svg
        className="wave-scroll-slow absolute left-0 top-[34%] h-[66%] w-[200%] opacity-80"
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80 C 220 20, 420 130, 640 70 S 1040 20, 1240 80 S 1600 130, 1600 80 L1600 400 L0 400 Z"
          fill="#0a4750"
        />
      </svg>

      <svg
        className="absolute bottom-0 left-0 h-[22%] w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <path d="M0 90 C 300 40, 900 140, 1200 70 L1200 200 L0 200 Z" fill="#e7cf9a" />
      </svg>

      <Palm x="6%" scale={0.9} />
      <Palm x="16%" scale={1.2} />
      <Palm x="82%" scale={1.1} flip />
      <Palm x="92%" scale={0.8} flip />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute inset-x-0 bottom-6 flex justify-center px-6 text-center"
      >
        <p className="font-display text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
          dall’aeroporto alla spiaggia, senza lo stress in mezzo
        </p>
      </motion.div>
    </div>
  )
}
