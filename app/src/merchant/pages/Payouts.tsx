import { Link } from 'react-router-dom'
import { money } from '../../store'
import { FEE_RATE, payouts } from '../data'
import { dayLabel, todayKey, useMerchant } from '../store'
import { MPage, Stat } from '../ui'

export default function Payouts() {
  const { txns, membership } = useMerchant()
  const list = payouts(txns, todayKey(), membership.invoices)
  const pending = list.filter((p) => !p.paid)
  const last30 = list.filter((p) => p.paid).slice(0, 26)

  return (
    <MPage title="Payouts" section="payouts">
      <div className="m-stats m-stats-2">
        <Stat label="On the way" value={money(pending.reduce((s, p) => s + p.net, 0))} sub={pending.length ? `Next: ${dayLabel(pending.at(-1)!.depositOn)}` : 'Nothing pending'} />
        <Stat label="Deposited, last 4 weeks" value={money(last30.reduce((s, p) => s + p.net, 0))} sub="To Checking •••• 3390" />
      </div>
      <p className="muted">
        Each business day's sales are deposited the next business day, minus a {FEE_RATE * 100}% fee on payments. Points members spend at your shop are reimbursed at $0.01 each.
      </p>
      <div className="list">
        {list.map((p) => (
          <Link key={p.id} to={`/merchant/payouts/${p.id}`} className="row">
            <span className="row-main">
              <strong>{dayLabel(p.depositOn)}</strong>
              <small>Sales from {dayLabel(p.id)} · {p.count} transactions</small>
            </span>
            <span className={`pill ${p.paid ? '' : 'pill-ready'}`}>{p.paid ? 'Deposited' : 'Scheduled'}</span>
            <span className="row-end">{money(p.net)}</span>
          </Link>
        ))}
      </div>
    </MPage>
  )
}
