import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { CENTS_PER_POINT, POINTS_EXPIRE_MONTHS, POINTS_PER_DOLLAR, rewardById } from './data'

export type Txn =
  | { id: string; kind: 'load'; date: string; cents: number; method: string }
  | { id: string; kind: 'payment'; date: string; shopId: string; cents: number; pointsUsed: number; pointsEarned: number }
  | { id: string; kind: 'redeem'; date: string; shopId: string; rewardId: string; pointsUsed: number; code: string }

/** A batch of points earned at one time. Each batch expires POINTS_EXPIRE_MONTHS after `earned`. */
export type PointLot = { earned: string; points: number }

type WalletState = { cents: number; lots: PointLot[]; txns: Txn[] }

type Wallet = Omit<WalletState, 'lots'> & {
  /** Points that haven't expired. */
  points: number
  /** Unexpired batches, oldest first. */
  lots: PointLot[]
  /** The next batch to expire, if any. */
  nextExpiry: { points: number; date: string } | null
  addFunds: (cents: number, method: string) => Txn
  pay: (shopId: string, totalCents: number, usePoints: boolean) => Txn
  redeem: (rewardId: string) => Txn
  reset: () => void
}

const STORAGE_KEY = 'cw-wallet-v3'

const daysAgo = (d: number, h = 10) => {
  const t = new Date()
  t.setDate(t.getDate() - d)
  t.setHours(h, 15, 0, 0)
  return t.toISOString()
}

export function expiresOn(earned: string) {
  const d = new Date(earned)
  d.setMonth(d.getMonth() + POINTS_EXPIRE_MONTHS)
  return d.toISOString()
}

const activeLots = (lots: PointLot[], now = Date.now()) =>
  lots.filter((l) => l.points > 0 && new Date(expiresOn(l.earned)).getTime() > now)
    .sort((a, b) => a.earned.localeCompare(b.earned))

/** Spend points oldest-first; returns the remaining batches. */
function spend(lots: PointLot[], amount: number): PointLot[] {
  let left = amount
  return activeLots(lots).map((l) => {
    const take = Math.min(l.points, left)
    left -= take
    return { ...l, points: l.points - take }
  }).filter((l) => l.points > 0)
}

const SEED: WalletState = {
  cents: 4250,
  // 820 points in total; the oldest batch expires in about two weeks.
  lots: [
    { earned: daysAgo(170, 12), points: 300 },
    { earned: daysAgo(95, 15), points: 325 },
    { earned: daysAgo(2, 17), points: 170 },
    { earned: daysAgo(1, 8), points: 25 },
  ],
  txns: [
    { id: 't4', kind: 'payment', date: daysAgo(1, 8), shopId: 'maple-coffee', cents: 575, pointsUsed: 0, pointsEarned: 25 },
    { id: 't3', kind: 'payment', date: daysAgo(2, 17), shopId: 'green-leaf', cents: 3420, pointsUsed: 0, pointsEarned: 170 },
    { id: 't2', kind: 'redeem', date: daysAgo(4, 9), shopId: 'rosas-bakery', rewardId: 'r-croissant', pointsUsed: 350, code: 'CW-7Q2K' },
    { id: 't1', kind: 'load', date: daysAgo(6, 12), cents: 10000, method: 'Checking •••• 4821' },
  ],
}

function load(): WalletState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as WalletState
  } catch {
    /* storage unavailable: fall back to seed */
  }
  return SEED
}

const newId = () => Math.random().toString(36).slice(2, 10)
const newCode = () => 'CW-' + Math.random().toString(36).slice(2, 6).toUpperCase()

/** How much of a bill can be covered with points (whole cents only). */
export function pointsApplicable(points: number, totalCents: number) {
  return Math.min(points, Math.floor(totalCents / CENTS_PER_POINT))
}

const WalletContext = createContext<Wallet | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const push = (txn: Txn, next: Omit<WalletState, 'txns'>) => {
    setState((s) => ({ ...next, txns: [txn, ...s.txns] }))
    return txn
  }

  const lots = activeLots(state.lots)
  const points = lots.reduce((sum, l) => sum + l.points, 0)
  const nextExpiry = lots.length ? { points: lots[0].points, date: expiresOn(lots[0].earned) } : null

  const wallet: Wallet = {
    cents: state.cents,
    txns: state.txns,
    lots,
    points,
    nextExpiry,
    addFunds: (cents, method) =>
      push(
        { id: newId(), kind: 'load', date: new Date().toISOString(), cents, method },
        { cents: state.cents + cents, lots },
      ),
    pay: (shopId, totalCents, usePoints) => {
      const pointsUsed = usePoints ? pointsApplicable(points, totalCents) : 0
      const cents = totalCents - pointsUsed * CENTS_PER_POINT
      if (cents > state.cents) throw new Error('Insufficient funds')
      const pointsEarned = Math.floor((cents / 100) * POINTS_PER_DOLLAR)
      const date = new Date().toISOString()
      const remaining = spend(lots, pointsUsed)
      return push(
        { id: newId(), kind: 'payment', date, shopId, cents, pointsUsed, pointsEarned },
        { cents: state.cents - cents, lots: pointsEarned ? [...remaining, { earned: date, points: pointsEarned }] : remaining },
      )
    },
    redeem: (rewardId) => {
      const reward = rewardById(rewardId)
      if (!reward || reward.points > points) throw new Error('Not enough points')
      return push(
        { id: newId(), kind: 'redeem', date: new Date().toISOString(), shopId: reward.shopId, rewardId, pointsUsed: reward.points, code: newCode() },
        { cents: state.cents, lots: spend(lots, reward.points) },
      )
    },
    reset: () => setState(SEED),
  }

  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}

export const money = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export const pointsValue = (points: number) => money(points * CENTS_PER_POINT)

/** True when a date is within the next 30 days (used to flag points about to expire). */
export const isExpiringSoon = (iso: string) => new Date(iso).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000

/** Expiry date for points earned right now. */
export const expiryForNewPoints = () => expiresOn(new Date().toISOString())

export const dayDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
