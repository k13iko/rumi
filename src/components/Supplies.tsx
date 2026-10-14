import { useState, type FormEvent } from 'react'
import { Icon } from './Icon'
import type { Supply } from '../types'

interface Props {
  supplies: Supply[]
  onToggle: (supply: Supply, inStock: boolean) => void
  onAdd: (name: string, note: string) => void
}

export function Supplies({ supplies, onToggle, onAdd }: Props) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), note.trim())
    setName('')
    setNote('')
    setAdding(false)
  }

  return (
    <section className="card">
      <div className="rm-head">
        <div>
          <h2>Supplies &amp; Staples</h2>
          <div className="sub">Low restock checklist</div>
        </div>
        <button type="button" className="add" aria-label="Add a supply" aria-expanded={adding} onClick={() => setAdding((open) => !open)}>
          <Icon name="plus" />
        </button>
      </div>

      {adding && (
        <form className="supply-form" onSubmit={submit}>
          <input id="supply-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="What is running low?" aria-label="Supply name" maxLength={80} autoFocus />
          <input id="supply-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" aria-label="Supply note" maxLength={160} />
          <button className="btn primary" type="submit">
            Add to list
          </button>
        </form>
      )}

      <div className="sup">
        {supplies.length === 0 && <div className="empty">Nothing on the list. Tap + when something runs low.</div>}

        {supplies.map((s) => (
          <label key={s.id} className={`item${s.in_stock ? '' : ' low'}`}>
            <input type="checkbox" checked={s.in_stock} onChange={(e) => onToggle(s, e.target.checked)} />
            <span>
              <b>{s.name}</b>
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