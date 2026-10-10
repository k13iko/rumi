const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/** 14250 -> "$142.50" */
export function formatCents(cents: number): string {
  return usd.format(cents / 100)
}

/** Whole-dollar amounts drop the cents: 2800 -> "$28", 2850 -> "$28.50". */
export function formatCentsShort(cents: number): string {
  return cents % 100 === 0 ? usd.format(cents / 100).replace('.00', '') : formatCents(cents)
}

/** "24.99" -> 2499. Returns null for anything that is not a positive amount. */
export function toCents(input: string): number | null {
  const n = Number.parseFloat(input)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100)
}