import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Modal } from '../../components/ui'
import { dayDate, money } from '../../store'
import { addDays, addMonths, BILLING_METHODS, MEMBERSHIP_MONTHS, membershipStatus, nextBusinessDay, payouts, type BillingMethod } from '../data'
import { todayKey, useMerchant } from '../store'
import { MPage } from '../ui'

const day = (k: string) => dayDate(k + 'T12:00:00')

export default function MembershipPay() {
  const { membership, payMembership, setAutopay, txns } = useMerchant()
  const navigate = useNavigate()
  const today = todayKey()
  const status = membershipStatus(membership, today)
  // The fee can only come out of the next deposit if that deposit is big enough to cover it.
  const depositOn = nextBusinessDay(today)
  const nextDeposit = payouts(txns, today, membership.invoices).find((p) => p.depositOn === depositOn && !p.paid)
  const depositOk = !!nextDeposit && nextDeposit.net >= status.amount
  const [method, setMethod] = useState<BillingMethod>(membership.autopayMethod === 'deposit' && !depositOk ? 'bank' : membership.autopayMethod)
  const [autopay, setAutopayChoice] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const periodEnd = addDays(addMonths(status.dueOn, MEMBERSHIP_MONTHS), -1)

  if (status.state === 'active') {
    return (
      <MPage title="Pay membership" back="/merchant/membership" section="membership">
        <p className="empty">You're paid through {day(status.paidThrough)}. You can pay the next period starting {day(addDays(status.dueOn, -30))}.</p>
        <Link to="/merchant/membership" className="btn btn-quiet">Back to membership</Link>
      </MPage>
    )
  }

  const confirm = () => {
    const inv = payMembership(method)
    setAutopay(autopay, method)
    setConfirming(false)
    navigate(`/merchant/membership/invoices/${inv.id}?paid=1`, { replace: true })
  }

  return (
    <MPage title="Pay membership" back="/merchant/membership" section="membership">
      <section className="m-panel m-pay-summary">
        <p className="muted">Common Cents Collective membership</p>
        <p className="amount">{money(status.amount)}</p>
        <p>Covers {day(status.dueOn)} – {day(periodEnd)}</p>
      </section>

      <h2 className="label">Pay with</h2>
      <div className="list">
        {(Object.keys(BILLING_METHODS) as BillingMethod[]).map((k) => {
          const off = k === 'deposit' && !depositOk
          return (
            <label key={k} className={`row radio-row${off ? ' is-disabled' : ''}`}>
              <input type="radio" name="pay-method" checked={method === k} disabled={off} onChange={() => setMethod(k)} />
              <span className="row-main">
                <strong>{BILLING_METHODS[k].label}</strong>
                <small>
                  {k !== 'deposit' ? BILLING_METHODS[k].sub
                    : depositOk ? `Taken from your ${day(depositOn)} deposit (${money(nextDeposit!.net)} before the fee)`
                    : nextDeposit ? `Not available: your ${day(depositOn)} deposit (${money(nextDeposit.net)}) is less than ${money(status.amount)}`
                    : `Not available: no deposit scheduled for ${day(depositOn)} yet`}
                </small>
              </span>
            </label>
          )
        })}
      </div>

      <label className="toggle">
        <input type="checkbox" checked={autopay} onChange={(e) => setAutopayChoice(e.target.checked)} />
        <span className="toggle-track" />
        <span><strong>Pay automatically every {MEMBERSHIP_MONTHS} months</strong><small>Next time on {day(addMonths(status.dueOn, MEMBERSHIP_MONTHS))}, with this payment method. Turn off any time.{method === 'deposit' ? ' If that deposit is too small, we charge Checking •••• 3390 instead.' : ''}</small></span>
      </label>

      <button className="btn btn-primary btn-block" onClick={() => setConfirming(true)}>Review payment</button>

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Confirm membership payment">
        <dl className="facts">
          <div><dt>To</dt><dd>Common Cents Collective</dd></div>
          <div><dt>Amount</dt><dd>{money(status.amount)}</dd></div>
          <div><dt>Covers</dt><dd>{day(status.dueOn)} – {day(periodEnd)}</dd></div>
          <div><dt>Pay with</dt><dd>{method === 'deposit' ? `Your ${day(nextBusinessDay(today))} deposit` : BILLING_METHODS[method].label}</dd></div>
          <div><dt>Automatic payment</dt><dd>{autopay ? 'On' : 'Off'}</dd></div>
        </dl>
        <div className="sheet-actions">
          <button className="btn btn-quiet" onClick={() => setConfirming(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={confirm}>Pay {money(status.amount)}</button>
        </div>
      </Modal>
    </MPage>
  )
}
