import { Icon } from './Icon'

export function TopBar({ userName }: { userName: string }) {
  return (
    <header className="top">
      {/* Search box with an icon inside it */}
      <div className="search">
        <Icon name="search" size={15} />
        <input id="search" type="search" placeholder="Search expenses, roommates..." aria-label="Search expenses and roommates" />
      </div>

      <div className="user">
        {/* aria-label tells screen readers what an icon-only button does */}
        <button type="button" className="bell on" aria-label="Notifications">
          <Icon name="bell" />
        </button>
        <span className="name">{userName}</span>
      </div>
    </header>
  )
}