// Sample data for the prototype. Replace with API data later.

/** Every point is worth the same at every member shop. */
export const CENTS_PER_POINT = 1 // 1 point = $0.01
/** Points earned per $1 paid through the app (same at every shop). */
export const POINTS_PER_DOLLAR = 5
/** Points expire this many months after they are earned. Oldest points are used first. */
export const POINTS_EXPIRE_MONTHS = 6

export type Shop = {
  id: string
  name: string
  category: string
  emoji: string
  color: string
  address: string
  hours: string
  distance: string
  about: string
}

export type Reward = {
  id: string
  shopId: string
  title: string
  points: number
  details: string
  featured?: boolean
}

export const CATEGORIES = ['All', 'Food & Drink', 'Grocery', 'Retail', 'Services']

export const SHOPS: Shop[] = [
  { id: 'maple-coffee', name: 'Maple Street Coffee', category: 'Food & Drink', emoji: '☕', color: '#8a5a3b', address: '112 Maple St', hours: '6am – 6pm daily', distance: '0.2 mi', about: 'Small-batch roaster and neighborhood hangout since 2011.' },
  { id: 'rosas-bakery', name: "Rosa's Bakery", category: 'Food & Drink', emoji: '🥐', color: '#c9774a', address: '48 Elm Ave', hours: '7am – 3pm, closed Mon', distance: '0.4 mi', about: 'Family bakery with fresh bread, pastries and custom cakes.' },
  { id: 'green-leaf', name: 'Green Leaf Grocer', category: 'Grocery', emoji: '🥬', color: '#3f8f4f', address: '300 Main St', hours: '8am – 9pm daily', distance: '0.6 mi', about: 'Local produce, pantry staples and farm-direct dairy.' },
  { id: 'sunny-diner', name: 'Sunny Side Diner', category: 'Food & Drink', emoji: '🍳', color: '#d9a21b', address: '9 Harbor Rd', hours: '7am – 2pm daily', distance: '0.8 mi', about: 'All-day breakfast, bottomless coffee, friendly faces.' },
  { id: 'page-turner', name: 'Page Turner Books', category: 'Retail', emoji: '📚', color: '#5b5fa8', address: '71 Oak St', hours: '10am – 7pm, closed Tue', distance: '0.5 mi', about: 'Independent bookstore with a cozy kids corner.' },
  { id: 'hilltop-hardware', name: 'Hilltop Hardware', category: 'Retail', emoji: '🔧', color: '#b5473a', address: '220 Hill Rd', hours: '8am – 6pm, Sun 10–4', distance: '1.1 mi', about: 'Tools, paint, keys cut and advice from folks who know.' },
  { id: 'bloom-stem', name: 'Bloom & Stem', category: 'Retail', emoji: '💐', color: '#c2527d', address: '15 Garden Ln', hours: '9am – 5pm, closed Sun', distance: '0.7 mi', about: 'Seasonal bouquets, plants and event flowers.' },
  { id: 'tidy-threads', name: 'Tidy Threads', category: 'Services', emoji: '🧵', color: '#3c7f95', address: '64 Main St', hours: '8am – 6pm weekdays', distance: '0.6 mi', about: 'Dry cleaning, laundry service and alterations.' },
]

export const REWARDS: Reward[] = [
  { id: 'r-coffee', shopId: 'maple-coffee', title: 'Free drip coffee', points: 300, details: 'Any size house drip coffee. One per visit.', featured: true },
  { id: 'r-latte', shopId: 'maple-coffee', title: 'Any latte', points: 550, details: 'Any latte, any milk, any size.' },
  { id: 'r-croissant', shopId: 'rosas-bakery', title: 'Butter croissant', points: 350, details: 'One fresh butter croissant.', featured: true },
  { id: 'r-cake', shopId: 'rosas-bakery', title: '$10 off a custom cake', points: 1000, details: 'Applies to orders placed 48 hours ahead.' },
  { id: 'r-produce', shopId: 'green-leaf', title: '$5 off produce', points: 500, details: 'Valid on fresh produce purchases of $15 or more.' },
  { id: 'r-breakfast', shopId: 'sunny-diner', title: 'Free short stack', points: 700, details: 'Three buttermilk pancakes with syrup.', featured: true },
  { id: 'r-book', shopId: 'page-turner', title: '15% off one book', points: 400, details: 'Any single new book in stock.' },
  { id: 'r-keys', shopId: 'hilltop-hardware', title: 'Two keys cut free', points: 250, details: 'Standard house keys only.' },
  { id: 'r-bouquet', shopId: 'bloom-stem', title: 'Mini bouquet', points: 900, details: "Florist's choice of seasonal stems.", featured: true },
  { id: 'r-shirts', shopId: 'tidy-threads', title: '3 shirts laundered', points: 600, details: 'Wash and press, ready next day.' },
]

export const PAYMENT_METHODS = [
  { id: 'bank', label: 'Checking •••• 4821', sub: 'Bank transfer · free' },
  { id: 'debit', label: 'Debit card •••• 1234', sub: 'Instant · free' },
]

export const shopById = (id?: string) => SHOPS.find((s) => s.id === id)
export const rewardById = (id?: string) => REWARDS.find((r) => r.id === id)
export const rewardsForShop = (shopId: string) => REWARDS.filter((r) => r.shopId === shopId)
