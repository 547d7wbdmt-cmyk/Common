# Kin on Main — member app prototype

**Kin on Main** is the shopper-facing program; **Kith & Coin Collective** is the company
behind it. The company only appears in legal footers, terms and the About screen
("A Kith & Coin Collective program"), per the brand guide.

Members earn **Kin Points** at one member business and use them at another on the
same block (sample launch area: the Pilsen block, Chicago). This is Phase 1
(points only): there's no wallet, no payments and no money language. Kin Points
have no cash value.

This is a clickable prototype that uses sample data stored in the browser (no backend yet).

## Run it

```bash
cd kin-on-main
npm install
npm run dev      # http://localhost:5173
```

`npm run build` type-checks and builds; `npm run lint` runs oxlint.

## Page map

| Layer | Screens |
|---|---|
| Pre-join | `/welcome` (intro → join form, or "Explore with a sample member") · `/terms` · `/about` |
| 0 · Shell | Top bar (logo / back + title, profile) · bottom tabs: Home, The Block, **My card**, Rewards, Activity |
| 1 · Tabs | `/` Home · `/block` · `/card` · `/rewards` · `/activity` · `/profile` |
| 2 · Detail | `/block/:shopId` · `/rewards/:rewardId` · `/activity/:id` · `/passport` · `/profile/logo` |
| 3 · Deeper | `/block/:shopId/rewards/:rewardId` |
| Overlays | Earned at register (+ "use them down the block" nudge) · confirm reward · reward code |

## Main flows

- **Join:** Welcome → Join free → name + email/mobile, separate unchecked SMS consent, agree to terms → 100 welcome Kin Points
- **Earn:** My card → show member code at the register. The prototype has a "simulate a register scan" panel to pick a business and purchase amount.
- **Use:** Rewards (or a member business) → reward → Use Kin Points → code to show at the counter. Rewards used somewhere other than where the member last earned are tagged **Cross-shop**.
- **Block Passport:** visit 5 different member businesses this month → add +250 bonus Kin Points
- **Levels:** Neighbor → Regular (10 visits) → Kin (25 visits)

## Brand

- Colors: Main Street Brick `#B5482F`, Daybreak Gold `#F2B33D`, Dawn Indigo `#24304F`, Kin Teal `#2F7F78`, Paper Cream `#FAF4E8` (tokens at the top of `src/index.css`)
- Type: Fraunces (display) and Source Sans 3 (UI), from Google Fonts
- **Logo:** the storefront logo. The cream version is primary and the navy one is for dark backgrounds. Source art is in `brand/logo/`. Web copies and SVG marks (full color, plus one-color indigo, cream and black) are in `public/brand/`. In code, `KinMark` (`src/components/ui.tsx`, with a `mono` option) and `LogoLockup` draw them. Profile → **Logo** (`/profile/logo`) shows every version, the downloads and the usage rules.
- `public/kith-and-coin-collective.png` is the company logo, used on the About screen only.

## Still needs review

- Program terms, privacy copy and the Block Passport rules in `src/pages/Terms.tsx` are drafts for counsel review.
- Earn rate (10 Kin Points per $1), reward prices, member businesses and the featured-merchant 2× are sample values in `src/data.ts`.

## Where things live

- `src/data.ts` sample member businesses, rewards, earn rate, passport and level rules
- `src/store.tsx` member state (Kin Points, activity, message preferences) saved to localStorage
- `src/App.tsx` routes and bottom tabs
- `src/pages/` one file per screen · `src/components/ui.tsx` shared UI
