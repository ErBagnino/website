// Small line-art SVG illustrations for the travel questionnaire, sharing one
// visual language (thin currentColor strokes, no fill) so they read as part
// of the same HUD system instead of stock icon-font glyphs.

type IconProps = { size?: number }

export function HotelIllustration({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 40V12l12-6 12 6v4" strokeLinejoin="round" />
      <path d="M18 40V20h12v20" />
      <rect x="26" y="16" width="16" height="24" rx="1.5" />
      <path d="M30 22h3M30 27h3M30 32h3M36 22h3M36 27h3M36 32h3" strokeLinecap="round" />
      <path d="M6 40h36" strokeLinecap="round" />
      <path d="M12 24v-4M12 32v-4" strokeLinecap="round" />
    </svg>
  )
}

export function FlightIllustration({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M6 27l14-4 8-14c.6-1 2.3-1 2.6.3l1.8 13.6 8-2.3c1.4-.4 2.6.9 2 2.2l-3 6.4-8 2.3.4 8.6c.1 1.3-1.4 2-2.3 1l-6-6.8-14 4z"
        strokeLinejoin="round"
      />
      <path d="M6 40h10" strokeLinecap="round" />
    </svg>
  )
}

export function ItineraryIllustration({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M8 12c8-6 12 4 20-2s12 4 12 4" strokeLinecap="round" />
      <circle cx="8" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="20" cy="9.6" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="40" cy="14" r="2.4" fill="currentColor" stroke="none" />
      <path d="M12 22h24M12 30h18M12 38h24" strokeLinecap="round" strokeDasharray="1 5" />
    </svg>
  )
}

export function RestaurantIllustration({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 6v16M9 6v10a3 3 0 0 0 6 0V6M15 6v10a3 3 0 0 1-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 25v17" strokeLinecap="round" />
      <path d="M34 6c-4 0-6 4-6 10s2 8 6 8 6-2 6-8-2-10-6-10Z" />
      <path d="M34 24v18" strokeLinecap="round" />
    </svg>
  )
}

export function ExperienceIllustration({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M24 6l4.4 9.4L38 17l-7 6.9 1.7 9.7L24 29l-8.7 4.6L17 23.9 10 17l9.6-1.6z" strokeLinejoin="round" />
      <path d="M12 40h24" strokeLinecap="round" />
    </svg>
  )
}

export function TrainIllustration({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="12" y="6" width="24" height="26" rx="6" />
      <path d="M12 20h24" />
      <circle cx="18" cy="26" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="30" cy="26" r="1.8" fill="currentColor" stroke="none" />
      <path d="M16 32l-4 8M32 32l4 8" strokeLinecap="round" />
      <path d="M18 6V3h12v3" />
    </svg>
  )
}

export function ApartmentIllustration({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="8" y="10" width="16" height="30" />
      <rect x="24" y="18" width="16" height="22" />
      <path d="M12 16h3M12 22h3M12 28h3M18 16h3M18 22h3M18 28h3" strokeLinecap="round" />
      <path d="M28 24h3M28 30h3M34 24h3M34 30h3" strokeLinecap="round" />
      <path d="M8 40h32" strokeLinecap="round" />
    </svg>
  )
}

export function OtherIllustration({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="24" r="16" />
      <path d="M24 14v10l6 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BoltIllustration({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M26 4 10 28h10l-4 16 20-26H26z" strokeLinejoin="round" />
    </svg>
  )
}

export function CoinIllustration({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="24" r="16" />
      <path d="M24 15v18M28 18.5c0-2-2-3.5-4.5-3.5S19 16.5 19 18.5 20.8 22 24 22s5 1.5 5 3.5-2 3.5-4.5 3.5-4.5-1.3-4.5-3.3" strokeLinecap="round" />
    </svg>
  )
}

export function BalanceIllustration({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M24 6v34M14 40h20" strokeLinecap="round" />
      <path d="M8 14h12M28 14h12" strokeLinecap="round" />
      <path d="M8 14l-4 9c2 2.5 6 2.5 8 0l-4-9ZM40 14l-4 9c2 2.5 6 2.5 8 0l-4-9Z" strokeLinejoin="round" />
    </svg>
  )
}

export function LensIllustration({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="21" cy="21" r="13" />
      <path d="M30.5 30.5 40 40" strokeLinecap="round" />
    </svg>
  )
}

export function StarIllustration({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M24 5l5.5 11.6L42 18.5l-9 8.8 2.2 13-11.2-6-11.2 6L15 27.3 6 18.5l12.5-1.9z" strokeLinejoin="round" />
    </svg>
  )
}
