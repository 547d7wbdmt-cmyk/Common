import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Modal } from '../../components/ui'
import { CENTS_PER_POINT, POINTS_EXPIRE_MONTHS, POINTS_PER_DOLLAR } from '../../data'
import { FEE_RATE, POINTS_FUNDING, ROLES, type Role } from '../data'
import { newStaffId, useMerchant } from '../store'
import { MPage } from '../ui'

export default function Settings() {
  const { profile, saveProfile, staff, role, saveStaff, reset } = useMerchant()
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState<Role>('cashier')
  const [wasReset, setWasReset] = useState(false)
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile)
  const field = (k: keyof typeof draft) => ({
    id: `profile-${k}`, className: 'search', value: draft[k],
    onChange: (e: { target: { value: string } }) => { setDraft({ ...draft, [k]: e.target.value }); setSaved(false) },
  })

  return (
    <MPage title="Settings" section="settings">
      <section className="m-panel">
        <h2>Shop profile</h2>
        <p className="muted">This is what members see on your shop page in the CommonWealth app.</p>
        <form className="m-form" onSubmit={(e) => { e.preventDefault(); saveProfile(draft); setSaved(true) }}>
          <label className="m-field"><span>Shop name</span><input {...field('name')} /></label>
          <div className="m-field-row">
            <label className="m-field"><span>Address</span><input {...field('address')} /></label>
            <label className="m-field"><span>Phone</span><input {...field('phone')} /></label>
          </div>
          <label className="m-field"><span>Hours</span><input {...field('hours')} /></label>
          <label className="m-field"><span>About</span><textarea {...field('about')} rows={2} className="search m-textarea" /></label>
          <div className="m-form-actions">
            {saved && !dirty && <span className="m-saved"><Icon name="check" size={16} /> Saved</span>}
            <button className="btn btn-primary" disabled={!dirty}>Save profile</button>
          </div>
        </form>
      </section>

      <section className="m-panel">
        <div className="section-head">
          <h2>Staff</h2>
          {role === 'owner' && <button className="btn btn-quiet" onClick={() => setAdding(true)}><Icon name="plus" size={16} /> Add person</button>}
        </div>
        <div className="list">
          {staff.map((s) => (
            <Link key={s.id} to={`/merchant/settings/staff/${s.id}`} className="row">
              <span className="avatar m-avatar">{s.name.split(' ').map((w) => w[0]).join('')}</span>
              <span className="row-main"><strong>{s.name}</strong><small>{ROLES[s.role].label} · {ROLES[s.role].summary}</small></span>
              <Icon name="chevron" size={18} />
            </Link>
          ))}
        </div>
        {role !== 'owner' && <p className="hint m-left">Only the owner can add people or change roles.</p>}
      </section>

      {role === 'owner' && (
        <section className="m-panel">
          <h2>Bank account</h2>
          <dl className="facts">
            <div><dt>Deposits go to</dt><dd>Checking •••• 3390</dd></div>
            <div><dt>Schedule</dt><dd>Next business day</dd></div>
          </dl>
          <p className="hint m-left">Changing the bank account needs a verification step (not in this prototype).</p>
        </section>
      )}

      <section className="m-panel">
        <h2>Your CommonWealth terms</h2>
        <dl className="facts">
          <div><dt>Members earn</dt><dd>{POINTS_PER_DOLLAR} points per $1</dd></div>
          <div><dt>Points spent at your shop</dt><dd>Reimbursed at ${(CENTS_PER_POINT / 100).toFixed(2)} each</dd></div>
          <div><dt>Processing fee</dt><dd>{FEE_RATE * 100}% of each payment</dd></div>
          <div><dt>Points expire</dt><dd>{POINTS_EXPIRE_MONTHS} months after they're earned</dd></div>
          <div><dt>Who pays for points earned here</dt><dd><span className="pill">{POINTS_FUNDING}</span></dd></div>
        </dl>
        <p className="hint m-left">Operated by Common Cents Collective under your merchant agreement.</p>
      </section>

      <section className="m-panel">
        <h2>Demo</h2>
        <button className="btn btn-quiet" onClick={() => { reset(); setDraft(profile); setWasReset(true) }}>Reset sample data</button>
        {wasReset && <p className="hint m-left">Done. Sample transactions, rewards and staff restored.</p>}
      </section>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a person">
        <form className="m-form" onSubmit={(e) => {
          e.preventDefault()
          saveStaff({ id: newStaffId(), name: newName.trim(), role: newRole })
          setAdding(false); setNewName(''); setNewRole('cashier')
        }}>
          <label className="m-field"><span>Name</span><input id="staff-name" className="search" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" /></label>
          <fieldset className="m-field">
            <legend>Role</legend>
            <div className="list">
              {(Object.keys(ROLES) as Role[]).map((r) => (
                <label key={r} className="row radio-row">
                  <input type="radio" name="new-role" checked={newRole === r} onChange={() => setNewRole(r)} />
                  <span className="row-main"><strong>{ROLES[r].label}</strong><small>{ROLES[r].summary}</small></span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="sheet-actions">
            <button type="button" className="btn btn-quiet" onClick={() => setAdding(false)}>Cancel</button>
            <button className="btn btn-primary" disabled={newName.trim().length < 2}>Add</button>
          </div>
        </form>
      </Modal>
    </MPage>
  )
}
