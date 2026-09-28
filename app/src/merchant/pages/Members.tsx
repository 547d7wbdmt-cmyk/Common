import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../components/ui'
import { money } from '../../store'
import { memberSummaries } from '../data'
import { useMerchant } from '../store'
import { MPage } from '../ui'

type Sort = 'spent' | 'visits'

export default function Members() {
  const { txns } = useMerchant()
  const [sort, setSort] = useState<Sort>('spent')
  const [query, setQuery] = useState('')
  const q = query.replace(/\s+/g, '').toUpperCase()
  const list = memberSummaries(txns)
    .filter((m) => !q || m.id.replace(/\s+/g, '').includes(q))
    .sort((a, b) => (sort === 'spent' ? b.spent - a.spent : b.visits - a.visits))

  return (
    <MPage title="Members" section="members">
      <p className="muted">
        Members who shop with you. For privacy, you see each member's CommonWealth ID, visit count and total spent here, and nothing else.
      </p>
      <div className="m-toolbar">
        <input id="member-search" className="search" type="search" placeholder="Search by member ID" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="chips">
          <button className={`chip${sort === 'spent' ? ' active' : ''}`} onClick={() => setSort('spent')}>Top spenders</button>
          <button className={`chip${sort === 'visits' ? ' active' : ''}`} onClick={() => setSort('visits')}>Most visits</button>
        </div>
      </div>
      <div className="list m-table">
        <div className="m-table-head" aria-hidden="true"><span>Member ID</span><span>Visits</span><span>Total spent</span></div>
        {list.map((m) => (
          <Link key={m.id} to={`/merchant/members/${encodeURIComponent(m.id)}`} className="row m-table-row">
            <span className="m-member-id"><Icon name="user" size={18} /> {m.id}</span>
            <span><span className="sr-only">Visits </span>{m.visits}</span>
            <span><span className="sr-only">Total spent </span>{money(m.spent)}</span>
          </Link>
        ))}
        {list.length === 0 && <p className="empty">No members match that ID.</p>}
      </div>
    </MPage>
  )
}
