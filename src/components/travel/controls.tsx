import { useMemo, useState, type ReactNode } from 'react'
import { getCountries } from '../../lib/countries'

const ACCENT = '#ffb454'

export function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function fmtDate(d: Date) {
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })
}

export function daysBetween(a: Date, b: Date) {
  return Math.round((b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)) / 86400000)
}

const WEEKDAYS = ['L', 'M', 'M', 'G', 'V', 'S', 'D']

export function CalendarPicker({
  start,
  end,
  onPick,
}: {
  start: Date | null
  end: Date | null
  onPick: (s: Date | null, e: Date | null) => void
}) {
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
          <span key={i} className="py-1 text-[10px] uppercase text-white/45">
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
      <p className="mt-3 text-center text-xs text-white/50">
        {start && end
          ? `Dal ${fmtDate(start)} al ${fmtDate(end)} · ${daysBetween(new Date(start), new Date(end))} giorni`
          : start
            ? 'Scegli la data di rientro'
            : 'Scegli la data di partenza'}
      </p>
    </div>
  )
}

export function CountryPicker({
  placeholder = 'Cerca un paese...',
  onSelect,
}: {
  placeholder?: string
  onSelect: (code: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const countries = useMemo(() => getCountries(), [])
  const filtered = useMemo(
    () => countries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [countries, query],
  )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm text-white/60 focus:border-travel focus:outline-none"
      >
        <span>{placeholder}</span>
        <span className="text-white/45">▾</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0f18] shadow-2xl">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un paese..."
            className="w-full border-b border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((c) => (
              <button
                type="button"
                key={c.code}
                onClick={() => {
                  onSelect(c.code)
                  setOpen(false)
                  setQuery('')
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-white/80 hover:bg-white/5"
              >
                <span className="text-lg">{c.flag}</span>
                {c.name}
              </button>
            ))}
            {filtered.length === 0 && <p className="px-4 py-3 text-sm text-white/50">Nessun paese trovato</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={active ? { background: ACCENT, color: '#05070c', borderColor: ACCENT } : { borderColor: 'rgba(255,180,84,0.35)' }}
      className="rounded-full border px-4 py-2 text-sm font-medium text-white/80 transition hover:border-travel"
    >
      {children}
    </button>
  )
}

export function IllustratedCard({
  active,
  onClick,
  icon,
  label,
  desc,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  label: string
  desc?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={active ? { borderColor: ACCENT, background: 'rgba(255,180,84,0.12)' } : undefined}
      className="flex flex-col items-start gap-3 rounded-2xl border border-white/10 p-5 text-left transition hover:border-travel hover:-translate-y-0.5"
    >
      <span style={{ color: active ? ACCENT : '#e7cf9a' }}>{icon}</span>
      <div>
        <p className="font-display text-sm uppercase tracking-wide text-white">{label}</p>
        {desc && <p className="mt-1 text-xs text-white/45">{desc}</p>}
      </div>
    </button>
  )
}
