import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WhatsAppButton from './WhatsAppButton'
import { getCountries } from '../lib/countries'

const ACCENT = '#ffb454'

const NEEDS = [
  'Hotel',
  'Volo',
  'Itinerario semplice',
  'Itinerario medio (giorno per giorno)',
  'Itinerario avanzato (ora per ora)',
  'Ristoranti locali da provare',
  'Esperienze ed attività da provare',
  'Treni e spostamenti interni',
  'Appartamenti / case vacanza',
]

const STYLES = [
  { id: 'veloce', label: 'Veloce', desc: 'Poche opzioni, ma buone e subito pronte' },
  { id: 'economico', label: 'Il più economico possibile', desc: 'Il budget conta più di tutto' },
  { id: 'qualita-prezzo', label: 'Il migliore al suo prezzo', desc: 'Equilibrio tra spesa e qualità' },
  { id: 'approfondito', label: 'Ricerca approfondita', desc: 'Voglio tutte le opzioni, con calma' },
  { id: 'top', label: 'Il top, senza compromessi', desc: 'Qualità prima del prezzo' },
]

const COMPANIONS = ['Da solo/a', 'In coppia', 'Famiglia con bambini', 'Con amici', 'Gruppo numeroso']

const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]
const DURATIONS = ['Weekend (2-3 giorni)', 'Circa una settimana', '10-15 giorni', '2+ settimane', 'Non lo so ancora']

const WEEKDAYS = ['L', 'M', 'M', 'G', 'V', 'S', 'D']

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })
}

function CalendarPicker({ start, end, onPick }: { start: Date | null; end: Date | null; onPick: (s: Date | null, e: Date | null) => void }) {
  const [viewDate, setViewDate] = useState(start ?? new Date())
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startWeekday = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const handleClick = (d: Date) => {
    if (!start || (start && end)) {
      onPick(d, null)
    } else if (d < start) {
      onPick(d, start)
    } else if (sameDay(d, start)) {
      onPick(d, null)
    } else {
      onPick(start, d)
    }
  }

  const isInRange = (d: Date) => start && end && d > start && d < end
  const isEdge = (d: Date) => (start && sameDay(d, start)) || (end && sameDay(d, end))

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/60 hover:border-travel hover:text-travel"
        >
          ‹
        </button>
        <span className="font-display text-xs uppercase tracking-widest text-white/80">
          {viewDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/60 hover:border-travel hover:text-travel"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="py-1 text-[10px] uppercase text-white/30">
            {w}
          </span>
        ))}
        {cells.map((d, i) =>
          d ? (
            <button
              type="button"
              key={i}
              onClick={() => handleClick(d)}
              style={
                isEdge(d)
                  ? { background: ACCENT, color: '#05070c' }
                  : isInRange(d)
                    ? { background: 'rgba(255,180,84,0.22)', color: '#fff' }
                    : undefined
              }
              className="aspect-square rounded-lg text-xs text-white/70 hover:bg-white/10"
            >
              {d.getDate()}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
      <p className="mt-3 text-center text-xs text-white/40">
        {start && end
          ? `Dal ${fmtDate(start)} al ${fmtDate(end)}`
          : start
            ? 'Scegli la data di rientro'
            : 'Scegli la data di partenza'}
      </p>
    </div>
  )
}

function CountryPicker({ value, onChange }: { value: string | null; onChange: (code: string | null) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const countries = useMemo(() => getCountries(), [])
  const filtered = useMemo(
    () => countries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [countries, query],
  )
  const selected = countries.find((c) => c.code === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm text-white focus:border-travel focus:outline-none"
      >
        <span className={selected ? '' : 'text-white/30'}>
          {selected ? (
            <>
              <span className="mr-2 text-lg">{selected.flag}</span>
              {selected.name}
            </>
          ) : value === 'UNDECIDED' ? (
            'Ancora da decidere'
          ) : (
            'Scegli un paese...'
          )}
        </span>
        <span className="text-white/30">▾</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0f18] shadow-2xl">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un paese..."
            className="w-full border-b border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              onChange('UNDECIDED')
              setOpen(false)
              setQuery('')
            }}
            className="w-full border-b border-white/5 px-4 py-2 text-left text-sm text-white/50 hover:bg-white/5"
          >
            Non ho ancora deciso
          </button>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((c) => (
              <button
                type="button"
                key={c.code}
                onClick={() => {
                  onChange(c.code)
                  setOpen(false)
                  setQuery('')
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-white/80 hover:bg-white/5"
              >
                <span className="text-lg">{c.flag}</span>
                {c.name}
              </button>
            ))}
            {filtered.length === 0 && <p className="px-4 py-3 text-sm text-white/40">Nessun paese trovato</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={active ? { background: ACCENT, color: '#05070c', borderColor: ACCENT } : { borderColor: 'rgba(255,180,84,0.35)' }}
      className="rounded-full border px-4 py-2 text-sm font-medium text-white/80 transition hover:border-travel"
    >
      {children}
    </button>
  )
}

const STEP_TITLES = ['Di cosa hai bisogno?', 'Dove vorresti andare?', 'Quando?', 'Stile di ricerca', 'Con chi parti?', 'Riepilogo']

export default function TravelWizard() {
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [needs, setNeeds] = useState<string[]>([])
  const [otherNeed, setOtherNeed] = useState('')
  const [country, setCountry] = useState<string | null>(null)
  const [periodMode, setPeriodMode] = useState<'dates' | 'flexible'>('dates')
  const [start, setStartDate] = useState<Date | null>(null)
  const [end, setEndDate] = useState<Date | null>(null)
  const [flexMonth, setFlexMonth] = useState<string | null>(null)
  const [flexDuration, setFlexDuration] = useState<string | null>(null)
  const [style, setStyle] = useState<string>('qualita-prezzo')
  const [companion, setCompanion] = useState<string>('In coppia')
  const [notes, setNotes] = useState('')
  const direction = useRef(1)

  const toggleNeed = (n: string) => setNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]))

  const countries = useMemo(() => getCountries(), [])
  const selectedCountry = countries.find((c) => c.code === country)

  const goNext = () => {
    direction.current = 1
    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1))
  }
  const goBack = () => {
    direction.current = -1
    setStep((s) => Math.max(s - 1, 0))
  }

  const message = useMemo(() => {
    const destLabel = selectedCountry
      ? `${selectedCountry.flag} ${selectedCountry.name}`
      : country === 'UNDECIDED'
        ? 'ancora da decidere'
        : 'non specificata'

    const periodLabel =
      periodMode === 'dates' && start && end
        ? `dal ${fmtDate(start)} al ${fmtDate(end)}`
        : periodMode === 'flexible' && (flexMonth || flexDuration)
          ? `${flexMonth ?? 'periodo flessibile'}${flexDuration ? `, ${flexDuration.toLowerCase()}` : ''}`
          : 'da definire insieme'

    const needsList = [...needs, otherNeed.trim() ? `Altro: ${otherNeed.trim()}` : null].filter(Boolean).join(', ')
    const styleLabel = STYLES.find((s) => s.id === style)?.label ?? ''

    const lines = [
      'Ciao Adam! Ho compilato il questionario viaggi del tuo portfolio, ecco i dettagli:',
      `📍 Destinazione: ${destLabel}`,
      `🗓️ Periodo: ${periodLabel}`,
      `🧭 Di cosa ho bisogno: ${needsList || 'ancora da capire insieme'}`,
      `🎯 Stile di ricerca: ${styleLabel}`,
      `👥 Chi viaggia: ${companion}`,
    ]
    if (notes.trim()) lines.push(`📝 Note: ${notes.trim()}`)
    lines.push('Mi racconti come possiamo procedere?')
    return lines.join('\n')
  }, [needs, otherNeed, country, selectedCountry, periodMode, start, end, flexMonth, flexDuration, style, companion, notes])

  if (!started) {
    return (
      <div className="corner-frame panel-glass rounded-2xl p-8 text-center text-travel sm:p-12">
        <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
          Componi la tua richiesta
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/55">
          Un questionario guidato in pochi passaggi: alla fine preparo io il messaggio con tutti i dettagli, tu
          premi solo invio.
        </p>
        <button
          onClick={() => setStarted(true)}
          style={{ background: ACCENT }}
          className="mt-8 rounded-full px-8 py-3 font-display text-sm uppercase tracking-widest text-void transition hover:scale-105"
        >
          Inizia il questionario
        </button>
      </div>
    )
  }

  return (
    <div className="corner-frame panel-glass rounded-2xl p-6 text-travel sm:p-10">
      <div className="mb-8 flex items-center gap-2">
        {STEP_TITLES.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: i <= step ? ACCENT : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction.current}>
        <motion.div
          key={step}
          custom={direction.current}
          initial={{ opacity: 0, x: direction.current * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction.current * -24 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="mb-6 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
            {STEP_TITLES[step]}
          </h3>

          {step === 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-travel/80">Scegli anche più opzioni</p>
              <div className="flex flex-wrap gap-2">
                {NEEDS.map((n) => (
                  <Chip key={n} active={needs.includes(n)} onClick={() => toggleNeed(n)}>
                    {n}
                  </Chip>
                ))}
              </div>
              <div className="mt-5">
                <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Altro? (facoltativo)</p>
                <input
                  value={otherNeed}
                  onChange={(e) => setOtherNeed(e.target.value)}
                  placeholder="Es. noleggio auto, visto, assicurazione di viaggio..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-travel focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Cerca il paese, con tanto di bandiera</p>
              <CountryPicker value={country} onChange={setCountry} />
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-4 flex gap-2">
                <Chip active={periodMode === 'dates'} onClick={() => setPeriodMode('dates')}>
                  Date precise
                </Chip>
                <Chip active={periodMode === 'flexible'} onClick={() => setPeriodMode('flexible')}>
                  Periodo flessibile
                </Chip>
              </div>
              {periodMode === 'dates' ? (
                <CalendarPicker start={start} end={end} onPick={(s, e) => { setStartDate(s); setEndDate(e) }} />
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Mese indicativo</p>
                    <div className="flex flex-wrap gap-2">
                      {MONTHS.map((m) => (
                        <Chip key={m} active={flexMonth === m} onClick={() => setFlexMonth(m)}>
                          {m}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Durata</p>
                    <div className="flex flex-wrap gap-2">
                      {DURATIONS.map((d) => (
                        <Chip key={d} active={flexDuration === d} onClick={() => setFlexDuration(d)}>
                          {d}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  style={style === s.id ? { borderColor: ACCENT, background: 'rgba(255,180,84,0.1)' } : undefined}
                  className="rounded-xl border border-white/10 p-4 text-left transition hover:border-travel"
                >
                  <p className="font-display text-sm uppercase tracking-wide text-white">{s.label}</p>
                  <p className="mt-1 text-xs text-white/45">{s.desc}</p>
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-travel/80">Chi viaggia</p>
              <div className="flex flex-wrap gap-2">
                {COMPANIONS.map((c) => (
                  <Chip key={c} active={companion === c} onClick={() => setCompanion(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
              <div className="mt-5">
                <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">
                  Note particolari (facoltativo)
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Allergie, mobilità ridotta, animali al seguito, preferenze particolari..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-travel focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="whitespace-pre-line rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                {message}
              </div>
              <div className="mt-6">
                <WhatsAppButton accent={ACCENT} message={message} label="Invia questa richiesta su WhatsApp" big />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step < 5 && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="font-display text-xs uppercase tracking-widest text-white/40 transition hover:text-white/80 disabled:opacity-0"
          >
            ‹ Indietro
          </button>
          <button
            onClick={goNext}
            style={{ background: ACCENT }}
            className="rounded-full px-6 py-2.5 font-display text-xs uppercase tracking-widest text-void transition hover:scale-105"
          >
            {step === 4 ? 'Vai al riepilogo' : 'Avanti'} ›
          </button>
        </div>
      )}
      {step === 5 && (
        <button
          onClick={() => {
            setStep(0)
            setStarted(false)
          }}
          className="mt-6 font-display text-xs uppercase tracking-widest text-white/40 hover:text-white/80"
        >
          ‹ Ricomincia il questionario
        </button>
      )}
    </div>
  )
}
