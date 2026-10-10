const TOKENS = [
  'bg',
  'surface',
  'surface-2',
  'line',
  'fg',
  'muted',
  'accent',
  'accent-soft',
  'owed',
  'owe',
  'warn-bg',
  'ok-bg',
  'av1',
  'av2',
  'av3',
  'av4',
  'av5'
]

export default function App() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Rumi colors</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {TOKENS.map((name) => (
          <div key={name} style={{ width: 110 }}>
            <div
              style={{
                height: 64,
                borderRadius: 8,
                border: '1px solid var(--line)',
                background: `var(--${name})`,
              }}
            />
            <small>{name}</small>
          </div>
        ))}
      </div>
    </main>
  )
}