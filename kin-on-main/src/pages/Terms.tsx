import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../components/ui'
import { PASSPORT_BONUS, PASSPORT_GOAL } from '../data'

/**
 * Plain-language program terms summary. DRAFT copy for the prototype:
 * regulatory counsel must review before launch (see brand guide, Compliance guardrails).
 */
export default function Terms() {
  const navigate = useNavigate()
  const { hash } = useLocation()
  useEffect(() => {
    document.title = 'Program terms · Kin on Main'
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [hash])

  return (
    <>
      <header className="topbar">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back"><Icon name="back" /></button>
        <h1 className="topbar-title">Program terms</h1>
      </header>
      <main className="content prose">
        <p className="draft">Draft for prototype · pending counsel review</p>

        <h2>The short version</h2>
        <ul>
          <li>Kin on Main is a points-based rewards program for Kin Shops on your block.</li>
          <li>You earn Kin Points when you show your member card at a Kin Shop, and you can use them for rewards at any Kin Shop.</li>
          <li><strong>Kin Points have no cash value</strong> and can’t be exchanged, sold or transferred for cash, unless state law requires otherwise.</li>
          <li>Kin on Main is not a bank, a payment method or an investment. You pay Kin Shops the usual way.</li>
          <li>Rewards are set by each Kin Shop and may change. We’ll tell you before program terms change.</li>
        </ul>

        <h2 id="passport">Block Passport official rules</h2>
        <p>
          Visit {PASSPORT_GOAL} different Kin Shops in one calendar month and show your member card at each to add{' '}
          {PASSPORT_BONUS} bonus Kin Points. One bonus per member per month. No drawing or element of chance.
        </p>

        <h2 id="privacy">Privacy</h2>
        <p>
          We collect only what the program needs: your name, an email or mobile number, and which Kin Shops you visit.
          We don’t sell your information. Text messages are sent only if you opted in; reply STOP to opt out. Every email has an
          unsubscribe link and our mailing address.
        </p>

        <p className="fine">Kin on Main is a program of Kith &amp; Coin Collective.</p>
      </main>
    </>
  )
}
