import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page, ShopBadge } from '../components/ui'
import { REWARDS, shopById } from '../data'
import { useMember } from '../store'

export default function Rewards() {
  const { points } = useMember()
  const [onlyReady, setOnlyReady] = useState(false)
  const rewards = [...REWARDS].filter((r) => !onlyReady || r.points <= points).sort((a, b) => a.points - b.points)

  return (
    <Page>
      <div>
        <h1 className="page-title">Rewards</h1>
        <p className="muted">You have <strong>{points.toLocaleString()} Kin Points</strong> to use at any member business.</p>
      </div>
      <div className="chips">
        <button className={`chip${!onlyReady ? ' active' : ''}`} onClick={() => setOnlyReady(false)}>All rewards</button>
        <button className={`chip${onlyReady ? ' active' : ''}`} onClick={() => setOnlyReady(true)}>Ready to use</button>
      </div>
      <div className="list">
        {rewards.map((r) => {
          const shop = shopById(r.shopId)!
          return (
            <Link key={r.id} to={`/rewards/${r.id}`} className="row">
              <ShopBadge shop={shop} size={40} />
              <span className="row-main">
                <strong>{r.title}</strong>
                <small>{shop.name}</small>
              </span>
              <span className={`pill ${points >= r.points ? 'pill-ok' : ''}`}>{r.points.toLocaleString()} pts</span>
            </Link>
          )
        })}
        {rewards.length === 0 && <p className="empty">Keep shopping the block. Rewards you can use will show up here.</p>}
      </div>
    </Page>
  )
}
