# Channels Realty — Backend (Phase 2)

Real backend for Channels Realty, built as **Vercel Serverless Functions** (`/api`) +
**Postgres (Prisma)** + **JWT auth** + **Paystack** payments. The existing static
frontend keeps deploying unchanged; it now has a backend to talk to via `window.API`
(`assets/api.js`).

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Hosting | Vercel | Static site + `/api/*` serverless functions, one deploy |
| Database | Postgres + Prisma | Portable — use **Supabase**, **Neon**, or **Vercel Postgres** |
| Auth | JWT (bcrypt) in an httpOnly cookie | No third-party auth bill, works anywhere |
| Payments | Paystack | Behind a provider-agnostic layer (`lib/paystack.js`) so Flutterwave can be added later |
| Money | BigInt **kobo** everywhere | No floating-point money bugs |

## 1. Provision a database

Easiest is **Supabase** (Postgres + storage for KYC files). Create a project, then from
**Project Settings → Database** copy two connection strings:

- **Pooled** (Transaction pooler, port `6543`) → `DATABASE_URL`
- **Direct** (port `5432`) → `DIRECT_URL` (migrations only)

> Neon and Vercel Postgres work identically — just paste their pooled/direct URLs.

## 2. Environment variables

Copy `.env.example` → `.env` for local dev, and set the same keys in
**Vercel → Project → Settings → Environment Variables**:

```
DATABASE_URL   # pooled connection (pgbouncer)
DIRECT_URL     # direct connection (migrations)
JWT_SECRET     # openssl rand -base64 48
PAYSTACK_SECRET_KEY
PAYSTACK_PUBLIC_KEY
SITE_URL       # e.g. https://channels-realty-three.vercel.app
```

## 3. Create the schema + seed

```bash
npm install
npm run db:deploy     # apply migrations (or: npm run db:push for first-time sync)
npm run db:seed       # catalog data + demo logins
```

Demo logins after seeding:
- `admin@channels.realty` / `admin1234` (ADMIN)
- `tunde@channels.realty` / `demo1234` (USER)

## 4. Paystack webhook

In the Paystack dashboard → **Settings → API Keys & Webhooks**, set the webhook URL to:

```
https://YOUR-DOMAIN/api/payments/webhook
```

The webhook re-verifies every event against Paystack before crediting anything, so it’s
safe even without raw-body signature access.

## 5. Deploy

Push to `main` → Vercel builds. `prisma generate` runs automatically on `postinstall`.
For schema changes, run `npm run db:deploy` (or wire it into the Vercel build command).

---

## API surface

All responses are JSON `{ ok: true, ... }` or `{ ok: false, error }`. Auth uses the
`cr_session` httpOnly cookie (sent automatically by the browser).

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | – | Service + DB + payments status |
| POST | `/api/auth/signup` | – | Register (accepts `ref` for referral attribution) |
| POST | `/api/auth/login` | – | Log in |
| POST | `/api/auth/logout` | – | Log out |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/estates` | – | Estate catalog |
| GET | `/api/drops` | – | Active land drops |
| GET | `/api/dashboard` | ✓ | Portfolio/referral summary |
| GET | `/api/wallet` | ✓ | Balance + ledger |
| POST | `/api/wallet/fund` | ✓ | Init Paystack funding → `authorizationUrl` |
| POST | `/api/land/buy` | ✓ | Buy sqm (`method: wallet \| paystack`) |
| POST | `/api/payments/verify` | ✓ | Confirm a Paystack payment by `reference` |
| POST | `/api/payments/webhook` | – | Paystack webhook (server-verified) |
| GET | `/api/orders` | ✓ | Order history |
| GET | `/api/portfolio` | ✓ | Holdings + valuation |
| GET | `/api/referrals` | ✓ | Affiliate stats + downline |
| GET/POST | `/api/giftcards` | ✓ | Catalog + owned / buy |
| GET/POST | `/api/membership` | ✓ | Plans + upgrade |
| GET/POST | `/api/ventures` | ✓ | Joint ventures + invest |
| GET/POST | `/api/p2p` | ✓ | P2P listings + create |
| POST | `/api/kyc/submit` | ✓ | Submit KYC (→ PENDING) |
| GET/POST | `/api/admin/kyc` | ADMIN | Review/approve KYC (pays referrer bonus) |
| GET/POST | `/api/payouts` | ✓ | List / request payout |

## Business rules encoded

- **Commissions:** on a paid land order, the buyer’s L1 referrer earns **20%** and the L2
  earns **5%**, credited to withdrawable balance (`lib/fulfill.js`).
- **Signup bonus:** when a referred user’s KYC is **approved**, their referrer gets
  **₦2,000** as `bonusCredit` — spendable on land only, never withdrawable.
- **Fulfillment is idempotent:** both the webhook and the verify endpoint can confirm a
  payment; the order is only fulfilled once.
- **Wallet payments** debit `bonusCredit` first, then `balance`.

## Wiring the frontend (next slice)

`assets/api.js` exposes `window.API` with a method per endpoint. The remaining work is to
replace the mock `window.DATA*` reads in the screens with live `API.*` calls and gate the
app behind real `API.login`/`API.signup`. Suggested order:

1. Auth screen → `API.signup` / `API.login`, then `API.me` on load.
2. Dashboard/Wallet/Portfolio → `API.dashboard`, `API.wallet`, `API.portfolio`.
3. Drops/Checkout → `API.buyLand` → redirect to `authorizationUrl`; on return,
   read `?ref=` and call `API.verifyPayment`.
4. Affiliate/Gift cards/Membership/Ventures/KYC → respective methods.
