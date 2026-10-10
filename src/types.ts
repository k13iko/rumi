export type Category = 'groceries' | 'utilities' | 'household' | 'dining' | 'other'

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'groceries', label: 'Groceries' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'household', label: 'Household' },
  { value: 'dining', label: 'Dining' },
  { value: 'other', label: 'Other' },
]

export interface Household {
  id: string
  name: string
  invite_code: string
}

export interface Member {
  user_id: string
  display_name: string
}

export interface Split {
  expense_id: string
  user_id: string
  amount_cents: number
  settled_at: string | null
}

export interface Expense {
  id: string
  household_id: string
  description: string
  category: Category
  total_cents: number
  paid_by: string
  expense_date: string // YYYY-MM-DD
  created_at: string
  expense_splits: Split[]
}

export interface Supply {
  id: string
  household_id: string
  name: string
  note: string | null
  in_stock: boolean
}

export interface NewExpense {
  householdId: string
  description: string
  category: Category
  totalCents: number
  paidBy: string
  date: string
  splitWith: string[]
}