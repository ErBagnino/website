/** Deterministic pseudo-random jitter in [-amount, amount], seeded by a plain number. */
export function jitter(seed: number, amount: number): number {
  const n = Math.sin(seed * 12.9898) * 43758.5453
  return (n - Math.floor(n) - 0.5) * 2 * amount
}
