import { useEffect, useId, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { rewardById, shopById, type Shop } from '../data'
import { money, shortDate, type Txn } from '../store'

const ICONS: Record<string, string> = {
  home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  shops: 'M4 9h16l-1-5H5zM5 9v11h14V9M9 20v-6h6v6',
  pay: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z',
  gift: 'M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1',
  wallet: 'M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2zM16 14h1',
  back: 'M15 5l-7 7 7 7',
  chevron: 'M9 5l7 7-7 7',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  check: 'M5 12l5 5 9-10',
  scan: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16',
}

export function Icon({ name, size = 22 }: { name: keyof typeof ICONS | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

/**
 * CommonWealth mark: a coin with a storefront awning inside, traced from the
 * official artwork (brand/logos/commonwealth-mark.png). Uses the --logo-* tokens,
 * so dark mode gets the reverse coin. Minimum size 24px.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  const px = Math.max(size, 24)
  const clipId = 'awning-' + useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg width={px} height={px} viewBox="72 72 576 576" aria-hidden="true" className="brand-mark">
      <defs>
        <clipPath id={clipId}>
          <circle cx="360" cy="360" r="252" />
        </clipPath>
      </defs>
      <circle cx="360" cy="360" r="288" fill="var(--logo-coin)" />
      <g clipPath={`url(#${clipId})`}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} fill={i % 2 ? 'var(--logo-face)' : 'var(--logo-awning)'}>
            <rect x={60 + 150 * i} y="100" width="150" height="223" />
            <circle cx={135 + 150 * i} cy="323" r="75" />
          </g>
        ))}
      </g>
      <polygon points="127,456 593,456 579,486 141,486" fill="var(--logo-awning)" />
    </svg>
  )
}

/** Full lockup, matching the official artwork: mark, two-tone wordmark, endorser line. */
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="CommonWealth by Common Cents Collective, home">
      <BrandMark />
      <span className="logo-text">
        <span className="wordmark">
          <span className="wm-common">Common</span>
          <span className="wm-wealth">Wealth</span>
        </span>
        <span className="endorser">by Common Cents Collective</span>
      </span>
    </Link>
  )
}

/**
 * Wraps every screen. Top-level screens (no `back`) show the brand bar;
 * deeper screens show a back arrow to their parent route plus a title.
 */
export function Page({ title, back, children, action }: { title?: string; back?: string; children: ReactNode; action?: ReactNode }) {
  const navigate = useNavigate()
  useEffect(() => {
    document.title = title ? `${title} · CommonWealth` : 'CommonWealth'
    window.scrollTo(0, 0)
  }, [title])

  return (
    <>
      <header className="topbar">
        {back ? (
          <>
            <button className="icon-btn" onClick={() => navigate(back)} aria-label="Back">
              <Icon name="back" />
            </button>
            <h1 className="topbar-title">{title}</h1>
          </>
        ) : (
          <Logo />
        )}
        <div className="topbar-action">
          {action ?? (
            <Link to="/profile" className="icon-btn" aria-label="Profile">
              <Icon name="user" />
            </Link>
          )}
        </div>
      </header>
      <main className="content">{children}</main>
    </>
  )
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ShopBadge({ shop, size = 44 }: { shop: Shop; size?: number }) {
  return (
    <span className="shop-badge" style={{ background: shop.color, width: size, height: size, fontSize: size * 0.5 }}>
      {shop.emoji}
    </span>
  )
}

/** Decorative QR-style code derived from a string. Not scannable; for the prototype only. */
export function FakeQr({ value, size = 180 }: { value: string; size?: number }) {
  const n = 21
  let seed = [...value].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) >>> 16) & 1
  const finder = (x: number, y: number) =>
    [[0, 0], [n - 7, 0], [0, n - 7]].some(([fx, fy]) => {
      const dx = x - fx, dy = y - fy
      if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return false
      return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
    })
  const inFinderZone = (x: number, y: number) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)
  const cells: ReactNode[] = []
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const on = inFinderZone(x, y) ? finder(x, y) : rand() === 1
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />)
    }
  return (
    <svg className="qr" width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} role="img" aria-label="QR code">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#ffffff" />
      <g fill="#14201c">{cells}</g>
    </svg>
  )
}

export function TxnRow({ txn }: { txn: Txn }) {
  const shop = txn.kind === 'load' ? undefined : shopById(txn.shopId)
  const title = txn.kind === 'load' ? 'Added funds' : txn.kind === 'redeem' ? rewardById(txn.rewardId)?.title ?? 'Reward' : shop?.name
  const amount =
    txn.kind === 'load' ? <span className="pos">+{money(txn.cents)}</span>
    : txn.kind === 'payment' ? <span>−{money(txn.cents)}</span>
    : <span className="pts-neg">−{txn.pointsUsed} points</span>
  const sub =
    txn.kind === 'payment' ? `+${txn.pointsEarned} points earned` : txn.kind === 'redeem' ? `Reward · ${shop?.name}` : txn.method

  return (
    <Link to={`/wallet/activity/${txn.id}`} className="row">
      {shop ? <ShopBadge shop={shop} size={40} /> : <span className="shop-badge load-badge"><Icon name="plus" /></span>}
      <span className="row-main">
        <strong>{title}</strong>
        <small>{shortDate(txn.date)} · {sub}</small>
      </span>
      <span className="row-end">{amount}</span>
    </Link>
  )
}
