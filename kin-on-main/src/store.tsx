import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { PASSPORT_BONUS, PASSPORT_GOAL, WELCOME_POINTS, pointsRate, rewardById } from './data'

export type Activity =
  | { id: string; kind: 'earn'; date: string; shopId: string; purchaseCents: number; points: number }
  | { id: string; kind: 'use'; date: string; shopId: string; rewardId: string; points: number; code: string; crossShop: boolean }
  | { id: string; kind: 'bonus'; date: string; label: string; points: number }

export type Member = { name: string; contact: string; memberId: string; since: string }

type State = {
  member: Member | null
  points: number
  activity: Activity[]
  smsOptIn: boolean
  emailOptIn: boolean
  /** Months ("2026-10") whose Block Passport bonus was already added. */
  passportsClaimed: string[]
}

type Store = State & {
  join: (name: string, contact: string, smsOptIn: boolean, emailOptIn: boolean) => void
  exploreSample: () => void
  earn: (shopId: string, purchaseCents: number) => Extract<Activity, { kind: 'earn' }>
  redeem: (rewardId: string) => Extract<Activity, { kind: 'use' }>
  claimPassport: () => void
  setPrefs: (p: Partial<Pick<State, 'smsOptIn' | 'emailOptIn'>>) => void
  reset: () => void
}

const STORAGE_KEY = 'kin-on-main-v1'

const daysAgo = (d: number, h = 10) => {
  const t = new Date()
  t.setDate(t.getDate() - d)
  t.setHours(h, 15, 0, 0)
  return t.toISOString()
}

const EMPTY: State = { member: null, points: 0, activity: [], smsOptIn: false, emailOptIn: false, passportsClaimed: [] }

/** A member a few weeks in, so every screen has something to show. */
const sample = (): State => ({
  member: { name: 'Dani Ruiz', contact: 'dani@example.com', memberId: 'KOM-48213', since: daysAgo(40) },
  points: 865,
  smsOptIn: false,
  emailOptIn: true,
  passportsClaimed: [],
  activity: [
    { id: 'a7', kind: 'earn', date: daysAgo(0, 8), shopId: 'corner-grind', purchaseCents: 650, points: 65 },
    { id: 'a6', kind: 'earn', date: daysAgo(1, 18), shopId: 'mercado-verde', purchaseCents: 3840, points: 384 },
    { id: 'a5', kind: 'use', date: daysAgo(3, 9), shopId: 'panaderia-sol', rewardId: 'r-concha', points: 250, code: 'KIN-7Q2K', crossShop: true },
    { id: 'a4', kind: 'earn', date: daysAgo(4, 13), shopId: 'la-cuadra', purchaseCents: 2210, points: 221 },
    { id: 'a3', kind: 'earn', date: daysAgo(9, 8), shopId: 'corner-grind', purchaseCents: 525, points: 52 },
    { id: 'a2', kind: 'earn', date: daysAgo(15, 11), shopId: 'eighteenth-hardware', purchaseCents: 2930, points: 293 },
    { id: 'a1', kind: 'bonus', date: daysAgo(40, 12), label: 'Welcome to Kin on Main', points: WELCOME_POINTS },
  ],
})

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as State) }
  } catch {
    /* storage unavailable: start fresh */
  }
  return EMPTY
}

const newId = () => Math.random().toString(36).slice(2, 10)
const newCode = () => 'KIN-' + Math.random().toString(36).slice(2, 6).toUpperCase()
const newMemberId = () => 'KOM-' + String(Math.floor(10000 + Math.random() * 90000))
export const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
export const monthName = (d = new Date()) => d.toLocaleString('en-US', { month: 'long' })

/** Distinct member businesses visited (earned at) this month. */
export const passportStamps = (activity: Activity[]) => {
  const month = monthKey()
  const ids = activity.filter((a) => a.kind === 'earn' && monthKey(new Date(a.date)) === month).map((a) => (a as { shopId: string }).shopId)
  return [...new Set(ids)]
}

export const visitsThisYear = (activity: Activity[]) => {
  const year = new Date().getFullYear()
  return activity.filter((a) => a.kind === 'earn' && new Date(a.date).getFullYear() === year).length
}

const StoreContext = createContext<Store | null>(null)

export function MemberProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const add = <A extends Activity>(a: A, delta: number) => {
    setState((s) => ({ ...s, points: s.points + delta, activity: [a, ...s.activity] }))
    return a
  }

  const store: Store = {
    ...state,
    join: (name, contact, smsOptIn, emailOptIn) =>
      setState({
        ...EMPTY,
        member: { name, contact, memberId: newMemberId(), since: new Date().toISOString() },
        smsOptIn,
        emailOptIn,
        points: WELCOME_POINTS,
        activity: [{ id: newId(), kind: 'bonus', date: new Date().toISOString(), label: 'Welcome to Kin on Main', points: WELCOME_POINTS }],
      }),
    exploreSample: () => setState(sample()),
    earn: (shopId, purchaseCents) => {
      const points = Math.floor((purchaseCents / 100) * pointsRate(shopId))
      return add({ id: newId(), kind: 'earn', date: new Date().toISOString(), shopId, purchaseCents, points }, points)
    },
    redeem: (rewardId) => {
      const reward = rewardById(rewardId)
      if (!reward || reward.points > state.points) throw new Error('Not enough Kin Points')
      const lastEarn = state.activity.find((a) => a.kind === 'earn')
      const crossShop = !!lastEarn && lastEarn.kind === 'earn' && lastEarn.shopId !== reward.shopId
      return add({ id: newId(), kind: 'use', date: new Date().toISOString(), shopId: reward.shopId, rewardId, points: reward.points, code: newCode(), crossShop }, -reward.points)
    },
    claimPassport: () => {
      const month = monthKey()
      if (state.passportsClaimed.includes(month) || passportStamps(state.activity).length < PASSPORT_GOAL) return
      setState((s) => ({
        ...s,
        points: s.points + PASSPORT_BONUS,
        passportsClaimed: [...s.passportsClaimed, month],
        activity: [{ id: newId(), kind: 'bonus', date: new Date().toISOString(), label: 'Block Passport complete', points: PASSPORT_BONUS }, ...s.activity],
      }))
    },
    setPrefs: (p) => setState((s) => ({ ...s, ...p })),
    reset: () => setState(EMPTY),
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useMember() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useMember must be used inside MemberProvider')
  return ctx
}

export const pts = (n: number) => `${n.toLocaleString()} Kin Points`

export const dollars = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
