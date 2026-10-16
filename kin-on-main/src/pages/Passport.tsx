import { Link } from 'react-router-dom'
import { Icon, Page, ShopBadge } from '../components/ui'
import { PASSPORT_BONUS, PASSPORT_GOAL, SHOPS } from '../data'
import { monthKey, monthName, passportStamps, useMember } from '../store'

/** Block Passport: visit five different member businesses in a month for bonus Kin Points. */
export default function Passport() {
  const { activity, passportsClaimed, claimPassport } = useMember()
  const stamped = passportStamps(activity)
  const done = stamped.length >= PASSPORT_GOAL
  const claimed = passportsClaimed.includes(monthKey())
  const month = monthName()

  return (
    <Page title="Block Passport" back="/">
      <section className="passport-hero">
        <p className="eyebrow">{month} challenge</p>
        <h2>Visit {PASSPORT_GOAL} Kin Shops</h2>
        <p>Get a stamp at each new spot this month. Fill the passport for <strong>+{PASSPORT_BONUS} bonus Kin Points</strong>.</p>
        <div className="stamps big">
          {Array.from({ length: PASSPORT_GOAL }, (_, i) => <span key={i} className={`stamp${i < stamped.length ? ' on' : ''}`} />)}
        </div>
        <p className="eyebrow">{Math.min(stamped.length, PASSPORT_GOAL)} of {PASSPORT_GOAL} stamps</p>
      </section>

      {claimed ? (
        <p className="done-note"><Icon name="check" /> Passport complete. Bonus added. See you next month!</p>
      ) : (
        <button className="btn btn-primary btn-block" disabled={!done} onClick={claimPassport}>
          {done ? `Add my +${PASSPORT_BONUS} Kin Points` : `${PASSPORT_GOAL - stamped.length} more to go`}
        </button>
      )}

      <div className="list">
        {SHOPS.map((s) => (
          <Link key={s.id} to={`/block/${s.id}`} className="row">
            <ShopBadge shop={s} size={40} />
            <span className="row-main">
              <strong>{s.name}</strong>
              <small>{s.category} · {s.distance}</small>
            </span>
            {stamped.includes(s.id) ? <span className="pill pill-ok">Stamped</span> : <Icon name="chevron" size={18} />}
          </Link>
        ))}
      </div>
      <p className="hint">No chance or purchase-based drawing involved. <Link to="/terms#passport">Official rules</Link></p>
    </Page>
  )
}
