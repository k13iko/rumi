import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { CATEGORIES, type Category, type Member, type NewExpense } from '../types'

// Today's date as "YYYY-MM-DD", in the user's own time zone
function today(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

interface Props {
  householdId: string
  members: Member[]
  meId: string
  onClose: () => void // called to close the popup
  onSubmit: (expense: NewExpense) => void // called with the finished form
}

export function LogExpenseModal({ householdId, members, meId, onClose, onSubmit }: Props) {
  // "State": values React remembers. Each has a getter and a setter.
  // Typing in a field calls the setter, and React redraws the form.
  const [description, setDescription] = useState('')
  // The amount in cents. 6000 means $60.00.
  const [cents, setCents] = useState(0)
  const [category, setCategory] = useState<Category>('groceries')
  const [paidBy, setPaidBy] = useState(meId)
  const [date, setDate] = useState(today) // a function: runs once at the start
  // A Set is a list with no duplicates. It starts with everyone ticked.
  const [splitWith, setSplitWith] = useState<Set<string>>(() => new Set(members.map((m) => m.user_id)))
  const [error, setError] = useState('')

  // Close the popup when Escape is pressed.
  // The function returned at the end removes the listener when the popup closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // null until something above $0 has been typed
  const totalCents = cents > 0 ? cents : null

  // The text shown in the box, e.g. 6000 -> "60.00"
  const amountText = (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const perPerson = totalCents && splitWith.size > 0 ? totalCents / splitWith.size / 100 : null

  // Runs on every keystroke in the Total box
  function handleAmount(e: ChangeEvent<HTMLInputElement>) {
    // Keep only the digits: "0.606" -> "0606"
    const digits = e.target.value.replace(/\D/g, '')
    // Read them as cents. slice(0, 9) stops absurdly long numbers.
    // An empty string becomes 0.
    setCents(Number(digits.slice(0, 9)))
  }

  // Tick or untick a person
  function togglePerson(id: string) {
    setSplitWith((prev) => {
      const next = new Set(prev) // copy, never change the old one
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Runs when the form is submitted
  function submit(e: FormEvent) {
    e.preventDefault() // stop the browser reloading the page
    if (!description.trim()) return setError('Add a short description.')
    if (totalCents === null) return setError('Enter an amount above $0.')
    if (splitWith.size === 0) return setError('Choose at least one person to split with.')

    onSubmit({
      householdId,
      description: description.trim(),
      category,
      totalCents,
      paidBy,
      date,
      splitWith: [...splitWith], // turn the Set into a list
    })
  }

  return (
    // Clicking the dark background (not the popup itself) closes it
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} aria-labelledby="log-title">
        <h2 id="log-title">Log expense</h2>

        <div className="field">
          <label htmlFor="exp-desc">What was it for?</label>
          <input id="exp-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Costco paper goods" maxLength={120} autoFocus />
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="exp-amount">Total ($)</label>
            <input id="exp-amount" type="text" inputMode="numeric" value={amountText} onChange={handleAmount} placeholder="0.00" />
          </div>
          <div className="field">
            <label htmlFor="exp-date">Date</label>
            <input id="exp-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="exp-cat">Category</label>
            <select id="exp-cat" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {/* One option per category in our list */}
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="exp-payer">Paid by</label>
            <select id="exp-payer" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.user_id === meId ? 'You' : m.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="field people">
          <legend>Split equally between</legend>
          {members.map((m) => (
            <label key={m.user_id} className="check">
              <input type="checkbox" checked={splitWith.has(m.user_id)} onChange={() => togglePerson(m.user_id)} />
              {m.user_id === meId ? 'You' : m.display_name}
            </label>
          ))}
          {/* Live preview of each person's share */}
          {perPerson !== null && <small className="hint">About ${perPerson.toFixed(2)} each</small>}
        </fieldset>

        <div className="err" role="alert">
          {error}
        </div>

        <div className="btns">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" type="submit">
            Add to ledger
          </button>
        </div>
      </form>
    </div>
  )
}