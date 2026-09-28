import { Link } from 'react-router-dom'
import { Icon } from '../../components/ui'
import { money } from '../../store'
import { addDays, canAccess, dayKey, fromKey, membershipLabel, membershipStatus, payouts } from '../data'
import { activeBonus, dayLabel, greeting, todayKey, useMerchant } from '../store'
import { MPage, MTxnRow, SalesChart, Stat } from '../ui'

export default function Today() {
  const { me, role, txns, bonuses, membership } = useMerchant()
  const today = todayKey()
  const todays = txns.filter((t) => dayKey(t.date) === today)
  const payments = todays.filter((t) => t.kind === 'payment')
  const sales = todays.filter((t) => t.kind !== 'reward').reduce((s, t) => s + t.total, 0)
  const pointsGiven = todays.reduce((s, t) => s + t.pointsIssued, 0)
  const pointsRedeemed = todays.reduce((s, t) => s + (t.kind === 'refund' ? 0 : t.pointsApplied), 0)
  const next = payouts(txns, today, membership.invoices).filter((p) => !p.paid).at(-1)
  const dues = membershipStatus(membership, today)
  const showDues = canAccess(role, 'membership') && dues.state !== 'active'
  const bonusNow = activeBonus(bonuses)
  const upcoming = bonuses.find((b) => b.start > today)

  const days = Array.from({ length: 7 }, (_, i) => {
    const key = addDays(today, i - 6)
    const value = txns.filter((t) => dayKey(t.date) === key && t.kind !== 'reward').reduce((s, t) => s + t.total, 0)
    return { key, label: i === 6 ? 'Today' : fromKey(key).toLocaleDateString('en-US', { weekday: 'short' }), value, closed: i < 6 && fromKey(key).getDay() === 1 }
  })
  const week = days.reduce((s, d) => s + d.value, 0)

  return (
    <MPage title="Today" section="today" actions={<Link to="/merchant/counter" className="btn btn-primary"><Icon name="pay" size={18} /> Take a payment</Link>}>
      <p className="m-greeting">{greeting()}, {me.name.split(' ')[0]}. Here's {dayLabel(today)} so far.</p>

      {showDues && (
        <Link to="/merchant/membership" className={`m-dues-banner${dues.state === 'overdue' ? ' is-late' : ''}`}>
          <Icon name="card" size={22} />
          <span>
            <strong>Membership {dues.state === 'overdue' ? 'is past due' : `renews ${dayLabel(dues.dueOn)}`}</strong>
            <small>{money(dues.amount)} for the next 6 months · {membership.autopay ? 'Automatic payment is on' : membershipLabel(dues)}</small>
          </span>
          {!membership.autopay && <span className="m-dues-cta">Pay now</span>}
        </Link>
      )}

      {(bonusNow || upcoming) && (
        <Link to={`/merchant/bonus/${(bonusNow ?? upcoming)!.id}`} className="m-bonus-banner">
          <span className="pill pill-ready">{bonusNow ? 'On now' : 'Coming up'}</span>
          <span>
            <strong>{(bonusNow ?? upcoming)!.title}</strong>
            <small>{bonusNow ? `Members earn ${bonusNow.multiplier}× points today.` : `${dayLabel(upcoming!.start)} · members earn ${upcoming!.multiplier}× points`}</small>
          </span>
        </Link>
      )}

      <div className="m-stats">
        <Stat label="Sales today" value={money(sales)} sub={`${payments.length} payments`} />
        <Stat label="Points given" value={pointsGiven.toLocaleString()} sub="Earned by members here" tone="earned" />
        <Stat label="Points redeemed here" value={pointsRedeemed.toLocaleString()} sub={`${money(pointsRedeemed)} reimbursed to you`} />
        <Stat label="Next deposit" value={next ? money(next.net) : '$0.00'} sub={next ? `Arrives ${dayLabel(next.depositOn)}` : 'Nothing pending'} />
      </div>

      <section className="m-panel">
        <div className="section-head">
          <h2>Sales, last 7 days</h2>
          <span className="muted">{money(week)} total</span>
        </div>
        <SalesChart days={days} />
      </section>

      <section className="m-panel">
        <div className="section-head">
          <h2>Today's activity</h2>
          <Link to="/merchant/transactions">All transactions</Link>
        </div>
        <div className="list">
          {todays.slice(0, 6).map((t) => <MTxnRow key={t.id} txn={t} />)}
          {todays.length === 0 && <p className="empty">No payments yet today. They'll show up here as they come in.</p>}
        </div>
      </section>
    </MPage>
  )
}
