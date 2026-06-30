# Channels Realty

Front-end for **Channels Realty** — a fractional / co-ownership property platform.

## Status

**Phase 1 — frontend (done):** the app runs as a static deploy. `index.html` (the bootstrap) loads `babel-standalone`, React, ReactDOM, and the JSX source files at runtime — Babel compiles the JSX in-browser before mounting to `#root`. Zero-build.

**Phase 2 — backend (done):** a real backend ships as **Vercel serverless functions** (`/api`) backed by **Postgres (Prisma)**, **JWT auth**, and **Paystack** payments. The frontend talks to it via `window.API` (`assets/api.js`) and **falls back to demo data** when the backend isn't configured, so the static deploy keeps working until you set the env vars. See **[BACKEND.md](BACKEND.md)** for the full setup, env vars and API reference.

Live features: signup/login, KYC + admin review, wallet funding & withdrawals (real Paystack transfers), land drops & purchases, referral commissions + signup bonus, gift cards, membership, joint ventures, and a P2P market with real settlement.

**Phase 3 (next):** swap the in-browser Babel for a real Next.js/Vite build (prod React, code-split), server-rendered affiliate landing pages, and email/notifications.

## Local dev

```bash
npm run dev
# → http://localhost:3000
```

(Just `serve` against the repo root — no build step.)

## Deploy

Pushes to `main` auto-deploy to Vercel: https://channels-realty-three.vercel.app

## Layout

```
index.html                  # bootstrap: loads Babel + React + JSX
assets/
  app.jsx                   # root component, screen registry, nav
  auth.jsx                  # auth / login / signup
  landing.jsx               # marketing landing
  icons.jsx                 # icon set
  ui.jsx                    # shared UI primitives
  tweaks-panel.jsx          # in-app design tweaks
  screen-dashboard.jsx
  screen-milestones.jsx
  screen-team.jsx
  screen-wallet.jsx
  screen-more.jsx
  screen-tasks.jsx
  screen-badges.jsx
  screen-market.jsx
  screen-property.jsx
  screen-account.jsx
  screen-finance.jsx
  screen-network.jsx
  screen-engage.jsx
  data.js                   # seed data (user, parcels, tasks)
  data2.js                  # more seed data
  data3.js                  # launch / affiliate / investor seed data
  globals.jsx               # promo banner, floating Top-Affiliates + support widgets, countdown
  screen-launch.jsx         # Grand Launch, Land Drops, Gift Cards, Verification Quest
  screen-affiliate.jsx      # Referrals & Earnings, Landing Pages, AI Promo Hub
  screen-invest.jsx         # Portfolio, P2P Market, Instant Trade, JV, Landlords, Insider, List Estate, Membership, Orders
  styles.css                # global styles
  babel.min.js              # in-browser JSX compiler
  react.development.js
  react-dom.development.js
  photo_*.jpg               # property photos
vercel.json
package.json
```

## Screens

Dashboard · Land & Milestones · Team · Tasks & Rewards · Wallet · More
Marketplace · Estate Detail · Plot Picker · Checkout · Document Vault · Property
Profile · KYC · Settings · Security · Payouts · Fund Wallet · Payment Plans · Statements
Leaderboard · Network Tree · Earnings Analytics · Marketing Toolkit · Notifications
Rewards Store · Events · Academy · Daily Check-in · Support · News · Invite

**Launch & growth (new):**
Grand Launch (live countdown, prizes, launch leaderboard) · Land Drops (presale pricing tiers + quick-buy) ·
Gift Cards (drop-day multiplier) · Verification Quest (gamified KYC / Verified Investor) ·
Referrals & Earnings (signup-bonus credit + commissions) · My Landing Pages · AI Promo Hub ·
Portfolio (All Assets) · P2P Market · Instant Trade · Joint Ventures · New Landlords ·
Insider Investor · List an Estate · Membership (+ Royal Profile) · Orders
