// Turns an id into a number, always the same number for the same id
function hash(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0
  }
  return h
}

// A colored circle with the person's first letter
export function Avatar({ id, name, small = false }: { id: string; name: string; small?: boolean }) {
  // Pick a color from 1 to 5. If you add more colors, change the 5.
  const tone = (hash(id) % 5) + 1

  return (
    <span className={`av a${tone}${small ? ' sm' : ''}`} aria-hidden="true">
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  )
}