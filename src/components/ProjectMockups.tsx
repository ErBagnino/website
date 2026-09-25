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

// A geometric "A" mark built from a triangle with a negative-space wedge cut
// out of it and an off-center crossbar — shown at two sizes and on both a
// light and dark ground, the way a real brand sheet demonstrates a mark
// holds up at different scales, rather than a single static glyph.
function Mark({ size = 44, inverted = false }: { size?: number; inverted?: boolean }) {
  const fg = inverted ? '#0a0f18' : ACCENT
  const bg = inverted ? ACCENT : '#0a0f18'
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L44 42 H4 Z" fill={fg} />
      <path d="M24 18 L34 36 H14 Z" fill={bg} />
      <rect x="15" y="27" width="22" height="3" fill={fg} />
    </svg>
  )
}

function LogoMockup() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-2">
      <div className="relative col-span-2 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#0a0f18] py-3">
        <svg className="absolute inset-0 h-full w-full opacity-[0.18]" aria-hidden>
          <pattern id="logoGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0H0V8" fill="none" stroke={ACCENT} strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#logoGrid)" />
        </svg>
        <Mark size={40} />
        <p className="font-display text-sm uppercase tracking-[0.4em] text-white/85">Aurelia</p>
        <p className="text-[8px] uppercase tracking-[0.25em] text-white/35">Studio di interni</p>
        <span className="absolute bottom-1.5 right-2 text-[6px] uppercase tracking-widest text-white/25">
          griglia 8×8 · area di rispetto 1x
        </span>
      </div>
      <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg py-2" style={{ background: ACCENT }}>
        <Mark size={22} inverted />
        <span className="text-[7px] uppercase tracking-widest text-void/60">Su chiaro</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-black/30 py-2">
        <Mark size={22} />
        <span className="text-[7px] uppercase tracking-widest text-white/35">Favicon</span>
      </div>
    </div>
  )
}

function PostQuote() {
  return (
    <div className="flex h-full flex-col justify-between rounded-md p-2" style={{ background: 'linear-gradient(155deg, #0d3b3a, #0a0f18)' }}>
      <span className="text-[16px] leading-none" style={{ color: ACCENT }}>
        “
      </span>
      <p className="font-display text-[8px] font-bold uppercase leading-tight text-white">
        Meno cose,
        <br />
        scelte meglio.
      </p>
    </div>
  )
}

function PostPattern() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full rounded-md">
      <rect width="100" height="100" fill="#0a0f18" />
      <circle cx="30" cy="35" r="22" fill="none" stroke={ACCENT} strokeWidth="1.4" opacity="0.7" />
      <circle cx="68" cy="66" r="14" fill={ACCENT} opacity="0.85" />
      <line x1="10" y1="80" x2="90" y2="20" stroke="#ff7ab8" strokeWidth="1.2" opacity="0.5" />
    </svg>
  )
}

function PostAnnounce() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 rounded-md border border-white/10 bg-[#0a0f18] p-2 text-center">
      <span className="font-display text-[7px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
        Novità
      </span>
      <p className="font-display text-[9px] font-bold uppercase leading-tight text-white">
        Collezione
        <br />
        Autunno
      </p>
    </div>
  )
}

function PostBeforeAfter() {
  return (
    <div className="relative h-full overflow-hidden rounded-md">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #1c2b2a 50%, #0a0f18 50%)' }} />
      <div className="absolute inset-y-0 left-1/2 w-px" style={{ background: ACCENT }} />
      <p className="absolute left-1.5 top-1.5 text-[6px] uppercase tracking-widest text-white/40">Prima</p>
      <p className="absolute right-1.5 top-1.5 text-[6px] uppercase tracking-widest" style={{ color: ACCENT }}>
        Dopo
      </p>
    </div>
  )
}

function HeartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.35-9.5-8.5C.8 8 2 4.5 5.5 4c2-.3 3.7.7 4.5 2.2C10.8 4.7 12.5 3.7 14.5 4 18 4.5 19.2 8 17.5 11.5 15 15.65 12 20 12 20Z" />
    </svg>
  )
}
function CommentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5h16v11H9l-5 4V5Z" strokeLinejoin="round" />
    </svg>
  )
}

function SocialMockup() {
  return (
    <div className="w-full max-w-[230px] overflow-hidden rounded-xl border border-white/10 bg-[#0a0f18]">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="rounded-full p-[1.5px]" style={{ background: `conic-gradient(${ACCENT}, #ff7ab8, #ffb454, ${ACCENT})` }}>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0a0f18]">
            <Mark size={11} />
          </span>
        </span>
        <span className="text-[10px] text-white/70">studio.aurelia</span>
        <span className="ml-auto text-white/30">•••</span>
      </div>
      <div className="grid grid-cols-2 gap-[2px] p-[2px]">
        <PostQuote />
        <PostPattern />
        <PostAnnounce />
        <PostBeforeAfter />
      </div>
      <div className="flex items-center gap-3 px-3 py-2 text-white/50">
        <span className="flex items-center gap-1">
          <HeartIcon /> 124
        </span>
        <span className="flex items-center gap-1">
          <CommentIcon /> 18
        </span>
        <span className="ml-auto text-[9px] text-white/30">griglia coerente, tono riconoscibile</span>
      </div>
    </div>
  )
}

function CupIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
      <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 4c0 1-1 1-1 2M12 4c0 1-1 1-1 2" strokeLinecap="round" />
    </svg>
  )
}
function LeafIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z" />
      <path d="M5 19c2-4 5-7 9-9" />
    </svg>
  )
}
function CroissantIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 15c2-7 8-10 18-9-3 2-3 4-1 5-2 0-3 1-2 3-2-1-3 0-3 2-3-1-4 0-5 2-1-2-3-2-5-1-2-1-2-1-2-2Z" />
    </svg>
  )
}

function WebMockup() {
  return (
    <div className="flex w-full max-w-[280px] items-end gap-2">
      <div className="flex-1 overflow-hidden rounded-lg border border-white/10 bg-[#0a0f18] shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#070b11] px-2.5 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff6459]" />
          <span className="h-2 w-2 rounded-full bg-[#ffbd44]" />
          <span className="h-2 w-2 rounded-full bg-[#00ca4e]" />
          <span className="ml-2 flex-1 truncate rounded bg-black/40 px-2 py-0.5 text-[8px] text-white/35">
            auroracaffe.it
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
          <span className="font-display text-[9px] uppercase tracking-widest text-white/70">Aurora · dal 2019</span>
          <div className="flex gap-2 text-[7px] uppercase tracking-wide text-white/35">
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
          <div className="mt-1.5 flex items-center gap-1 text-[7px] text-white/40">
            <span style={{ color: ACCENT }}>★★★★★</span>
            <span>4.9 · 210 recensioni</span>
          </div>
          <span
            className="mt-2 inline-block rounded-full px-2.5 py-1 text-[7px] uppercase tracking-wider text-void"
            style={{ background: ACCENT }}
          >
            Scopri il menu
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 px-3 pb-3 text-accent">
          <div className="flex items-center justify-center rounded border border-white/10 bg-black/30 py-2">
            <CupIcon />
          </div>
          <div className="flex items-center justify-center rounded border border-white/10 bg-black/30 py-2">
            <LeafIcon />
          </div>
          <div className="flex items-center justify-center rounded border border-white/10 bg-black/30 py-2">
            <CroissantIcon />
          </div>
        </div>
      </div>

      {/* a slim mobile-viewport twin, to show the same layout adapts */}
      <div className="w-14 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-[#0a0f18] shadow-lg">
        <div className="flex justify-center border-b border-white/10 bg-[#070b11] py-1">
          <span className="h-1 w-4 rounded-full bg-white/20" />
        </div>
        <div className="px-1.5 py-2" style={{ background: 'radial-gradient(circle at 30% 0%, rgba(56,240,224,0.14), transparent 70%)' }}>
          <p className="font-display text-[6px] font-bold uppercase leading-tight text-white">Aurora</p>
          <span
            className="mt-1 block rounded-full px-1 py-0.5 text-center text-[5px] uppercase text-void"
            style={{ background: ACCENT }}
          >
            Menu
          </span>
        </div>
        <div className="space-y-1 px-1.5 pb-1.5">
          {[CupIcon, LeafIcon, CroissantIcon].map((Icon, i) => (
            <div key={i} className="flex items-center justify-center rounded border border-white/10 bg-black/30 py-1 text-accent">
              <Icon />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// A generative flow-field poster, presented like a framed print with a
// gallery placard — concrete and titled — next to a smaller second variant,
// so the tile also reads as an iterative process rather than one lucky roll.
function FlowField({ seedOffset = 0 }: { seedOffset?: number }) {
  const arcs = [
    { d: 'M8 70 C 30 20, 70 20, 92 70', color: ACCENT },
    { d: 'M4 50 C 30 90, 70 10, 96 50', color: '#ff7ab8' },
    { d: 'M14 85 C 40 45, 60 45, 86 85', color: '#ffb454' },
    { d: 'M10 30 C 35 60, 65 60, 90 30', color: '#c792ea' },
  ]
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <g transform={`rotate(${seedOffset} 50 50)`}>
        {arcs.map((a, i) => (
          <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth="0.9" opacity={0.75 - i * 0.1} />
        ))}
      </g>
      <circle cx="50" cy="52" r="3.4" fill={ACCENT} />
    </svg>
  )
}

function AiMockup() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0a0f18] p-3">
      <div className="flex items-end gap-2">
        <div className="relative aspect-square w-[58%] overflow-hidden rounded-sm border border-white/10 bg-[#050a10]">
          <FlowField />
        </div>
        <div className="relative aspect-square w-[26%] overflow-hidden rounded-sm border border-white/10 bg-[#050a10] opacity-70">
          <FlowField seedOffset={35} />
        </div>
      </div>
      <div className="flex w-[84%] items-center justify-between text-[7px] uppercase tracking-widest text-white/40">
        <span>Studio → generativo · v2</span>
        <span>Prompt-assisted</span>
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
