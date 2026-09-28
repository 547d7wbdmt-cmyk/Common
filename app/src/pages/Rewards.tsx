import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page, ShopBadge } from '../components/ui'
import { REWARDS, shopById } from '../data'
import { pointsValue, useWallet } from '../store'

export default function Rewards() {
  const { points } = useWallet()
  const [affordableOnly, setAffordableOnly] = useState(false)
  const list = REWARDS.filter((r) => !affordableOnly || r.points <= points).sort((a, b) => a.points - b.points)

  return (
    <Page>
      <h1 className="page-title">Rewards</h1>
      <div className="points-banner">
        <span>You have</span>
        <strong>{points.toLocaleString()} points</strong>
        <small>Worth {pointsValue(points)} at any member shop</small>
      </div>
      <div className="chips">
        <button className={`chip${!affordableOnly ? ' active' : ''}`} onClick={() => setAffordableOnly(false)}>All rewards</button>
        <button className={`chip${affordableOnly ? ' active' : ''}`} onClick={() => setAffordableOnly(true)}>I can redeem now</button>
      </div>
      <div className="list">
        {list.map((r) => {
          const shop = shopById(r.shopId)!
          return (
            <Link key={r.id} to={`/rewards/${r.id}`} className="row">
              <ShopBadge shop={shop} size={40} />
              <span className="row-main">
                <strong>{r.title}</strong>
                <small>{shop.name}</small>
              </span>
              <span className={`pill ${points >= r.points ? 'pill-ready' : ''}`}>{r.points} points</span>
            </Link>
          )
        })}
        {list.length === 0 && <p className="empty">Earn more points at any member shop to unlock these rewards.</p>}
      </div>
    </Page>
  )
}
