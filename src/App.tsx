import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'

export default function App() {
  return (
    <div className="app">
      {/* Fake values for now. Real data comes in Step 7. */}
      <Sidebar householdName="Apartment 4B" memberCount={5} />

      <div className="main">
        <TopBar userName="Kimiko" />
        <main className="content">
          <h1>Good morning, Kimiko</h1>
        </main>
      </div>
    </div>
  )
}