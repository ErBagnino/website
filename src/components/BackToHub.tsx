import { Link } from 'react-router-dom'

export default function BackToHub({ accent = '#38f0e0' }: { accent?: string }) {
  return (
    <Link
      to="/"
      style={{ color: accent }}
      className="fixed left-5 top-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 font-display text-xs uppercase tracking-widest backdrop-blur-md transition hover:border-current hover:bg-black/60"
    >
      <span aria-hidden>◀</span> Hub
    </Link>
  )
}
