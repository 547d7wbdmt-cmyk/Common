import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FakeQr, Icon, Logo, Modal, Page, TxnRow } from '../components/ui'
import { dayDate, money, pointsValue, useWallet } from '../store'

export default function Wallet() {
  const { cents, points, txns, nextExpiry } = useWallet()
  const [showCard, setShowCard] = useState(false)

  return (
    <Page>
      <h1 className="page-title">Wallet</h1>
      <div className="wallet-split">
        <div className="stat">
          <small>Balance</small>
          <strong>{money(cents)}</strong>
        </div>
        <Link to="/wallet/points" className="stat stat-link">
          <small>Points</small>
          <strong>{points.toLocaleString()}</strong>
          <small>{pointsValue(points)} value</small>
          {nextExpiry && <small>{nextExpiry.points} expire {dayDate(nextExpiry.date)}</small>}
        </Link>
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
        <div className="member-card">
          <div className="awning" aria-hidden="true" />
          <div className="member-card-body">
            <Logo />
            <FakeQr value="member-alex-rivera" />
            <p className="code">CW 2048 7731</p>
            <p>Alex Rivera · Member</p>
          </div>
        </div>
        <p className="muted center">Member shops scan this to add points to your account.</p>
      </Modal>
    </Page>
  )
}
