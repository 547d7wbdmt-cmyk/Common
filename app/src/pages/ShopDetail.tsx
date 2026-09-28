import { Link, useParams } from 'react-router-dom'
import { Icon, Page, ShopBadge } from '../components/ui'
import { POINTS_PER_DOLLAR, rewardsForShop, shopById } from '../data'
import { useWallet } from '../store'
import NotFound from './NotFound'

export default function ShopDetail() {
  const { shopId } = useParams()
  const shop = shopById(shopId)
  const { points } = useWallet()
  if (!shop) return <NotFound />

  return (
    <Page title={shop.name} back="/shops">
      <section className="shop-hero">
        <ShopBadge shop={shop} size={64} />
        <div>
          <h2>{shop.name}</h2>
          <p>{shop.category} · {shop.distance}</p>
        </div>
      </section>

      <p>{shop.about}</p>
      <dl className="facts">
        <div><dt>Address</dt><dd>{shop.address}</dd></div>
        <div><dt>Hours</dt><dd>{shop.hours}</dd></div>
        <div><dt>You earn</dt><dd>{POINTS_PER_DOLLAR} points per $1</dd></div>
      </dl>

      <Link to={`/pay/${shop.id}`} className="btn btn-primary btn-block"><Icon name="pay" size={18} /> Pay {shop.name}</Link>

      <div className="section-head"><h2>Rewards here</h2></div>
      <div className="list">
        {rewardsForShop(shop.id).map((r) => (
          <Link key={r.id} to={`/shops/${shop.id}/rewards/${r.id}`} className="row">
            <span className="row-main">
              <strong>{r.title}</strong>
              <small>{r.details}</small>
            </span>
            <span className={`pill ${points >= r.points ? 'pill-ready' : ''}`}>{r.points} points</span>
          </Link>
        ))}
      </div>
      <p className="hint">Points from any member shop can be spent here too.</p>
    </Page>
  )
}
