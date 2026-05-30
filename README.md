# Channels Realty

Front-end for **Channels Realty** — a fractional / co-ownership property platform.

## Status

**Phase 1 (current):** Static UI deploy. The design exported from Claude's design tool is served as-is from `index.html` + `assets/` so we get a live URL fast.

**Phase 2 (next):** Convert the 30+ screens in `_design-source/` into a proper Next.js app with backend integration (auth, KYC, payments, wallet, property data).

## Local dev

```bash
npm run dev
# → http://localhost:3000
```

(Just runs `serve` against the repo root — no build step in Phase 1.)

## Deploy

Auto-deploys to Vercel on push to `main`.

## Layout

```
index.html              # entry point
assets/                 # bundled JS, CSS, photos (Phase 1 runtime)
_design-source/         # JSX source files for Phase 2 rebuild
vercel.json             # static hosting + cache headers
```

## Screens (from the design)

Dashboard · Land & Milestones · Team · Tasks & Rewards · Wallet · More
Marketplace · Estate Detail · Plot Picker · Checkout · Document Vault · Property
Profile · KYC · Settings · Security · Payouts · Fund Wallet · Payment Plans · Statements
Leaderboard · Network Tree · Earnings Analytics · Marketing Toolkit · Notifications
Rewards Store · Events · Academy · Daily Check-in · Support · News · Invite
