import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Modal } from '../../components/ui'
import { dayDate, money } from '../../store'
import { addDays, addMonths, BILLING_METHODS, MEMBERSHIP_GRACE_DAYS, MEMBERSHIP_MONTHS, membershipLabel, membershipStatus, type BillingMethod } from '../data'
import { todayKey, useMerchant } from '../store'
import { MPage } from '../ui'

const day = (k: string) => dayDate(k + 'T12:00:00')

export default function Membership() {
  const { membership, setAutopay, profile } = useMerchant()
  const status = membershipStatus(membership, todayKey())
  const [picking, setPicking] = useState(false)
  const [method, setMethod] = useState<BillingMethod>(membership.autopayMethod)

  return (
    <MPage title="Membership" section="membership"
      actions={status.state !== 'active' && <Link to="/merchant/membership/pay" className="btn btn-primary">Pay {money(status.amount)}</Link>}>
      <section className={`m-member-plan m-plan-${status.state}`}>
        <div className="m-plan-top">
          <div>
            <p className="m-plan-name">Common Cents Collective membership</p>
            <p className="muted">{profile.name} · member since {day(membership.joined)}</p>
          </div>
          <span className={`pill ${status.state === 'active' ? 'pill-ok' : status.state === 'due' ? 'pill-ready' : 'pill-late'}`}>
            {membershipLabel(status)}
          </span>
        </div>
        <p className="m-plan-price"><strong>{money(status.amount)}</strong> every {MEMBERSHIP_MONTHS} months</p>
        <dl className="facts">
          <div><dt>Paid through</dt><dd>{day(status.paidThrough)}</dd></div>
          <div><dt>Next payment</dt><dd>{money(status.amount)} on {day(status.dueOn)}</dd></div>
          <div><dt>Covers</dt><dd>{day(status.dueOn)} – {day(addDays(addMonths(status.dueOn, MEMBERSHIP_MONTHS), -1))}</dd></div>
        </dl>
        {status.state === 'active' ? (
          <p className="muted">You can pay starting {day(addDays(status.dueOn, -30))}, 30 days before it's due.</p>
        ) : (
          <>
            {status.state === 'overdue' && <p className="warn m-left">Your membership is past due. Pay now to keep taking CommonWealth payments.</p>}
            {status.state === 'due' && !membership.autopay && <p className="muted">After {day(addDays(status.dueOn, MEMBERSHIP_GRACE_DAYS))} the membership shows as past due.</p>}
            <Link to="/merchant/membership/pay" className="btn btn-primary btn-block">Pay {money(status.amount)}</Link>
          </>
        )}
      </section>

      <section className="m-panel">
        <h2>Automatic payment</h2>
        <label className="toggle">
          <input type="checkbox" checked={membership.autopay} onChange={(e) => setAutopay(e.target.checked)} />
          <span className="toggle-track" />
          <span>
            <strong>{membership.autopay ? 'On' : 'Off'}</strong>
            <small>
              {membership.autopay
                ? `We'll pay ${money(status.amount)} with ${membership.autopayMethod === 'deposit' ? 'your next deposit' : BILLING_METHODS[membership.autopayMethod].label} on ${day(status.dueOn)}.`
                : 'Pay each renewal yourself. We remind you 30 days ahead.'}
            </small>
          </span>
        </label>
        <button className="row m-method-row" onClick={() => { setMethod(membership.autopayMethod); setPicking(true) }}>
          <Icon name={membership.autopayMethod === 'card' ? 'card' : 'bank'} size={20} />
          <span className="row-main"><strong>{BILLING_METHODS[membership.autopayMethod].label}</strong><small>Payment method for renewals</small></span>
          <span className="m-change">Change</span>
        </button>
      </section>

      <section className="m-panel">
        <h2>What membership includes</h2>
        <ul className="m-includes">
          <li><Icon name="check" size={18} /> Your shop listed in the CommonWealth app</li>
          <li><Icon name="check" size={18} /> Take CommonWealth payments, points and rewards at your counter</li>
          <li><Icon name="check" size={18} /> Run bonus events for members</li>
          <li><Icon name="check" size={18} /> This merchant portal for you and your staff</li>
        </ul>
        <p className="hint m-left">Separate from the 2% fee on payments, which comes out of each deposit.</p>
      </section>

      <section className="m-panel">
        <h2>Billing history</h2>
        <div className="list">
          {membership.invoices.map((inv) => (
            <Link key={inv.id} to={`/merchant/membership/invoices/${inv.id}`} className="row">
              <span className="row-main">
                <strong>{day(inv.periodStart)} – {day(addDays(inv.periodEnd, -1))}</strong>
                <small>Paid {dayDate(inv.paidAt)} · {inv.method === 'deposit' ? 'From deposit' : BILLING_METHODS[inv.method].label}</small>
              </span>
              <span className="pill">Paid</span>
              <span className="row-end">{money(inv.amount)}</span>
            </Link>
          ))}
        </div>
      </section>

      <Modal open={picking} onClose={() => setPicking(false)} title="Payment method for renewals">
        <div className="list">
          {(Object.keys(BILLING_METHODS) as BillingMethod[]).map((k) => (
            <label key={k} className="row radio-row">
              <input type="radio" name="autopay-method" checked={method === k} onChange={() => setMethod(k)} />
              <span className="row-main"><strong>{BILLING_METHODS[k].label}</strong><small>{BILLING_METHODS[k].sub}</small></span>
            </label>
          ))}
        </div>
        <div className="sheet-actions">
          <button className="btn btn-quiet" onClick={() => setPicking(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { setAutopay(membership.autopay, method); setPicking(false) }}>Save</button>
        </div>
      </Modal>
    </MPage>
  )
}
