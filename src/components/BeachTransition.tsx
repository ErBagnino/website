import { motion } from 'framer-motion'

function Palm({ x, scale = 1, flip = false, opacity = 1 }: { x: string; scale?: number; flip?: boolean; opacity?: number }) {
  return (
    <div
      className="beach-sway absolute bottom-0 origin-bottom"
      style={{ left: x, transform: `scale(${scale}) ${flip ? 'scaleX(-1)' : ''}`, opacity }}
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

function Bush({ x, scale = 1 }: { x: string; scale?: number }) {
  return (
    <div className="bush-rustle absolute bottom-0 origin-bottom" style={{ left: x, transform: `scale(${scale})` }}>
      <svg width="46" height="26" viewBox="0 0 46 26" fill="none">
        <ellipse cx="12" cy="18" rx="12" ry="8" fill="#254f3c" />
        <ellipse cx="26" cy="14" rx="15" ry="10" fill="#2c5c46" />
        <ellipse cx="38" cy="19" rx="9" ry="7" fill="#254f3c" />
      </svg>
    </div>
  )
}

function DistantPerson({ x, delay = 0, scale = 1 }: { x: string; delay?: number; scale?: number }) {
  return (
    <div
      className="stroll absolute bottom-[19%]"
      style={{ left: x, animationDelay: `${delay}s`, transform: `scale(${scale})` }}
    >
      <svg width="8" height="18" viewBox="0 0 8 18" fill="none" opacity={0.55}>
        <circle cx="4" cy="3" r="2.2" fill="#1a1410" />
        <path d="M4 5.5 L4 12 M4 8 L1 10 M4 8 L7 10 M4 12 L2 17 M4 12 L6 17" stroke="#1a1410" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function VolleyballPlayer({ x, delay = 0, flip = false }: { x: string; delay?: number; flip?: boolean }) {
  return (
    <div
      className="player-bob absolute bottom-[16%] origin-bottom"
      style={{ left: x, animationDelay: `${delay}s`, transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <svg width="16" height="30" viewBox="0 0 16 30" fill="none">
        <circle cx="8" cy="5" r="3.2" fill="#e7cf9a" />
        <path d="M8 8.5 L8 18" stroke="#ffb454" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M8 11 L2 7 M8 11 L14 7" stroke="#e7cf9a" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M8 18 L4 29 M8 18 L12 29" stroke="#1c3a42" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function VolleyballCourt() {
  return (
    <div className="absolute bottom-[4%] left-[24%] h-[12%] w-[15%] min-w-[150px]">
      <svg viewBox="0 0 200 90" className="h-full w-full overflow-visible" preserveAspectRatio="none">
        <polygon
          points="20,84 180,84 158,10 42,10"
          stroke="#fff"
          strokeOpacity="0.4"
          strokeWidth="1.6"
          fill="#e0c07f"
          fillOpacity="0.18"
        />
        <line x1="100" y1="10" x2="100" y2="84" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 3" />
        <line x1="100" y1="10" x2="100" y2="46" stroke="#cbb27a" strokeWidth="3" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={100} y1={10 + i * 5} x2={94} y2={10 + i * 5} stroke="#cbb27a" strokeWidth="1" opacity={0.7} />
        ))}
      </svg>
      <VolleyballPlayer x="18%" delay={0} />
      <VolleyballPlayer x="34%" delay={0.9} flip />
      <VolleyballPlayer x="62%" delay={0.4} />
      <VolleyballPlayer x="78%" delay={1.3} flip />
    </div>
  )
}

function Ship() {
  return (
    <div className="ship-drift absolute top-[38%] opacity-85">
      <div className="ship-bob">
        <svg width="58" height="22" viewBox="0 0 58 22" fill="none">
          <path d="M5 13 L53 13 L47 19 L11 19 Z" fill="#0b2a30" />
          <rect x="15" y="4" width="3" height="9" fill="#0b2a30" />
          <rect x="24" y="2" width="3" height="11" fill="#0b2a30" />
          <rect x="33" y="5" width="3" height="8" fill="#0b2a30" />
          <line x1="5" y1="13" x2="53" y2="13" stroke="#12383f" strokeWidth="1.4" />
          <ellipse cx="29" cy="20.5" rx="16" ry="1.6" fill="#0e5a63" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}

export default function BeachTransition() {
  return (
    <div className="relative h-[52vh] w-full overflow-hidden sm:h-[58vh]">
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

      <Ship />

      <svg
        className="absolute bottom-0 left-0 h-[26%] w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <path d="M0 90 C 300 40, 900 140, 1200 70 L1200 200 L0 200 Z" fill="#e7cf9a" />
      </svg>

      <DistantPerson x="24%" delay={0} />
      <DistantPerson x="46%" delay={2.4} scale={0.85} />
      <DistantPerson x="60%" delay={4.8} />
      <DistantPerson x="73%" delay={1.6} scale={0.9} />

      <VolleyballCourt />

      <Bush x="1%" scale={1.1} />
      <Bush x="95%" scale={0.9} />
      <Bush x="11%" scale={0.7} />

      <Palm x="4%" scale={0.55} opacity={0.5} />
      <Palm x="8%" scale={0.95} />
      <Palm x="18%" scale={1.25} />
      <Palm x="80%" scale={1.15} flip />
      <Palm x="90%" scale={0.9} flip />
      <Palm x="95%" scale={0.5} flip opacity={0.5} />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-6 text-center sm:top-6"
      >
        {/* Sits in the empty sky band (never over the sand illustrations below,
            which vary in height between mobile and desktop) with its own scrim
            so it stays legible regardless of what scrolls behind it. */}
        <p className="rounded-full border border-white/10 bg-black/35 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm sm:text-sm">
          dall’aeroporto alla spiaggia, senza lo stress in mezzo
        </p>
      </motion.div>
    </div>
  )
}
