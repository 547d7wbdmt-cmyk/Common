import { useState } from 'react'
import { dayKey, type MTxn } from '../data'
import { dayLabel, useMerchant } from '../store'
import { MPage, MTxnRow } from '../ui'
import { money } from '../../store'

const FILTERS: { key: MTxn['kind'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'payment', label: 'Payments' },
  { key: 'reward', label: 'Rewards' },
  { key: 'refund', label: 'Refunds' },
]

export default function Transactions() {
  const { txns } = useMerchant()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all')
  const [query, setQuery] = useState('')
  const q = query.replace(/\s+/g, '').toUpperCase()
  const list = txns.filter((t) => (filter === 'all' || t.kind === filter) && (!q || t.memberId.replace(/\s+/g, '').includes(q) || t.id.includes(q)))

  // Group by day, newest first.
  const groups = new Map<string, MTxn[]>()
  for (const t of list.slice(0, 150)) {
    const k = dayKey(t.date)
    groups.set(k, [...(groups.get(k) ?? []), t])
  }

  return (
    <MPage title="Transactions" section="transactions">
      <div className="m-toolbar">
        <input id="txn-search" className="search" type="search" placeholder="Search by member ID or reference" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="chips">
          {FILTERS.map((f) => (
            <button key={f.key} className={`chip${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>
      </div>
      {[...groups.entries()].map(([k, items]) => (
        <section key={k} className="m-day">
          <div className="section-head">
            <h2 className="label">{dayLabel(k)}</h2>
            <span className="muted">{money(items.filter((t) => t.kind !== 'reward').reduce((s, t) => s + t.total, 0))} in sales</span>
          </div>
          <div className="list">{items.map((t) => <MTxnRow key={t.id} txn={t} />)}</div>
        </section>
      ))}
      {list.length === 0 && <p className="empty">No transactions match. Try another member ID or filter.</p>}
    </MPage>
  )
}
