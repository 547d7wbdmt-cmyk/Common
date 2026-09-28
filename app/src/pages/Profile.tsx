import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark, Page } from '../components/ui'
import { CENTS_PER_POINT, POINTS_EXPIRE_MONTHS, POINTS_PER_DOLLAR, SHOPS } from '../data'
import { useWallet } from '../store'

export default function Profile() {
  const { reset } = useWallet()
  const [wasReset, setWasReset] = useState(false)
  return (
    <Page title="Profile" back="/">
      <section className="profile">
        <span className="avatar">AR</span>
        <h2>Alex Rivera</h2>
        <p className="muted">Member since 2026 · CW 2048 7731</p>
      </section>

      <h2 className="label">How CommonWealth works</h2>
      <ol className="how">
        <li><strong>Load funds</strong> from your bank or debit card.</li>
        <li><strong>Pay</strong> with the app at any of our {SHOPS.length} member shops.</li>
        <li><strong>Earn {POINTS_PER_DOLLAR} points for every $1.</strong> Each point takes ${(CENTS_PER_POINT / 100).toFixed(2)} off a purchase at any member shop.</li>
        <li><strong>Spend points</strong> on rewards or toward any payment.</li>
        <li><strong>Points expire {POINTS_EXPIRE_MONTHS} months after you earn them.</strong> Your oldest points are used first.</li>
      </ol>

      <div className="list">
        <Link to="/wallet" className="row"><span className="row-main"><strong>Wallet & payment methods</strong></span></Link>
        <Link to="/wallet/activity" className="row"><span className="row-main"><strong>Activity</strong></span></Link>
        <button className="row" onClick={() => { reset(); setWasReset(true) }}>
          <span className="row-main"><strong>Reset demo data</strong><small>{wasReset ? 'Done. Sample balance and history restored.' : 'Restore the sample balance and history'}</small></span>
        </button>
      </div>

      <footer className="endorsement">
        <BrandMark size={28} />
        <p>CommonWealth is operated by <strong>Common Cents Collective</strong>, a coalition of locally owned businesses.</p>
      </footer>
    </Page>
  )
}
