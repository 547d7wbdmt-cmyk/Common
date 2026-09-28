import { Link } from 'react-router-dom'
import { Icon, Page, ShopBadge, TxnRow } from '../components/ui'
import { POINTS_PER_DOLLAR, REWARDS, SHOPS, shopById } from '../data'
import { dayDate, isExpiringSoon, money, pointsValue, useWallet } from '../store'

export default function Home() {
  const { cents, points, txns, nextExpiry } = useWallet()
  const expiringSoon = nextExpiry && isExpiringSoon(nextExpiry.date)
  const featured = REWARDS.filter((r) => r.featured)

  return (
    <Page>
      <h1 className="headline">Spend here. Earn everywhere.</h1>

      <section className="balance-card">
        <div className="awning" aria-hidden="true" />
        <p className="eyebrow">Available balance</p>
        <p className="balance">{money(cents)}</p>
        <p className="points-line">
          <strong className="earned">{points.toLocaleString()} points</strong> · worth {pointsValue(points)} at any member shop
        </p>
        {expiringSoon && (
          <Link to="/wallet/points" className="expiry-note">
            <span className="pill pill-ready">Expiring soon</span>
            {nextExpiry.points} points expire {dayDate(nextExpiry.date)}
          </Link>
        )}
        <div className="balance-actions">
          <Link to="/pay" className="btn btn-primary"><Icon name="pay" size={18} /> Pay</Link>
          <Link to="/wallet/add" className="btn btn-secondary"><Icon name="plus" size={18} /> Add funds</Link>
        </div>
      </section>

      <p className="hint">Earn {POINTS_PER_DOLLAR} points for every $1 at our {SHOPS.length} member shops. Use them at any of them.</p>

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
              <span className={`pill ${points >= r.points ? 'pill-ready' : ''}`}>{r.points} points</span>
            </Link>
          )
        })}
      </div>

      <div className="section-head">
        <h2>Member shops near you</h2>
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
