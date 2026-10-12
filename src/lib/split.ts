// Splits an amount into equal parts, in whole cents.
// Leftover cents go to the first people, one each, so the parts
// always add up exactly. Example: 10000 split 3 ways -> [3334, 3333, 3333]
export function splitEvenly(totalCents: number, count: number): number[] {
  const base = Math.floor(totalCents / count) // the equal part, rounded down
  const remainder = totalCents % count // cents left over

  // Array.from builds a list of "count" items. i is the position (0, 1, 2...).
  // The first "remainder" people get one extra cent.
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0))
}