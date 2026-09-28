import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../../components/ui'
import { POINTS_PER_DOLLAR } from '../../data'
import { addDays } from '../data'
import { dayLabel, newBonusId, todayKey, useMerchant } from '../store'
import { MPage } from '../ui'

const MULTIPLIERS = [2, 3]

export default function BonusEdit() {
  const { bonusId } = useParams()
  const { bonuses, saveBonus, deleteBonus } = useMerchant()
  const navigate = useNavigate()
  const existing = bonuses.find((b) => b.id === bonusId)
  const isNew = bonusId === 'new'
  const today = todayKey()
  const [title, setTitle] = useState(existing?.title ?? 'Double points day')
  const [multiplier, setMultiplier] = useState(existing?.multiplier ?? 2)
  const [start, setStart] = useState(existing?.start ?? addDays(today, 1))
  const [end, setEnd] = useState(existing?.end ?? addDays(today, 1))
  const [confirming, setConfirming] = useState(false)

  if (!existing && !isNew) {
    return <MPage title="Bonus event" back="/merchant/rewards" section="rewards"><p className="empty">We couldn't find that bonus event.</p></MPage>
  }
  const ended = !!existing && existing.end < today
  const error = title.trim().length < 3 ? 'Give the event a name.' : end < start ? 'The end date is before the start date.' : !existing && start < today ? 'Pick today or a later date.' : ''

  const publish = () => {
    saveBonus({ id: existing?.id ?? newBonusId(), title: title.trim(), multiplier, start, end })
    setConfirming(false)
    navigate('/merchant/rewards')
  }

  return (
    <MPage title={isNew ? 'New bonus event' : existing!.title} back="/merchant/rewards" section="rewards">
      <form className="m-form" onSubmit={(e) => { e.preventDefault(); if (!error) setConfirming(true) }}>
        <label className="m-field">
          <span>Name</span>
          <input id="bonus-title" className="search" value={title} onChange={(e) => setTitle(e.target.value)} disabled={ended} />
        </label>
        <fieldset className="m-field">
          <legend>Points boost</legend>
          <div className="chips">
            {MULTIPLIERS.map((x) => (
              <button type="button" key={x} className={`chip${multiplier === x ? ' active' : ''}`} onClick={() => setMultiplier(x)} disabled={ended}>
                {x}× ({x * POINTS_PER_DOLLAR} points per $1)
              </button>
            ))}
          </div>
        </fieldset>
        <div className="m-field-row">
          <label className="m-field">
            <span>Starts</span>
            <input id="bonus-start" type="date" className="search" value={start} onChange={(e) => { setStart(e.target.value); if (end < e.target.value) setEnd(e.target.value) }} disabled={ended} />
          </label>
          <label className="m-field">
            <span>Ends</span>
            <input id="bonus-end" type="date" className="search" value={end} min={start} onChange={(e) => setEnd(e.target.value)} disabled={ended} />
          </label>
        </div>
        {error && <p className="warn m-left">{error}</p>}
        <p className="muted">Members see the event in the app. The extra points apply to payments at your shop during these days.</p>
        {!ended && (
          <div className="m-form-actions">
            {existing && <button type="button" className="btn btn-quiet" onClick={() => { deleteBonus(existing.id); navigate('/merchant/rewards') }}>Delete event</button>}
            <button className="btn btn-primary" disabled={!!error}>{isNew ? 'Review and publish' : 'Save changes'}</button>
          </div>
        )}
        {ended && <p className="muted">This event has ended and can't be changed.</p>}
      </form>

      <Modal open={confirming} onClose={() => setConfirming(false)} title={isNew ? 'Publish this bonus event?' : 'Save changes?'}>
        <div className="m-bonus-banner m-bonus-preview">
          <span className="pill pill-ready">{multiplier}× points</span>
          <span><strong>{title.trim()}</strong><small>{dayLabel(start)}{end !== start ? ` – ${dayLabel(end)}` : ''} at Rosa's Bakery</small></span>
        </div>
        <p className="muted">This is how it appears to members. Points from the event expire 6 months after they're earned, like all points.</p>
        <div className="sheet-actions">
          <button className="btn btn-quiet" onClick={() => setConfirming(false)}>Keep editing</button>
          <button className="btn btn-primary" onClick={publish}>{isNew ? 'Publish' : 'Save'}</button>
        </div>
      </Modal>
    </MPage>
  )
}
