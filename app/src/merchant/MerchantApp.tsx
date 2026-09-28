import { Link, Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { Icon } from '../components/ui'
import { canAccess, ROLES, type Section } from './data'
import { MerchantProvider, useMerchant } from './store'
import { CollectiveLogo } from './ui'
import './merchant.css'
import Today from './pages/Today'
import Counter from './pages/Counter'
import Transactions from './pages/Transactions'
import TxnDetail from './pages/TxnDetail'
import Refund from './pages/Refund'
import Rewards from './pages/Rewards'
import RewardEdit from './pages/RewardEdit'
import BonusEdit from './pages/BonusEdit'
import Members from './pages/Members'
import MemberDetail from './pages/MemberDetail'
import Payouts from './pages/Payouts'
import PayoutDetail from './pages/PayoutDetail'
import PayoutItems from './pages/PayoutItems'
import Settings from './pages/Settings'
import StaffDetail from './pages/StaffDetail'
import More from './pages/More'
import Membership from './pages/Membership'
import MembershipPay from './pages/MembershipPay'
import MembershipInvoice from './pages/MembershipInvoice'

export const NAV: { section: Section; to: string; label: string; icon: string }[] = [
  { section: 'today', to: '/merchant', label: 'Today', icon: 'home' },
  { section: 'counter', to: '/merchant/counter', label: 'Counter', icon: 'pay' },
  { section: 'transactions', to: '/merchant/transactions', label: 'Transactions', icon: 'list' },
  { section: 'rewards', to: '/merchant/rewards', label: 'Rewards', icon: 'gift' },
  { section: 'members', to: '/merchant/members', label: 'Members', icon: 'users' },
  { section: 'payouts', to: '/merchant/payouts', label: 'Payouts', icon: 'bank' },
  { section: 'membership', to: '/merchant/membership', label: 'Membership', icon: 'card' },
  { section: 'settings', to: '/merchant/settings', label: 'Settings', icon: 'settings' },
]
const PHONE_TABS: Section[] = ['today', 'counter', 'transactions']

/** Demo control: switch between staff members to see what each role can do. */
export function RoleSwitcher() {
  const { me, staff, setCurrentStaff } = useMerchant()
  return (
    <label className="m-role">
      <span className="m-role-label">Signed in as</span>
      <select id="m-role-select" value={me.id} onChange={(e) => setCurrentStaff(e.target.value)}>
        {staff.map((s) => <option key={s.id} value={s.id}>{s.name} · {ROLES[s.role].label}</option>)}
      </select>
      <small>Demo: switch people to preview each role</small>
    </label>
  )
}

/** Layer 0 for merchants: sidebar on tablets and computers, bottom tabs on phones. */
function MerchantShell() {
  const { role, profile } = useMerchant()
  const nav = NAV.filter((n) => canAccess(role, n.section))
  const tabs = nav.filter((n) => PHONE_TABS.includes(n.section))

  return (
    <div className="m-app">
      <aside className="m-sidebar">
        <CollectiveLogo />
        <div className="m-shop">
          <span className="m-shop-badge" aria-hidden="true">🥐</span>
          <span>
            <strong>{profile.name}</strong>
            <small>CommonWealth member shop</small>
          </span>
        </div>
        <nav className="m-nav" aria-label="Merchant">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/merchant'} className="m-nav-link">
              <Icon name={n.icon} size={20} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="m-sidebar-foot">
          <RoleSwitcher />
          <Link to="/" className="m-switch-app">Open the member app →</Link>
        </div>
      </aside>

      <div className="m-main"><Outlet /></div>

      <nav className="m-tabs" aria-label="Merchant">
        {tabs.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/merchant'} className="tab">
            <span className="tab-icon"><Icon name={n.icon} /></span>
            <span>{n.label}</span>
          </NavLink>
        ))}
        <NavLink to="/merchant/more" className="tab">
          <span className="tab-icon"><Icon name="more" /></span>
          <span>More</span>
        </NavLink>
      </nav>
    </div>
  )
}

/** Cashiers land on the Counter; everyone else on Today. */
function Home() {
  const { role } = useMerchant()
  return canAccess(role, 'today') ? <Today /> : <Navigate to="/merchant/counter" replace />
}

/*
 * Merchant page map (all under /merchant):
 *   Layer 1: /  counter  transactions  rewards  members  payouts  membership  settings  (more, on phones)
 *   Layer 2: transactions/:id  rewards/:id (or new)  bonus/:id (or new)  members/:id  payouts/:day  membership/pay  membership/invoices/:id  settings/staff/:id
 *   Layer 3: transactions/:id/refund  payouts/:day/items
 *   Overlays: payment received, charge a member, reward code check, confirm refund, publish bonus
 */
export default function MerchantApp() {
  return (
    <MerchantProvider>
      <Routes>
        <Route element={<MerchantShell />}>
          <Route index element={<Home />} />
          <Route path="counter" element={<Counter />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:txnId" element={<TxnDetail />} />
          <Route path="transactions/:txnId/refund" element={<Refund />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="rewards/:rewardId" element={<RewardEdit />} />
          <Route path="bonus/:bonusId" element={<BonusEdit />} />
          <Route path="members" element={<Members />} />
          <Route path="members/:memberId" element={<MemberDetail />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="payouts/:day" element={<PayoutDetail />} />
          <Route path="payouts/:day/items" element={<PayoutItems />} />
          <Route path="membership" element={<Membership />} />
          <Route path="membership/pay" element={<MembershipPay />} />
          <Route path="membership/invoices/:invoiceId" element={<MembershipInvoice />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/staff/:staffId" element={<StaffDetail />} />
          <Route path="more" element={<More />} />
          <Route path="*" element={<Navigate to="/merchant" replace />} />
        </Route>
      </Routes>
    </MerchantProvider>
  )
}
