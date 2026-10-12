import { Icon } from './Icon'
import type { Supply } from '../types'

export function Supplies({ supplies }: { supplies: Supply[] }) {
  return (
    <section className="card">
      <div className="rm-head">
        <div>
          <h2>Supplies &amp; Staples</h2>
          <div className="sub">Low restock checklist</div>
        </div>
        {/* Doesn't do anything yet. We wire it up in Step 6. */}
        <button type="button" className="add" aria-label="Add a supply">
          <Icon name="plus" />
        </button>
      </div>

      <div className="sup">
        {supplies.length === 0 && <div className="empty">Nothing on the list. Tap + when something runs low.</div>}

        {supplies.map((s) => (
          // A <label> makes the whole row clickable. Low items get an extra class.
          <label key={s.id} className={`item${s.in_stock ? '' : ' low'}`}>
            {/* readOnly: the box shows the state but can't change it yet */}
            <input type="checkbox" checked={s.in_stock} readOnly />
            <span>
              <b>{s.name}</b>
              {/* Only show the note if there is one */}
              {s.note && <small>{s.note}</small>}
            </span>
            <span className={`tag ${s.in_stock ? 'ok' : 'low'}`}>{s.in_stock ? 'Stocked' : 'Low'}</span>
          </label>
        ))}
      </div>

      <div className="supplies-foot">
        <button type="button" className="link">
          <Icon name="basket" size={14} />
          Go to Groceries &amp; Supplies board
        </button>
      </div>
    </section>
  )
}