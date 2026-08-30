import { buildWhatsAppLink } from '../lib/whatsapp'

interface WhatsAppButtonProps {
  message: string
  label?: string
  accent?: string
  className?: string
  big?: boolean
}

function WhatsAppGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.35.65 4.55 1.78 6.44L4 29l7.72-1.73a11.9 11.9 0 0 0 4.3.8h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.43 22.65 3.03 16.02 3Zm0 21.9c-1.5 0-2.96-.4-4.24-1.15l-.3-.18-4.58 1.03 1.05-4.46-.2-.31a9.85 9.85 0 0 1-1.5-5.28c0-5.46 4.44-9.9 9.9-9.9a9.83 9.83 0 0 1 6.98 2.9 9.83 9.83 0 0 1 2.9 6.98c-.03 5.46-4.47 9.37-10.01 9.37Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.08 4.48.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function WhatsAppButton({
  message,
  label = 'Scrivimi su WhatsApp',
  accent = '#38f0e0',
  className = '',
  big = false,
}: WhatsAppButtonProps) {
  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: accent, boxShadow: `0 0 24px -6px ${accent}` }}
      className={`group relative inline-flex items-center gap-3 rounded-full border px-6 py-3 font-display uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-[0.98] ${
        big ? 'text-base py-4 px-8' : 'text-sm'
      } panel-glass ${className}`}
    >
      <span
        style={{ background: accent }}
        className="absolute -left-1 -top-1 h-3 w-3 animate-ping rounded-full opacity-60"
      />
      <span style={{ background: accent }} className="text-void flex h-8 w-8 items-center justify-center rounded-full">
        <WhatsAppGlyph size={18} />
      </span>
      <span className="text-white/90 group-hover:text-white">{label}</span>
    </a>
  )
}
