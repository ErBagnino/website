// Curated popular destinations, positioned on the stylized world map's
// 1000x520 viewBox (simple equirectangular projection: x = (lon+180)/360*1000,
// y = (90-lat)/180*520). Not every country is here — the map is a fast visual
// shortcut on top of the full country search, not a replacement for it.
export interface Destination {
  code: string
  x: number
  y: number
}

export const DESTINATIONS: Destination[] = [
  { code: 'IT', x: 535, y: 139 },
  { code: 'FR', x: 506, y: 119 },
  { code: 'ES', x: 490, y: 143 },
  { code: 'PT', x: 475, y: 148 },
  { code: 'GR', x: 566, y: 151 },
  { code: 'HR', x: 544, y: 128 },
  { code: 'GB', x: 500, y: 111 },
  { code: 'IS', x: 439, y: 75 },
  { code: 'NO', x: 530, y: 87 },
  { code: 'DE', x: 537, y: 108 },
  { code: 'AT', x: 546, y: 121 },
  { code: 'CH', x: 521, y: 125 },
  { code: 'NL', x: 514, y: 109 },
  { code: 'TR', x: 580, y: 142 },
  { code: 'MA', x: 478, y: 169 },
  { code: 'EG', x: 587, y: 173 },
  { code: 'ZA', x: 551, y: 358 },
  { code: 'KE', x: 602, y: 264 },
  { code: 'AE', x: 654, y: 187 },
  { code: 'TH', x: 779, y: 221 },
  { code: 'VN', x: 794, y: 199 },
  { code: 'ID', x: 820, y: 285 },
  { code: 'JP', x: 888, y: 157 },
  { code: 'MV', x: 704, y: 248 },
  { code: 'US', x: 294, y: 143 },
  { code: 'CA', x: 279, y: 134 },
  { code: 'MX', x: 225, y: 204 },
  { code: 'BR', x: 379, y: 326 },
  { code: 'AR', x: 338, y: 360 },
  { code: 'PE', x: 300, y: 299 },
  { code: 'AU', x: 920, y: 358 },
  { code: 'NZ', x: 986, y: 366 },
  { code: 'IN', x: 714, y: 180 },
]
