import { Link, useParams } from 'react-router-dom'
import { money } from '../../store'
import { FEE_RATE, POINTS_FUNDING, dayKey, payouts } from '../data'
import { dayLabel, todayKey, useMerchant } from '../store'
import { MPage } from '../ui'

export default function PayoutDetail() {
  const { day = '' } = useParams()
  const { txns, membership } = useMerchant()
  const p = payouts(txns, todayKey(), membership.invoices).find((x) => x.id === day)
  if (!p) {
    return <MPage title="Payout" back="/merchant/payouts" section="payouts"><p className="empty">No sales on that day.</p></MPage>
  }
  const dayTxns = txns.filter((t) => dayKey(t.date) === day)
  const pointsApplied = dayTxns.filter((t) => t.kind === 'payment').reduce((s, t) => s + t.pointsApplied, 0)
  const pointsIssued = dayTxns.reduce((s, t) => s + t.pointsIssued, 0)

  return (
    <MPage title={`Deposit ${dayLabel(p.depositOn)}`} back="/merchant/payouts" section="payouts">
      <section className="m-panel m-detail-head">
        <p className="amount">{money(p.net)}</p>
        <p className="muted">{p.paid ? 'Deposited' : 'Scheduled'} to Checking •••• 3390 · sales from {dayLabel(p.id)}</p>
      </section>

      <dl className="facts m-statement">
        <div><dt>Payments</dt><dd>{money(p.sales)}</dd></div>
        <div className="m-indent"><dt>of which paid with points (reimbursed)</dt><dd>{money(pointsApplied)}</dd></div>
        <div><dt>Rewards redeemed (reimbursed)</dt><dd>{money(p.rewards)}</dd></div>
        {p.refunds !== 0 && <div><dt>Refunds</dt><dd>−{money(-p.refunds)}</dd></div>}
        <div><dt>Fees ({FEE_RATE * 100}% of payments)</dt><dd>−{money(p.fees)}</dd></div>
        {p.membership > 0 && <div><dt><Link to="/merchant/membership">Membership fee</Link></dt><dd>−{money(p.membership)}</dd></div>}
        <div className="m-total"><dt>Deposit</dt><dd>{money(p.net)}</dd></div>
      </dl>

      <dl className="facts">
        <div><dt>Points members earned here</dt><dd className="earned">{pointsIssued.toLocaleString()} points</dd></div>
        <div><dt>Who pays for those points</dt><dd><span className="pill">{POINTS_FUNDING}</span></dd></div>
      </dl>
      <p className="muted">Nothing is taken out of your deposit for points members earn until the Collective settles how points are funded.</p>

      <Link to={`/merchant/payouts/${p.id}/items`} className="btn btn-quiet btn-block">See all {p.count} transactions</Link>
    </MPage>
  )
}
