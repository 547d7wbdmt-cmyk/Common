import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FakeQr, Modal, Page, ShopBadge } from '../components/ui'
import { rewardById, shopById } from '../data'
import { useMember, type Activity } from '../store'
import NotFound from './NotFound'

/** Reached from /rewards/:rewardId (layer 2) or /block/:shopId/rewards/:rewardId (layer 3). */
export default function RewardDetail() {
  const { rewardId, shopId } = useParams()
  const reward = rewardById(rewardId)
  const { points, redeem } = useMember()
  const [confirming, setConfirming] = useState(false)
  const [code, setCode] = useState<Extract<Activity, { kind: 'use' }> | null>(null)
  if (!reward || (shopId && reward.shopId !== shopId)) return <NotFound />
  const shop = shopById(reward.shopId)!
  const canUse = points >= reward.points

  const doUse = () => {
    setCode(redeem(reward.id))
    setConfirming(false)
  }

  return (
    <Page title="Reward" back={shopId ? `/block/${shopId}` : '/rewards'}>
      <section className="reward-hero">
        <ShopBadge shop={shop} size={60} />
        <h2>{reward.title}</h2>
        <Link to={`/block/${shop.id}`}>{shop.name}</Link>
      </section>

      <dl className="facts">
        <div><dt>Uses</dt><dd>{reward.points.toLocaleString()} Kin Points</dd></div>
        <div><dt>You have</dt><dd>{points.toLocaleString()} Kin Points</dd></div>
        <div><dt>Details</dt><dd>{reward.details}</dd></div>
      </dl>

      <button className="btn btn-primary btn-block" disabled={!canUse} onClick={() => setConfirming(true)}>
        {canUse ? 'Use Kin Points' : `${(reward.points - points).toLocaleString()} more Kin Points to go`}
      </button>
      <p className="hint">Use it at the counter within 15 minutes of getting your code.</p>

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Use Kin Points for this reward?">
        <p>
          <strong>{reward.points.toLocaleString()} Kin Points</strong> for <strong>{reward.title}</strong> at {shop.name}. You’ll have{' '}
          {(points - reward.points).toLocaleString()} left.
        </p>
        <div className="sheet-actions">
          <button className="btn btn-secondary" onClick={() => setConfirming(false)}>Not now</button>
          <button className="btn btn-primary" onClick={doUse}>Use points</button>
        </div>
      </Modal>

      <Modal open={!!code} onClose={() => setCode(null)} title="Show this at the counter">
        {code && (
          <div className="center">
            <FakeQr value={code.code} />
            <p className="code">{code.code}</p>
            <p>{reward.title} · {shop.name}</p>
            {code.crossShop && <p className="pill pill-teal">Cross-shop: earned elsewhere on the block</p>}
            <Link className="btn btn-secondary btn-block" to={`/activity/${code.id}`}>View in activity</Link>
          </div>
        )}
      </Modal>
    </Page>
  )
}
