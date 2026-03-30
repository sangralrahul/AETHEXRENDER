# AETHEX - Medical Store for Indian Doctors & Students

## Project Overview

AETHEX is India's premier one-stop medical store for doctors and medical students. It sells scrubs, aprons, lab coats, books/study material, stethoscopes, surgical instruments, BP machines, and other medical equipment.

## Artifacts

- **aethex** — React + Vite frontend at `/` (port 24237)
- **api-server** — Express 5 backend at `/api` (port 8080)

## Features

### Settings Sync (March 2026)
- **Cadus AI Settings in Navbar** — account dropdown now has a "Cadus AI Settings" button (Brain icon) for all logged-in users
- **Real user data in Account tab** — shows actual name, email, PRO badge, daily query usage bar (20/day free, 200/day pro)
- **Real-time sync** — AiAssistant listens to `window.storage` events; settings changed on website apply instantly to the AI page
- **Context-aware Chats tab** — when opened from website, shows informational hint instead of destructive chat actions
- **SettingsModal props** — all chat-action props now optional; accepts `user` and `isFromWebsite` flags

### New (2026 Audit Pass)
- **Dark theme** — #0D1117 background, #161B22 cards, #00C2A8 teal. Applied globally via CSS variables
- **User Auth** — email signup/login + Google placeholder. `AuthModal.tsx` + `use-user-auth.ts` hook (localStorage)
- **CADUS AI Pro subscription** — ₹299/month, ₹1999/year. UI in `/account`. Admin hint: `aethex@admin2026`
- **New pages**: `/shop` (alias for /products), `/study-hub`, `/checkout`, `/orders`, `/account`, `/admin`
- **Trust badges** on Home — GST Invoice, Fast Delivery, Verified Brands, Easy Returns
- **Newsletter section** on Home
- **Navbar** — dark theme, auth dropdown with Pro Crown badge, Study Hub/Shop/Blog/News links
- **sitemap.xml** and **robots.txt** in `/public/`
- **DB tables created** and seeded with 6 categories, 19 products

### Study Hub (`/study-hub`)
- 10 coaching platforms compared (PrepLadder, Marrow, AMBOSS, Dr. Najeeb, etc.)
- Exam filter (NEET PG, NEXT, FMGE, USMLE, INI-CET)
- Compare up to 3 platforms side-by-side in a modal
- Essential medical books section, free YouTube channels section
- CADUS AI CTA banner

### Checkout (`/checkout`)
- 3-step flow: Address → Payment → Confirm
- Full Indian address form with state selector
- Payment methods: UPI, Card, Net Banking, COD
- Demo order placement with success screen and order ID
- Razorpay ready (demo mode active)

### Orders (`/orders`)
- Order history with status badges and stepper tracker
- Search/filter by status
- Order detail modal with full tracker, address, tracking info, and totals
- Stats: total orders, delivered, in transit

### Account (`/account`)
- Tabbed: Profile, Addresses, Wishlist, Subscription, Notifications
- Edit name/phone, saved addresses (CRUD), Pro subscription upgrade UI
- Toggle notification preferences

### Admin (`/admin`)
- Password-protected (hint: aethex@admin2026)
- 8 tabs: Dashboard, Products, Orders, Users, Sellers, Blog, Analytics, Settings
- Dashboard shows revenue, orders, users, Pro subscriptions
- Sellers tab: approve/reject pending sellers
- Analytics: top categories revenue bar chart

---

- Home page with hero section, 8-category grid, featured products, Study Hub section, AI assistant banner
- Products page with category filters, search, and sort (Featured / Price / Highest Rated)
- Product detail pages with full review section, star breakdown, sort/filter, review form
- Shopping cart (session-based via localStorage)
- AI Medical Assistant (CADUS AI) — full-screen Replit-style interface at `/ai-assistant`
  - 12 clinical AI modes: Diagnose, DDx Generator, Deep Research, Image, Slides, Drug Interactions, Dosage Calc, Lab Values, SOAP Note, MCQ/Exam, Patient Education, Procedure Guide
  - Specialty filter, voice input (en-IN), session persistence
- 8 product categories: Scrubs, Aprons, Books, Stethoscopes, Surgical Instruments, Dental Supplies, Lab Supplies, Equipment
- 30 seeded products with realistic Indian pricing (₹)
- **Order Tracking system** at `/orders/track` — stepper UI, auto-fetch from URL param `?orderId=`, courier info with copy tracking
- **Notification Bell** in Navbar — real-time dropdown, unread count badge, mark-all-read, dismiss per item, auto-polls every 30s
- **Email notifications** via Resend API (`RESEND_API_KEY` env var) — graceful fallback when credentials absent
- **SMS notifications** via Twilio — 5 SMS types, auto-prefixes `+91`; graceful fallback without creds
- **Reviews & Ratings System**:
  - Product reviews: star rating (1–5), title, body, photos (up to 3, resized client-side), Verified Purchase badge
  - One review per session per product; 7-day edit window; helpful voting; report flagging
  - Review display: overall score, star breakdown bars, sort (Recent/Helpful/Highest/Lowest), star filter, pagination
  - Platform reviews (Study Hub): additional fields (value, content quality, faculty, exam prep, would recommend)
  - Admin moderation panel at `/admin/reviews` — Pending/Approved/Rejected/Flagged tabs, approve/reject/flag actions, official replies
  - Auto-approve reviews with no banned words; banned words trigger `pending` status
  - My Reviews page at `/my-reviews` — user's own reviews with edit/delete
  - Product cards show filled star ratings
  - User account dropdown in Navbar → My Reviews, Track Order, Admin Reviews
- **DB Tables**: products, categories, cart_items, orders, notifications, reviews, review_votes, platform_reviews, banned_words
- **Seller Onboarding System**:
  - Seller registration (/seller/register) — 3-step wizard: Business Info, Bank Details, Documents
  - Seller login (/seller/login) — code-based (SELL-XXXX); demo: SELL-0001
  - Seller Dashboard (/seller/dashboard) — stats, revenue chart (recharts), top products, commission notice
  - Seller Products (/seller/products) — full CRUD with 5-image upload, low-stock alerts, status badges
  - Seller Orders (/seller/orders) — accept/reject/ship/deliver workflow, tracking info, packing slip download
  - Seller Payouts (/seller/payouts) — 10% commission, 90% to seller, 7-day cycle, ₹500 minimum threshold
  - Seller Analytics (/seller/analytics) — line chart (revenue + orders), order breakdown pie, top-products bar
  - Seller Settings (/seller/settings) — vacation mode toggle, business profile, bank details, delivery pincodes
  - Admin Sellers (/admin/sellers) — pending/approved/rejected tabs, approve/reject/request docs, shows seller code on approval
  - Seller Storefront (/seller/:code/store) — public mini-store with all live products
  - Seller badge visible in Navbar account dropdown (Seller Hub, Admin Sellers)
  - Dark theme throughout all seller pages; no Navbar/Footer on seller dashboard
  - Demo seller: SELL-0001, MedTech Solutions India, 5 products (4 live + 1 pending), demo orders + payouts
- **DB Tables**: products, categories, cart_items, orders, notifications, reviews, review_votes, platform_reviews, banned_words, sellers, seller_products, seller_orders, seller_payouts, blog_posts, blog_comments, newsletter_subscribers
- **Blog & Medical News System**:
  - Blog listing (/blog) — hero, category filter, 9-post grid (featured first), sticky sidebar with newsletter + popular posts + categories, pagination
  - Individual post (/blog/:slug) — featured image, author card, auto-generated TOC, social share (WhatsApp/Twitter/LinkedIn/Copy), article HTML, related posts, comments
  - Medical News (/news) — 8 demo articles with breaking news banner (NewsAPI live when NEWS_API_KEY secret added, auto-cached 6h)
  - Admin Blog (/admin/blog) — full CRUD, HTML editor with live preview toggle, publish/draft toggle, scheduled publishing, SEO fields, subscriber CSV export
  - Newsletter — sidebar + footer forms, stored in DB, CSV export at /api/admin/newsletter/subscribers?format=csv
  - SEO — every blog post sets document.title + meta description + OG tags dynamically; index.html has site-wide meta + OG + Twitter card + GA placeholder
  - Sitemap — auto-generated at /api/sitemap.xml covering all 6 static pages + all published blog posts
  - Robots.txt — at /api/robots.txt; allows all crawlers, blocks admin/seller dashboard
  - Navbar — Blog + News links added; Admin Blog added to account dropdown
  - Footer — Resources section with Blog/News/AI links; newsletter wired to API
  - 6 starter posts seeded: gadgets, PrepLadder vs Marrow, CADUS AI guide, stethoscopes guide, NEET-PG 2025 strategy, portable devices
  - Optional env vars: NEWS_API_KEY (for live news), SITE_URL (for sitemap canonical, default https://aethex.in)

# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
