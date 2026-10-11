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