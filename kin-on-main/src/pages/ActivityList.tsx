import { useState } from 'react'
import { ActivityRow, Page } from '../components/ui'
import { useMember } from '../store'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'earn', label: 'Earned' },
  { id: 'use', label: 'Used' },
  { id: 'bonus', label: 'Bonus' },
] as const

export default function ActivityList() {
  const { activity } = useMember()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all')
  const items = activity.filter((a) => filter === 'all' || a.kind === filter)
  const shopsVisited = new Set(activity.flatMap((a) => (a.kind === 'earn' ? [a.shopId] : []))).size
  const crossShop = activity.filter((a) => a.kind === 'use' && a.crossShop).length

  return (
    <Page>
      <h1 className="page-title">Activity</h1>
      <div className="stat-row">
        <div className="stat"><strong>{shopsVisited}</strong><small>Kin Shops visited</small></div>
        <div className="stat"><strong>{crossShop}</strong><small>rewards used at Kin on Main</small></div>
      </div>
      <div className="chips" role="tablist">
        {FILTERS.map((f) => (
          <button key={f.id} role="tab" aria-selected={f.id === filter} className={`chip${f.id === filter ? ' active' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="list">
        {items.map((a) => <ActivityRow key={a.id} item={a} />)}
        {items.length === 0 && <p className="empty">Nothing here yet.</p>}
      </div>
    </Page>
  )
}
