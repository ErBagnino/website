import { useState } from 'react'
import { motion } from 'framer-motion'
import { withBase } from '../lib/url'

export interface GalleryItem {
  /** Path under /public, e.g. "/gallery/tech-logo-1.jpg". Drop the real file there with this exact name. */
  src: string
  alt: string
  caption: string
}

function GalleryTile({ item, accent, delay }: { item: GalleryItem; accent: string; delay: number }) {
  const [failed, setFailed] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="corner-frame group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/30"
      style={{ color: accent }}
    >
      {!failed ? (
        <img
          src={withBase(item.src)}
          alt={item.alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        // TODO: sostituire con immagine reale — questo placeholder sparisce da solo
        // non appena il file indicato in `item.src` viene caricato in /public/gallery/.
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-white/15 p-4 text-center">
          <span className="text-2xl opacity-60">◫</span>
          <span className="text-xs text-white/40">{item.caption}</span>
          <code className="text-[10px] text-white/25">{item.src}</code>
        </div>
      )}
    </motion.div>
  )
}

export default function GalleryGrid({ items, accent }: { items: GalleryItem[]; accent: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item, i) => (
        <GalleryTile key={item.src} item={item} accent={accent} delay={i * 0.06} />
      ))}
    </div>
  )
}
