import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark, Icon } from '../components/ui'
import { money } from '../store'
import { canAccess, ROLES, type MTxn, type Section } from './data'
import { timeOnly, useMerchant } from './store'

/**
 * Common Cents Collective lockup (after brand/logos/common-cents-collective-lockup.png).
 * Merchant-facing materials lead with the Collective per the brand guide.
 */
export function CollectiveLogo() {
  return (
    <Link to="/merchant" className="ccc-logo" aria-label="Common Cents Collective merchant portal, home">
      <BrandMark size={40} />
      <span className="ccc-text">
        <span className="ccc-name">Common Cents</span>
        <span className="ccc-collective">Collective</span>
      </span>
    </Link>
  )
}

/** A merchant screen: title bar plus content, with a permission check for the section. */
export function MPage({ title, back, actions, section, children }: {
  title: string; back?: string; actions?: ReactNode; section?: Section; children: ReactNode
}) {
  const { role } = useMerchant()
  useEffect(() => {
    document.title = `${title} · Merchant portal`
    window.scrollTo(0, 0)
  }, [title])
  const allowed = !section || canAccess(role, section)

  return (
    <>
      <header className="m-topbar">
        {back ? (
          <Link to={back} className="icon-btn" aria-label="Back"><Icon name="back" /></Link>
        ) : (
          <span className="m-topbar-mark"><BrandMark size={30} /></span>
        )}
        <h1 className="m-title">{title}</h1>
        {allowed && actions && <div className="m-actions">{actions}</div>}
      </header>
      <main className="m-content">{allowed ? children : <NoAccess />}</main>
    </>
  )
}

function NoAccess() {
  const { role } = useMerchant()
  return (
    <div className="m-empty-state">
      <h2>This page isn't part of the {ROLES[role].label.toLowerCase()} role</h2>
      <p className="muted">{ROLES[role].label}s can use: {ROLES[role].summary.toLowerCase()}. Ask the shop owner if you need more access.</p>
      <Link to="/merchant/counter" className="btn btn-primary">Go to Counter</Link>
    </div>
  )
}

export function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: ReactNode; tone?: 'earned' }) {
  return (
    <div className="m-stat">
      <span className="m-stat-label">{label}</span>
      <strong className={tone === 'earned' ? 'earned' : undefined}>{value}</strong>
      {sub && <small>{sub}</small>}
    </div>
  )
}

export function useKindLabel() {
  const { rewards } = useMerchant()
  return (t: MTxn) =>
    t.kind === 'payment' ? 'Payment' : t.kind === 'refund' ? 'Refund' : rewards.find((r) => r.id === t.rewardId)?.title ?? 'Reward'
}

/** One ledger line. Shows only the member ID, never personal details. */
export function MTxnRow({ txn, showDate }: { txn: MTxn; showDate?: boolean }) {
  const kindLabel = useKindLabel()
  const sub = [
    showDate ? new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + timeOnly(txn.date) : timeOnly(txn.date),
    txn.kind === 'reward' ? `Reward · ${txn.pointsApplied} points` : null,
    txn.kind === 'payment' && txn.pointsApplied > 0 ? `${txn.pointsApplied} points applied` : null,
  ].filter(Boolean).join(' · ')
  return (
    <Link to={`/merchant/transactions/${txn.id}`} className="row">
      <span className={`m-kind m-kind-${txn.kind}`} aria-hidden="true">
        <Icon name={txn.kind === 'payment' ? 'pay' : txn.kind === 'refund' ? 'refund' : 'gift'} size={18} />
      </span>
      <span className="row-main">
        <strong>{kindLabel(txn)} <span className="m-member">{txn.memberId}</span></strong>
        <small>{sub}</small>
      </span>
      <span className="row-end">{txn.kind === 'refund' ? '−' + money(-txn.total) : money(txn.total)}</span>
    </Link>
  )
}

/** Single-series bar chart of daily sales. Hover or focus a bar for its value; a table view is included. */
export function SalesChart({ days }: { days: { key: string; label: string; value: number; closed?: boolean }[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(640)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const max = Math.max(...days.map((d) => d.value), 1)
  const steps = [2500, 5000, 10000, 20000, 25000, 50000, 100000]
  const step = steps.find((s) => max / s <= 4) ?? 100000
  const top = Math.ceil(max / step) * step
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
  const W = width, H = 200, padL = 48, padB = 26, padT = 20
  const plotW = W - padL, plotH = H - padB - padT
  const slot = plotW / days.length
  const barW = Math.min(44, slot - 10)
  const y = (v: number) => padT + plotH - (v / top) * plotH
  const last = days.length - 1

  return (
    <figure className="m-chart">
      <div className="m-chart-plot" ref={ref}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Sales for the last 7 days">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={W} y1={y(t)} y2={y(t)} className="m-grid" />
              <text x={padL - 8} y={y(t) + 4} textAnchor="end" className="m-axis">{t === 0 ? '$0' : '$' + t / 100}</text>
            </g>
          ))}
          {days.map((d, i) => {
            const x = padL + i * slot + (slot - barW) / 2
            const h = Math.max(0, (d.value / top) * plotH)
            const r = Math.min(4, h / 2)
            return (
              <g key={d.key} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                 onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}
                 aria-label={`${d.label}: ${d.closed ? 'closed' : money(d.value)}`}>
                <rect x={padL + i * slot} y={padT} width={slot} height={plotH} fill="transparent" />
                {h > 0 && (
                  <path className={`m-bar${hover === i ? ' is-hover' : ''}`}
                    d={`M${x},${y(0)} V${y(0) - h + r} Q${x},${y(0) - h} ${x + r},${y(0) - h} H${x + barW - r} Q${x + barW},${y(0) - h} ${x + barW},${y(0) - h + r} V${y(0)} Z`} />
                )}
                <text x={x + barW / 2} y={H - 8} textAnchor="middle" className={`m-axis${i === last ? ' m-axis-strong' : ''}`}>{d.label}</text>
                {i === last && d.value > 0 && hover === null && (
                  <text x={x + barW / 2} y={y(d.value) - 6} textAnchor="middle" className="m-value">{money(d.value)}</text>
                )}
              </g>
            )
          })}
        </svg>
        {hover !== null && (
          <div className="m-tooltip" style={{ left: `${((padL + hover * slot + slot / 2) / W) * 100}%` }}>
            <strong>{days[hover].closed ? 'Closed' : money(days[hover].value)}</strong>
            <span>{days[hover].label}</span>
          </div>
        )}
      </div>
      <details className="m-table-toggle">
        <summary>Show as table</summary>
        <table>
          <thead><tr><th>Day</th><th>Sales</th></tr></thead>
          <tbody>{days.map((d) => <tr key={d.key}><td>{d.label}</td><td>{d.closed ? 'Closed' : money(d.value)}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  )
}
