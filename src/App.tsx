import { BalanceCard } from './components/BalanceCard'
import { Icon } from './components/Icon'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { Ledger } from './components/Ledger'
import { EXPENSES, ME, MEMBERS } from './sampleData'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function App() {
  // Full month name, e.g. "October"
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' })

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
              <BalanceCard netCents={-2800} monthTotalCents={31000} yourShareCents={16750} />
              <Ledger expenses={EXPENSES} members={MEMBERS} meId={ME} />
            </div>
            <div className="col">{/* Roommates and supplies cards go here later */}</div>
          </div>
        </main>
      </div>
    </div>
  )
}