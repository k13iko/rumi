import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { formatCents, formatCentsShort } from '../lib/money'
import type { Member } from '../types'

interface Props {
  members: Member[]
  net: Map<string, number> // user id -> cents, from netBalances
  meId: string
}

export function Roommates({ members, net, meId }: Props) {
  // Everyone except you
  const others = members.filter((m) => m.user_id !== meId)

  // Count how many people owe you, how many you owe, and how many are even
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
          // "?? 0" means: if there's no entry for this person, use 0
          const cents = net.get(m.user_id) ?? 0

          return (
            // Highlight the row if you owe this person
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

              {/* They owe you: Request button. You owe them: Settle button.
                  Neither does anything yet. We wire them up in Step 6. */}
              {cents > 0 && (
                <button type="button" className="mini">
                  Request
                </button>
              )}
              {cents < 0 && (
                <button type="button" className="mini settle">
                  Settle
                  <br />
                  {formatCentsShort(-cents)}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* The thin bar and its caption, only if there are roommates */}
      {others.length > 0 && (
        <>
          <div className="bars" aria-hidden="true">
            {/* Each segment's width is proportional to its count */}
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