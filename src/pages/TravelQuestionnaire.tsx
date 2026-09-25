import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BackToHub from '../components/BackToHub'
import WhatsAppButton from '../components/WhatsAppButton'
import { useDocumentMeta } from '../lib/seo'
import { getCountries } from '../lib/countries'
import WorldMap from '../components/travel/WorldMap'
import { CalendarPicker, Chip, CountryPicker, IllustratedCard, daysBetween, fmtDate } from '../components/travel/controls'
import {
  ApartmentIllustration,
  BalanceIllustration,
  BoltIllustration,
  CoinIllustration,
  ExperienceIllustration,
  FlightIllustration,
  HotelIllustration,
  ItineraryIllustration,
  LensIllustration,
  OtherIllustration,
  RestaurantIllustration,
  StarIllustration,
  TrainIllustration,
} from '../components/travel/Illustrations'

const ACCENT = '#ffb454'

const NEED_CATEGORIES = [
  { id: 'hotel', label: 'Hotel', icon: HotelIllustration },
  { id: 'volo', label: 'Volo', icon: FlightIllustration },
  { id: 'itinerario', label: 'Itinerario', icon: ItineraryIllustration },
  { id: 'ristoranti', label: 'Ristoranti locali', icon: RestaurantIllustration },
  { id: 'esperienze', label: 'Esperienze & attività', icon: ExperienceIllustration },
  { id: 'treni', label: 'Treni & spostamenti', icon: TrainIllustration },
  { id: 'appartamento', label: 'Appartamento / casa vacanza', icon: ApartmentIllustration },
  { id: 'altro', label: 'Altro', icon: OtherIllustration },
] as const

const ITINERARY_LEVELS = [
  { id: 'semplice', label: 'Semplice', desc: 'Le tappe principali, il resto lo decidete voi' },
  { id: 'medio', label: 'Giorno per giorno', desc: 'Un percorso chiaro con le cose da non perdere' },
  { id: 'avanzato', label: 'Ora per ora', desc: 'Dettagliato, per chi vuole ottimizzare ogni giornata' },
]

const STYLES = [
  { id: 'veloce', label: 'Veloce', desc: 'Poche opzioni, ma buone e subito pronte', icon: BoltIllustration },
  { id: 'economico', label: 'Il più economico possibile', desc: 'Il budget conta più di tutto', icon: CoinIllustration },
  { id: 'qualita-prezzo', label: 'Il migliore al suo prezzo', desc: 'Equilibrio tra spesa e qualità', icon: BalanceIllustration },
  { id: 'approfondito', label: 'Ricerca approfondita', desc: 'Voglio tutte le opzioni, con calma', icon: LensIllustration },
  { id: 'top', label: 'Il top, senza compromessi', desc: 'Qualità prima del prezzo', icon: StarIllustration },
]

const COMPANIONS = ['Da solo/a', 'In coppia', 'Famiglia con bambini', 'Con amici', 'Gruppo numeroso']
const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
const DURATIONS = ['Weekend (2-3 giorni)', 'Circa una settimana', '10-15 giorni', '2+ settimane', 'Non lo so ancora']
const BUDGETS = [
  { id: 'contenuto', label: 'Contenuto', desc: 'Il risparmio guida ogni scelta' },
  { id: 'medio', label: 'Medio', desc: 'Un buon compromesso, senza esagerare' },
  { id: 'alto', label: 'Alto', desc: 'Qualità prima del prezzo' },
]
const ACCOMMODATION_TYPES = ['Hotel', 'B&B', 'Appartamento', 'Ostello', 'Resort / villaggio']
const STARS = ['Nessuna preferenza', '3 stelle', '4 stelle', '5 stelle']
const FLIGHT_DIRECT = ['Solo diretti', 'Scalo va bene', 'Non so ancora']
const FLIGHT_TIME = ['Mattina', 'Pomeriggio', 'Sera / notte', 'Indifferente']
const FLIGHT_CLASS = ['Economy', 'Premium economy', 'Business']
const INTERESTS = ['Mare', 'Montagna', 'Cultura & arte', 'Cibo & vino', 'Vita notturna', 'Natura & outdoor', 'Shopping', 'Relax & benessere', 'Avventura', 'Fotografia']
const DIETS = ['Nessuna restrizione', 'Vegetariano', 'Vegano', 'Senza glutine', 'Halal', 'Kosher']
const TRANSPORTS = ['Auto a noleggio', 'Mezzi pubblici', 'Transfer privati', 'A piedi / bici', 'Non so ancora']

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

function Stepper({ value, onChange, min = 0, max = 12, label }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
      <span className="text-sm text-white/70">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Diminuisci ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-travel hover:text-travel"
        >
          −
        </button>
        <span className="w-5 text-center font-display text-sm text-white">{value}</span>
        <button
          type="button"
          aria-label={`Aumenta ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-travel hover:text-travel"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function TravelQuestionnaire() {
  useDocumentMeta({
    title: 'Raccontami il tuo viaggio | Adam Gabriele Javurek',
    description: 'Qualche domanda guidata per raccontarmi il viaggio che hai in mente: destinazione, date, stile e preferenze. Alla fine preparo io un messaggio pronto da mandarmi su WhatsApp.',
    path: '/travel/questionnaire',
  })

  const [step, setStep] = useState(0)
  const direction = useRef(1)

  const [needs, setNeeds] = useState<string[]>([])
  const [otherNeed, setOtherNeed] = useState('')
  const [itineraryLevel, setItineraryLevel] = useState<string | null>(null)

  const [destinations, setDestinations] = useState<string[]>([])
  const [undecidedDest, setUndecidedDest] = useState(false)

  const [periodMode, setPeriodMode] = useState<'dates' | 'flexible'>('dates')
  const [start, setStartDate] = useState<Date | null>(null)
  const [end, setEndDate] = useState<Date | null>(null)
  const [flexMonth, setFlexMonth] = useState<string | null>(null)
  const [flexDuration, setFlexDuration] = useState<string | null>(null)
  const [companion, setCompanion] = useState<string>('In coppia')
  const [travelers, setTravelers] = useState(2)
  const [children, setChildren] = useState(0)

  const [budget, setBudget] = useState<string | null>(null)
  const [budgetPerPerson, setBudgetPerPerson] = useState(true)
  const [budgetNote, setBudgetNote] = useState('')

  const [accommodationTypes, setAccommodationTypes] = useState<string[]>([])
  const [stars, setStars] = useState<string | null>(null)

  const [flightDirect, setFlightDirect] = useState<string | null>(null)
  const [flightTime, setFlightTime] = useState<string | null>(null)
  const [flightClass, setFlightClass] = useState<string | null>(null)

  const [style, setStyle] = useState('qualita-prezzo')
  const [interests, setInterests] = useState<string[]>([])
  const [diet, setDiet] = useState<string[]>([])
  const [dietOther, setDietOther] = useState('')
  const [transport, setTransport] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const countries = useMemo(() => getCountries(), [])

  const stepKeys = useMemo(() => {
    const keys = ['needs', 'destination', 'when', 'budget']
    if (needs.includes('hotel') || needs.includes('appartamento')) keys.push('accommodation')
    if (needs.includes('volo')) keys.push('flight')
    keys.push('style', 'interests', 'diet', 'transport', 'notes', 'summary')
    return keys
  }, [needs])

  const key = stepKeys[Math.min(step, stepKeys.length - 1)]
  const isSummary = key === 'summary'

  const goNext = () => {
    direction.current = 1
    setStep((s) => Math.min(s + 1, stepKeys.length - 1))
  }
  const goBack = () => {
    direction.current = -1
    setStep((s) => Math.max(s - 1, 0))
  }

  const message = useMemo(() => {
    const destLabel = undecidedDest
      ? 'ancora da decidere'
      : destinations.length
        ? destinations.map((c) => { const country = countries.find((x) => x.code === c); return country ? `${country.flag} ${country.name}` : c }).join(', ')
        : null

    const periodLabel =
      periodMode === 'dates' && start && end
        ? `dal ${fmtDate(start)} al ${fmtDate(end)} (${daysBetween(new Date(start), new Date(end))} giorni)`
        : periodMode === 'flexible' && (flexMonth || flexDuration)
          ? `${flexMonth ?? 'periodo flessibile'}${flexDuration ? `, ${flexDuration.toLowerCase()}` : ''}`
          : null

    const needLabels = needs.map((n) => {
      if (n === 'itinerario' && itineraryLevel) {
        const lvl = ITINERARY_LEVELS.find((l) => l.id === itineraryLevel)?.label.toLowerCase()
        return `itinerario (${lvl})`
      }
      return NEED_CATEGORIES.find((c) => c.id === n)?.label.toLowerCase() ?? n
    })
    if (otherNeed.trim()) needLabels.push(otherNeed.trim())

    const whoLabel = `${companion}${travelers > 1 ? ` — ${travelers} persone` : ''}${children > 0 ? `, ${children} bambini` : ''}`

    const budgetLabel = budget
      ? `${BUDGETS.find((b) => b.id === budget)?.label} (${budgetPerPerson ? 'a persona' : 'totale'})${budgetNote.trim() ? ` — ${budgetNote.trim()}` : ''}`
      : null

    const accommodationLabel =
      accommodationTypes.length || (stars && stars !== 'Nessuna preferenza')
        ? [accommodationTypes.join(', '), stars && stars !== 'Nessuna preferenza' ? stars : null].filter(Boolean).join(', ')
        : null

    const flightLabel =
      flightDirect || flightTime || flightClass
        ? [flightDirect, flightTime !== 'Indifferente' ? flightTime : null, flightClass].filter(Boolean).join(', ')
        : null

    const styleLabel = STYLES.find((s) => s.id === style)?.label ?? null

    const dietLabel = diet.length ? [...diet, dietOther.trim() || null].filter(Boolean).join(', ') : null

    const lines: (string | null)[] = [
      'Ciao Adam! Sto pensando a un viaggio e volevo raccontarti un po\' quello che ho in mente — ho usato il questionario del tuo portfolio, ecco cosa ne è uscito:',
      destLabel ? `📍 Destinazione: ${destLabel}` : null,
      periodLabel ? `🗓️ Periodo: ${periodLabel}` : null,
      `👥 Chi viaggia: ${whoLabel}`,
      needLabels.length ? `🧭 Cosa mi piacerebbe capire insieme: ${needLabels.join(', ')}` : null,
      budgetLabel ? `💶 Budget indicativo: ${budgetLabel}` : null,
      accommodationLabel ? `🏨 Alloggio: ${accommodationLabel}` : null,
      flightLabel ? `✈️ Voli: ${flightLabel}` : null,
      styleLabel ? `🎯 Stile di ricerca: ${styleLabel}` : null,
      interests.length ? `❤️ Interessi: ${interests.join(', ')}` : null,
      dietLabel ? `🍽️ Preferenze alimentari: ${dietLabel}` : null,
      transport.length ? `🚗 Spostamenti sul posto: ${transport.join(', ')}` : null,
      notes.trim() ? `📝 Note: ${notes.trim()}` : null,
      'Fammi sapere cosa ne pensi, ne parliamo con calma!',
    ]
    return lines.filter(Boolean).join('\n')
  }, [
    undecidedDest, destinations, countries, periodMode, start, end, flexMonth, flexDuration,
    needs, itineraryLevel, otherNeed, companion, travelers, children, budget, budgetPerPerson, budgetNote,
    accommodationTypes, stars, flightDirect, flightTime, flightClass, style, interests, diet, dietOther, transport, notes,
  ])

  return (
    <div className="min-h-screen bg-void pb-24 pt-28">
      <BackToHub accent={ACCENT} />
      <Link
        to="/travel"
        className="fixed right-5 top-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 font-display text-xs uppercase tracking-widest text-travel backdrop-blur-md transition hover:border-travel hover:bg-black/60"
      >
        Modulo Viaggi ▶
      </Link>

      <div className="mx-auto max-w-3xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl"
        >
          Che viaggio hai in mente?
        </motion.h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">
          Qualche domanda guidata, niente di burocratico: mi aiuta a capire cosa hai in testa. Alla fine ti preparo
          un messaggio con tutti i dettagli, pronto da mandarmi su WhatsApp quando vuoi.
        </p>

        <div className="corner-frame panel-glass mt-8 rounded-2xl p-6 text-travel sm:p-10">
          <div className="mb-8 flex items-center gap-2">
            {stepKeys.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-colors"
                style={{ background: i <= step ? ACCENT : 'rgba(255,255,255,0.1)' }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait" custom={direction.current}>
            <motion.div
              key={key}
              custom={direction.current}
              initial={{ opacity: 0, x: direction.current * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction.current * -24 }}
              transition={{ duration: 0.3 }}
            >
              {key === 'needs' && (
                <div>
                  <h3 className="mb-6 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
                    Di cosa hai bisogno?
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {NEED_CATEGORIES.map((n) => (
                      <IllustratedCard
                        key={n.id}
                        active={needs.includes(n.id)}
                        onClick={() => setNeeds((prev) => toggle(prev, n.id))}
                        icon={<n.icon />}
                        label={n.label}
                      />
                    ))}
                  </div>
                  {needs.includes('itinerario') && (
                    <div className="mt-6">
                      <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Che livello di dettaglio?</p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {ITINERARY_LEVELS.map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => setItineraryLevel(l.id)}
                            style={itineraryLevel === l.id ? { borderColor: ACCENT, background: 'rgba(255,180,84,0.1)' } : undefined}
                            className="rounded-xl border border-white/10 p-3 text-left transition hover:border-travel"
                          >
                            <p className="font-display text-xs uppercase tracking-wide text-white">{l.label}</p>
                            <p className="mt-1 text-[11px] text-white/45">{l.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {needs.includes('altro') && (
                    <div className="mt-5">
                      <input
                        value={otherNeed}
                        onChange={(e) => setOtherNeed(e.target.value)}
                        placeholder="Es. noleggio auto, visto, assicurazione di viaggio..."
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-travel focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {key === 'destination' && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
                    Dove vorresti andare?
                  </h3>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Chip active={undecidedDest} onClick={() => setUndecidedDest((v) => !v)}>
                      Non ho ancora deciso
                    </Chip>
                  </div>
                  {!undecidedDest && (
                    <>
                      <WorldMap selected={destinations} onToggle={(code) => setDestinations((prev) => toggle(prev, code))} />
                      <div className="mt-4">
                        <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Oppure cerca un altro paese</p>
                        <CountryPicker onSelect={(code) => setDestinations((prev) => (prev.includes(code) ? prev : [...prev, code]))} />
                      </div>
                    </>
                  )}
                </div>
              )}

              {key === 'when' && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">Quando e con chi?</h3>
                  <div className="mb-4 flex gap-2">
                    <Chip active={periodMode === 'dates'} onClick={() => setPeriodMode('dates')}>Date precise</Chip>
                    <Chip active={periodMode === 'flexible'} onClick={() => setPeriodMode('flexible')}>Periodo flessibile</Chip>
                  </div>
                  {periodMode === 'dates' ? (
                    <CalendarPicker start={start} end={end} onPick={(s, e) => { setStartDate(s); setEndDate(e) }} />
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Mese indicativo</p>
                        <div className="flex flex-wrap gap-2">
                          {MONTHS.map((m) => <Chip key={m} active={flexMonth === m} onClick={() => setFlexMonth(m)}>{m}</Chip>)}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Durata</p>
                        <div className="flex flex-wrap gap-2">
                          {DURATIONS.map((d) => <Chip key={d} active={flexDuration === d} onClick={() => setFlexDuration(d)}>{d}</Chip>)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-6">
                    <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Chi viaggia</p>
                    <div className="flex flex-wrap gap-2">
                      {COMPANIONS.map((c) => <Chip key={c} active={companion === c} onClick={() => setCompanion(c)}>{c}</Chip>)}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Stepper label="Persone" value={travelers} onChange={setTravelers} min={1} max={16} />
                    {companion === 'Famiglia con bambini' && (
                      <Stepper label="Bambini" value={children} onChange={setChildren} min={0} max={8} />
                    )}
                  </div>
                </div>
              )}

              {key === 'budget' && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">Budget indicativo</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {BUDGETS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBudget(b.id)}
                        style={budget === b.id ? { borderColor: ACCENT, background: 'rgba(255,180,84,0.1)' } : undefined}
                        className="rounded-xl border border-white/10 p-4 text-left transition hover:border-travel"
                      >
                        <p className="font-display text-sm uppercase tracking-wide text-white">{b.label}</p>
                        <p className="mt-1 text-xs text-white/45">{b.desc}</p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Chip active={budgetPerPerson} onClick={() => setBudgetPerPerson(true)}>A persona</Chip>
                    <Chip active={!budgetPerPerson} onClick={() => setBudgetPerPerson(false)}>Totale</Chip>
                  </div>
                  <input
                    value={budgetNote}
                    onChange={(e) => setBudgetNote(e.target.value)}
                    placeholder="Una cifra indicativa? (facoltativo)"
                    className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-travel focus:outline-none"
                  />
                </div>
              )}

              {key === 'accommodation' && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">Che tipo di alloggio?</h3>
                  <div className="flex flex-wrap gap-2">
                    {ACCOMMODATION_TYPES.map((t) => (
                      <Chip key={t} active={accommodationTypes.includes(t)} onClick={() => setAccommodationTypes((prev) => toggle(prev, t))}>{t}</Chip>
                    ))}
                  </div>
                  <p className="mb-2 mt-5 text-xs uppercase tracking-widest text-travel/80">Categoria preferita</p>
                  <div className="flex flex-wrap gap-2">
                    {STARS.map((s) => <Chip key={s} active={stars === s} onClick={() => setStars(s)}>{s}</Chip>)}
                  </div>
                </div>
              )}

              {key === 'flight' && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">Preferenze sul volo</h3>
                  <p className="mb-2 text-xs uppercase tracking-widest text-travel/80">Scali</p>
                  <div className="flex flex-wrap gap-2">
                    {FLIGHT_DIRECT.map((f) => <Chip key={f} active={flightDirect === f} onClick={() => setFlightDirect(f)}>{f}</Chip>)}
                  </div>
                  <p className="mb-2 mt-5 text-xs uppercase tracking-widest text-travel/80">Fascia oraria</p>
                  <div className="flex flex-wrap gap-2">
                    {FLIGHT_TIME.map((f) => <Chip key={f} active={flightTime === f} onClick={() => setFlightTime(f)}>{f}</Chip>)}
                  </div>
                  <p className="mb-2 mt-5 text-xs uppercase tracking-widest text-travel/80">Classe</p>
                  <div className="flex flex-wrap gap-2">
                    {FLIGHT_CLASS.map((f) => <Chip key={f} active={flightClass === f} onClick={() => setFlightClass(f)}>{f}</Chip>)}
                  </div>
                </div>
              )}

              {key === 'style' && (
                <div>
                  <h3 className="mb-6 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">Stile di ricerca</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {STYLES.map((s) => (
                      <IllustratedCard key={s.id} active={style === s.id} onClick={() => setStyle(s.id)} icon={<s.icon />} label={s.label} desc={s.desc} />
                    ))}
                  </div>
                </div>
              )}

              {key === 'interests' && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">Cosa ti incuriosisce di più?</h3>
                  <p className="mb-3 text-xs uppercase tracking-widest text-travel/80">Scegli anche più opzioni</p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((i) => <Chip key={i} active={interests.includes(i)} onClick={() => setInterests((prev) => toggle(prev, i))}>{i}</Chip>)}
                  </div>
                </div>
              )}

              {key === 'diet' && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">Preferenze alimentari</h3>
                  <div className="flex flex-wrap gap-2">
                    {DIETS.map((d) => <Chip key={d} active={diet.includes(d)} onClick={() => setDiet((prev) => toggle(prev, d))}>{d}</Chip>)}
                  </div>
                  <input
                    value={dietOther}
                    onChange={(e) => setDietOther(e.target.value)}
                    placeholder="Altre esigenze alimentari? (facoltativo)"
                    className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-travel focus:outline-none"
                  />
                </div>
              )}

              {key === 'transport' && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">Spostamenti sul posto</h3>
                  <div className="flex flex-wrap gap-2">
                    {TRANSPORTS.map((t) => <Chip key={t} active={transport.includes(t)} onClick={() => setTransport((prev) => toggle(prev, t))}>{t}</Chip>)}
                  </div>
                </div>
              )}

              {key === 'notes' && (
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">Qualcos'altro da sapere?</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Allergie, mobilità ridotta, animali al seguito, ricorrenze speciali, preferenze particolari..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-travel focus:outline-none"
                  />
                </div>
              )}

              {isSummary && (
                <div>
                  <h3 className="mb-2 font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
                    Ecco il messaggio pronto
                  </h3>
                  <p className="mb-4 text-sm text-white/55">Puoi tornare indietro per cambiare qualcosa, oppure mandarmelo così com'è.</p>
                  <div className="whitespace-pre-line rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                    {message}
                  </div>
                  <div className="mt-6">
                    <WhatsAppButton accent={ACCENT} message={message} label="Mandalo su WhatsApp" big />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {!isSummary && (
            <div className="mt-8 flex justify-between">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="font-display text-xs uppercase tracking-widest text-white/50 transition hover:text-white/80 disabled:opacity-0"
              >
                ‹ Indietro
              </button>
              <button
                onClick={goNext}
                style={{ background: ACCENT }}
                className="rounded-full px-6 py-2.5 font-display text-xs uppercase tracking-widest text-void transition hover:scale-105"
              >
                {stepKeys[step + 1] === 'summary' ? 'Vai al riepilogo' : 'Avanti'} ›
              </button>
            </div>
          )}
          {isSummary && (
            <button
              onClick={goBack}
              className="mt-6 font-display text-xs uppercase tracking-widest text-white/50 hover:text-white/80"
            >
              ‹ Torna indietro
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
