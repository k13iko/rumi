import { useState } from 'react'
import { BalanceCard } from './components/BalanceCard'
import { Icon } from './components/Icon'
import { Ledger } from './components/Ledger'
import { LogExpenseModal } from './components/LogExpenseModal'
import { RhythmCheck } from './components/RhythmCheck'
import { Roommates } from './components/Roommates'
import { Sidebar } from './components/Sidebar'
import { Supplies } from './components/Supplies'
import { TopBar } from './components/TopBar'
import { monthTotals, netBalances } from './lib/balances'
import { splitEvenly } from './lib/split'
import { EXPENSES, ME, MEMBERS, SUPPLIES } from './sampleData'
import type { Expense, NewExpense } from './types'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function App() {
  // The expense list is now "state": when it changes, the page redraws
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES)
  // Whether the Log Expense popup is open
  const [logging, setLogging] = useState(false)

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' })

  // Everything below is recalculated from "expenses" each time it changes
  const net = netBalances(expenses, ME)
  const netCents = [...net.values()].reduce((sum, c) => sum + c, 0)
  const month = monthTotals(expenses, ME)
  const openBalances = [...net.values()].filter((c) => c !== 0).length
  const lowSupplies = SUPPLIES.filter((s) => !s.in_stock).length

  // Turns the form's answers into a full expense and adds it to the top
  function handleAddExpense(form: NewExpense) {
    const amounts = splitEvenly(form.totalCents, form.splitWith.length)
    const id = `local-${Date.now()}` // a made-up id, fine for now
    const now = new Date().toISOString()

    const newExpense: Expense = {
      id,
      household_id: 'h1',
      description: form.description,
      category: form.category,
      total_cents: form.totalCents,
      paid_by: form.paidBy,
      expense_date: form.date,
      created_at: now,
      // One share per person. The payer's own share counts as already paid.
      expense_splits: form.splitWith.map((userId, i) => ({
        expense_id: id,
        user_id: userId,
        amount_cents: amounts[i] ?? 0,
        settled_at: userId === form.paidBy ? now : null,
      })),
    }

    // New list = the new expense, then all the old ones
    setExpenses((current) => [newExpense, ...current])
    setLogging(false)
  }

  return (
    <div className="app">
      <Sidebar householdName="Apartment 4B" memberCount={MEMBERS.length} />

      <div className="main">
        <TopBar userName="Kimiko" />

        <main className="content">
          <section className="hero">
            <div>
              <div className="eyebrow">
                Apartment 4B <span>&middot;</span>
                <span className="ok">All shared accounts current for {monthName}</span>
              </div>
              <h1>{greeting()}, Kimiko</h1>
            </div>
            <div className="actions">
              <button type="button" className="btn">
                <Icon name="scale" size={16} />
                Settle Balances
              </button>
              {/* Opens the popup */}
              <button type="button" className="btn primary" onClick={() => setLogging(true)}>
                <Icon name="plus" size={16} />
                Log Expense
              </button>
            </div>
          </section>

          <div className="grid">
            <div className="col">
              <BalanceCard netCents={netCents} monthTotalCents={month.totalCents} yourShareCents={month.yourShareCents} />
              {/* Only the 8 newest expenses are shown */}
              <Ledger expenses={expenses.slice(0, 8)} members={MEMBERS} meId={ME} />
              <RhythmCheck openBalances={openBalances} lowSupplies={lowSupplies} />
            </div>
            <div className="col">
              <Roommates members={MEMBERS} net={net} meId={ME} />
              <Supplies supplies={SUPPLIES} />
            </div>
          </div>
        </main>
      </div>

      {/* "&&" means: only draw the popup while logging is true */}
      {logging && (
        <LogExpenseModal householdId="h1" members={MEMBERS} meId={ME} onClose={() => setLogging(false)} onSubmit={handleAddExpense} />
      )}
    </div>
  )
}