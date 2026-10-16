import { Link, useParams } from 'react-router-dom'
import { Icon, Page, ShopBadge } from '../components/ui'
import { FEATURED_SHOP_ID, pointsRate, rewardsForShop, shopById } from '../data'
import { useMember } from '../store'
import NotFound from './NotFound'

export default function ShopDetail() {
  const { shopId } = useParams()
  const shop = shopById(shopId)
  const { points } = useMember()
  if (!shop) return <NotFound />
  const rewards = rewardsForShop(shop.id)

  return (
    <Page title={shop.name} back="/block">
      <section className="shop-hero" style={{ background: shop.color }}>
        <ShopBadge shop={shop} size={60} />
        <div>
          <h2>{shop.name}</h2>
          <p>{shop.category}</p>
          {shop.founding && <span className="pill pill-on-dark">Founding Merchant</span>}
        </div>
      </section>

      <div className="earn-banner">
        <Icon name="sun" />
        <span>
          <strong>Earn {pointsRate(shop.id)} Kin Points per $1</strong>
          <small>{shop.id === FEATURED_SHOP_ID ? 'Featured this week: double Kin Points.' : 'Show your member card at the register.'}</small>
        </span>
      </div>

      <p className="story">“{shop.about}” <small>— {shop.owner}</small></p>

      <dl className="facts">
        <div><dt><Icon name="pin" size={16} /> Address</dt><dd>{shop.address}</dd></div>
        <div><dt><Icon name="clock" size={16} /> Hours</dt><dd>{shop.hours}</dd></div>
        <div><dt>Distance</dt><dd>{shop.distance}</dd></div>
      </dl>

      <div className="section-head"><h2>Use Kin Points here</h2></div>
      <div className="list">
        {rewards.map((r) => (
          <Link key={r.id} to={`/block/${shop.id}/rewards/${r.id}`} className="row">
            <span className="row-main">
              <strong>{r.title}</strong>
              <small>{r.details}</small>
            </span>
            <span className={`pill ${points >= r.points ? 'pill-ok' : ''}`}>{r.points.toLocaleString()} pts</span>
          </Link>
        ))}
      </div>
      <p className="hint">Kin Points earned anywhere on the block work here.</p>
    </Page>
  )
}
