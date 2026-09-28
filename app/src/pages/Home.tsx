import { Link } from 'react-router-dom'
import { Icon, Page, ShopBadge, TxnRow } from '../components/ui'
import { POINTS_PER_DOLLAR, REWARDS, SHOPS, shopById } from '../data'
import { money, pointsValue, useWallet } from '../store'

export default function Home() {
  const { cents, points, txns } = useWallet()
  const featured = REWARDS.filter((r) => r.featured)

  return (
    <Page>
      <section className="balance-card">
        <p className="eyebrow">Available balance</p>
        <p className="balance">{money(cents)}</p>
        <p className="points-line">
          <strong>{points.toLocaleString()} pts</strong> · worth {pointsValue(points)} at any member shop
        </p>
        <div className="balance-actions">
          <Link to="/pay" className="btn btn-light"><Icon name="pay" size={18} /> Pay</Link>
          <Link to="/wallet/add" className="btn btn-ghost-light"><Icon name="plus" size={18} /> Add funds</Link>
        </div>
      </section>

      <p className="hint">Earn {POINTS_PER_DOLLAR} pts for every $1 you pay at {SHOPS.length} local shops.</p>

      <div className="section-head">
        <h2>Featured rewards</h2>
        <Link to="/rewards">See all</Link>
      </div>
      <div className="scroller">
        {featured.map((r) => {
          const shop = shopById(r.shopId)!
          return (
            <Link key={r.id} to={`/rewards/${r.id}`} className="reward-card">
              <ShopBadge shop={shop} size={36} />
              <strong>{r.title}</strong>
              <small>{shop.name}</small>
              <span className={`pill ${points >= r.points ? 'pill-ok' : ''}`}>{r.points} pts</span>
            </Link>
          )
        })}
      </div>

      <div className="section-head">
        <h2>Nearby shops</h2>
        <Link to="/shops">See all</Link>
      </div>
      <div className="grid">
        {SHOPS.slice(0, 4).map((s) => (
          <Link key={s.id} to={`/shops/${s.id}`} className="shop-tile">
            <ShopBadge shop={s} />
            <strong>{s.name}</strong>
            <small>{s.category} · {s.distance}</small>
          </Link>
        ))}
      </div>

      <div className="section-head">
        <h2>Recent activity</h2>
        <Link to="/wallet/activity">See all</Link>
      </div>
      <div className="list">
        {txns.slice(0, 3).map((t) => <TxnRow key={t.id} txn={t} />)}
      </div>
    </Page>
  )
}
