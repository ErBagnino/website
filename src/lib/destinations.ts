// Curated popular destinations, positioned using the real (simplified)
// country centroids from the world map data in worldMapPath.ts — same
// coordinate space, so pins land exactly on their country. Not every country
// is here — the map is a fast visual shortcut on top of the full country
// search, not a replacement for it.
export interface Destination {
  code: string
  x: number
  y: number
}

export const DESTINATIONS: Destination[] = [
  { code: 'IT', x: 434.1, y: 415.9 },
  { code: 'FR', x: 413.1, y: 405.5 },
  { code: 'ES', x: 397.9, y: 423.7 },
  { code: 'PT', x: 387.9, y: 428.8 },
  { code: 'GR', x: 458.3, y: 428.2 },
  { code: 'HR', x: 442.6, y: 411.5 },
  { code: 'GB', x: 401.5, y: 382.5 },
  { code: 'IS', x: 368.8, y: 344.2 },
  { code: 'NO', x: 440, y: 338.5 },
  { code: 'DE', x: 428.7, y: 392.3 },
  { code: 'AT', x: 435.8, y: 403.5 },
  { code: 'CH', x: 424.9, y: 405.9 },
  { code: 'NL', x: 419, y: 388.7 },
  { code: 'TR', x: 480.1, y: 428.1 },
  { code: 'MA', x: 387.6, y: 456.1 },
  { code: 'EG', x: 480, y: 456 },
  { code: 'ZA', x: 467.2, y: 605 },
  { code: 'KE', x: 497.7, y: 525.4 },
  { code: 'AE', x: 534.4, y: 467.2 },
  { code: 'TH', x: 650, y: 492.8 },
  { code: 'VN', x: 661.3, y: 486.1 },
  { code: 'ID', x: 651.2, y: 528.1 },
  { code: 'JP', x: 710.4, y: 429.4 },
  { code: 'MV', x: 583, y: 517.4 },
  { code: 'US', x: 197.4, y: 422.8 },
  { code: 'CA', x: 224.2, y: 347.5 },
  { code: 'MX', x: 162.8, y: 460.3 },
  { code: 'BR', x: 268.2, y: 558.1 },
  { code: 'AR', x: 263.2, y: 627.3 },
  { code: 'PE', x: 224.8, y: 550.9 },
  { code: 'AU', x: 720.7, y: 614.4 },
  { code: 'NZ', x: 804.9, y: 668.6 },
  { code: 'IN', x: 600.2, y: 465 },
]
