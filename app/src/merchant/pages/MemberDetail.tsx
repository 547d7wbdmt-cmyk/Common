import { useParams } from 'react-router-dom'
import { money } from '../../store'
import { memberSummaries } from '../data'
import { useMerchant } from '../store'
import { MPage, MTxnRow, Stat } from '../ui'

export default function MemberDetail() {
  const { memberId = '' } = useParams()
  const id = decodeURIComponent(memberId)
  const { txns } = useMerchant()
  const summary = memberSummaries(txns).find((m) => m.id === id)
  const theirs = txns.filter((t) => t.memberId === id)

  if (!summary) {
    return <MPage title="Member" back="/merchant/members" section="members"><p className="empty">No visits from that member yet.</p></MPage>
  }
  return (
    <MPage title={id} back="/merchant/members" section="members">
      <div className="m-stats m-stats-2">
        <Stat label="Visits" value={String(summary.visits)} />
        <Stat label="Total spent" value={money(summary.spent)} />
      </div>
      <p className="muted">A CommonWealth member ID is unique across the Collective. Names and contact details stay private to the member.</p>
      <h2 className="label">Their transactions at your shop</h2>
      <div className="list">{theirs.map((t) => <MTxnRow key={t.id} txn={t} showDate />)}</div>
    </MPage>
  )
}
