// Merchant portal model and sample data (demo shop: Rosa's Bakery).
import { CENTS_PER_POINT, POINTS_PER_DOLLAR, REWARDS } from '../data'

export const SHOP_ID = 'rosas-bakery'
/** Processing fee per payment. Deposits arrive the next business day. */
export const FEE_RATE = 0.02
/** Who pays for the points members earn at a shop. Not decided yet; nothing is deducted for it. */
export const POINTS_FUNDING = 'To be decided'
/** Membership fee each shop pays the Collective, billed every 6 months. Placeholder amount (cents). */
export const MEMBERSHIP_FEE = 15000
export const MEMBERSHIP_MONTHS = 6
/** Days after the due date before a membership shows as past due. */
export const MEMBERSHIP_GRACE_DAYS = 15

export type BillingMethod = 'bank' | 'card' | 'deposit'
export const BILLING_METHODS: Record<BillingMethod, { label: string; sub: string }> = {
  bank: { label: 'Checking •••• 3390', sub: 'Bank transfer · arrives in 1–2 business days' },
  card: { label: 'Business card •••• 4417', sub: 'Charged right away' },
  deposit: { label: 'Take it from my next deposit', sub: 'Deducted from your next daily deposit' },
}

/** One paid membership period. Day keys are YYYY-MM-DD; the period runs from start up to (not including) end. */
export type Invoice = {
  id: string
  periodStart: string
  periodEnd: string
  amount: number
  paidAt: string
  method: BillingMethod
  /** For 'deposit' payments: the deposit it was taken from. */
  deductedOn?: string
}
export type Membership = { joined: string; autopay: boolean; autopayMethod: BillingMethod; invoices: Invoice[] }

/** The member from the member-app demo, so the two sides line up. */
export const DEMO_MEMBER = 'CW 2048 7731'

export type Role = 'owner' | 'manager' | 'cashier'
export const ROLES: Record<Role, { label: string; summary: string }> = {
  owner: { label: 'Owner', summary: 'Everything, including payouts and the bank account' },
  manager: { label: 'Manager', summary: 'Everything except payouts and the bank account' },
  cashier: { label: 'Cashier', summary: 'Counter only: take payments and check reward codes' },
}

export type Section = 'today' | 'counter' | 'transactions' | 'rewards' | 'members' | 'payouts' | 'membership' | 'settings'
const ACCESS: Record<Section, Role[]> = {
  today: ['owner', 'manager'],
  counter: ['owner', 'manager', 'cashier'],
  transactions: ['owner', 'manager'],
  rewards: ['owner', 'manager'],
  members: ['owner', 'manager'],
  payouts: ['owner'],
  membership: ['owner'],
  settings: ['owner', 'manager'],
}
export const canAccess = (role: Role, section: Section) => ACCESS[section].includes(role)

export type Staff = { id: string; name: string; role: Role }

/**
 * One line in the shop's ledger. Amounts are cents.
 * - payment: `total` is the sale; `pointsApplied` of it was paid with points (reimbursed at face value).
 * - reward: a member redeemed one of the shop's rewards; `total` is the points' face value, reimbursed.
 * - refund: negative `total`, linked to the payment it reverses.
 */
export type MTxn = {
  id: string
  date: string
  memberId: string
  kind: 'payment' | 'reward' | 'refund'
  total: number
  pointsApplied: number
  pointsIssued: number
  fee: number
  staff: string
  source?: 'member' | 'shop'
  multiplier?: number
  rewardId?: string
  code?: string
  refundOf?: string
}

export type MReward = { id: string; title: string; points: number; details: string; active: boolean }
/** Bonus points event; `start`/`end` are inclusive day keys (YYYY-MM-DD). */
export type BonusEvent = { id: string; title: string; multiplier: number; start: string; end: string }
export type Voucher = { code: string; rewardId: string; memberId: string; issued: string; usedAt?: string }
export type ShopProfile = { name: string; address: string; hours: string; phone: string; about: string }

export type MerchantState = {
  profile: ShopProfile
  staff: Staff[]
  currentStaffId: string
  txns: MTxn[]
  rewards: MReward[]
  bonuses: BonusEvent[]
  vouchers: Voucher[]
  membership: Membership
}

// ---------- money rules ----------
export const feeFor = (total: number) => Math.round(total * FEE_RATE)
export const pointsFor = (paidFromBalance: number, multiplier = 1) =>
  Math.floor((paidFromBalance / 100) * POINTS_PER_DOLLAR * multiplier)
/** What a ledger line adds to (or takes from) the shop's deposit. */
export const depositFor = (t: MTxn) => t.total - t.fee

// ---------- dates ----------
const pad = (n: number) => String(n).padStart(2, '0')
export const dayKey = (d: Date | string) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`
}
export const fromKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const addDays = (k: string, n: number) => {
  const d = fromKey(k)
  d.setDate(d.getDate() + n)
  return dayKey(d)
}
export const addMonths = (k: string, n: number) => {
  const d = fromKey(k)
  d.setMonth(d.getMonth() + n)
  return dayKey(d)
}
export const daysBetween = (a: string, b: string) => Math.round((fromKey(b).getTime() - fromKey(a).getTime()) / 86400000)
export const nextBusinessDay = (k: string) => {
  let d = addDays(k, 1)
  while ([0, 6].includes(fromKey(d).getDay())) d = addDays(d, 1)
  return d
}
export const bonusOn = (bonuses: BonusEvent[], k: string) =>
  bonuses.find((b) => b.start <= k && k <= b.end)

// ---------- sample data ----------
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const shopRewards: MReward[] = [
  ...REWARDS.filter((r) => r.shopId === SHOP_ID).map((r) => ({ id: r.id, title: r.title, points: r.points, details: r.details, active: true })),
  { id: 'r-bread', title: "Yesterday's loaf", points: 200, details: 'Any loaf baked the day before. While they last.', active: true },
]

export function seedState(now = new Date()): MerchantState {
  const r = rng(20260928)
  const four = () => String(1000 + Math.floor(r() * 9000))
  const members = [DEMO_MEMBER, ...Array.from({ length: 23 }, () => `CW ${four()} ${four()}`)]
  const pickMember = () => (r() < 0.45 ? members[Math.floor(r() * 6)] : members[Math.floor(r() * members.length)])
  const staffNames = ['Rosa Martinez', 'Luis Ortega', 'Dee Carter']
  const today = dayKey(now)

  let nextSat = today
  while (fromKey(nextSat).getDay() !== 6 || nextSat === today) nextSat = addDays(nextSat, 1)
  const bonuses: BonusEvent[] = [
    { id: 'b-past', title: 'Double points weekend', multiplier: 2, start: addDays(today, -16), end: addDays(today, -15) },
    { id: 'b-next', title: 'Double points Saturday', multiplier: 2, start: nextSat, end: nextSat },
  ]

  const txns: MTxn[] = []
  for (let back = 27; back >= 0; back--) {
    const day = new Date(now)
    day.setDate(day.getDate() - back)
    if (day.getDay() === 1 && back > 0) continue // closed Mondays (today always has sample activity for the demo)
    const weekend = [0, 6].includes(day.getDay())
    const count = 4 + Math.floor(r() * 6) + (weekend ? 4 : 0)
    const k = dayKey(day)
    const multiplier = bonusOn(bonuses, k)?.multiplier ?? 1
    for (let i = 0; i < count; i++) {
      const t = new Date(day)
      t.setHours(7 + Math.floor(r() * 8), Math.floor(r() * 60), 0, 0)
      // Today's sample sales land in the hours before "now", so the demo is never empty early in the day.
      if (back === 0) t.setTime(now.getTime() - Math.floor(r() * 6 * 60 + 5) * 60000)
      if (t > now) continue
      const staff = staffNames[Math.floor(r() * 3)]
      const memberId = pickMember()
      if (r() < 0.1) {
        const reward = shopRewards[Math.floor(r() * shopRewards.length)]
        txns.push({ id: '', date: t.toISOString(), memberId, kind: 'reward', total: reward.points * CENTS_PER_POINT, pointsApplied: reward.points, pointsIssued: 0, fee: 0, staff, rewardId: reward.id })
        continue
      }
      const total = Math.round((350 + r() * 3400) / 5) * 5
      const pointsApplied = r() < 0.2 ? Math.min(Math.round(100 + r() * 500), total) : 0
      const fromBalance = total - pointsApplied * CENTS_PER_POINT
      txns.push({
        id: '', date: t.toISOString(), memberId, kind: 'payment', total, pointsApplied,
        pointsIssued: pointsFor(fromBalance, multiplier), fee: feeFor(total), staff,
        source: r() < 0.7 ? 'member' : 'shop', ...(multiplier > 1 ? { multiplier } : {}),
      })
    }
  }
  txns.sort((a, b) => a.date.localeCompare(b.date))
  txns.forEach((t, i) => (t.id = 'M' + String(1000 + i)))

  // One partial refund, a few days back.
  const refundable = txns.filter((t) => t.kind === 'payment' && t.total > 1500).at(-12)
  if (refundable) {
    const d = new Date(refundable.date)
    d.setMinutes(d.getMinutes() + 20)
    txns.push({ id: 'M0999', date: d.toISOString(), memberId: refundable.memberId, kind: 'refund', total: -500, pointsApplied: 0, pointsIssued: -Math.round((refundable.pointsIssued * 500) / refundable.total), fee: 0, staff: 'Rosa Martinez', refundOf: refundable.id })
  }
  txns.sort((a, b) => b.date.localeCompare(a.date))

  const daysAgo = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return d.toISOString() }
  // Joined a year ago (less 12 days), so the current 6-month period ends in 12 days.
  const joined = addDays(addMonths(today, -12), 12)
  const period2 = addMonths(joined, MEMBERSHIP_MONTHS)
  const at = (k: string) => fromKey(k).toISOString()
  return {
    profile: { name: "Rosa's Bakery", address: '48 Elm Ave', hours: '7am – 3pm, closed Mon', phone: '(555) 014-2290', about: 'Family bakery with fresh bread, pastries and custom cakes.' },
    staff: [
      { id: 's-rosa', name: 'Rosa Martinez', role: 'owner' },
      { id: 's-luis', name: 'Luis Ortega', role: 'manager' },
      { id: 's-dee', name: 'Dee Carter', role: 'cashier' },
    ],
    currentStaffId: 's-rosa',
    txns,
    rewards: shopRewards,
    bonuses,
    vouchers: [
      { code: 'CW-7Q2K', rewardId: 'r-croissant', memberId: DEMO_MEMBER, issued: daysAgo(4) },
      { code: 'CW-M4RS', rewardId: 'r-cake', memberId: members[3], issued: daysAgo(1) },
      { code: 'CW-B8TL', rewardId: 'r-croissant', memberId: members[5], issued: daysAgo(6), usedAt: daysAgo(2) },
    ],
    membership: {
      joined,
      autopay: false,
      autopayMethod: 'bank',
      invoices: [
        { id: 'INV-2' + period2.replace(/-/g, '').slice(2), periodStart: period2, periodEnd: addMonths(joined, 2 * MEMBERSHIP_MONTHS), amount: MEMBERSHIP_FEE, paidAt: at(addDays(period2, -3)), method: 'card' },
        { id: 'INV-1' + joined.replace(/-/g, '').slice(2), periodStart: joined, periodEnd: period2, amount: MEMBERSHIP_FEE, paidAt: at(joined), method: 'bank' },
      ],
    },
  }
}

// ---------- derived views ----------
export type MemberSummary = { id: string; visits: number; spent: number }
export function memberSummaries(txns: MTxn[]): MemberSummary[] {
  const map = new Map<string, MemberSummary>()
  for (const t of txns) {
    const m = map.get(t.memberId) ?? { id: t.memberId, visits: 0, spent: 0 }
    if (t.kind !== 'refund') m.visits++
    if (t.kind !== 'reward') m.spent += t.total
    map.set(t.memberId, m)
  }
  return [...map.values()].sort((a, b) => b.spent - a.spent)
}

export type Payout = {
  id: string // the business day the sales happened
  depositOn: string
  sales: number
  rewards: number
  refunds: number
  fees: number
  /** Membership fees taken from this deposit. */
  membership: number
  net: number
  count: number
  paid: boolean
}
export function payouts(txns: MTxn[], today: string, invoices: Invoice[] = []): Payout[] {
  const map = new Map<string, Payout>()
  for (const t of txns) {
    const k = dayKey(t.date)
    const p = map.get(k) ?? { id: k, depositOn: nextBusinessDay(k), sales: 0, rewards: 0, refunds: 0, fees: 0, membership: 0, net: 0, count: 0, paid: false }
    if (t.kind === 'payment') p.sales += t.total
    if (t.kind === 'reward') p.rewards += t.total
    if (t.kind === 'refund') p.refunds += t.total
    p.fees += t.fee
    p.net += depositFor(t)
    p.count++
    p.paid = p.depositOn <= today
    map.set(k, p)
  }
  for (const inv of invoices) {
    const p = inv.deductedOn && [...map.values()].find((x) => x.depositOn === inv.deductedOn)
    if (p) { p.membership += inv.amount; p.net -= inv.amount }
  }
  return [...map.values()].sort((a, b) => b.id.localeCompare(a.id))
}

export type MembershipStatus = {
  state: 'active' | 'due' | 'overdue'
  /** Start of the period that needs paying next (= end of the last paid period). */
  dueOn: string
  daysLeft: number
  paidThrough: string
  amount: number
}
export function membershipLabel({ state, daysLeft }: MembershipStatus) {
  if (state === 'active') return 'Active'
  if (state === 'overdue') return 'Past due'
  return daysLeft > 0 ? `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}` : daysLeft === 0 ? 'Due today' : `${-daysLeft} days late`
}

/** Where the membership stands today. "Due" opens 30 days before the paid period ends. */
export function membershipStatus(m: Membership, today: string): MembershipStatus {
  const dueOn = m.invoices[0]?.periodEnd ?? m.joined
  const daysLeft = daysBetween(today, dueOn)
  const state = daysLeft > 30 ? 'active' : daysLeft >= -MEMBERSHIP_GRACE_DAYS ? 'due' : 'overdue'
  return { state, dueOn, daysLeft, paidThrough: addDays(dueOn, -1), amount: MEMBERSHIP_FEE }
}
