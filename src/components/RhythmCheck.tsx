import { Icon } from './Icon'

interface Props {
  openBalances: number // how many roommates you still have a balance with
  lowSupplies: number // how many supplies are marked Low
}

export function RhythmCheck({ openBalances, lowSupplies }: Props) {
  // Calm means: no open balances and nothing running low
  const calm = openBalances === 0 && lowSupplies === 0

  // Build a phrase for each problem, e.g. "4 open balances"
  const parts: string[] = []
  if (openBalances > 0) parts.push(`${openBalances} open ${openBalances === 1 ? 'balance' : 'balances'}`)
  if (lowSupplies > 0) parts.push(`${lowSupplies} ${lowSupplies === 1 ? 'item' : 'items'} running low`)

  return (
    <section className="rhythm">
      <span className="ico">
        <Icon name="leaf" />
      </span>
      <div>
        <b>Household Rhythm Check</b>
        {/* join(' and ') puts "and" between the phrases */}
        <p>{calm ? 'Balances are clear and the shelves are stocked. Everything is running smoothly.' : `Worth a look: ${parts.join(' and ')}.`}</p>
      </div>
      <span className="pill">
        {calm ? (
          <>
            Optimal
            <br />
            Harmony
          </>
        ) : (
          <>
            Needs
            <br />
            Attention
          </>
        )}
      </span>
    </section>
  )
}