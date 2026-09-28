# CommonWealth

**by Common Cents Collective**

A coalition rewards app for independent, locally owned businesses.
Members load funds, pay member shops through the app, and earn points
that are worth the same ($0.01 each) at every member shop. Points expire
6 months after they are earned, and the oldest points are used first.
Spend here. Earn everywhere.

This is the **customer-side clickable prototype**: it uses sample data
stored in the browser (no backend yet).

## Run it

```bash
cd app
npm install
npm run dev      # http://localhost:5173
```

`npm run build` type-checks and builds; `npm run lint` runs oxlint.

## Page map

Each layer is a URL, so Back, refresh and deep links work everywhere.

| Layer | Screens |
|---|---|
| 0 · Shell | Top bar (logo / back + title, profile) · bottom tabs: Home, Shops, **Pay**, Rewards, Wallet |
| 1 · Tabs | `/` Home · `/shops` · `/pay` · `/rewards` · `/wallet` · `/profile` |
| 2 · Detail | `/shops/:shopId` · `/pay/:shopId` (amount keypad) · `/rewards/:rewardId` · `/wallet/add` · `/wallet/activity` · `/wallet/points` (expiry by batch) |
| 3 · Deeper | `/shops/:shopId/rewards/:rewardId` · `/wallet/activity/:txnId` (receipt) |
| Overlays | Confirm payment · confirm add funds · redeem confirm → voucher QR · scan shop code · member card |

## Merchant portal (`/merchant`)

For member shops; the demo is signed in as **Rosa's Bakery**. Leads with the
Common Cents Collective lockup, as the brand guide asks for merchant-facing
materials. Sidebar on tablets and computers, bottom tabs on phones.

| Layer | Screens |
|---|---|
| 1 · Sections | Today · Counter · Transactions · Rewards (and bonus events) · Members · Payouts · Settings · More (phone) |
| 2 · Detail | Transaction · Edit/new reward · Edit/new bonus event · Member · Payout (deposit statement) · Staff member |
| 3 · Deeper | Refund a transaction · Payout line items |
| Overlays | Charge a member → waiting for approval → payment received · Reward code valid → confirm · Confirm refund · Publish bonus event · Add staff |

Rules in the prototype (`app/src/merchant/data.ts`):
- Payments start either way: the member scans the shop code, or the shop charges the member's card and the member approves.
- Points members spend at the shop, on payments or rewards, are reimbursed at $0.01 each.
- 2% fee on payments; each business day's sales are deposited the next business day.
- Who pays for points earned at a shop is **to be decided** (`POINTS_FUNDING`); nothing is deducted for it yet.
- Shops see only a member's CommonWealth ID, visit count and total spent.
- Roles: Owner (everything), Manager (no payouts or bank), Cashier (Counter only). A demo switcher shows each role.

## Main flows

- **Pay:** Pay tab → scan or pick shop → enter amount → optionally apply points → confirm → receipt (+points earned)
- **Add funds:** Wallet → Add funds → amount + source → confirm → updated balance
- **Redeem:** Rewards (or a shop) → reward → redeem → voucher code to show at the counter

## Brand

Styled to the CommonWealth brand guide: evergreen and copper brand pair,
marigold for badges and the awning, paper ground; Bricolage Grotesque for
headlines and the wordmark, Public Sans for text; the awning stripe as the
one pattern. Color tokens live at the top of `app/src/index.css` and use the official
brand values (light and dark). A few dark-mode supporting colors not in the
brand palette (muted text, dividers, tinted panels, text on buttons) are
derived; every text pair was checked for 4.5:1 contrast in both themes.
In dark mode the logo uses the reverse coin color.

The official logo files and brand guide are in `brand/`. The in-app mark is
a vector traced from `brand/logos/commonwealth-mark.png` (matches it to
within anti-aliasing), and the lockup sets the two-tone wordmark and
endorser line in live type so it follows light and dark mode.

## Where things live

- `app/src/data.ts` sample shops, rewards, point rules (`CENTS_PER_POINT`, `POINTS_PER_DOLLAR`, `POINTS_EXPIRE_MONTHS`)
- `app/src/store.tsx` wallet state (balance, dated point batches, transactions) saved to localStorage
- `app/src/App.tsx` routes and bottom tabs
- `app/src/pages/` one file per screen · `app/src/components/ui.tsx` shared UI, including the logo mark and lockup
- `npm run build:artifact` builds a single shareable HTML file into `app/dist-artifact/`; `npm run build:artifact:merchant` does the same, opening on the merchant portal
- `app/src/merchant/` the merchant portal: data rules and sample ledger, store, shell and routes, pages
