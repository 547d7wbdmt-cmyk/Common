import { useState } from 'react'
import { Page, TxnRow } from '../components/ui'
import { useWallet, type Txn } from '../store'

const FILTERS: { key: Txn['kind'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'payment', label: 'Payments' },
  { key: 'load', label: 'Funds added' },
  { key: 'redeem', label: 'Rewards' },
]

export default function Activity() {
  const { txns } = useWallet()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all')
  const list = txns.filter((t) => filter === 'all' || t.kind === filter)

  return (
    <Page title="Activity" back="/wallet">
      <div className="chips">
        {FILTERS.map((f) => (
          <button key={f.key} className={`chip${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>
      <div className="list">
        {list.map((t) => <TxnRow key={t.id} txn={t} />)}
        {list.length === 0 && <p className="empty">Nothing here yet.</p>}
      </div>
    </Page>
  )
}
