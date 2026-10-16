import { Link } from 'react-router-dom'
import { ActivityRow, Endorsement, Icon, Page, ShopBadge } from '../components/ui'
import { BLOCK, FEATURED_MULTIPLIER, FEATURED_SHOP_ID, PASSPORT_GOAL, REWARDS, levelFor, shopById } from '../data'
import { passportStamps, useMember, visitsThisYear } from '../store'

export default function Home() {
  const { member, points, activity } = useMember()
  const level = levelFor(visitsThisYear(activity))
  const stamps = passportStamps(activity).length
  const featured = shopById(FEATURED_SHOP_ID)!

  // Cross-shop nudge: the last place they earned, and a reward they can use somewhere else.
  const lastEarn = activity.find((a) => a.kind === 'earn')
  const earnedAt = lastEarn?.kind === 'earn' ? shopById(lastEarn.shopId) : undefined
  const elsewhere = REWARDS.filter((r) => r.shopId !== earnedAt?.id && r.points <= points).sort((a, b) => b.points - a.points)[0]

  return (
    <Page>
      <section className="points-card">
        <div className="points-sun" aria-hidden="true" />
        <p className="eyebrow">Hi {member?.name.split(' ')[0]} · <span className="level">{level.name}</span></p>
        <p className="points-big">{points.toLocaleString()}</p>
        <p className="points-label">Kin Points to use anywhere on the {BLOCK.name}</p>
        <div className="card-actions">
          <Link to="/card" className="btn btn-light"><Icon name="card" size={18} /> My card</Link>
          <Link to="/rewards" className="btn btn-ghost-light"><Icon name="gift" size={18} /> Rewards</Link>
        </div>
      </section>

      {earnedAt && elsewhere && (
        <Link to={`/rewards/${elsewhere.id}`} className="nudge">
          <Icon name="arrows" />
          <span>
            <strong>Earned it at {earnedAt.name}.</strong>
            <small>Use it down the block: {elsewhere.title} at {shopById(elsewhere.shopId)!.name}.</small>
          </span>
          <Icon name="chevron" size={18} />
        </Link>
      )}

      <Link to="/passport" className="passport-card">
        <span className="row-main">
          <strong>Block Passport</strong>
          <small>Visit {PASSPORT_GOAL} member businesses this month</small>
        </span>
        <span className="stamps" aria-label={`${stamps} of ${PASSPORT_GOAL} stamps`}>
          {Array.from({ length: PASSPORT_GOAL }, (_, i) => <span key={i} className={`stamp${i < stamps ? ' on' : ''}`} />)}
        </span>
      </Link>

      <Link to={`/block/${featured.id}`} className="featured">
        <ShopBadge shop={featured} size={48} />
        <span className="row-main">
          <small className="kicker">Featured this week</small>
          <strong>{featured.name}</strong>
          <small>{FEATURED_MULTIPLIER}× Kin Points on every visit</small>
        </span>
        <Icon name="chevron" size={18} />
      </Link>

      <div className="section-head">
        <h2>Rewards on the block</h2>
        <Link to="/rewards">See all</Link>
      </div>
      <div className="scroller">
        {REWARDS.filter((r) => r.featured).map((r) => {
          const shop = shopById(r.shopId)!
          return (
            <Link key={r.id} to={`/rewards/${r.id}`} className="reward-card">
              <ShopBadge shop={shop} size={36} />
              <strong>{r.title}</strong>
              <small>{shop.name}</small>
              <span className={`pill ${points >= r.points ? 'pill-ok' : ''}`}>{r.points.toLocaleString()} pts</span>
            </Link>
          )
        })}
      </div>

      <div className="section-head">
        <h2>Recent activity</h2>
        <Link to="/activity">See all</Link>
      </div>
      <div className="list">
        {activity.slice(0, 3).map((a) => <ActivityRow key={a.id} item={a} />)}
      </div>

      <Endorsement />
    </Page>
  )
}
