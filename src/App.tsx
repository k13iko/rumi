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
import { useToast } from './hooks/useToast'
import { monthTotals, netBalances, settleBetween } from './lib/balances'
import { formatCents } from './lib/money'
import { splitEvenly } from './lib/split'
import { EXPENSES, ME, MEMBERS, SUPPLIES } from './sampleData'
import type { Expense, Member, NewExpense, Supply } from './types'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES)
  const [supplies, setSupplies] = useState<Supply[]>(SUPPLIES)
  const [logging, setLogging] = useState(false)
  const { show, node: toastNode } = useToast()

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' })

  const net = netBalances(expenses, ME)
  const netCents = [...net.values()].reduce((sum, c) => sum + c, 0)
  const month = monthTotals(expenses, ME)
  const openBalances = [...net.values()].filter((c) => c !== 0).length
  const lowSupplies = supplies.filter((s) => !s.in_stock).length

  // --- Expenses ---
  function handleAddExpense(form: NewExpense) {
    const amounts = splitEvenly(form.totalCents, form.splitWith.length)
    const id = `local-${Date.now()}`
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
      expense_splits: form.splitWith.map((userId, i) => ({
        expense_id: id,
        user_id: userId,
        amount_cents: amounts[i] ?? 0,
        settled_at: userId === form.paidBy ? now : null,
      })),
    }

    setExpenses((current) => [newExpense, ...current])
    setLogging(false)
    show(`Added ${form.description} to the ledger.`)
  }

  function handleSettle(member: Member) {
    const before = expenses // remember the list as it was before settling
    setExpenses(settleBetween(expenses, ME, member.user_id))
    show(`Settled up with ${member.display_name.split(' ')[0]}.`, {
      label: 'Undo',
      onClick: () => setExpenses(before), // put the old list back
    })
  }

  async function handleRequest(member: Member, cents: number, isReminder: boolean) {
    const first = member.display_name.split(' ')[0]
    const text = isReminder
      ? `Hi ${first}, a friendly reminder that you owe ${formatCents(cents)} for our shared expenses in Apartment 4B.`
      : `Hi ${first}, you owe ${formatCents(cents)} for our shared expenses in Apartment 4B. Thanks!`
    try {
      await navigator.clipboard.writeText(text)
      show(`Message for ${first} copied. Paste it into your chat.`)
    } catch {
      show('Could not copy the message. Your browser blocked clipboard access.')
    }
  }

  function handleToggleSupply(supply: Supply, inStock: boolean) {
    setSupplies((current) =>
      current.map((s) => (s.id === supply.id ? { ...s, in_stock: inStock, claimed_by: inStock ? null : s.claimed_by } : s)),
    )
    show(inStock ? `${supply.name} marked as stocked.` : `${supply.name} marked as low.`)
  }

  function handleAddSupply(name: string) {
    const supply: Supply = { id: `local-${Date.now()}`, household_id: 'h1', name, in_stock: false, claimed_by: null }
    setSupplies((current) => [...current, supply])
    show(`Added ${name} to the list.`)
  }

  function handleRemoveSupply(supply: Supply) {
    const before = supplies // remember the list so Undo can restore it
    setSupplies(supplies.filter((s) => s.id !== supply.id))
    show(`Removed ${supply.name}.`, { label: 'Undo', onClick: () => setSupplies(before) })
  }

  function handleClaim(supply: Supply, claim: boolean) {
    setSupplies((current) => current.map((s) => (s.id === supply.id ? { ...s, claimed_by: claim ? ME : null } : s)))
    show(claim ? `You're getting ${supply.name}.` : `Unclaimed ${supply.name}.`)
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
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById('roommates')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                <Icon name="scale" size={16} />
                Settle Balances
              </button>
              <button type="button" className="btn primary" onClick={() => setLogging(true)}>
                <Icon name="plus" size={16} />
                Log Expense
              </button>
            </div>
          </section>

          <div className="grid">
            <div className="col">
              <BalanceCard netCents={netCents} monthTotalCents={month.totalCents} yourShareCents={month.yourShareCents} />
              <Ledger expenses={expenses.slice(0, 8)} members={MEMBERS} meId={ME} />
              <RhythmCheck openBalances={openBalances} lowSupplies={lowSupplies} />
            </div>
            <div className="col">
              <div id="roommates">
                <Roommates members={MEMBERS} expenses={expenses} net={net} meId={ME} onSettle={handleSettle} onRequest={(m, c, r) => void handleRequest(m, c, r)} />
              </div>
              <Supplies supplies={supplies} members={MEMBERS} meId={ME} onToggle={handleToggleSupply} onAdd={handleAddSupply} onRemove={handleRemoveSupply} onClaim={handleClaim} />
            </div>
          </div>
        </main>
      </div>

      {logging && <LogExpenseModal householdId="h1" members={MEMBERS} meId={ME} onClose={() => setLogging(false)} onSubmit={handleAddExpense} />}
      {toastNode}
    </div>
  )
}