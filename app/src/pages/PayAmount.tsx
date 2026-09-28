import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Modal, Page, ShopBadge } from '../components/ui'
import { CENTS_PER_POINT, POINTS_PER_DOLLAR, shopById } from '../data'
import { dayDate, expiryForNewPoints, money, pointsApplicable, useWallet } from '../store'
import NotFound from './NotFound'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫']

export default function PayAmount() {
  const { shopId } = useParams()
  const shop = shopById(shopId)
  const { cents: balance, points, pay } = useWallet()
  const navigate = useNavigate()
  const [digits, setDigits] = useState('')
  const [usePoints, setUsePoints] = useState(false)
  const [confirming, setConfirming] = useState(false)
  if (!shop) return <NotFound />

  // Amount is typed like a cash register: digits fill in from the cents side.
  const total = Number(digits || '0')
  const pointsUsed = usePoints ? pointsApplicable(points, total) : 0
  const fromBalance = total - pointsUsed * CENTS_PER_POINT
  const earned = Math.floor((fromBalance / 100) * POINTS_PER_DOLLAR)
  const short = fromBalance > balance

  const press = (k: string) => {
    if (k === '⌫') setDigits((d) => d.slice(0, -1))
    else setDigits((d) => (d + k).replace(/^0+/, '').slice(0, 7))
  }

  const confirm = () => {
    const txn = pay(shop.id, total, usePoints)
    setConfirming(false) // close before the balance updates so the sheet never shows recalculated numbers
    navigate(`/wallet/activity/${txn.id}?paid=1`, { replace: true })
  }

  return (
    <Page title={`Pay ${shop.name}`} back="/pay">
      <div className="pay-head">
        <ShopBadge shop={shop} size={48} />
        <p className="amount">{money(total)}</p>
        <p className="muted">Balance {money(balance)}</p>
      </div>

      <label className="toggle">
        <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} disabled={points === 0} />
        <span className="toggle-track" />
        <span>
          <strong>Use my points</strong>
          <small>{points.toLocaleString()} points available ({money(points * CENTS_PER_POINT)})</small>
        </span>
      </label>

      <div className="keypad">
        {KEYS.map((k) => (
          <button key={k} onClick={() => press(k)} aria-label={k === '⌫' ? 'Delete' : k}>{k}</button>
        ))}
      </div>

      {short && total > 0 && (
        <p className="warn">Not enough balance. <Link to="/wallet/add">Add funds</Link></p>
      )}
      <button className="btn btn-primary btn-block" disabled={total === 0 || short} onClick={() => setConfirming(true)}>
        Review payment
      </button>

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Confirm payment">
        <dl className="facts">
          <div><dt>To</dt><dd>{shop.name}</dd></div>
          <div><dt>Total</dt><dd>{money(total)}</dd></div>
          {pointsUsed > 0 && <div><dt>Points applied</dt><dd>−{pointsUsed} points ({money(pointsUsed * CENTS_PER_POINT)})</dd></div>}
          <div><dt>From balance</dt><dd>{money(fromBalance)}</dd></div>
          <div><dt>You'll earn</dt><dd className="earned">+{earned} points</dd></div>
          {earned > 0 && <div><dt>They expire</dt><dd>{dayDate(expiryForNewPoints())}</dd></div>}
        </dl>
        <div className="sheet-actions">
          <button className="btn btn-quiet" onClick={() => setConfirming(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={confirm}>Pay {money(total)}</button>
        </div>
      </Modal>
    </Page>
  )
}
