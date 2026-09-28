import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FakeQr, Icon, Modal, Page, TxnRow } from '../components/ui'
import { money, pointsValue, useWallet } from '../store'

export default function Wallet() {
  const { cents, points, txns } = useWallet()
  const [showCard, setShowCard] = useState(false)

  return (
    <Page>
      <h1 className="page-title">Wallet</h1>
      <div className="wallet-split">
        <div className="stat">
          <small>Balance</small>
          <strong>{money(cents)}</strong>
        </div>
        <div className="stat">
          <small>Points</small>
          <strong>{points.toLocaleString()}</strong>
          <small>{pointsValue(points)} value</small>
        </div>
      </div>

      <div className="action-grid">
        <Link to="/wallet/add" className="action"><Icon name="plus" /> Add funds</Link>
        <button className="action" onClick={() => setShowCard(true)}><Icon name="pay" /> My member card</button>
      </div>

      <div className="section-head">
        <h2>Activity</h2>
        <Link to="/wallet/activity">See all</Link>
      </div>
      <div className="list">
        {txns.slice(0, 5).map((t) => <TxnRow key={t.id} txn={t} />)}
      </div>

      <Modal open={showCard} onClose={() => setShowCard(false)} title="Member card">
        <div className="center">
          <FakeQr value="member-alex-rivera" />
          <p className="code">CCC 2048 7731</p>
          <p className="muted">Shops can scan this to look up your account.</p>
        </div>
      </Modal>
    </Page>
  )
}
