import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import WhatsAppButton from './WhatsAppButton'

const ACCENT = '#ffb454'

const NEEDS = ['Hotel', 'Volo', 'Itinerario giorno per giorno', 'Ristoranti locali']
const BUDGETS = [
  { id: 'economico', label: 'Il più economico possibile' },
  { id: 'bilanciato', label: 'Il migliore al suo prezzo' },
  { id: 'top', label: 'Il top, senza troppi compromessi' },
]

export default function TravelQuiz() {
  const [needs, setNeeds] = useState<string[]>([])
  const [destination, setDestination] = useState('')
  const [period, setPeriod] = useState('')
  const [budget, setBudget] = useState<string>('bilanciato')

  const toggleNeed = (need: string) => {
    setNeeds((prev) => (prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]))
  }

  const message = useMemo(() => {
    const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label ?? ''
    const parts: string[] = []
    parts.push('Ciao Adam! Sto organizzando un viaggio' + (destination ? ` a ${destination}` : '') + '.')
    if (period) parts.push(`Periodo indicativo: ${period}.`)
    if (needs.length > 0) {
      parts.push(`Mi piacerebbe una mano con: ${needs.join(', ')}.`)
    } else {
      parts.push('Non ho ancora deciso su cosa mi serve una mano, vorrei parlarne.')
    }
    parts.push(`Come stile di ricerca preferirei: ${budgetLabel.toLowerCase()}.`)
    parts.push('Mi racconti come possiamo procedere?')
    return parts.join(' ')
  }, [needs, destination, period, budget])

  return (
    <div className="corner-frame panel-glass rounded-2xl p-6 text-travel sm:p-10">
      <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
        Componi la tua richiesta
      </h3>
      <p className="mt-2 text-sm text-white/55">
        Rispondi a qualche domanda veloce: preparo io il messaggio, tu premi solo invio.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <p className="mb-3 font-display text-xs uppercase tracking-widest text-travel/80">
            1. Di cosa hai bisogno? (scegli anche più opzioni)
          </p>
          <div className="flex flex-wrap gap-2">
            {NEEDS.map((need) => {
              const active = needs.includes(need)
              return (
                <button
                  key={need}
                  onClick={() => toggleNeed(need)}
                  style={active ? { background: ACCENT, color: '#05070c', borderColor: ACCENT } : { borderColor: 'rgba(255,180,84,0.35)' }}
                  className="rounded-full border px-4 py-2 text-sm font-medium text-white/80 transition hover:border-travel"
                >
                  {need}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 font-display text-xs uppercase tracking-widest text-travel/80">2. Destinazione</p>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Es. Lisbona, Giappone, non ho ancora deciso..."
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-travel focus:outline-none"
            />
          </div>
          <div>
            <p className="mb-2 font-display text-xs uppercase tracking-widest text-travel/80">3. Periodo</p>
            <input
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Es. metà settembre, 5 giorni..."
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-travel focus:outline-none"
            />
          </div>
        </div>

        <div>
          <p className="mb-3 font-display text-xs uppercase tracking-widest text-travel/80">
            4. Che stile di ricerca preferisci?
          </p>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => {
              const active = budget === b.id
              return (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  style={active ? { background: ACCENT, color: '#05070c', borderColor: ACCENT } : { borderColor: 'rgba(255,180,84,0.35)' }}
                  className="rounded-full border px-4 py-2 text-sm font-medium text-white/80 transition hover:border-travel"
                >
                  {b.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/60"
      >
        <p className="mb-1 font-display text-[10px] uppercase tracking-widest text-travel/70">
          Anteprima messaggio
        </p>
        {message}
      </motion.div>

      <div className="mt-6">
        <WhatsAppButton accent={ACCENT} message={message} label="Invia questa richiesta su WhatsApp" big />
      </div>
    </div>
  )
}
