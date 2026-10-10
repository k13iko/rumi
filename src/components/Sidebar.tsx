import { Icon, type IconName } from './Icon'

// The main menu: a label and an icon for each page
const NAV: { label: string; icon: IconName }[] = [
  { label: 'Dashboard', icon: 'dash' },
  { label: 'Expenses', icon: 'doc' },
  { label: 'Utilities', icon: 'bolt' },
  { label: 'Groceries', icon: 'basket' },
  { label: 'Budget', icon: 'pie' },
]

// "Props" are inputs, passed in like <Sidebar householdName="..." />
export function Sidebar({ householdName, memberCount }: { householdName: string; memberCount: number }) {
  return (
    <aside className="rail">
      <div className="brand">Rumi</div>

      <nav className="nav" aria-label="Main">
        {/* One button per menu item. Dashboard is marked as the current page. */}
        {NAV.map((item) => (
          <button key={item.label} type="button" aria-current={item.label === 'Dashboard' ? 'page' : undefined}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sep" />

      <div className="hh-block">
        <div className="hh-head">
          <span className="label">Household</span>
        </div>
        <button type="button" className="hh">
          <Icon name="home" />
          <span style={{ flex: 1 }}>
            <b>{householdName}</b>
            {/* Say "roommate" for 1, "roommates" otherwise */}
            <small>
              {memberCount} {memberCount === 1 ? 'roommate' : 'roommates'}
            </small>
          </span>
        </button>
        <button type="button" className="link">
          <Icon name="copy" size={13} />
          Copy invite code
        </button>
      </div>

      <div className="spacer" />

      <div className="settings">
        <div className="sep" />
        <div className="nav">
          <button type="button">
            <Icon name="cog" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  )
}