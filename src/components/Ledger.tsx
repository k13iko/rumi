import { Avatar } from './Avatar'
import { Icon, type IconName } from './Icon'
import { ledgerShare } from '../lib/balances'
import { formatCents } from '../lib/money'
import type { Category, Expense, Member } from '../types'

// Which icon goes with which category
const CATEGORY_ICON: Record<Category, IconName> = {
  groceries: 'basket',
  utilities: 'bolt',
  household: 'box',
  dining: 'cup',
  other: 'doc',
}

// "2026-10-04" -> "Oct 4"
function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface Props {
  expenses: Expense[]
  members: Member[]
  meId: string
}

export function Ledger({ expenses, members, meId }: Props) {
  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>Recent Ledger Activity</h2>
          <div className="sub">Real-time domestic entries with automatic multi-way division</div>
        </div>
      </div>

      {/* No expenses: show a message. Otherwise: show the table. */}
      {expenses.length === 0 ? (
        <div className="empty">No expenses yet. Use Log Expense to add the first one.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date &amp; Description</th>
                <th>Paid by</th>
                <th>Split method</th>
                <th>Your share</th>
              </tr>
            </thead>
            <tbody>
              {/* One table row per expense */}
              {expenses.map((e) => {
                const share = ledgerShare(e, meId)
                const payerName = members.find((m) => m.user_id === e.paid_by)?.display_name ?? 'Roommate'

                return (
                  <tr key={e.id}>
                    <td>
                      <div className="desc">
                        <span className="ico">
                          <Icon name={CATEGORY_ICON[e.category]} />
                        </span>
                        <div>
                          <b>{e.description}</b>
                          <small>
                            {shortDate(e.expense_date)} &bull; Total {formatCents(e.total_cents)}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="payer">
                        <Avatar id={e.paid_by} name={payerName} small />
                        {e.paid_by === meId ? 'You' : payerName}
                      </div>
                    </td>

                    <td>
                      <span className="split">Split {e.expense_splits.length} ways</span>
                    </td>

                    {/* The last column depends on the kind of share */}
                    <td className="num">
                      {share.kind === 'owed' && (
                        <>
                          <span className="pos">+{formatCents(share.cents)}</span>
                          <span className="note">owed to you</span>
                        </>
                      )}
                      {share.kind === 'owe' && (
                        <>
                          <span className="neg">&minus;{formatCents(share.cents)}</span>
                          <span className="note">your share</span>
                        </>
                      )}
                      {share.kind === 'settled' && (
                        <>
                          <span className="settled">
                            <Icon name="check" size={14} />
                            Settled
                          </span>
                          <span className="note">{formatCents(share.cents)} cleared</span>
                        </>
                      )}
                      {share.kind === 'none' && <span className="note">Not in this split</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="foot">
        <span>Showing {expenses.length} recent ledger items</span>
        <button type="button" className="link">
          View full ledger and receipts <Icon name="arrow" size={14} />
        </button>
      </div>
    </section>
  )
}