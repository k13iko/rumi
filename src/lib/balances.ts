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