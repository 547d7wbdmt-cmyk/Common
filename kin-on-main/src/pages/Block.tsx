import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Page, ShopBadge } from '../components/ui'
import { BLOCK, CATEGORIES, FEATURED_SHOP_ID, SHOPS, rewardsForShop } from '../data'
import { plural } from '../store'

/** Directory of member businesses in this launch area ("the block"). */
export default function Block() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const shops = SHOPS.filter(
    (s) => (category === 'All' || s.category === category) && s.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <Page>
      <div>
        <h1 className="page-title">The {BLOCK.name}</h1>
        <p className="muted">{SHOPS.length} member businesses, all a short walk apart.</p>
      </div>
      <input className="search" type="search" placeholder="Search member businesses" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="chips" role="tablist">
        {CATEGORIES.map((c) => (
          <button key={c} role="tab" aria-selected={c === category} className={`chip${c === category ? ' active' : ''}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="list">
        {shops.map((s) => (
          <Link key={s.id} to={`/block/${s.id}`} className="row">
            <ShopBadge shop={s} />
            <span className="row-main">
              <strong>{s.name}</strong>
              <small>{s.category} · {s.distance} · {plural(rewardsForShop(s.id).length, 'reward')}</small>
            </span>
            {s.id === FEATURED_SHOP_ID ? <span className="pill pill-gold">2×</span> : <Icon name="chevron" size={18} />}
          </Link>
        ))}
        {shops.length === 0 && <p className="empty">No member businesses match your search.</p>}
      </div>
    </Page>
  )
}
