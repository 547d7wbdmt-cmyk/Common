import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Icon } from '../../components/ui'
import { dayDate, money } from '../../store'
import { addDays, BILLING_METHODS, dayKey, payouts } from '../data'
import { todayKey, useMerchant } from '../store'
import { CollectiveLogo, MPage } from '../ui'

const day = (k: string) => dayDate(k + 'T12:00:00')

/** Receipt for one membership period. The Collective is the issuer, so its lockup leads. */
export default function MembershipInvoice() {
  const { invoiceId } = useParams()
  const [params] = useSearchParams()
  const { membership, profile, txns } = useMerchant()
  const inv = membership.invoices.find((i) => i.id === invoiceId)
  if (!inv) {
    return <MPage title="Receipt" back="/merchant/membership" section="membership"><p className="empty">We couldn't find that receipt.</p></MPage>
  }
  const deposit = inv.deductedOn && payouts(txns, todayKey(), membership.invoices).find((p) => p.depositOn === inv.deductedOn)

  return (
    <MPage title="Receipt" back="/merchant/membership" section="membership">
      {params.has('paid') && (
        <div className="success">
          <span className="success-icon"><Icon name="check" size={28} /></span>
          <h2>Membership paid</h2>
          <p>{profile.name} is a member through {day(addDays(inv.periodEnd, -1))}. Thank you for keeping your neighborhood's money local.</p>
        </div>
      )}

      <section className="m-receipt">
        <div className="m-receipt-head">
          <CollectiveLogo />
          <span className="pill pill-ok">Paid</span>
        </div>
        <p className="amount">{money(inv.amount)}</p>
        <dl className="facts">
          <div><dt>Receipt</dt><dd className="code-inline">{inv.id}</dd></div>
          <div><dt>For</dt><dd>Membership, {day(inv.periodStart)} – {day(addDays(inv.periodEnd, -1))}</dd></div>
          <div><dt>Billed to</dt><dd>{profile.name}, {profile.address}</dd></div>
          <div><dt>Paid on</dt><dd>{dayDate(inv.paidAt)}</dd></div>
          <div><dt>Paid with</dt><dd>{inv.method === 'deposit' ? 'Deducted from a deposit' : BILLING_METHODS[inv.method].label}</dd></div>
          {inv.deductedOn && (
            <div><dt>Deposit</dt><dd>{deposit ? <Link to={`/merchant/payouts/${deposit.id}`}>{day(inv.deductedOn)}</Link> : day(inv.deductedOn)}</dd></div>
          )}
        </dl>
        <p className="hint m-left">Common Cents Collective operates the CommonWealth rewards program. Paid {dayKey(inv.paidAt) < inv.periodStart ? 'ahead of' : 'for'} the period shown.</p>
      </section>

      <Link to="/merchant/membership" className="btn btn-quiet btn-block">Back to membership</Link>
    </MPage>
  )
}
