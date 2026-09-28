import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { CENTS_PER_POINT, POINTS_PER_DOLLAR, rewardById } from './data'

export type Txn =
  | { id: string; kind: 'load'; date: string; cents: number; method: string }
  | { id: string; kind: 'payment'; date: string; shopId: string; cents: number; pointsUsed: number; pointsEarned: number }
  | { id: string; kind: 'redeem'; date: string; shopId: string; rewardId: string; pointsUsed: number; code: string }

type WalletState = { cents: number; points: number; txns: Txn[] }

type Wallet = WalletState & {
  addFunds: (cents: number, method: string) => Txn
  pay: (shopId: string, totalCents: number, usePoints: boolean) => Txn
  redeem: (rewardId: string) => Txn
  reset: () => void
}

const STORAGE_KEY = 'ccc-wallet-v1'

const daysAgo = (d: number, h = 10) => {
  const t = new Date()
  t.setDate(t.getDate() - d)
  t.setHours(h, 15, 0, 0)
  return t.toISOString()
}

const SEED: WalletState = {
  cents: 4250,
  points: 820,
  txns: [
    { id: 't4', kind: 'payment', date: daysAgo(1, 8), shopId: 'maple-coffee', cents: 575, pointsUsed: 0, pointsEarned: 25 },
    { id: 't3', kind: 'payment', date: daysAgo(2, 17), shopId: 'green-leaf', cents: 3420, pointsUsed: 0, pointsEarned: 170 },
    { id: 't2', kind: 'redeem', date: daysAgo(4, 9), shopId: 'rosas-bakery', rewardId: 'r-croissant', pointsUsed: 350, code: 'CCC-7Q2K' },
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
const newCode = () => 'CCC-' + Math.random().toString(36).slice(2, 6).toUpperCase()

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

  const wallet: Wallet = {
    ...state,
    addFunds: (cents, method) =>
      push(
        { id: newId(), kind: 'load', date: new Date().toISOString(), cents, method },
        { cents: state.cents + cents, points: state.points },
      ),
    pay: (shopId, totalCents, usePoints) => {
      const pointsUsed = usePoints ? pointsApplicable(state.points, totalCents) : 0
      const cents = totalCents - pointsUsed * CENTS_PER_POINT
      if (cents > state.cents) throw new Error('Insufficient funds')
      const pointsEarned = Math.floor((cents / 100) * POINTS_PER_DOLLAR)
      return push(
        { id: newId(), kind: 'payment', date: new Date().toISOString(), shopId, cents, pointsUsed, pointsEarned },
        { cents: state.cents - cents, points: state.points - pointsUsed + pointsEarned },
      )
    },
    redeem: (rewardId) => {
      const reward = rewardById(rewardId)
      if (!reward || reward.points > state.points) throw new Error('Not enough points')
      return push(
        { id: newId(), kind: 'redeem', date: new Date().toISOString(), shopId: reward.shopId, rewardId, pointsUsed: reward.points, code: newCode() },
        { cents: state.cents, points: state.points - reward.points },
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

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
