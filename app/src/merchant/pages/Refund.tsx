import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../../components/ui'
import { money, shortDate } from '../../store'
import { refundedAmount, useMerchant } from '../store'
import { MPage } from '../ui'

export default function Refund() {
  const { txnId } = useParams()
  const { txns, role, refund } = useMerchant()
  const navigate = useNavigate()
  const txn = txns.find((t) => t.id === txnId)
  const left = txn ? txn.total - refundedAmount(txns, txn.id) : 0
  const [full, setFull] = useState(true)
  const [custom, setCustom] = useState('')
  const [confirming, setConfirming] = useState(false)
  const back = `/merchant/transactions/${txnId}`

  if (!txn || txn.kind !== 'payment' || left <= 0) {
    return <MPage title="Refund" back={back} section="transactions"><p className="empty">This payment can't be refunded.</p></MPage>
  }
  if (role === 'cashier') {
    return <MPage title="Refund" back={back} section="transactions"><p className="empty">Only owners and managers can refund.</p></MPage>
  }

  const amount = full ? left : Math.round(Number(custom || '0') * 100)
  const valid = Number.isFinite(amount) && amount > 0 && amount <= left
  const pointsBack = Math.round((txn.pointsIssued * amount) / txn.total)

  const confirm = () => {
    refund(txn.id, amount)
    setConfirming(false)
    navigate(back, { replace: true })
  }

  return (
    <MPage title="Refund" back={back} section="transactions">
      <dl className="facts">
        <div><dt>Payment</dt><dd>{txn.id} · {money(txn.total)}</dd></div>
        <div><dt>Member</dt><dd>{txn.memberId}</dd></div>
        <div><dt>Date</dt><dd>{shortDate(txn.date)}</dd></div>
        <div><dt>Left to refund</dt><dd>{money(left)}</dd></div>
      </dl>

      <h2 className="label">How much?</h2>
      <div className="list">
        <label className="row radio-row">
          <input type="radio" name="refund-amount" checked={full} onChange={() => setFull(true)} />
          <span className="row-main"><strong>Full refund</strong><small>{money(left)}</small></span>
        </label>
        <label className="row radio-row">
          <input type="radio" name="refund-amount" checked={!full} onChange={() => setFull(false)} />
          <span className="row-main"><strong>Part of it</strong><small>Up to {money(left)}</small></span>
        </label>
      </div>
      {!full && (
        <input id="refund-custom" className="search" inputMode="decimal" placeholder="Amount, e.g. 5.00" value={custom}
          onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ''))} />
      )}
      {!full && custom && !valid && <p className="warn">Enter an amount between $0.01 and {money(left)}.</p>}

      <p className="muted">The money goes back to the member's CommonWealth balance right away. Points they earned on the refunded part are taken back.</p>
      <button className="btn btn-primary btn-block" disabled={!valid} onClick={() => setConfirming(true)}>Refund {valid ? money(amount) : ''}</button>

      <Modal open={confirming} onClose={() => setConfirming(false)} title={`Refund ${money(amount)}?`}>
        <dl className="facts">
          <div><dt>To member</dt><dd>{txn.memberId}</dd></div>
          <div><dt>Amount</dt><dd>{money(amount)}</dd></div>
          <div><dt>Points taken back</dt><dd>{pointsBack} points</dd></div>
          <div><dt>From your deposit</dt><dd>−{money(amount)}</dd></div>
        </dl>
        <div className="sheet-actions">
          <button className="btn btn-quiet" onClick={() => setConfirming(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={confirm}>Refund</button>
        </div>
      </Modal>
    </MPage>
  )
}
