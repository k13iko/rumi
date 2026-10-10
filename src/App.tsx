import { Avatar } from './components/Avatar'
import { Icon, type IconName } from './components/Icon'

const ICONS: IconName[] = ['dash', 'doc', 'bolt', 'basket', 'pie', 'home', 'cog', 'search', 'bell', 'plus', 'scale', 'check', 'leaf', 'cup']

// Fake people, just for testing
const PEOPLE = [
  { id: 'user-1', name: 'Marcus Chen' },
  { id: 'user-2', name: 'Sarah Jenkins' },
  { id: 'user-3', name: 'Liam Vance' },
  { id: 'user-4', name: 'Carlos Diaz' },
  { id: 'user-5', name: 'Kimiko Low' },
]

export default function App() {
  return (
    <main style={{ padding: 24, display: 'grid', gap: 24 }}>
      <h1>Icons and avatars</h1>

      {/* One icon per name in the list */}
      <div style={{ display: 'flex', gap: 16, color: 'var(--accent)' }}>
        {ICONS.map((name) => (
          <Icon key={name} name={name} size={24} />
        ))}
      </div>

      {/* Normal and small avatars */}
      <div style={{ display: 'flex', gap: 12 }}>
        {PEOPLE.map((p) => (
          <Avatar key={p.id} id={p.id} name={p.name} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {PEOPLE.map((p) => (
          <Avatar key={p.id} id={p.id} name={p.name} small />
        ))}
      </div>
    </main>
  )
}