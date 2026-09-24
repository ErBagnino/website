import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const ACCENT = '#38f0e0'

function Tile({
  children,
  delay,
  tag,
}: {
  children: ReactNode
  delay: number
  tag: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="corner-frame group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#050a10] p-4 text-accent transition duration-500 hover:-translate-y-1"
    >
      <span className="absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-display text-[9px] uppercase tracking-widest text-white/50">
        {tag}
      </span>
      <div className="flex h-full w-full items-center justify-center">{children}</div>
    </motion.div>
  )
}

function LogoMockup() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="31" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
        <path d="M32 12 L48 44 H16 Z" stroke={ACCENT} strokeWidth="2" fill="none" />
        <path d="M32 24 L40 44 H24 Z" fill={ACCENT} opacity="0.85" />
      </svg>
      <p className="font-display text-sm uppercase tracking-[0.35em] text-white/80">Aurelia</p>
      <div className="flex gap-1.5">
        {['#38f0e0', '#8ef5e8', '#0a0f18', '#e8fbf6'].map((c) => (
          <span key={c} className="h-3 w-3 rounded-full border border-white/20" style={{ background: c }} />
        ))}
      </div>
    </div>
  )
}

function SocialMockup() {
  return (
    <div className="w-full max-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-[#0a0f18]">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="h-5 w-5 rounded-full" style={{ background: ACCENT }} />
        <span className="text-[10px] text-white/70">studio.aurelia</span>
        <span className="ml-auto text-white/30">•••</span>
      </div>
      <div
        className="flex h-24 items-end p-3"
        style={{ background: 'linear-gradient(135deg, #0d3b3a, #38f0e0 120%)' }}
      >
        <p className="font-display text-sm font-bold uppercase leading-tight text-void">
          Nuova
          <br />
          Collezione
        </p>
      </div>
      <div className="flex items-center gap-3 px-3 py-2 text-white/50">
        <span>♡</span>
        <span>💬</span>
        <span>↗</span>
        <span className="ml-auto text-[9px]">124</span>
      </div>
    </div>
  )
}

function WebMockup() {
  return (
    <div className="w-full max-w-[240px] overflow-hidden rounded-lg border border-white/10 bg-[#0a0f18] shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#070b11] px-2.5 py-1.5">
        <span className="h-2 w-2 rounded-full bg-[#ff6459]" />
        <span className="h-2 w-2 rounded-full bg-[#ffbd44]" />
        <span className="h-2 w-2 rounded-full bg-[#00ca4e]" />
        <span className="ml-2 flex-1 truncate rounded bg-black/40 px-2 py-0.5 text-[8px] text-white/35">
          auroracaffe.it
        </span>
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="font-display text-[9px] uppercase tracking-widest text-white/70">Aurora</span>
        <div className="flex gap-2 text-[7px] text-white/35">
          <span>Menu</span>
          <span>Storia</span>
          <span>Contatti</span>
        </div>
      </div>
      <div className="px-3 py-3" style={{ background: 'radial-gradient(circle at 30% 0%, rgba(56,240,224,0.12), transparent 70%)' }}>
        <p className="font-display text-xs font-bold uppercase leading-tight text-white">
          Caffè di quartiere,
          <br />
          fatto bene.
        </p>
        <span
          className="mt-2 inline-block rounded-full px-2.5 py-1 text-[7px] uppercase tracking-wider text-void"
          style={{ background: ACCENT }}
        >
          Scopri il menu
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 px-3 pb-3">
        {['☕', '🌿', '🥐'].map((e, i) => (
          <div key={i} className="rounded border border-white/10 bg-black/30 p-1.5 text-center text-[10px]">
            {e}
          </div>
        ))}
      </div>
    </div>
  )
}

function AiMockup() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(56,240,224,0.5), transparent 55%), radial-gradient(circle at 70% 60%, rgba(255,122,184,0.35), transparent 55%), radial-gradient(circle at 50% 90%, rgba(255,180,84,0.3), transparent 60%), #050a10',
        }}
      />
      <div className="float absolute left-[20%] top-[25%] h-10 w-10 rounded-full bg-white/10 blur-xl" />
      <div className="float absolute right-[22%] top-[45%] h-14 w-14 rounded-full bg-white/10 blur-xl" style={{ animationDelay: '1.4s' }} />
      <div className="absolute bottom-3 left-3 right-3 rounded-md bg-black/40 px-2 py-1 backdrop-blur-sm">
        <p className="text-[9px] uppercase tracking-widest text-white/60">Generato con AI · prompt-assisted</p>
      </div>
    </div>
  )
}

export default function ProjectMockups() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Tile tag="Branding" delay={0}>
        <LogoMockup />
      </Tile>
      <Tile tag="Social Design" delay={0.08}>
        <SocialMockup />
      </Tile>
      <Tile tag="Web Design" delay={0.16}>
        <WebMockup />
      </Tile>
      <Tile tag="AI Creative" delay={0.24}>
        <AiMockup />
      </Tile>
    </div>
  )
}
