import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FakeQr, Modal, Page, ShopBadge } from '../components/ui'
import { rewardById, shopById } from '../data'
import { pointsValue, useWallet, type Txn } from '../store'
import NotFound from './NotFound'

/** Reached from /rewards/:rewardId (layer 2) or /shops/:shopId/rewards/:rewardId (layer 3). */
export default function RewardDetail() {
  const { rewardId, shopId } = useParams()
  const reward = rewardById(rewardId)
  const { points, redeem } = useWallet()
  const [confirming, setConfirming] = useState(false)
  const [voucher, setVoucher] = useState<Extract<Txn, { kind: 'redeem' }> | null>(null)
  if (!reward || (shopId && reward.shopId !== shopId)) return <NotFound />
  const shop = shopById(reward.shopId)!
  const canRedeem = points >= reward.points

  const doRedeem = () => {
    const txn = redeem(reward.id)
    if (txn.kind === 'redeem') setVoucher(txn)
    setConfirming(false)
  }

  return (
    <Page title="Reward" back={shopId ? `/shops/${shopId}` : '/rewards'}>
      <section className="reward-hero">
        <ShopBadge shop={shop} size={56} />
        <h2>{reward.title}</h2>
        <Link to={`/shops/${shop.id}`}>{shop.name}</Link>
      </section>

      <dl className="facts">
        <div><dt>Cost</dt><dd>{reward.points} pts <small>({pointsValue(reward.points)} value)</small></dd></div>
        <div><dt>Your points</dt><dd>{points.toLocaleString()} pts</dd></div>
        <div><dt>Details</dt><dd>{reward.details}</dd></div>
      </dl>

      <button className="btn btn-primary btn-block" disabled={!canRedeem} onClick={() => setConfirming(true)}>
        {canRedeem ? 'Redeem reward' : `Need ${reward.points - points} more pts`}
      </button>

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Redeem this reward?">
        <p>
          <strong>{reward.points} pts</strong> will be used for <strong>{reward.title}</strong> at {shop.name}. You'll have{' '}
          {points - reward.points} pts left.
        </p>
        <div className="sheet-actions">
          <button className="btn btn-secondary" onClick={() => setConfirming(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={doRedeem}>Redeem</button>
        </div>
      </Modal>

      <Modal open={!!voucher} onClose={() => setVoucher(null)} title="Show this at the counter">
        {voucher && (
          <div className="center">
            <FakeQr value={voucher.code} />
            <p className="code">{voucher.code}</p>
            <p>{reward.title} · {shop.name}</p>
            <Link className="btn btn-secondary btn-block" to={`/wallet/activity/${voucher.id}`}>View in activity</Link>
          </div>
        )}
      </Modal>
    </Page>
  )
}
