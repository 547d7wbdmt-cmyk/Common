import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Page, ShopBadge } from '../components/ui'
import { CATEGORIES, SHOPS, rewardsForShop } from '../data'

export default function Shops() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const shops = SHOPS.filter(
    (s) => (category === 'All' || s.category === category) && s.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <Page>
      <h1 className="page-title">Member shops</h1>
      <input className="search" type="search" placeholder="Search shops" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="chips" role="tablist">
        {CATEGORIES.map((c) => (
          <button key={c} role="tab" aria-selected={c === category} className={`chip${c === category ? ' active' : ''}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="list">
        {shops.map((s) => (
          <Link key={s.id} to={`/shops/${s.id}`} className="row">
            <ShopBadge shop={s} />
            <span className="row-main">
              <strong>{s.name}</strong>
              <small>{s.category} · {s.distance} · {rewardsForShop(s.id).length} rewards</small>
            </span>
            <Icon name="chevron" size={18} />
          </Link>
        ))}
        {shops.length === 0 && <p className="empty">No shops match your search.</p>}
      </div>
    </Page>
  )
}
