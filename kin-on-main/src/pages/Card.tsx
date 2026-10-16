import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FakeQr, Icon, Modal, Page, ShopBadge } from '../components/ui'
import { REWARDS, SHOPS, levelFor, pointsRate, shopById } from '../data'
import { dollars, useMember, visitsThisYear, type Activity } from '../store'

const PRESETS = [650, 1800, 4200]

/** Member card shown at the register. Includes a prototype-only "register scan" simulator. */
export default function Card() {
  const { member, points, activity, earn } = useMember()
  const [shopId, setShopId] = useState(SHOPS[0].id)
  const [cents, setCents] = useState(PRESETS[1])
  const [earned, setEarned] = useState<Extract<Activity, { kind: 'earn' }> | null>(null)
  if (!member) return null
  const level = levelFor(visitsThisYear(activity))
  const preview = Math.floor((cents / 100) * pointsRate(shopId))

  const nextUse = earned && REWARDS.filter((r) => r.shopId !== earned.shopId).sort((a, b) => a.points - b.points)[0]

  return (
    <Page>
      <section className="member-card">
        <div className="member-card-top">
          <span>Kin on Main member</span>
          <span className="level">{level.name}</span>
        </div>
        <FakeQr value={member.memberId} size={200} />
        <p className="code">{member.memberId}</p>
        <p className="muted">{member.name} · {points.toLocaleString()} Kin Points</p>
      </section>
      <p className="hint">Show this at the register to earn. Staff may ask, “Are you Kin on Main?”</p>

      <section className="sim">
        <p className="label">Prototype only · simulate a register scan</p>
        <label className="field">
          <span>Member business</span>
          <select value={shopId} onChange={(e) => setShopId(e.target.value)}>
            {SHOPS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <div className="preset-row" role="radiogroup" aria-label="Purchase amount">
          {PRESETS.map((p) => (
            <button key={p} role="radio" aria-checked={p === cents} className={`preset${p === cents ? ' active' : ''}`} onClick={() => setCents(p)}>
              {dollars(p)}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-block" onClick={() => setEarned(earn(shopId, cents))}>
          Scan at register · +{preview} Kin Points
        </button>
      </section>

      <Modal open={!!earned} onClose={() => setEarned(null)} title="Kin Points Earned">
        {earned && (
          <div className="success">
            <span className="success-icon"><Icon name="check" size={28} /></span>
            <p className="amount">+{earned.points.toLocaleString()}</p>
            <p>Thanks for supporting our Kin on Main</p>
            <p className="muted">Earned at {shopById(earned.shopId)!.name}</p>
            {nextUse && (
              <Link to={`/rewards/${nextUse.id}`} className="nudge" onClick={() => setEarned(null)}>
                <ShopBadge shop={shopById(nextUse.shopId)!} size={36} />
                <span>
                  <strong>Use them at another Kin on Main</strong>
                  <small>{nextUse.title} · {shopById(nextUse.shopId)!.name}</small>
                </span>
              </Link>
            )}
            <button className="btn btn-secondary btn-block" onClick={() => setEarned(null)}>Done</button>
          </div>
        )}
      </Modal>
    </Page>
  )
}
