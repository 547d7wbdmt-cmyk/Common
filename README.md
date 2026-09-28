# Common Cents Collective

A shared wallet and rewards app for a collective of local businesses.
Customers load funds, pay member shops through the app, and earn points
that are worth the same ($0.01 each) at every shop.

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
| 2 · Detail | `/shops/:shopId` · `/pay/:shopId` (amount keypad) · `/rewards/:rewardId` · `/wallet/add` · `/wallet/activity` |
| 3 · Deeper | `/shops/:shopId/rewards/:rewardId` · `/wallet/activity/:txnId` (receipt) |
| Overlays | Confirm payment · confirm add funds · redeem confirm → voucher QR · scan shop code · member card |

## Main flows

- **Pay:** Pay tab → scan or pick shop → enter amount → optionally apply points → confirm → receipt (+points earned)
- **Add funds:** Wallet → Add funds → amount + source → confirm → updated balance
- **Redeem:** Rewards (or a shop) → reward → redeem → voucher code to show at the counter

## Where things live

- `app/src/data.ts` sample shops, rewards, point rules (`CENTS_PER_POINT`, `POINTS_PER_DOLLAR`)
- `app/src/store.tsx` wallet state (balance, points, transactions) saved to localStorage
- `app/src/App.tsx` routes and bottom tabs
- `app/src/pages/` one file per screen · `app/src/components/ui.tsx` shared UI
