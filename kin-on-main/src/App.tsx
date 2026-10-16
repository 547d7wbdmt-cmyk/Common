import { NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Icon } from './components/ui'
import { useMember } from './store'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Block from './pages/Block'
import ShopDetail from './pages/ShopDetail'
import Card from './pages/Card'
import Rewards from './pages/Rewards'
import RewardDetail from './pages/RewardDetail'
import ActivityList from './pages/ActivityList'
import ActivityDetail from './pages/ActivityDetail'
import Passport from './pages/Passport'
import Profile from './pages/Profile'
import Terms from './pages/Terms'
import About from './pages/About'
import NotFound from './pages/NotFound'

const TABS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/block', label: 'The Block', icon: 'block' },
  { to: '/card', label: 'My card', icon: 'card', primary: true },
  { to: '/rewards', label: 'Rewards', icon: 'gift' },
  { to: '/activity', label: 'Activity', icon: 'activity' },
]

/** Layer 0: the app shell (top bar comes from each Page; bottom tabs live here). */
function Shell() {
  const { member } = useMember()
  const { pathname } = useLocation()
  if (!member) return <Navigate to="/welcome" replace state={{ from: pathname }} />
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

/** Screens anyone can open before joining (terms must be linked from enrollment). */
function Bare() {
  return (
    <div className="app app-bare">
      <Outlet />
    </div>
  )
}

/*
 * Page map — each layer is a URL, so Back / refresh / deep links work.
 *   Pre-join:  /welcome  /terms  /about
 *   Layer 1:   /  /block  /card  /rewards  /activity  /profile
 *   Layer 2:   /block/:shopId  /rewards/:rewardId  /activity/:id  /passport
 *   Layer 3:   /block/:shopId/rewards/:rewardId
 *   Overlays (confirm, reward code, simulated register scan) are modals.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Bare />}>
        <Route path="welcome" element={<Welcome />} />
        <Route path="terms" element={<Terms />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="block" element={<Block />} />
        <Route path="block/:shopId" element={<ShopDetail />} />
        <Route path="block/:shopId/rewards/:rewardId" element={<RewardDetail />} />
        <Route path="card" element={<Card />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="rewards/:rewardId" element={<RewardDetail />} />
        <Route path="activity" element={<ActivityList />} />
        <Route path="activity/:id" element={<ActivityDetail />} />
        <Route path="passport" element={<Passport />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
