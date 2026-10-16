import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, LogoLockup } from '../components/ui'

/** Brand story (short form from the brand guide). */
export default function About() {
  const navigate = useNavigate()
  useEffect(() => {
    document.title = 'About · Kin on Main'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <header className="topbar">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back"><Icon name="back" /></button>
        <h1 className="topbar-title">About</h1>
      </header>
      <main className="content prose">
        <div className="welcome-hero small">
          <LogoLockup size={200} />
        </div>
        <p>
          Kin on Main is a shared rewards program for the independent businesses on your street. Shop at the bakery, earn
          Kin Points you can use at the hardware store, the salon or the taquería down the block. Every visit keeps the
          neighborhood strong and helps the businesses you love keep rising.
        </p>
        <h2>What we stand for</h2>
        <ul>
          <li><strong>Rise together.</strong> No business wins alone.</li>
          <li><strong>Keep it local.</strong> Loyalty stays in the neighborhood.</li>
          <li><strong>Show up.</strong> For merchants, members and the groups around them.</li>
          <li><strong>Plain dealing.</strong> Simple rules, clear terms, no fine-print surprises.</li>
        </ul>
        <div className="company">
          <img src="/kith-and-coin-collective.png" alt="Kith & Coin Collective" width={120} height={120} />
          <p className="fine">
            Kin on Main is a program of Kith &amp; Coin Collective, founded in the Chicago area to build local wealth together.
          </p>
        </div>
      </main>
    </>
  )
}
