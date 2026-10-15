import { useState, type FormEvent } from 'react'
import { Icon } from './Icon'
import type { Member, Supply } from '../types'

interface Props {
  supplies: Supply[]
  members: Member[]
  meId: string
  onToggle: (supply: Supply, inStock: boolean) => void
  onAdd: (name: string) => void
  onRemove: (supply: Supply) => void
  onClaim: (supply: Supply, claim: boolean) => void
}

export function Supplies({ supplies, members, meId, onToggle, onAdd, onRemove, onClaim }: Props) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim())
    setName('')
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
          <button className="btn primary" type="submit">
            Add to list
          </button>
        </form>
      )}

      <div className="sup">
        {supplies.length === 0 && <div className="empty">Nothing on the list. Tap + when something runs low.</div>}

        {supplies.map((s) => {
          const claimer = members.find((m) => m.user_id === s.claimed_by)
          const mine = s.claimed_by === meId

          return (
            <label key={s.id} className={`item${s.in_stock ? '' : ' low'}`}>
              <input type="checkbox" checked={s.in_stock} onChange={(e) => onToggle(s, e.target.checked)} />
              <span>
                <b>{s.name}</b>

                {!s.in_stock && !claimer && (
                  <button
                    type="button"
                    className="link claim solid"
                    onClick={(e) => {
                      e.preventDefault()
                      onClaim(s, true)
                    }}
                  >
                    Claim
                  </button>
                )}

                {!s.in_stock && claimer && (
                  <small className="claimed">
                    {mine ? 'You are getting this' : `${claimer.display_name.split(' ')[0]} is getting this`}
                  </small>
                )}
                {!s.in_stock && mine && (
                  <button
                    type="button"
                    className="link claim"
                    onClick={(e) => {
                      e.preventDefault()
                      onClaim(s, false)
                    }}
                  >
                    Unclaim
                  </button>
                )}
              </span>
              <span className={`tag ${s.in_stock ? 'ok' : 'low'}`}>{s.in_stock ? 'Stocked' : 'Low'}</span>
              <button
                type="button"
                className="del"
                aria-label={`Remove ${s.name}`}
                title="Remove"
                onClick={(e) => {
                  e.preventDefault()
                  onRemove(s)
                }}
              >
                ×
              </button>
            </label>
          )
        })}
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