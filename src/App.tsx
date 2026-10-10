import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'

// Choose a greeting based on the hour of the day (0 to 23)
function greeting(): string {
  // new Date() is the current date and time on the user's computer
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning' // midnight to 11:59am
  if (hour < 18) return 'Good afternoon' // noon to 5:59pm
  return 'Good evening' // 6pm onward
}

export default function App() {
  return (
    <div className="app">
      {/* Fake values for now. Real data comes in Step 7. */}
      <Sidebar householdName="Apartment 4B" memberCount={5} />

      <div className="main">
        <TopBar userName="Kimiko" />
        <main className="content">
          <h1>{greeting()}, Kimiko</h1>
        </main>
      </div>
    </div>
  )
}