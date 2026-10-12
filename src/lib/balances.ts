import type { Expense } from '../types'

// The four things the "Your share" column can show
export type LedgerShare =
  | { kind: 'owed'; cents: number } // you paid, and others still owe you
  | { kind: 'owe'; cents: number } // someone else paid, and you still owe your share
  | { kind: 'settled'; cents: number } // everything on this row is paid
  | { kind: 'none' } // you aren't part of this split

export function ledgerShare(e: Expense, meId: string): LedgerShare {
  // Your own share of this expense, if you have one
  const mine = e.expense_splits.find((s) => s.user_id === meId)

  // Case 1: you paid
  if (e.paid_by === meId) {
    // Everyone's shares except yours
    const others = e.expense_splits.filter((s) => s.user_id !== meId)
    if (others.length === 0) return { kind: 'none' }

    // Add up what's still unpaid. "reduce" adds a list of numbers into one total.
    const open = others.filter((s) => !s.settled_at).reduce((sum, s) => sum + s.amount_cents, 0)
    if (open > 0) return { kind: 'owed', cents: open }

    // Nothing unpaid: show the full amount as settled
    return { kind: 'settled', cents: others.reduce((sum, s) => sum + s.amount_cents, 0) }
  }

  // Case 2: someone else paid
  if (!mine) return { kind: 'none' }
  return mine.settled_at ? { kind: 'settled', cents: mine.amount_cents } : { kind: 'owe', cents: mine.amount_cents }
}

// Works out, for each roommate, the net amount between you and them.
// Positive means they owe you. Negative means you owe them.
// Returns a Map: a lookup table from user id to cents.
export function netBalances(expenses: Expense[], meId: string): Map<string, number> {
  const net = new Map<string, number>()

  // Adds an amount to someone's running total (starting from 0)
  const add = (id: string, cents: number) => net.set(id, (net.get(id) ?? 0) + cents)

  for (const e of expenses) {
    for (const s of e.expense_splits) {
      // Skip shares that are already paid, and the payer's own share
      if (s.settled_at || s.user_id === e.paid_by) continue

      if (e.paid_by === meId) add(s.user_id, s.amount_cents) // you paid: they owe you
      else if (s.user_id === meId) add(e.paid_by, -s.amount_cents) // they paid: you owe them
    }
  }
  return net
}

// The two month figures shown on the balance card
export interface MonthTotals {
  totalCents: number // everything the household spent this month
  yourShareCents: number // your part of that
}

// "now" has a default value, so callers can leave it out and get the current date
export function monthTotals(expenses: Expense[], meId: string, now = new Date()): MonthTotals {
  // Build a text like "2026-10" for the current month.
  // getMonth() counts from 0 (January is 0), so we add 1.
  // padStart makes sure a single digit gets a leading zero: "9" -> "09".
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  let totalCents = 0
  let yourShareCents = 0

  for (const e of expenses) {
    // Skip expenses from other months. Dates look like "2026-10-04",
    // so we just check whether the date starts with "2026-10".
    if (!e.expense_date.startsWith(prefix)) continue

    totalCents += e.total_cents

    // Find your share of this expense. "?." means "if it exists",
    // and "?? 0" means "otherwise use 0" (for expenses you weren't part of).
    yourShareCents += e.expense_splits.find((s) => s.user_id === meId)?.amount_cents ?? 0
  }

  return { totalCents, yourShareCents }
}