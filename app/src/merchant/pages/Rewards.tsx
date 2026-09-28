import { Link } from 'react-router-dom'
import { Icon } from '../../components/ui'
import { money } from '../../store'
import { todayKey, dayLabel, useMerchant } from '../store'
import { MPage } from '../ui'

export default function Rewards() {
  const { rewards, txns, bonuses, saveReward } = useMerchant()
  const today = todayKey()
  const redemptions = (id: string) => txns.filter((t) => t.kind === 'reward' && t.rewardId === id).length

  return (
    <MPage title="Rewards" section="rewards"
      actions={<Link to="/merchant/rewards/new" className="btn btn-primary"><Icon name="plus" size={18} /> New reward</Link>}>
      <p className="muted">Members spend points from any member shop on your rewards. You're reimbursed $0.01 for every point redeemed here.</p>

      <div className="list">
        {rewards.map((r) => (
          <div key={r.id} className="row m-reward-row">
            <Link to={`/merchant/rewards/${r.id}`} className="row-main m-row-link">
              <strong>{r.title}</strong>
              <small>{r.points} points · {money(r.points)} reimbursed · {redemptions(r.id)} redeemed</small>
            </Link>
            <label className="toggle m-toggle-compact">
              <input type="checkbox" checked={r.active} onChange={(e) => saveReward({ ...r, active: e.target.checked })} aria-label={`${r.title} is ${r.active ? 'on' : 'paused'}`} />
              <span className="toggle-track" />
              <small>{r.active ? 'On' : 'Paused'}</small>
            </label>
          </div>
        ))}
      </div>

      <div className="section-head">
        <h2>Bonus events</h2>
        <Link to="/merchant/bonus/new">New bonus event</Link>
      </div>
      <p className="muted">Give members extra points for a day or a weekend. Good for slow days and launches.</p>
      <div className="list">
        {bonuses.map((b) => {
          const state = b.end < today ? 'Ended' : b.start <= today ? 'On now' : 'Scheduled'
          return (
            <Link key={b.id} to={`/merchant/bonus/${b.id}`} className="row">
              <span className="row-main">
                <strong>{b.title}</strong>
                <small>{dayLabel(b.start)}{b.end !== b.start ? ` – ${dayLabel(b.end)}` : ''} · {b.multiplier}× points</small>
              </span>
              <span className={`pill ${state === 'Ended' ? '' : 'pill-ready'}`}>{state}</span>
            </Link>
          )
        })}
        {bonuses.length === 0 && <p className="empty">No bonus events yet.</p>}
      </div>
    </MPage>
  )
}
