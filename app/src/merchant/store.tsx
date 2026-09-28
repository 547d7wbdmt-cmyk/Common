import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { CENTS_PER_POINT } from '../data'
import {
  bonusOn, dayKey, feeFor, pointsFor, seedState,
  type BonusEvent, type MerchantState, type MReward, type MTxn, type Role, type ShopProfile, type Staff, type Voucher,
} from './data'

const STORAGE_KEY = 'cw-merchant-v1'

type Merchant = MerchantState & {
  me: Staff
  role: Role
  setCurrentStaff: (id: string) => void
  /** Record a payment. `source` says who started it: the member (scanned the shop code) or the shop (charged the member). */
  charge: (memberId: string, total: number, source: 'member' | 'shop', pointsApplied?: number) => MTxn
  refund: (txnId: string, amount: number) => MTxn
  findVoucher: (code: string) => Voucher | undefined
  redeemVoucher: (code: string) => MTxn
  saveReward: (reward: MReward) => void
  saveBonus: (bonus: BonusEvent) => void
  deleteBonus: (id: string) => void
  saveStaff: (staff: Staff) => void
  removeStaff: (id: string) => void
  saveProfile: (profile: ShopProfile) => void
  reset: () => void
}

function load(): MerchantState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as MerchantState
  } catch {
    /* storage unavailable: use sample data */
  }
  return seedState()
}

const newId = (prefix: string) => prefix + Math.random().toString(36).slice(2, 8).toUpperCase()
const normalizeCode = (code: string) => code.trim().toUpperCase().replace(/\s+/g, '').replace(/^CW-?/, 'CW-')

/** Refunded so far against a payment (positive cents). */
export const refundedAmount = (txns: MTxn[], id: string) =>
  -txns.filter((t) => t.refundOf === id).reduce((s, t) => s + t.total, 0)

export const activeBonus = (bonuses: BonusEvent[]) => bonusOn(bonuses, dayKey(new Date()))
export const todayKey = () => dayKey(new Date())
export const greeting = (h = new Date().getHours()) => (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')

const MerchantContext = createContext<Merchant | null>(null)

export function MerchantProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MerchantState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const me = state.staff.find((s) => s.id === state.currentStaffId) ?? state.staff[0]
  const addTxn = (txn: MTxn, patch: Partial<MerchantState> = {}) => {
    setState((s) => ({ ...s, ...patch, txns: [txn, ...s.txns] }))
    return txn
  }

  const merchant: Merchant = {
    ...state,
    me,
    role: me.role,
    setCurrentStaff: (id) => setState((s) => ({ ...s, currentStaffId: id })),
    charge: (memberId, total, source, pointsApplied = 0) => {
      const multiplier = activeBonus(state.bonuses)?.multiplier ?? 1
      const fromBalance = total - pointsApplied * CENTS_PER_POINT
      return addTxn({
        id: newId('M'), date: new Date().toISOString(), memberId, kind: 'payment', total, pointsApplied,
        pointsIssued: pointsFor(fromBalance, multiplier), fee: feeFor(total), staff: me.name, source,
        ...(multiplier > 1 ? { multiplier } : {}),
      })
    },
    refund: (txnId, amount) => {
      const original = state.txns.find((t) => t.id === txnId)
      if (!original || original.kind !== 'payment') throw new Error('Only payments can be refunded')
      if (amount <= 0 || amount > original.total - refundedAmount(state.txns, txnId)) throw new Error('Refund is more than what is left')
      return addTxn({
        id: newId('R'), date: new Date().toISOString(), memberId: original.memberId, kind: 'refund', total: -amount,
        pointsApplied: 0, pointsIssued: -Math.round((original.pointsIssued * amount) / original.total), fee: 0,
        staff: me.name, refundOf: txnId,
      })
    },
    findVoucher: (code) => state.vouchers.find((v) => v.code === normalizeCode(code)),
    redeemVoucher: (code) => {
      const v = state.vouchers.find((x) => x.code === normalizeCode(code))
      const reward = v && state.rewards.find((r) => r.id === v.rewardId)
      if (!v || !reward || v.usedAt) throw new Error('Code is not valid')
      const date = new Date().toISOString()
      return addTxn(
        { id: newId('M'), date, memberId: v.memberId, kind: 'reward', total: reward.points * CENTS_PER_POINT, pointsApplied: reward.points, pointsIssued: 0, fee: 0, staff: me.name, rewardId: reward.id, code: v.code },
        { vouchers: state.vouchers.map((x) => (x.code === v.code ? { ...x, usedAt: date } : x)) },
      )
    },
    saveReward: (reward) =>
      setState((s) => ({
        ...s,
        rewards: s.rewards.some((r) => r.id === reward.id) ? s.rewards.map((r) => (r.id === reward.id ? reward : r)) : [...s.rewards, reward],
      })),
    saveBonus: (bonus) =>
      setState((s) => ({
        ...s,
        bonuses: (s.bonuses.some((b) => b.id === bonus.id) ? s.bonuses.map((b) => (b.id === bonus.id ? bonus : b)) : [...s.bonuses, bonus])
          .sort((a, b) => a.start.localeCompare(b.start)),
      })),
    deleteBonus: (id) => setState((s) => ({ ...s, bonuses: s.bonuses.filter((b) => b.id !== id) })),
    saveStaff: (staff) =>
      setState((s) => ({
        ...s,
        staff: s.staff.some((x) => x.id === staff.id) ? s.staff.map((x) => (x.id === staff.id ? staff : x)) : [...s.staff, staff],
      })),
    removeStaff: (id) => setState((s) => ({ ...s, staff: s.staff.filter((x) => x.id !== id) })),
    saveProfile: (profile) => setState((s) => ({ ...s, profile })),
    reset: () => setState(seedState()),
  }

  return <MerchantContext.Provider value={merchant}>{children}</MerchantContext.Provider>
}

export function useMerchant() {
  const ctx = useContext(MerchantContext)
  if (!ctx) throw new Error('useMerchant must be used inside MerchantProvider')
  return ctx
}

export const newRewardId = () => newId('r-')
export const newBonusId = () => newId('b-')
export const newStaffId = () => newId('s-')

export const timeOnly = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
export const dayLabel = (k: string) =>
  new Date(k.length === 10 ? k + 'T12:00:00' : k).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
