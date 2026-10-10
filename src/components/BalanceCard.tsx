import { Icon } from './Icon'
import { formatCents } from '../lib/money'

// The numbers this card needs, all in cents
interface Props {
  netCents: number // positive: others owe you. negative: you owe others.
  monthTotalCents: number // everything the household spent this month
  yourShareCents: number // your part of that
}

export function BalanceCard({ netCents, monthTotalCents, yourShareCents }: Props) {
  // "\u2212" is a proper minus sign. Zero gets no sign at all.
  const sign = netCents > 0 ? '+' : netCents < 0 ? '\u2212' : ''
  const caption = netCents > 0 ? 'Net owed to you' : netCents < 0 ? 'Net you owe' : 'All settled up'

  return (
    <section className="card">
      <div className="balance">
        <div>
          <div className="label">Collective balance</div>

          {/* Show the amount in red-orange if you owe money */}
          <div className="big" style={netCents < 0 ? { color: 'var(--owe)' } : undefined}>
            {sign}
            {formatCents(Math.abs(netCents))} <small>{caption}</small>
          </div>

          <div className="meta">
            Household this month: <b>{formatCents(monthTotalCents)}</b> &nbsp;&bull;&nbsp; Your share:{' '}
            <b>{formatCents(yourShareCents)}</b>
          </div>
        </div>

        {/* Doesn't do anything yet. We wire it up in Step 6. */}
        <button type="button" className="chip-btn">
          <Icon name="play" size={14} />
          1-Click Summary
        </button>
      </div>
    </section>
  )
}