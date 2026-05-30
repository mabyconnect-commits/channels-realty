# Channels Realty

Front-end for **Channels Realty** — a fractional / co-ownership property platform.

## Status

**Phase 1 (current):** the actual app from the design tool runs as a static deploy. `index.html` (the bootstrap) loads `babel-standalone`, React, ReactDOM, and the JSX source files at runtime — Babel compiles the JSX in-browser before mounting to `#root`. Slower than a build step, but zero-build.

**Phase 2 (next):** replace the in-browser Babel with a proper Next.js / Vite build, swap React dev builds for prod, wire up real backend (auth, KYC, payments, wallet, property data).

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
