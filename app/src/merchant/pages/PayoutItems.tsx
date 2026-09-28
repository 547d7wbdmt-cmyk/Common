import { useParams } from 'react-router-dom'
import { money } from '../../store'
import { dayKey, depositFor, nextBusinessDay } from '../data'
import { dayLabel, timeOnly, useMerchant } from '../store'
import { MPage, useKindLabel } from '../ui'
import { Link } from 'react-router-dom'

/** Layer 3: every line that makes up one deposit. */
export default function PayoutItems() {
  const { day = '' } = useParams()
  const { txns, membership } = useMerchant()
  const kindLabel = useKindLabel()
  const items = txns.filter((t) => dayKey(t.date) === day)
  const deducted = membership.invoices.filter((i) => i.deductedOn && items.length && i.deductedOn === nextBusinessDay(day))
  const total = items.reduce((s, t) => s + depositFor(t), 0) - deducted.reduce((s, i) => s + i.amount, 0)

  return (
    <MPage title={`Sales from ${dayLabel(day)}`} back={`/merchant/payouts/${day}`} section="payouts">
      <div className="list m-table m-table-4">
        <div className="m-table-head" aria-hidden="true"><span>Time · type</span><span>Amount</span><span>Fee</span><span>To you</span></div>
        {items.map((t) => (
          <Link key={t.id} to={`/merchant/transactions/${t.id}`} className="row m-table-row">
            <span className="row-main"><strong>{kindLabel(t)}</strong><small>{timeOnly(t.date)} · {t.memberId}</small></span>
            <span><span className="sr-only">Amount </span>{t.total < 0 ? '−' + money(-t.total) : money(t.total)}</span>
            <span><span className="sr-only">Fee </span>{t.fee ? '−' + money(t.fee) : '—'}</span>
            <span><span className="sr-only">To you </span>{depositFor(t) < 0 ? '−' + money(-depositFor(t)) : money(depositFor(t))}</span>
          </Link>
        ))}
        {deducted.map((i) => (
          <Link key={i.id} to={`/merchant/membership/invoices/${i.id}`} className="row m-table-row">
            <span className="row-main"><strong>Membership fee</strong><small>{i.id}</small></span>
            <span /><span />
            <span>−{money(i.amount)}</span>
          </Link>
        ))}
        <div className="row m-table-row m-table-total">
          <span className="row-main"><strong>Deposit</strong></span><span /><span /><span>{money(total)}</span>
        </div>
      </div>
    </MPage>
  )
}
