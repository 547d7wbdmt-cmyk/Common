import { Link, useParams } from 'react-router-dom'
import { FakeQr, Icon, Page, ShopBadge } from '../components/ui'
import { rewardById, shopById } from '../data'
import { dollars, shortDate, useMember } from '../store'
import NotFound from './NotFound'

export default function ActivityDetail() {
  const { id } = useParams()
  const { activity } = useMember()
  const item = activity.find((a) => a.id === id)
  if (!item) return <NotFound />
  const shop = item.kind === 'bonus' ? undefined : shopById(item.shopId)

  return (
    <Page title={item.kind === 'earn' ? 'Kin Points earned' : item.kind === 'use' ? 'Reward used' : 'Bonus'} back="/activity">
      <section className="receipt">
        {shop ? <ShopBadge shop={shop} size={60} /> : <span className="shop-badge bonus-badge big"><Icon name="sun" size={30} /></span>}
        <p className="amount">{item.kind === 'use' ? '−' : '+'}{item.points.toLocaleString()}</p>
        <p className="muted">Kin Points</p>

        {item.kind === 'use' && <FakeQr value={item.code} size={150} />}

        <dl className="facts">
          <div><dt>When</dt><dd>{shortDate(item.date)}</dd></div>
          {shop && <div><dt>Member business</dt><dd><Link to={`/block/${shop.id}`}>{shop.name}</Link></dd></div>}
          {item.kind === 'earn' && <div><dt>Purchase</dt><dd>{dollars(item.purchaseCents)}</dd></div>}
          {item.kind === 'use' && <div><dt>Reward</dt><dd>{rewardById(item.rewardId)?.title}</dd></div>}
          {item.kind === 'use' && <div><dt>Code</dt><dd className="code">{item.code}</dd></div>}
          {item.kind === 'use' && item.crossShop && <div><dt>Cross-shop</dt><dd>Earned elsewhere, used here</dd></div>}
          {item.kind === 'bonus' && <div><dt>For</dt><dd>{item.label}</dd></div>}
        </dl>
      </section>
      <p className="hint">Something look off? Ask at the member business or contact Kin on Main support.</p>
    </Page>
  )
}
