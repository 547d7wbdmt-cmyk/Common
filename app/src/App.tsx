import { NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { Icon } from './components/ui'
import Home from './pages/Home'
import Shops from './pages/Shops'
import ShopDetail from './pages/ShopDetail'
import RewardDetail from './pages/RewardDetail'
import Rewards from './pages/Rewards'
import PayPickShop from './pages/PayPickShop'
import PayAmount from './pages/PayAmount'
import Wallet from './pages/Wallet'
import AddFunds from './pages/AddFunds'
import Activity from './pages/Activity'
import TxnDetail from './pages/TxnDetail'
import Points from './pages/Points'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const TABS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/shops', label: 'Shops', icon: 'shops' },
  { to: '/pay', label: 'Pay', icon: 'pay', primary: true },
  { to: '/rewards', label: 'Rewards', icon: 'gift' },
  { to: '/wallet', label: 'Wallet', icon: 'wallet' },
]

/** Layer 0: the app shell (top bar comes from each Page; bottom tabs live here). */
function Shell() {
  return (
    <div className="app">
      <Outlet />
      <nav className="tabs" aria-label="Main">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab${t.primary ? ' tab-primary' : ''}${isActive ? ' active' : ''}`}>
            <span className="tab-icon"><Icon name={t.icon} /></span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

/*
 * Page map — each layer is a URL, so Back / refresh / deep links work.
 *   Layer 1: /  /shops  /pay  /rewards  /wallet
 *   Layer 2: /shops/:shopId  /pay/:shopId  /rewards/:rewardId  /wallet/add  /wallet/activity  /wallet/points
 *   Layer 3: /shops/:shopId/rewards/:rewardId  /wallet/activity/:txnId
 *   Overlays (confirm, redeem code, QR) are modals on top of the current page.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="shops" element={<Shops />} />
        <Route path="shops/:shopId" element={<ShopDetail />} />
        <Route path="shops/:shopId/rewards/:rewardId" element={<RewardDetail />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="rewards/:rewardId" element={<RewardDetail />} />
        <Route path="pay" element={<PayPickShop />} />
        <Route path="pay/:shopId" element={<PayAmount />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="wallet/add" element={<AddFunds />} />
        <Route path="wallet/activity" element={<Activity />} />
        <Route path="wallet/activity/:txnId" element={<TxnDetail />} />
        <Route path="wallet/points" element={<Points />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
