import { Link } from 'react-router-dom'
import { Icon } from '../../components/ui'
import { canAccess } from '../data'
import { NAV, RoleSwitcher } from '../MerchantApp'
import { useMerchant } from '../store'
import { CollectiveLogo, MPage } from '../ui'

/** Phone-only menu for the sections that don't fit in the bottom tabs. */
export default function More() {
  const { role, profile } = useMerchant()
  const items = NAV.filter((n) => !['today', 'counter', 'transactions'].includes(n.section) && canAccess(role, n.section))
  return (
    <MPage title="More">
      <div className="m-more-head">
        <CollectiveLogo />
        <p className="muted">{profile.name} · CommonWealth member shop</p>
      </div>
      {items.length > 0 && (
        <div className="list">
          {items.map((n) => (
            <Link key={n.to} to={n.to} className="row">
              <Icon name={n.icon} size={20} />
              <span className="row-main"><strong>{n.label}</strong></span>
              <Icon name="chevron" size={18} />
            </Link>
          ))}
        </div>
      )}
      <section className="m-panel"><RoleSwitcher /></section>
      <Link to="/" className="btn btn-quiet btn-block">Open the member app</Link>
    </MPage>
  )
}
