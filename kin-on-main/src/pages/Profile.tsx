import { Link, useNavigate } from 'react-router-dom'
import { Endorsement, Icon, Page } from '../components/ui'
import { LEVELS, levelFor, nextLevel } from '../data'
import { useMember, visitsThisYear } from '../store'

export default function Profile() {
  const { member, activity, smsOptIn, emailOptIn, setPrefs, reset } = useMember()
  const navigate = useNavigate()
  if (!member) return null
  const visits = visitsThisYear(activity)
  const level = levelFor(visits)
  const next = nextLevel(visits)

  return (
    <Page title="Profile" back="/">
      <section className="profile">
        <span className="avatar">{member.name.slice(0, 1).toUpperCase()}</span>
        <h2>{member.name}</h2>
        <p className="muted">{member.contact} · Member since {new Date(member.since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
      </section>

      <section className="level-card">
        <div className="level-steps">
          {LEVELS.map((l) => <span key={l.name} className={l.name === level.name ? 'on' : ''}>{l.name}</span>)}
        </div>
        <p><strong>{level.name}</strong> · {visits} visits this year</p>
        <p className="muted">{level.perk}</p>
        {next && <p className="muted">{next.min - visits} more visits to {next.name}.</p>}
      </section>

      <p className="label">Messages</p>
      <div className="list">
        <label className="toggle-row">
          <span className="row-main"><strong>Email</strong><small>Block events and featured merchants</small></span>
          <input type="checkbox" checked={emailOptIn} onChange={(e) => setPrefs({ emailOptIn: e.target.checked })} />
          <span className="toggle-track" />
        </label>
        <label className="toggle-row">
          <span className="row-main"><strong>Text messages</strong><small>Optional · reply STOP anytime</small></span>
          <input type="checkbox" checked={smsOptIn} onChange={(e) => setPrefs({ smsOptIn: e.target.checked })} />
          <span className="toggle-track" />
        </label>
      </div>

      <p className="label">About</p>
      <div className="list">
        <Link to="/about" className="row"><span className="row-main"><strong>About Kin on Main</strong></span><Icon name="chevron" size={18} /></Link>
        <Link to="/terms" className="row"><span className="row-main"><strong>Program terms</strong></span><Icon name="chevron" size={18} /></Link>
        <Link to="/terms#privacy" className="row"><span className="row-main"><strong>Privacy notice</strong></span><Icon name="chevron" size={18} /></Link>
        <Link to="/profile/logo" className="row"><span className="row-main"><strong>Logo</strong><small>Versions, downloads and how to use them</small></span><Icon name="chevron" size={18} /></Link>
      </div>

      <button className="btn btn-secondary btn-block" onClick={() => { reset(); navigate('/welcome') }}>
        Reset prototype
      </button>

      <Endorsement />
    </Page>
  )
}
