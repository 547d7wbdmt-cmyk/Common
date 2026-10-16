import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { KinMark, LogoLockup } from '../components/ui'
import { BLOCK, SHOPS, WELCOME_POINTS } from '../data'
import { useMember } from '../store'

/** Enrollment. Terms are linked here; SMS needs its own, unchecked-by-default consent (TCPA). */
export default function Welcome() {
  const { member, join, exploreSample } = useMember()
  const navigate = useNavigate()
  const [step, setStep] = useState<'intro' | 'join'>('intro')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [agree, setAgree] = useState(false)
  const [sms, setSms] = useState(false)
  const [email, setEmail] = useState(true)

  useEffect(() => {
    document.title = 'Join · Kin on Main'
  }, [])

  if (member) return <Navigate to="/" replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    join(name.trim(), contact.trim(), sms, email)
    navigate('/', { replace: true })
  }

  if (step === 'intro')
    return (
      <main className="welcome">
        <div className="welcome-hero">
          <h1 className="sr-only">Kin on Main</h1>
          <LogoLockup />
        </div>

        <ol className="steps">
          <li><strong>Show your card.</strong> Earn Kin Points at any of {SHOPS.length} member businesses on the {BLOCK.name}.</li>
          <li><strong>Use them at any member business.</strong> Points you earn at the bakery work at the bike shop, the salon or the taquería.</li>
          <li><strong>Support local shops.</strong> Every visit helps the independent businesses in your neighborhood.</li>
        </ol>

        <div className="welcome-actions">
          <button className="btn btn-primary btn-block" onClick={() => setStep('join')}>Join free</button>
          <button className="btn btn-secondary btn-block" onClick={() => { exploreSample(); navigate('/', { replace: true }) }}>
            Explore with a sample member
          </button>
          <p className="hint">Prototype · sample data stays in this browser.</p>
        </div>
      </main>
    )

  return (
    <main className="welcome">
      <div className="welcome-hero small">
        <KinMark size={44} />
        <h1>Join Kin on Main</h1>
        <p className="muted">One free app. {WELCOME_POINTS} Kin Points to start you off.</p>
      </div>

      <form className="form" onSubmit={submit}>
        <label className="field">
          <span>First name</span>
          <input required autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          <span>Email or mobile number</span>
          <input required autoComplete="email" value={contact} onChange={(e) => setContact(e.target.value)} />
        </label>

        <label className="check">
          <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} />
          <span>Email me about block events and featured merchants. Unsubscribe anytime.</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} />
          <span>Text me Kin on Main updates (optional). Msg &amp; data rates may apply. Reply STOP to opt out.</span>
        </label>
        <label className="check">
          <input type="checkbox" required checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I agree to the <Link to="/terms">program terms</Link> and privacy notice.</span>
        </label>

        <button className="btn btn-primary btn-block" disabled={!agree || !name.trim() || !contact.trim()}>Join Kin on Main</button>
        <button type="button" className="btn btn-ghost btn-block" onClick={() => setStep('intro')}>Back</button>
      </form>

      <p className="fine">Kin Points are rewards with no cash value. A Kith &amp; Coin Collective program.</p>
    </main>
  )
}
