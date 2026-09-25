// Small self-drawn flag chips. Emoji flags are unreliable cross-platform —
// Windows in particular falls back to showing the raw two-letter ISO code as
// plain text instead of a flag glyph — so every country in the picker gets
// an actual drawn (simplified, but color-accurate) flag instead of relying
// on OS emoji font support. A handful of the most complex emblems (a lion,
// a dragon, a taegeuk) are simplified to their dominant bands/colors rather
// than reproduced exactly — still unmistakably that flag's palette, never a
// broken-looking fallback.

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

  AD: { dir: 'v', colors: ['#0018a8', '#fedd00', '#c8102e'] },
  AF: { dir: 'v', colors: ['#000', '#d32011', '#007a36'] },
  AG: { dir: 'h', colors: ['#ce1126', '#000', '#0072ce'] },
  AL: { dir: 'h', colors: ['#e41e20'] },
  AM: { dir: 'h', colors: ['#d90012', '#0033a0', '#f2a800'] },
  AO: { dir: 'h', colors: ['#cc092f', '#000'] },
  AZ: { dir: 'h', colors: ['#00b9e4', '#ef3340', '#509e2f'] },
  BA: { dir: 'h', colors: ['#002395', '#fecb00'] },
  BB: { dir: 'v', colors: ['#00267f', '#ffc726', '#00267f'] },
  BE: { dir: 'v', colors: ['#000', '#fada5e', '#ed2939'] },
  BF: { dir: 'h', colors: ['#ef2b2d', '#009e49'] },
  BG: { dir: 'h', colors: ['#fff', '#00966e', '#d62612'] },
  BH: { dir: 'h', colors: ['#ce1126', '#fff'] },
  BI: { dir: 'h', colors: ['#ce1126', '#fff', '#1eb53a'] },
  BJ: { dir: 'v', colors: ['#008751', '#fcd116', '#e8112d'] },
  BN: { dir: 'h', colors: ['#fed141'] },
  BO: { dir: 'h', colors: ['#d52b1e', '#f9e300', '#007934'] },
  BS: { dir: 'h', colors: ['#00778b', '#ffc72c', '#00778b'] },
  BT: { dir: 'h', colors: ['#ffcc33', '#ff4e12'] },
  BW: { dir: 'h', colors: ['#75aadb', '#000', '#75aadb'] },
  BY: { dir: 'h', colors: ['#c8102e', '#00af66'] },
  BZ: { dir: 'h', colors: ['#ce1126', '#003f87', '#ce1126'] },
  CD: { dir: 'h', colors: ['#007fff', '#f7d618', '#ce1021'] },
  CF: { dir: 'h', colors: ['#003082', '#fff', '#289728', '#ffce00'] },
  CG: { dir: 'h', colors: ['#009543', '#fbde4a', '#dc241f'] },
  CI: { dir: 'v', colors: ['#f77f00', '#fff', '#009e60'] },
  CM: { dir: 'v', colors: ['#007a5e', '#ce1126', '#fcd116'] },
  CO: { dir: 'h', colors: ['#fcd116', '#003893', '#ce1126'] },
  CR: { dir: 'h', colors: ['#002b7f', '#fff', '#ce1126', '#fff', '#002b7f'] },
  CU: { dir: 'h', colors: ['#002a8f', '#fff', '#002a8f', '#fff', '#002a8f'] },
  CV: { dir: 'h', colors: ['#003893', '#fff', '#cf2027', '#fff', '#003893'] },
  CY: { dir: 'h', colors: ['#f0f0f0'] },
  CZ: { dir: 'h', colors: ['#fff', '#d7141a'] },
  DJ: { dir: 'h', colors: ['#6ab2e7', '#12ad2b'] },
  DM: { dir: 'h', colors: ['#006b3f'] },
  DO: { dir: 'h', colors: ['#002d62', '#fff', '#ce1126'] },
  DZ: { dir: 'v', colors: ['#006233', '#fff'] },
  EC: { dir: 'h', colors: ['#fcd116', '#0072ce', '#ef3340'] },
  EE: { dir: 'h', colors: ['#0072ce', '#000', '#fff'] },
  ER: { dir: 'h', colors: ['#12a750', '#ea0437', '#1279be'] },
  ET: { dir: 'h', colors: ['#078930', '#fcdd09', '#da121a'] },
  FJ: { dir: 'h', colors: ['#68bfe5'] },
  FM: { dir: 'h', colors: ['#75b2dd'] },
  GA: { dir: 'h', colors: ['#009e60', '#fcd116', '#3a75c4'] },
  GD: { dir: 'h', colors: ['#ce1126', '#fcd116', '#007a5e'] },
  GH: { dir: 'h', colors: ['#ce1126', '#fcd116', '#006b3f'] },
  GM: { dir: 'h', colors: ['#ce1126', '#0c1c8c', '#3a7728'] },
  GN: { dir: 'v', colors: ['#ce1126', '#fcd116', '#009460'] },
  GQ: { dir: 'h', colors: ['#3e9a00', '#fff', '#e32118'] },
  GT: { dir: 'v', colors: ['#4997d0', '#fff', '#4997d0'] },
  GW: { dir: 'v', colors: ['#ce1126', '#fcd116', '#009e49'] },
  GY: { dir: 'h', colors: ['#009e49', '#fcd116', '#ce1126'] },
  HN: { dir: 'h', colors: ['#0073cf', '#fff', '#0073cf'] },
  HT: { dir: 'h', colors: ['#00209f', '#d21034'] },
  HU: { dir: 'h', colors: ['#ce2939', '#fff', '#477050'] },
  IE: { dir: 'v', colors: ['#169b62', '#fff', '#ff883e'] },
  IQ: { dir: 'h', colors: ['#ce1126', '#fff', '#000'] },
  IR: { dir: 'h', colors: ['#239f40', '#fff', '#da0000'] },
  JM: { dir: 'h', colors: ['#009e49', '#fed100', '#000'] },
  JO: { dir: 'h', colors: ['#000', '#fff', '#007a3d'] },
  KG: { dir: 'h', colors: ['#e8112d'] },
  KH: { dir: 'h', colors: ['#032ea1', '#e00025', '#032ea1'] },
  KI: { dir: 'h', colors: ['#ce1126', '#fcd116', '#0072c6'] },
  KM: { dir: 'h', colors: ['#ffd700', '#fff', '#e8112d', '#3a75c4'] },
  KN: { dir: 'h', colors: ['#009e49', '#000', '#e03c31'] },
  KP: { dir: 'h', colors: ['#024fa2', '#ed1c27', '#024fa2'] },
  KW: { dir: 'h', colors: ['#007a3d', '#fff', '#ce1126'] },
  KZ: { dir: 'h', colors: ['#00afca'] },
  LB: { dir: 'h', colors: ['#ee161f', '#fff', '#ee161f'] },
  LI: { dir: 'h', colors: ['#002b7f', '#ce1126'] },
  LK: { dir: 'v', colors: ['#00534e', '#ffb612', '#8d153a'] },
  LR: { dir: 'h', colors: ['#bf0a30', '#fff', '#bf0a30', '#fff', '#bf0a30', '#fff'] },
  LS: { dir: 'h', colors: ['#00209f', '#fff', '#009543'] },
  LT: { dir: 'h', colors: ['#fdb913', '#006a44', '#c1272d'] },
  LU: { dir: 'h', colors: ['#ed2939', '#fff', '#00a1de'] },
  LV: { dir: 'h', colors: ['#9e3039', '#fff', '#9e3039'] },
  LY: { dir: 'h', colors: ['#e70013', '#000', '#239e46'] },
  MC: { dir: 'h', colors: ['#ce1126', '#fff'] },
  MD: { dir: 'v', colors: ['#003da5', '#ffd200', '#cc092f'] },
  ME: { dir: 'h', colors: ['#c40308'] },
  MG: { dir: 'v', colors: ['#fff', '#fc3d32', '#007e3a'] },
  MH: { dir: 'h', colors: ['#003893'] },
  MK: { dir: 'h', colors: ['#d20000', '#ffe600'] },
  ML: { dir: 'v', colors: ['#14b53a', '#fcd116', '#ce1126'] },
  MM: { dir: 'h', colors: ['#fecb00', '#34b233', '#ea2839'] },
  MN: { dir: 'v', colors: ['#c4272f', '#015197', '#c4272f'] },
  MR: { dir: 'h', colors: ['#d01c1f', '#00a95c', '#d01c1f'] },
  MT: { dir: 'v', colors: ['#fff', '#cf142b'] },
  MU: { dir: 'h', colors: ['#ea2839', '#1a206d', '#ffd500', '#00a551'] },
  MW: { dir: 'h', colors: ['#000', '#ce1126', '#339e35'] },
  MY: { dir: 'h', colors: ['#cc0001', '#fff', '#cc0001', '#fff'] },
  MZ: { dir: 'h', colors: ['#007168', '#000', '#fce100'] },
  NA: { dir: 'h', colors: ['#003580', '#d21034', '#009543'] },
  NE: { dir: 'h', colors: ['#e05206', '#fff', '#0db02b'] },
  NG: { dir: 'v', colors: ['#008751', '#fff', '#008751'] },
  NI: { dir: 'h', colors: ['#0067c6', '#fff', '#0067c6'] },
  NR: { dir: 'h', colors: ['#002b7f', '#ffc61e', '#002b7f'] },
  OM: { dir: 'h', colors: ['#fff', '#db161b', '#008000'] },
  PA: { dir: 'h', colors: ['#001489', '#fff', '#d21034'] },
  PG: { dir: 'h', colors: ['#000', '#ce1126'] },
  PH: { dir: 'h', colors: ['#0038a8', '#ce1126'] },
  PK: { dir: 'v', colors: ['#fff', '#01411c'] },
  PL: { dir: 'h', colors: ['#fff', '#dc143c'] },
  PS: { dir: 'h', colors: ['#000', '#fff', '#007a3d'] },
  PW: { dir: 'h', colors: ['#4aadd6'] },
  PY: { dir: 'h', colors: ['#d52b1e', '#fff', '#0038a8'] },
  QA: { dir: 'h', colors: ['#fff', '#8a1538'] },
  RO: { dir: 'v', colors: ['#002b7f', '#fcd116', '#ce1126'] },
  RS: { dir: 'h', colors: ['#c6363c', '#0c4076', '#fff'] },
  RU: { dir: 'h', colors: ['#fff', '#0039a6', '#d52b1e'] },
  RW: { dir: 'h', colors: ['#00a1de', '#fad201', '#20603d'] },
  SA: { dir: 'h', colors: ['#006c35'] },
  SB: { dir: 'h', colors: ['#0051ba', '#fcd116', '#215b33'] },
  SC: { dir: 'h', colors: ['#003f87', '#fcd856', '#d62828', '#fff', '#007a3d'] },
  SD: { dir: 'h', colors: ['#d21034', '#fff', '#000'] },
  SG: { dir: 'h', colors: ['#ed2939', '#fff'] },
  SI: { dir: 'h', colors: ['#fff', '#005cb9', '#d0103a'] },
  SK: { dir: 'h', colors: ['#fff', '#0b4ea2', '#ee1c25'] },
  SL: { dir: 'h', colors: ['#1eb53a', '#fff', '#0072c6'] },
  SM: { dir: 'h', colors: ['#fff', '#5eb6e4'] },
  SN: { dir: 'v', colors: ['#00853f', '#fdef42', '#e31b23'] },
  SO: { dir: 'h', colors: ['#4189dd'] },
  SR: { dir: 'h', colors: ['#377e3f', '#fff', '#b40a2d', '#fff', '#377e3f'] },
  SS: { dir: 'h', colors: ['#000', '#ce1126', '#078930'] },
  ST: { dir: 'h', colors: ['#12ad2b', '#ffce00', '#12ad2b'] },
  SV: { dir: 'h', colors: ['#0047ab', '#fff', '#0047ab'] },
  SY: { dir: 'h', colors: ['#ce1126', '#fff', '#000'] },
  SZ: { dir: 'h', colors: ['#3a5eb5', '#ffd900', '#b10c0c', '#ffd900', '#3a5eb5'] },
  TD: { dir: 'v', colors: ['#002664', '#fecb00', '#c60c30'] },
  TG: { dir: 'h', colors: ['#006a4e', '#ffce00', '#006a4e', '#ffce00', '#006a4e'] },
  TJ: { dir: 'h', colors: ['#cc0000', '#fff', '#006600'] },
  TL: { dir: 'h', colors: ['#dc241f', '#ffc726', '#000'] },
  TM: { dir: 'h', colors: ['#00843d'] },
  TN: { dir: 'h', colors: ['#e70013'] },
  TO: { dir: 'h', colors: ['#c10000'] },
  TT: { dir: 'h', colors: ['#ce1126', '#000', '#ce1126'] },
  TV: { dir: 'h', colors: ['#48b5d2'] },
  TZ: { dir: 'h', colors: ['#1eb53a', '#fcd116', '#000', '#fcd116', '#00a3dd'] },
  UA: { dir: 'h', colors: ['#0057b7', '#ffd700'] },
  UG: { dir: 'h', colors: ['#000', '#fcdc04', '#d90000', '#000', '#fcdc04', '#d90000'] },
  UY: { dir: 'h', colors: ['#fff', '#0038a8', '#fff', '#0038a8', '#fff'] },
  UZ: { dir: 'h', colors: ['#0099b5', '#fff', '#1eb53a'] },
  VA: { dir: 'v', colors: ['#ffe000', '#fff'] },
  VC: { dir: 'v', colors: ['#0038a8', '#fcd116', '#009e49'] },
  VE: { dir: 'h', colors: ['#fcd116', '#00247d', '#cf142b'] },
  VU: { dir: 'h', colors: ['#d21034', '#009543'] },
  WS: { dir: 'h', colors: ['#ce1126'] },
  YE: { dir: 'h', colors: ['#ce1126', '#fff', '#000'] },
  ZM: { dir: 'v', colors: ['#198a00', '#de2010', '#000', '#ef7d00'] },
  ZW: { dir: 'h', colors: ['#006400', '#ffd200', '#d40000', '#000', '#d40000', '#ffd200', '#006400'] },
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
  DK: () => <NordicCross field="#c8102e" cross="#fff" />,
  FI: () => <NordicCross field="#fff" cross="#003580" />,
  SE: () => <NordicCross field="#006aa7" cross="#fecc02" />,
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
  CL: () => (
    <>
      <rect width={W} height={H} fill="#fff" />
      <rect y={H / 2} width={W} height={H / 2} fill="#d52b1e" />
      <rect width="12" height={H / 2} fill="#0039a6" />
      <path d="M6 2.6l.9 2 2.2.2-1.7 1.4.6 2.1-2-1.3-2 1.3.6-2.1-1.7-1.4 2.2-.2Z" fill="#fff" />
    </>
  ),
  BD: () => (
    <>
      <rect width={W} height={H} fill="#006a4e" />
      <circle cx="13" cy="10" r="5.2" fill="#f42a41" />
    </>
  ),
  CN: () => (
    <>
      <rect width={W} height={H} fill="#de2910" />
      <path d="M8 5l1.2 3.2L12.4 8l-2.6 2 .9 3.3L8 11.4l-2.7 1.9.9-3.3-2.6-2 3.2-.2Z" fill="#ffde00" />
      {[[12, 3], [13.5, 5], [13.5, 7.5], [12, 9.5]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.5" fill="#ffde00" />
      ))}
    </>
  ),
  IL: () => (
    <>
      <rect width={W} height={H} fill="#fff" />
      <rect y="2.5" width={W} height="2" fill="#0038b8" />
      <rect y="15.5" width={W} height="2" fill="#0038b8" />
      <path d="M15 7l2.6 4.5h-5.2Z" fill="none" stroke="#0038b8" strokeWidth="0.8" />
      <path d="M15 13l-2.6-4.5h5.2Z" fill="none" stroke="#0038b8" strokeWidth="0.8" />
    </>
  ),
  KR: () => (
    <>
      <rect width={W} height={H} fill="#fff" />
      <circle cx="15" cy="10" r="4" fill="#cd2e3a" />
      <path d="M15 6a4 4 0 0 0 0 8 2 2 0 0 1 0-4 2 2 0 0 0 0-4Z" fill="#0047a0" />
    </>
  ),
  TW: () => (
    <>
      <rect width={W} height={H} fill="#fe0000" />
      <rect width="14" height="10" fill="#000095" />
      <circle cx="7" cy="5" r="3" fill="#fff" />
    </>
  ),
  GE: () => (
    <>
      <rect width={W} height={H} fill="#fff" />
      <rect x="12.5" width="5" height={H} fill="#ff0000" />
      <rect y="7.5" width={W} height="5" fill="#ff0000" />
      {[[5, 4], [25, 4], [5, 16], [25, 16]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <rect x="-1.4" y="-2.4" width="2.8" height="4.8" fill="#ff0000" />
          <rect x="-2.4" y="-1.4" width="4.8" height="2.8" fill="#ff0000" />
        </g>
      ))}
    </>
  ),
  LA: () => (
    <>
      <rect width={W} height={H} fill="#ce1126" />
      <rect y={H / 4} width={W} height={H / 2} fill="#002868" />
      <circle cx="15" cy="10" r="3.6" fill="#fff" />
    </>
  ),
  LC: () => (
    <>
      <rect width={W} height={H} fill="#66cccc" />
      <path d="M15 4l6 12H9Z" fill="#fcd116" />
      <path d="M15 6l-4.5 10h9Z" fill="#000" />
    </>
  ),
  NP: () => (
    <>
      <rect width={W} height={H} fill="#0a0a0a" />
      <path d="M6 2 L20 8 L6 8 Z" fill="#dc143c" stroke="#003893" strokeWidth="0.6" />
      <path d="M6 8 L20 14 L6 18 Z" fill="#dc143c" stroke="#003893" strokeWidth="0.6" />
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
