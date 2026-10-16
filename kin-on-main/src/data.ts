// Sample data for the prototype. Replace with API data later.
// Copy follows the Kin on Main brand guide: "Kin Points", "member businesses",
// "earn / use". Kin Points are rewards only: no cash value, never money.

/** Kin Points earned per $1 of purchase at a member business (same everywhere). */
export const POINTS_PER_DOLLAR = 10
/** Featured-merchant weeks multiply points at one business. */
export const FEATURED_MULTIPLIER = 2
export const WELCOME_POINTS = 100

/** Block Passport: visit this many different member businesses in a month. */
export const PASSPORT_GOAL = 5
export const PASSPORT_BONUS = 250

/** Optional member levels (by visits this year). Family theme, no Gold/Platinum. */
export const LEVELS = [
  { name: 'Neighbor', min: 0, perk: 'Earn and use Kin Points at every member business.' },
  { name: 'Regular', min: 10, perk: 'Early word on block events and featured-merchant weeks.' },
  { name: 'Kin', min: 25, perk: 'A thank-you from the block: invitations to member-only nights.' },
] as const

export const BLOCK = { name: 'Pilsen block', city: 'Chicago' }

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
  owner: string
  founding?: boolean
}

export type Reward = {
  id: string
  shopId: string
  title: string
  points: number
  details: string
  featured?: boolean
}

export const CATEGORIES = ['All', 'Food & Drink', 'Grocery', 'Shops', 'Services']

export const SHOPS: Shop[] = [
  { id: 'corner-grind', name: 'Corner Grind Coffee', category: 'Food & Drink', emoji: '☕', color: '#7a4b32', address: '1817 W 18th St', hours: '6am – 6pm daily', distance: '1 min walk', about: 'Neighborhood roaster pouring the first cup on the block since 2014.', owner: 'Marisol, owner', founding: true },
  { id: 'panaderia-sol', name: 'Panadería del Sol', category: 'Food & Drink', emoji: '🥐', color: '#c0793f', address: '1735 W 18th St', hours: '6am – 4pm, closed Mon', distance: '2 min walk', about: 'Conchas, bolillos and celebration cakes, baked before the shutters go up.', owner: 'The Herrera family', founding: true },
  { id: 'mercado-verde', name: 'Mercado Verde', category: 'Grocery', emoji: '🥬', color: '#3f7f4f', address: '1900 S Blue Island Ave', hours: '8am – 9pm daily', distance: '4 min walk', about: 'Fresh produce, pantry staples and tortillas from down the street.', owner: 'Luis, owner', founding: true },
  { id: 'la-cuadra', name: 'Taquería La Cuadra', category: 'Food & Drink', emoji: '🌮', color: '#b5482f', address: '1846 S Loomis St', hours: '10am – 10pm daily', distance: '3 min walk', about: 'Al pastor off the trompo and salsas made every morning.', owner: 'Ana & Jorge, owners' },
  { id: 'spoke-sprocket', name: 'Spoke & Sprocket Bikes', category: 'Shops', emoji: '🚲', color: '#2f7f78', address: '1650 W 18th St', hours: '10am – 7pm, closed Tue', distance: '5 min walk', about: 'Tune-ups, used bikes and a free air pump out front.', owner: 'Dev, mechanic and owner' },
  { id: 'eighteenth-hardware', name: '18th Street Hardware', category: 'Shops', emoji: '🔧', color: '#5a5f7a', address: '1921 W 18th St', hours: '8am – 6pm, Sun 10–4', distance: '6 min walk', about: 'Keys cut, paint mixed and advice from people who know.', owner: 'The Kowalski family', founding: true },
  { id: 'rizos-salon', name: 'Rizos Salon', category: 'Services', emoji: '✂️', color: '#9a4f7a', address: '1760 S Ashland Ave', hours: '9am – 7pm, closed Sun', distance: '7 min walk', about: 'Curl specialists, color and quick trims for the whole family.', owner: 'Yesenia, stylist and owner' },
  { id: 'flor-de-barrio', name: 'Flor de Barrio', category: 'Shops', emoji: '💐', color: '#c0566a', address: '1712 W 18th St', hours: '9am – 6pm, closed Mon', distance: '2 min walk', about: 'Seasonal bouquets, marigolds in fall and plants for every window.', owner: 'Inés, florist' },
  { id: 'libros-del-barrio', name: 'Libros del Barrio', category: 'Shops', emoji: '📚', color: '#4a5b8f', address: '1802 S Racine Ave', hours: '10am – 7pm, closed Tue', distance: '5 min walk', about: 'Bilingual bookstore with Saturday story time for kids.', owner: 'Tomás, bookseller' },
]

/** This week's featured merchant earns double Kin Points. */
export const FEATURED_SHOP_ID = 'spoke-sprocket'

export const REWARDS: Reward[] = [
  { id: 'r-drip', shopId: 'corner-grind', title: 'House drip coffee', points: 300, details: 'Any size house drip. One per visit.', featured: true },
  { id: 'r-latte', shopId: 'corner-grind', title: 'Any latte', points: 500, details: 'Any latte, any milk, any size.' },
  { id: 'r-concha', shopId: 'panaderia-sol', title: 'Two conchas', points: 250, details: 'Baker’s choice of flavor, fresh that morning.', featured: true },
  { id: 'r-cake', shopId: 'panaderia-sol', title: '10% off a celebration cake', points: 900, details: 'For orders placed 48 hours ahead.' },
  { id: 'r-produce', shopId: 'mercado-verde', title: 'Bag of seasonal produce', points: 600, details: 'A grocer-picked bag of what’s fresh this week.' },
  { id: 'r-tacos', shopId: 'la-cuadra', title: 'Three tacos al pastor', points: 700, details: 'Dine in or to go. Salsas on the house.', featured: true },
  { id: 'r-tuneup', shopId: 'spoke-sprocket', title: '20% off a tune-up', points: 800, details: 'Standard or full tune-up. Book ahead on weekends.', featured: true },
  { id: 'r-keys', shopId: 'eighteenth-hardware', title: 'Two keys cut', points: 200, details: 'Standard house keys only.' },
  { id: 'r-paint', shopId: 'eighteenth-hardware', title: '15% off one gallon of paint', points: 450, details: 'Any interior or exterior paint in stock.' },
  { id: 'r-trim', shopId: 'rizos-salon', title: 'Bang or beard trim', points: 400, details: 'Walk-ins welcome, weekdays before 3pm.' },
  { id: 'r-bouquet', shopId: 'flor-de-barrio', title: 'Mini bouquet', points: 650, details: 'Florist’s choice of seasonal stems.', featured: true },
  { id: 'r-book', shopId: 'libros-del-barrio', title: '15% off one book', points: 350, details: 'Any single new book in stock.' },
]

export const shopById = (id?: string) => SHOPS.find((s) => s.id === id)
export const rewardById = (id?: string) => REWARDS.find((r) => r.id === id)
export const rewardsForShop = (shopId: string) => REWARDS.filter((r) => r.shopId === shopId)
export const pointsRate = (shopId: string) => POINTS_PER_DOLLAR * (shopId === FEATURED_SHOP_ID ? FEATURED_MULTIPLIER : 1)

export const levelFor = (visits: number) => [...LEVELS].reverse().find((l) => visits >= l.min)!
export const nextLevel = (visits: number) => LEVELS.find((l) => visits < l.min)
