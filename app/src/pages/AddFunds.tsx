import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Page } from '../components/ui'
import { PAYMENT_METHODS } from '../data'
import { money, useWallet } from '../store'

const PRESETS = [2000, 5000, 10000]

export default function AddFunds() {
  const { cents, addFunds } = useWallet()
  const navigate = useNavigate()
  const [amount, setAmount] = useState(5000)
  const [custom, setCustom] = useState('')
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id)
  const [confirming, setConfirming] = useState(false)

  const value = custom ? Math.round(Number(custom) * 100) : amount
  const valid = Number.isFinite(value) && value >= 500 && value <= 100000
  const methodLabel = PAYMENT_METHODS.find((m) => m.id === method)!.label

  const confirm = () => {
    const txn = addFunds(value, methodLabel)
    navigate(`/wallet/activity/${txn.id}?added=1`, { replace: true })
  }

  return (
    <Page title="Add funds" back="/wallet">
      <p className="muted">Current balance {money(cents)}</p>

      <h2 className="label">Amount</h2>
      <div className="preset-row">
        {PRESETS.map((p) => (
          <button key={p} className={`preset${!custom && amount === p ? ' active' : ''}`} onClick={() => { setAmount(p); setCustom('') }}>
            {money(p)}
          </button>
        ))}
      </div>
      <input
        className="search"
        inputMode="decimal"
        placeholder="Other amount ($5 – $1,000)"
        value={custom}
        onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ''))}
      />

      <h2 className="label">From</h2>
      <div className="list">
        {PAYMENT_METHODS.map((m) => (
          <label key={m.id} className="row radio-row">
            <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} />
            <span className="row-main">
              <strong>{m.label}</strong>
              <small>{m.sub}</small>
            </span>
          </label>
        ))}
      </div>

      <button className="btn btn-primary btn-block" disabled={!valid} onClick={() => setConfirming(true)}>
        {valid ? `Add ${money(value)}` : 'Enter $5 – $1,000'}
      </button>

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Add funds?">
        <dl className="facts">
          <div><dt>Amount</dt><dd>{money(value)}</dd></div>
          <div><dt>From</dt><dd>{methodLabel}</dd></div>
          <div><dt>New balance</dt><dd>{money(cents + value)}</dd></div>
        </dl>
        <div className="sheet-actions">
          <button className="btn btn-secondary" onClick={() => setConfirming(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={confirm}>Confirm</button>
        </div>
      </Modal>
    </Page>
  )
}
