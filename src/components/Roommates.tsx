import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { oldestOpenDate } from '../lib/balances'
import { formatCents, formatCentsShort } from '../lib/money'
import type { Expense, Member } from '../types'

// After this many days unpaid, "Request" becomes "Remind"
const REMIND_AFTER_DAYS = 7

// How many whole days ago was "2026-10-04"?
function daysSince(iso: string): number {
  const then = new Date(`${iso}T00:00:00`).getTime()
  return Math.floor((Date.now() - then) / 86_400_000)
}

interface Props {
  members: Member[]
  expenses: Expense[]
  net: Map<string, number>
  meId: string
  onSettle: (member: Member) => void
  onRequest: (member: Member, cents: number, isReminder: boolean) => void
}

export function Roommates({ members, expenses, net, meId, onSettle, onRequest }: Props) {
  const others = members.filter((m) => m.user_id !== meId)

  const toReceive = others.filter((m) => (net.get(m.user_id) ?? 0) > 0).length
  const toPay = others.filter((m) => (net.get(m.user_id) ?? 0) < 0).length
  const clear = others.length - toReceive - toPay

  return (
    <section className="card">
      <div className="rm-head">
        <div>
          <h2>Roommate Balances</h2>
          <div className="sub">Individual standings in this household</div>
        </div>
        <Icon name="swap" />
      </div>

      <div className="rm-list">
        {others.length === 0 && <div className="empty">Nobody else has joined yet.</div>}

        {others.map((m) => {
          const cents = net.get(m.user_id) ?? 0

          const oldest = oldestOpenDate(expenses, meId, m.user_id)
          const isReminder = cents > 0 && oldest !== null && daysSince(oldest) >= REMIND_AFTER_DAYS

          return (
            <div key={m.user_id} className={`rm${cents < 0 ? ' me' : ''}`}>
              <Avatar id={m.user_id} name={m.display_name} />

              <div className="who">
                <b>{m.display_name}</b>
                {cents > 0 && (
                  <small>
                    owes you<span className="in">{formatCents(cents)}</span>
                  </small>
                )}
                {cents < 0 && (
                  <small>
                    you owe<span className="out">{formatCents(-cents)}</span>
                  </small>
                )}
                {cents === 0 && <small>settled up</small>}
              </div>

              {/* They owe you: Request/Remind, plus a ✓ to mark it received */}
              {cents > 0 && (
                <>
                  <button type="button" className="mini" onClick={() => onRequest(m, cents, isReminder)}>
                    {isReminder ? 'Remind' : 'Request'}
                  </button>
                  <button
                    type="button"
                    className="mini icon"
                    aria-label={`Mark ${m.display_name} as paid`}
                    title="Mark as received"
                    onClick={() => onSettle(m)}
                  >
                    <Icon name="check" size={14} />
                  </button>
                </>
              )}

              {/* You owe them: green Settle button showing the amount */}
              {cents < 0 && (
                <button type="button" className="mini settle" onClick={() => onSettle(m)}>
                  Settle
                  <br />
                  {formatCentsShort(-cents)}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {others.length > 0 && (
        <>
          <div className="bars" aria-hidden="true">
            {toReceive > 0 && <i style={{ flex: toReceive }} />}
            {toPay > 0 && <i className="pay" style={{ flex: toPay }} />}
            {clear > 0 && <i className="clear" style={{ flex: clear }} />}
          </div>
          <div className="bars-cap">
            <span>
              {others.length} {others.length === 1 ? 'roommate' : 'roommates'} in this household
            </span>
            <span>
              {toReceive} to receive &bull; {toPay} to pay
            </span>
          </div>
        </>
      )}
    </section>
  )
}