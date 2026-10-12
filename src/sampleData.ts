import type { Expense, Member, Split, Supply } from './types'

// Pretend you are the user with id 'me'
export const ME = 'me'

export const MEMBERS: Member[] = [
  { user_id: 'me', display_name: 'Kimiko Low' },
  { user_id: 'marcus', display_name: 'Max Yun' },
  { user_id: 'sarah', display_name: 'Trinity Li' },
  { user_id: 'liam', display_name: 'Ethan Vail' },
  { user_id: 'carlos', display_name: 'Ryu Hoshino' },
]

const EVERYONE = MEMBERS.map((m) => m.user_id)

// Builds the list of shares for one expense.
// Whoever paid has already paid their own share, so it starts settled.
function shares(expenseId: string, people: string[], eachCents: number, paidBy: string, allSettled = false): Split[] {
  return people.map((userId) => ({
    expense_id: expenseId,
    user_id: userId,
    amount_cents: eachCents,
    settled_at: allSettled || userId === paidBy ? '2026-10-01T00:00:00Z' : null,
  }))
}

export const EXPENSES: Expense[] = [
  {
    id: 'e1',
    household_id: 'h1',
    description: "Trader Joe's Weekly Restock",
    category: 'groceries',
    total_cents: 24960, // $249.60, split 5 ways = 4992 each
    paid_by: 'me',
    expense_date: '2026-10-04',
    created_at: '2026-10-04T18:00:00Z',
    expense_splits: shares('e1', EVERYONE, 4992, 'me'),
  },
  {
    id: 'e2',
    household_id: 'h1',
    description: 'ConEd Electricity (Sept)',
    category: 'utilities',
    total_cents: 11840,
    paid_by: 'marcus',
    expense_date: '2026-10-03',
    created_at: '2026-10-03T12:00:00Z',
    expense_splits: shares('e2', EVERYONE, 2368, 'marcus'),
  },
  {
    id: 'e3',
    household_id: 'h1',
    description: 'Dishwasher Pods & Paper Towels',
    category: 'household',
    total_cents: 3250,
    paid_by: 'sarah',
    expense_date: '2026-10-02',
    created_at: '2026-10-02T15:00:00Z',
    expense_splits: shares('e3', EVERYONE, 650, 'sarah'),
  },
  {
    id: 'e4',
    household_id: 'h1',
    description: 'Whole Foods Olive Oil & Espresso Roast',
    category: 'dining',
    total_cents: 4200,
    paid_by: 'liam',
    expense_date: '2026-09-29',
    created_at: '2026-09-29T10:00:00Z',
    // Only 3 people shared this one, and everyone has paid
    expense_splits: shares('e4', ['me', 'liam', 'sarah'], 1400, 'liam', true),
  },
]

export const SUPPLIES: Supply[] = [
  { id: 's1', household_id: 'h1', name: 'Paper Towels', note: 'Claimed by Marcus \u2022 Will purchase Fri', in_stock: false },
  { id: 's2', household_id: 'h1', name: 'Eco Dish Soap (Refill)', note: 'Under the sink 2.5L reserve', in_stock: true },
  { id: 's3', household_id: 'h1', name: 'Extra Virgin Olive Oil', note: 'New bottle opened yesterday', in_stock: true },
  { id: 's4', household_id: 'h1', name: 'Compost & Trash Liners', note: 'Added by Carlos \u2022 4 bags remaining', in_stock: false },
]