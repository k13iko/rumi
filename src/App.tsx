import { BalanceCard } from './components/BalanceCard'
import { Icon } from './components/Icon'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { Ledger } from './components/Ledger'
import { EXPENSES, ME, MEMBERS } from './sampleData'
import { Roommates } from './components/Roommates'
import { netBalances } from './lib/balances'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function App() {
  // Full month name, e.g. "October"
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' })
  // Net amount per roommate, and the grand total across everyone
  const net = netBalances(EXPENSES, ME)
  const netCents = [...net.values()].reduce((sum, c) => sum + c, 0)

  return (
    <div className="app">
      <Sidebar householdName="Apartment 4124" memberCount={5} />

      <div className="main">
        <TopBar userName="Kimiko" />

        <main className="content">
          {/* Page header */}
          <section className="hero">
            <div>
              <div className="eyebrow">
                Apartment 4124 <span>&middot;</span>
                <span className="ok">All shared accounts current for {monthName}</span>
              </div>
              <h1>{greeting()}, Kimiko</h1>
            </div>
            <div className="actions">
              <button type="button" className="btn">
                <Icon name="scale" size={16} />
                Settle Balances
              </button>
              <button type="button" className="btn primary">
                <Icon name="plus" size={16} />
                Log Expense
              </button>
            </div>
          </section>

          {/* Two columns of cards */}
          <div className="grid">
            <div className="col">
              {/* Fake amounts in cents: $142.50, $310.00, $167.50 */}
              <BalanceCard netCents={netCents} monthTotalCents={31000} yourShareCents={16750} />
              <Ledger expenses={EXPENSES} members={MEMBERS} meId={ME} />
            </div>
            <div className="col">
              <Roommates members={MEMBERS} net={net} meId={ME} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}