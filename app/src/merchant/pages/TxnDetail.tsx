import { Link, useParams } from 'react-router-dom'
import { Icon } from '../../components/ui'
import { money, shortDate } from '../../store'
import { dayKey, depositFor, nextBusinessDay } from '../data'
import { dayLabel, refundedAmount, useMerchant } from '../store'
import { MPage, useKindLabel } from '../ui'

export default function TxnDetail() {
  const { txnId } = useParams()
  const { txns, role } = useMerchant()
  const kindLabel = useKindLabel()
  const txn = txns.find((t) => t.id === txnId)
  if (!txn) {
    return <MPage title="Not found" back="/merchant/transactions" section="transactions"><p className="empty">We couldn't find that transaction.</p></MPage>
  }
  const refunded = txn.kind === 'payment' ? refundedAmount(txns, txn.id) : 0
  const refunds = txns.filter((t) => t.refundOf === txn.id)
  const original = txn.refundOf ? txns.find((t) => t.id === txn.refundOf) : undefined
  const canRefund = txn.kind === 'payment' && refunded < txn.total && role !== 'cashier'

  return (
    <MPage title={kindLabel(txn)} back="/merchant/transactions" section="transactions"
      actions={canRefund && <Link to={`/merchant/transactions/${txn.id}/refund`} className="btn btn-quiet"><Icon name="refund" size={18} /> Refund</Link>}>
      <section className="m-panel m-detail-head">
        <p className="amount">{txn.kind === 'refund' ? '−' + money(-txn.total) : money(txn.total)}</p>
        <p className="muted">{shortDate(txn.date)} · {txn.staff}</p>
        {refunded > 0 && <span className="pill">{refunded >= txn.total ? 'Refunded' : `${money(refunded)} refunded`}</span>}
      </section>

      <dl className="facts">
        <div><dt>Member</dt><dd><Link to={`/merchant/members/${encodeURIComponent(txn.memberId)}`}>{txn.memberId}</Link></dd></div>
        <div><dt>Reference</dt><dd>{txn.id}</dd></div>
        {txn.kind === 'payment' && (
          <>
            <div><dt>How they paid</dt><dd>{txn.source === 'member' ? 'Scanned your shop code' : 'Charged at the counter'}</dd></div>
            <div><dt>From their balance</dt><dd>{money(txn.total - txn.pointsApplied)}</dd></div>
            {txn.pointsApplied > 0 && <div><dt>With points</dt><dd>{txn.pointsApplied} points · {money(txn.pointsApplied)} reimbursed</dd></div>}
            <div><dt>Points they earned</dt><dd className="earned">+{txn.pointsIssued}{txn.multiplier ? ` (${txn.multiplier}× bonus)` : ''}</dd></div>
            <div><dt>Fee (2%)</dt><dd>−{money(txn.fee)}</dd></div>
          </>
        )}
        {txn.kind === 'reward' && (
          <>
            <div><dt>Points redeemed</dt><dd>{txn.pointsApplied} points</dd></div>
            <div><dt>Reimbursed to you</dt><dd>{money(txn.total)}</dd></div>
            {txn.code && <div><dt>Code</dt><dd className="code-inline">{txn.code}</dd></div>}
          </>
        )}
        {txn.kind === 'refund' && (
          <>
            {original && <div><dt>Refund of</dt><dd><Link to={`/merchant/transactions/${original.id}`}>{original.id} · {money(original.total)}</Link></dd></div>}
            <div><dt>Points taken back</dt><dd>{-txn.pointsIssued} points</dd></div>
          </>
        )}
        <div><dt>In deposit</dt><dd><Link to={`/merchant/payouts/${dayKey(txn.date)}`}>{depositFor(txn) < 0 ? '−' : ''}{money(Math.abs(depositFor(txn)))} · {dayLabel(nextBusinessDay(dayKey(txn.date)))}</Link></dd></div>
      </dl>

      {refunds.length > 0 && (
        <section>
          <h2 className="label">Refunds</h2>
          <div className="list">
            {refunds.map((r) => (
              <Link key={r.id} to={`/merchant/transactions/${r.id}`} className="row">
                <span className="row-main"><strong>{money(-r.total)} refunded</strong><small>{shortDate(r.date)} · {r.staff}</small></span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </MPage>
  )
}
