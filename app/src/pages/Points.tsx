import { Page } from '../components/ui'
import { POINTS_EXPIRE_MONTHS } from '../data'
import { dayDate, expiresOn, isExpiringSoon, pointsValue, useWallet } from '../store'

export default function Points() {
  const { points, lots } = useWallet()

  return (
    <Page title="Your points" back="/wallet">
      <div className="points-banner">
        <span>You have</span>
        <strong>{points.toLocaleString()} points</strong>
        <small>Worth {pointsValue(points)} at any member shop</small>
      </div>

      <p className="muted">
        Points expire {POINTS_EXPIRE_MONTHS} months after you earn them. When you use points, your oldest ones go first.
      </p>

      <h2 className="label">When your points expire</h2>
      <div className="list">
        {lots.map((l) => {
          const expires = expiresOn(l.earned)
          const soon = isExpiringSoon(expires)
          return (
            <div key={l.earned} className="row">
              <span className="row-main">
                <strong>{l.points.toLocaleString()} points</strong>
                <small>Earned {dayDate(l.earned)}</small>
              </span>
              <span className={`pill ${soon ? 'pill-ready' : ''}`}>
                {soon ? 'Expires ' : ''}{dayDate(expires)}
              </span>
            </div>
          )
        })}
        {lots.length === 0 && <p className="empty">No points yet. Pay at any member shop to start earning.</p>}
      </div>
    </Page>
  )
}
