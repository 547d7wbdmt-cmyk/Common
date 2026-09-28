import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { money } from '../../store'
import { newRewardId, useMerchant } from '../store'
import { MPage } from '../ui'

export default function RewardEdit() {
  const { rewardId } = useParams()
  const { rewards, txns, saveReward } = useMerchant()
  const navigate = useNavigate()
  const existing = rewards.find((r) => r.id === rewardId)
  const isNew = rewardId === 'new'
  const [title, setTitle] = useState(existing?.title ?? '')
  const [points, setPoints] = useState(existing ? String(existing.points) : '')
  const [details, setDetails] = useState(existing?.details ?? '')
  const [active, setActive] = useState(existing?.active ?? true)

  if (!existing && !isNew) {
    return <MPage title="Reward" back="/merchant/rewards" section="rewards"><p className="empty">We couldn't find that reward.</p></MPage>
  }
  const pts = Number(points)
  const errors = {
    title: title.trim().length < 3 ? 'Give the reward a name members will recognize.' : '',
    points: !Number.isInteger(pts) || pts < 50 || pts > 10000 ? 'Use a whole number from 50 to 10,000.' : '',
  }
  const valid = !errors.title && !errors.points
  const redeemed = existing ? txns.filter((t) => t.kind === 'reward' && t.rewardId === existing.id).length : 0

  const save = () => {
    saveReward({ id: existing?.id ?? newRewardId(), title: title.trim(), points: pts, details: details.trim(), active })
    navigate('/merchant/rewards')
  }

  return (
    <MPage title={isNew ? 'New reward' : 'Edit reward'} back="/merchant/rewards" section="rewards">
      <form className="m-form" onSubmit={(e) => { e.preventDefault(); if (valid) save() }}>
        <label className="m-field">
          <span>Name</span>
          <input id="reward-title" className="search" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Free cookie" />
          {title && errors.title && <small className="warn m-left">{errors.title}</small>}
        </label>
        <label className="m-field">
          <span>Points it costs</span>
          <input id="reward-points" className="search" inputMode="numeric" value={points} onChange={(e) => setPoints(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 300" />
          <small>{points && !errors.points ? `You're reimbursed ${money(pts)} each time it's redeemed.` : errors.points && points ? <span className="warn">{errors.points}</span> : 'Each point is worth $0.01.'}</small>
        </label>
        <label className="m-field">
          <span>Details members see</span>
          <textarea id="reward-details" className="search m-textarea" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Limits, sizes, or when it's available" />
        </label>
        <label className="toggle">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          <span className="toggle-track" />
          <span><strong>{active ? 'On' : 'Paused'}</strong><small>{active ? 'Members can redeem it now.' : "Members can see it but can't redeem it."}</small></span>
        </label>
        {existing && <p className="muted">Redeemed {redeemed} times.</p>}
        <div className="m-form-actions">
          <button type="button" className="btn btn-quiet" onClick={() => navigate('/merchant/rewards')}>Cancel</button>
          <button className="btn btn-primary" disabled={!valid}>{isNew ? 'Add reward' : 'Save changes'}</button>
        </div>
      </form>
    </MPage>
  )
}
