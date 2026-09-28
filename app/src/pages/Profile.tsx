import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../components/ui'
import { CENTS_PER_POINT, POINTS_PER_DOLLAR, SHOPS } from '../data'
import { useWallet } from '../store'

export default function Profile() {
  const { reset } = useWallet()
  const [wasReset, setWasReset] = useState(false)
  return (
    <Page title="Profile" back="/">
      <section className="profile">
        <span className="avatar">AR</span>
        <h2>Alex Rivera</h2>
        <p className="muted">Member since 2026 · CCC 2048 7731</p>
      </section>

      <h2 className="label">How Common Cents works</h2>
      <ol className="how">
        <li><strong>Load funds</strong> from your bank or debit card.</li>
        <li><strong>Pay</strong> at any of our {SHOPS.length} member shops with the app.</li>
        <li><strong>Earn {POINTS_PER_DOLLAR} pts per $1</strong>. Every point is worth ${(CENTS_PER_POINT / 100).toFixed(2)} everywhere.</li>
        <li><strong>Spend points</strong> on rewards or toward any payment.</li>
      </ol>

      <div className="list">
        <Link to="/wallet" className="row"><span className="row-main"><strong>Wallet & payment methods</strong></span></Link>
        <Link to="/wallet/activity" className="row"><span className="row-main"><strong>Activity</strong></span></Link>
        <button className="row" onClick={() => { reset(); setWasReset(true) }}>
          <span className="row-main"><strong>Reset demo data</strong><small>{wasReset ? 'Done. Sample balance and history restored.' : 'Restore the sample balance and history'}</small></span>
        </button>
      </div>
    </Page>
  )
}
