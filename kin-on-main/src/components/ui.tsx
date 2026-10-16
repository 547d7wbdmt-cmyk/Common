import { useEffect, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BLOCK, rewardById, shopById, type Shop } from '../data'
import { shortDate, type Activity } from '../store'

const ICONS: Record<string, string> = {
  home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  block: 'M3 10h18l-1.5-5h-15zM4 10v10h16V10M9.5 20v-5h5v5M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0',
  card: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z',
  gift: 'M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1',
  activity: 'M4 6h16M4 12h16M4 18h10',
  back: 'M15 5l-7 7 7 7',
  chevron: 'M9 5l7 7-7 7',
  close: 'M6 6l12 12M18 6 6 18',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  check: 'M5 12l5 5 9-10',
  sun: 'M4 17a8 8 0 0 1 16 0zM12 3v2M4.9 6.9l1.4 1.4M19.1 6.9l-1.4 1.4M2 17h20',
  star: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z',
  arrows: 'M7 7h11l-3-3M17 17H6l3 3',
  pin: 'M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
}

export function Icon({ name, size = 22 }: { name: keyof typeof ICONS | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

/**
 * PLACEHOLDER MARK — the Kin on Main logo is TBD.
 * Follows the guide's direction (a rising half-sun that doubles as an awning arch over
 * three storefronts) so the layout is realistic. Swap this one component for the final art.
 */
export function KinMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="kin-mark">
      <rect width="32" height="32" rx="9" fill="var(--brick)" />
      <path d="M7 17a9 9 0 0 1 18 0z" fill="var(--gold)" />
      <path d="M6 19h20v7H6z" fill="#FAF4E8" />
      <path d="M12.7 19v7M19.3 19v7" stroke="var(--brick)" strokeWidth="1.6" />
    </svg>
  )
}

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Kin on Main home">
      <KinMark />
      <span className="logo-text">
        Kin on Main <small>{BLOCK.name}</small>
      </span>
    </Link>
  )
}

/** Endorsement line: legal footers and terms only, per the brand guide. */
export function Endorsement() {
  return (
    <footer className="endorse">
      <p>Kin Points have no cash value and can’t be exchanged for cash. <Link to="/terms">Program terms</Link></p>
      <p>A Kith &amp; Coin Collective program</p>
    </footer>
  )
}

/**
 * Wraps every screen. Top-level screens (no `back`) show the brand bar;
 * deeper screens show a back arrow to their parent route plus a title.
 */
export function Page({ title, back, children, action }: { title?: string; back?: string; children: ReactNode; action?: ReactNode }) {
  const navigate = useNavigate()
  useEffect(() => {
    document.title = title ? `${title} · Kin on Main` : 'Kin on Main'
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
    <svg className="qr" width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} role="img" aria-label="Member code">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#fff" />
      <g fill="#24304F">{cells}</g>
    </svg>
  )
}

export function ActivityRow({ item }: { item: Activity }) {
  const shop = item.kind === 'bonus' ? undefined : shopById(item.shopId)
  const title = item.kind === 'bonus' ? item.label : item.kind === 'use' ? rewardById(item.rewardId)?.title ?? 'Reward' : shop?.name
  const sub = item.kind === 'earn' ? 'Earned on a visit' : item.kind === 'use' ? `Used at ${shop?.name}` : 'Bonus Kin Points'

  return (
    <Link to={`/activity/${item.id}`} className="row">
      {shop ? <ShopBadge shop={shop} size={40} /> : <span className="shop-badge bonus-badge"><Icon name="sun" /></span>}
      <span className="row-main">
        <strong>{title}</strong>
        <small>{shortDate(item.date)} · {sub}</small>
      </span>
      <span className="row-end">
        {item.kind === 'use' ? <span className="pts-neg">−{item.points.toLocaleString()}</span> : <span className="pos">+{item.points.toLocaleString()}</span>}
        {item.kind === 'use' && item.crossShop && <span className="pill pill-teal">Cross-shop</span>}
      </span>
    </Link>
  )
}
