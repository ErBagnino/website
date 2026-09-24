// Small self-drawn flag chips. Emoji flags are unreliable cross-platform —
// Windows in particular falls back to showing the raw two-letter ISO code as
// plain text instead of a flag glyph — so real destinations get an actual
// drawn (simplified, but recognizable) flag instead of relying on OS emoji
// font support. Anything outside this list gets a neutral, clearly-styled
// placeholder rather than a broken-looking fallback.

const W = 30
const H = 20

function StripeFlag({ dir, colors }: { dir: 'h' | 'v'; colors: string[] }) {
  const n = colors.length
  return (
    <>
      {colors.map((c, i) =>
        dir === 'v' ? (
          <rect key={i} x={(W / n) * i} y="0" width={W / n} height={H} fill={c} />
        ) : (
          <rect key={i} x="0" y={(H / n) * i} width={W} height={H / n} fill={c} />
        ),
      )}
    </>
  )
}

const STRIPES: Record<string, { dir: 'h' | 'v'; colors: string[] }> = {
  IT: { dir: 'v', colors: ['#009246', '#fff', '#ce2b37'] },
  FR: { dir: 'v', colors: ['#0055a4', '#fff', '#ef4135'] },
  ES: { dir: 'h', colors: ['#aa151b', '#f1bf00', '#aa151b'] },
  PT: { dir: 'v', colors: ['#046a38', '#046a38', '#da020e', '#da020e', '#da020e'] },
  GR: { dir: 'h', colors: ['#0d5eaf', '#fff', '#0d5eaf', '#fff', '#0d5eaf'] },
  HR: { dir: 'h', colors: ['#ff0000', '#fff', '#171796'] },
  DE: { dir: 'h', colors: ['#000', '#d00', '#ffce00'] },
  AT: { dir: 'h', colors: ['#ed2939', '#fff', '#ed2939'] },
  NL: { dir: 'h', colors: ['#ae1c28', '#fff', '#21468b'] },
  EG: { dir: 'h', colors: ['#ce1126', '#fff', '#000'] },
  ZA: { dir: 'h', colors: ['#007a4d', '#ffb612', '#000'] },
  KE: { dir: 'h', colors: ['#000', '#bb0000', '#006600'] },
  TH: { dir: 'h', colors: ['#a51931', '#f4f5f8', '#2d2a4a', '#f4f5f8', '#a51931'] },
  ID: { dir: 'h', colors: ['#ff0000', '#fff'] },
  MX: { dir: 'v', colors: ['#006341', '#fff', '#ce1126'] },
  AR: { dir: 'h', colors: ['#74acdf', '#fff', '#74acdf'] },
  PE: { dir: 'v', colors: ['#d91023', '#fff', '#d91023'] },
  IN: { dir: 'h', colors: ['#ff9933', '#fff', '#138808'] },
}

function NordicCross({ field, cross }: { field: string; cross: string }) {
  return (
    <>
      <rect width={W} height={H} fill={field} />
      <rect x="9" width="4" height={H} fill={cross} />
      <rect y="8" width={W} height="4" fill={cross} />
    </>
  )
}

const SPECIAL: Record<string, () => JSX.Element> = {
  IS: () => (
    <>
      <NordicCross field="#02529c" cross="#fff" />
      <rect x="10" width="2" height={H} fill="#dc1e35" />
      <rect y="9" width={W} height="2" fill="#dc1e35" />
    </>
  ),
  NO: () => <NordicCross field="#ba0c2f" cross="#fff" />,
  CH: () => (
    <>
      <rect width={W} height={H} fill="#d52b1e" />
      <rect x="12" y="6" width="6" height="8" fill="#fff" />
      <rect x="9" y="9" width="12" height="2" fill="#fff" />
    </>
  ),
  TR: () => (
    <>
      <rect width={W} height={H} fill="#e30a17" />
      <circle cx="12" cy="10" r="4.2" fill="#fff" />
      <circle cx="13.4" cy="10" r="3.4" fill="#e30a17" />
      <path d="M17 10l3.4-1.1-2.1 2.9v-3.6l2.1 2.9Z" fill="#fff" />
    </>
  ),
  MA: () => (
    <>
      <rect width={W} height={H} fill="#c1272d" />
      <path d="M15 6l1.3 3.2L20 9.7l-2.8 2 1 3.4-3.2-2-3.2 2 1-3.4-2.8-2 3.7-.5Z" fill="none" stroke="#006233" strokeWidth="0.8" />
    </>
  ),
  VN: () => (
    <>
      <rect width={W} height={H} fill="#da251d" />
      <path d="M15 6l1.3 3.2L20 9.7l-2.8 2 1 3.4-3.2-2-3.2 2 1-3.4-2.8-2 3.7-.5Z" fill="#ff0" />
    </>
  ),
  JP: () => (
    <>
      <rect width={W} height={H} fill="#fff" />
      <circle cx="15" cy="10" r="5.4" fill="#bc002d" />
    </>
  ),
  MV: () => (
    <>
      <rect width={W} height={H} fill="#d21034" />
      <rect x="4" y="3" width="22" height="14" fill="#007e3a" />
      <circle cx="16" cy="10" r="4" fill="#fff" />
      <circle cx="17.6" cy="10" r="3.4" fill="#007e3a" />
    </>
  ),
  US: () => (
    <>
      <rect width={W} height={H} fill="#b31942" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={(i * H) / 7} width={W} height={H / 14} fill="#fff" />
      ))}
      <rect width="13" height="10.5" fill="#0a3161" />
    </>
  ),
  CA: () => (
    <>
      <rect width={W} height={H} fill="#fff" />
      <rect width="7.5" height={H} fill="#d52b1e" />
      <rect x="22.5" width="7.5" height={H} fill="#d52b1e" />
      <path d="M15 5l1.4 3 3-1.4-1 3 2.6 1.6-3 .6.3 3-2.3-1.8-2.3 1.8.3-3-3-.6L13.6 10l-1-3 3 1.4Z" fill="#d52b1e" />
    </>
  ),
  BR: () => (
    <>
      <rect width={W} height={H} fill="#009c3b" />
      <path d="M15 2l13 8-13 8-13-8Z" fill="#ffdf00" />
      <circle cx="15" cy="10" r="3.6" fill="#002776" />
    </>
  ),
  AU: () => (
    <>
      <rect width={W} height={H} fill="#00247d" />
      <rect width="13" height="9" fill="#00247d" stroke="#fff" strokeWidth="0.6" />
      <path d="M2 1l9 7M11 1l-9 7" stroke="#fff" strokeWidth="1" />
      {[[22, 5], [25, 11], [19, 14], [26, 16], [15, 8]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 4 ? 0.8 : 1} fill="#fff" />
      ))}
    </>
  ),
  NZ: () => (
    <>
      <rect width={W} height={H} fill="#00247d" />
      <rect width="13" height="9" fill="#00247d" stroke="#fff" strokeWidth="0.6" />
      <path d="M2 1l9 7M11 1l-9 7" stroke="#fff" strokeWidth="1" />
      {[[21, 5], [25, 9], [21, 15], [26, 15.5]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.1" fill="#e4002b" stroke="#fff" strokeWidth="0.3" />
      ))}
    </>
  ),
  AE: () => (
    <>
      <rect width={W} height={H} fill="#00732f" />
      <rect y={H / 3} width={W} height={H / 3} fill="#fff" />
      <rect y={(2 * H) / 3} width={W} height={H / 3} fill="#000" />
      <rect width="8" height={H} fill="#ff0000" />
    </>
  ),
  GB: () => (
    <>
      <rect width={W} height={H} fill="#012169" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="3" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="1.2" />
      <rect x="12.5" width="5" height={H} fill="#fff" />
      <rect y="7.5" width={W} height="5" fill="#fff" />
      <rect x="13.4" width="3.2" height={H} fill="#c8102e" />
      <rect y="8.4" width={W} height="3.2" fill="#c8102e" />
    </>
  ),
}

export default function Flag({ code, size = 20 }: { code: string; size?: number }) {
  const special = SPECIAL[code]
  const stripe = STRIPES[code]
  const w = size
  const h = (size * H) / W

  if (special || stripe) {
    return (
      <svg width={w} height={h} viewBox={`0 0 ${W} ${H}`} className="inline-block overflow-hidden rounded-[2px] align-middle" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.18)' }}>
        {special ? special() : <StripeFlag {...stripe} />}
      </svg>
    )
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-[2px] bg-white/10 align-middle text-[7px] font-semibold uppercase tracking-tight text-white/60"
      style={{ width: w, height: h }}
    >
      {code}
    </span>
  )
}
