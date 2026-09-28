import { useNavigate, useParams } from 'react-router-dom'
import { ROLES, type Role } from '../data'
import { useMerchant } from '../store'
import { MPage } from '../ui'

export default function StaffDetail() {
  const { staffId } = useParams()
  const { staff, role, me, saveStaff, removeStaff, txns } = useMerchant()
  const navigate = useNavigate()
  const person = staff.find((s) => s.id === staffId)
  if (!person) {
    return <MPage title="Staff" back="/merchant/settings" section="settings"><p className="empty">That person isn't on your staff list.</p></MPage>
  }
  const isOwner = role === 'owner'
  const owners = staff.filter((s) => s.role === 'owner').length
  const lastOwner = person.role === 'owner' && owners === 1
  const handled = txns.filter((t) => t.staff === person.name).length

  return (
    <MPage title={person.name} back="/merchant/settings" section="settings">
      <section className="m-panel">
        <h2 className="label">Role</h2>
        <div className="list">
          {(Object.keys(ROLES) as Role[]).map((r) => (
            <label key={r} className="row radio-row">
              <input type="radio" name="staff-role" checked={person.role === r} disabled={!isOwner || (lastOwner && r !== 'owner')}
                onChange={() => saveStaff({ ...person, role: r })} />
              <span className="row-main"><strong>{ROLES[r].label}</strong><small>{ROLES[r].summary}</small></span>
            </label>
          ))}
        </div>
        {lastOwner && <p className="hint m-left">A shop needs at least one owner.</p>}
        {!isOwner && <p className="hint m-left">Only the owner can change roles.</p>}
      </section>
      <p className="muted">Handled {handled} transactions.</p>
      {isOwner && person.id !== me.id && !lastOwner && (
        <button className="btn btn-quiet" onClick={() => { removeStaff(person.id); navigate('/merchant/settings') }}>Remove {person.name.split(' ')[0]}</button>
      )}
    </MPage>
  )
}
