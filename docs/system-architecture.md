# System Architecture — SIE Yosakoi Shop

## Overview

Mini e-commerce pre-order system for SIE Yosakoi Team merchandise. Batch-based sales, 100% upfront payment via bank transfer/QR, manual admin verification.

## Tech Stack

| Layer | Service | Notes |
|---|---|---|
| Frontend / SSR | Astro SSR on CF Workers | `@astrojs/cloudflare` adapter, `output: "server"` |
| API | CF Workers (Astro endpoints) | Business logic, form handling, middleware |
| Database | CF D1 (SQLite) | Orders, products, batches; raw SQL |
| Session / cache | CF KV | Admin session (TTL 7d), system config |
| File storage | CF R2 | Product images; Worker proxy upload |
| Auth admin | Username + PBKDF2 hash (KV) | Web Crypto API — bcrypt blocked on Workers |
| Email | CF Email Routing + Worker | Auto order confirmation |

## Infrastructure

```
User / Admin → CF Workers (Astro SSR)
                    ├── CF D1 (SQLite)       — orders, products, batches
                    ├── CF KV                — sessions, config
                    ├── CF R2                — product images
                    └── CF Email Worker      — order confirmation emails
```

## Data Model

### Tables (CF D1)

**batches**
```
id TEXT PRIMARY KEY, name TEXT, status TEXT (draft|open|closed), 
open_at INTEGER, close_at INTEGER, created_at INTEGER
```

**products**
```
id TEXT PRIMARY KEY, batch_id TEXT FK, name TEXT, price INTEGER (cents), 
description TEXT, image_url TEXT, images JSON (array), 
has_variants BOOLEAN, variants_config JSON, active BOOLEAN, sort_order INTEGER
```
Variants support: color + size (e.g., shirt: 4 colors × 3 sizes = 12 SKUs).

**orders**
```
id TEXT PRIMARY KEY, batch_id TEXT FK, customer_name TEXT, phone TEXT, 
delivery_method TEXT, address TEXT, items JSON (OrderItem[]), 
subtotal INTEGER, shipping_fee INTEGER, total INTEGER, notes TEXT,
order_status TEXT (pending|confirmed|shipping|done|cancelled),
payment_status TEXT (awaiting|verified|refunded), created_at INTEGER
```

### Order Status Flow

`order_status`: `pending → confirmed → shipping → done | cancelled`
`payment_status`: `awaiting → verified → refunded`

**Rule:** `order_status` can only move to `confirmed` when `payment_status = verified`.

### KV Keys

```
admin_username          → "admin"
admin_password          → "pbkdf2:{hash}:{salt}"   (PBKDF2 / Web Crypto)
session:{uuid}          → "admin"                  (TTL 7 days)
config:bank_info        → JSON
config:shop_info        → JSON
config:shipping_options → JSON
```

## Authentication & Middleware

### Login Flow

```
POST /admin/login (username, password)
  ↓ validate username exists in KV (admin_username)
  ↓ retrieve stored hash from KV (admin_password)
  ↓ verifyPassword(password, hash) → Web Crypto PBKDF2
  ↓ if valid: createSession(kv) → UUID token
  ↓ Set-Cookie: session={uuid}; HttpOnly; Secure; SameSite=Lax
  ↓ KV.put("session:{uuid}", "admin", { expirationTtl: 604800 }) — 7 days
  ↓ Redirect to /admin
```

### Middleware Protection

`src/middleware.ts` intercepts all requests:
- **For `/admin/*` (except `/admin/login`)**: validates session cookie
- **Valid token**: checks `KV.get("session:{token}")` — must equal "admin"
- **Invalid/expired**: redirects to `/admin/login`

Single admin account. Username/hash stored in KV at startup (environment secrets).

### Password Hashing

PBKDF2 via Web Crypto API:
- **Algorithm**: SHA-256
- **Iterations**: 100,000
- **Salt**: 16 random bytes (hex-encoded)
- **Output format**: `pbkdf2:100000:{salt_hex}:{hash_hex}`
- **Constant-time comparison**: prevents timing attacks

No bcrypt/argon2 (CPU limits on CF Workers).

## Key Technical Decisions

| Decision | Rationale |
|---|---|
| **PBKDF2 over bcrypt** | bcrypt/argon2 exceed CF Workers CPU limits. Web Crypto API PBKDF2 (100k iterations, SHA-256) is built-in, unlimited, constant-time comparison. |
| **Raw SQL over ORMs** | Simpler for this scale (3 tables, ~20 queries). Avoids Drizzle/Prisma overhead on Workers. Direct D1 queries via `database.prepare()`. |
| **No transactions** | D1 is SQLite — no distributed transactions. Design for idempotency (duplicate form submits safe). |
| **KV eventual consistency** | Acceptable for admin sessions (single user). Session tokens (UUIDs) stored with 7-day TTL. |
| **R2 image proxy** | Product images small (<5MB). Direct `/img/[...key]` worker proxy simpler/cheaper than presigned URLs. Handles caching headers. |
| **Cloudflare Email Routing** | Auto order confirmation without external SMTP. Worker trigger on order creation. |
| **Astro SSR + Cloudflare adapter** | Full rendering on edge (no pre-rendering). Dynamic batch/product updates visible immediately. SSR handles form validation before submission. |

### Build Notes

- **First build requires manual step**: Comment out `main = "dist/server/entry.mjs"` in `wrangler.toml` before initial build (CF Workers entry missing until after first Astro compile). Uncomment after build completes.
- **Wrangler serve**: Uses `platformProxy: { enabled: true, persist: true }` to mock D1/KV/R2 locally.
- **Type safety**: Full TypeScript in `src/types.ts`; shared between pages and lib.

## Image Storage & Serving (R2)

### Upload
- Admin product page: drag/drop or file input → form multipart/form-data
- `POST /admin/products`: Receive file, validate type/size, upload to R2
- R2 key format: `products/{batch_id}/{product_id}/{filename}`
- Store URL in products table `image_url`, `images[]` fields

### Serving
- **Worker proxy**: `GET /img/[...key]` (path: `GET /img/products/batch-1/prod-1/image.webp`)
- R2 returns stream → worker adds cache headers (1 day)
- No presigned URLs needed — all products public

### Types
- Accept: JPEG, PNG, WebP, AVIF (max 5MB)
- Recommended: WebP (smaller, faster loading)

---

## Delivery Methods

Four options available for checkout:

| Code | Name | Notes |
|---|---|---|
| `pickup_practice` | Pick up at practice | Venue TBD |
| `pickup_festival_sat` | Pick up at festival (Sat) | SIE Yosakoi Festival day 1 |
| `pickup_festival_sun` | Pick up at festival (Sun) | SIE Yosakoi Festival day 2 |
| `ship_after_27apr` | Ship after April 27 | Address required, shipping fee applies |

Shipping fee calculated per delivery method in settings (KV `config:shipping_options`).

---

## Design & Styling

### Color Palette

Koinobori Festival theme (Japanese carp streamers). CSS variables in `src/styles/global.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg-sky` | #B8E4F0 | Hero, section backgrounds |
| `--bg-pink` | #F9C8D8 | Accent, badge backgrounds |
| `--koi-navy` | #1A5F7A | Primary text, links, CTAs |
| `--koi-red` | #E63946 | Highlight, error states |
| `--koi-orange` | #F4A261 | Secondary accent |
| `--koi-teal` | #A8DADC | Success, completion states |
| `--koi-purple` | #C77DFF | Decorative accents |
| `--navy-deep` | #1A1A2E | Borders, deep text |

### Typography

- **Display (hero)**: Zen Old Mincho 700–900 (Japanese serif)
- **Body**: Noto Sans JP 400–500 (Vietnamese support, line-height 1.75+)
- Scale: 12px (xs) → 60px (6xl) per `--text-*` tokens

### Patterns

Fish-scale (seigaiha) SVG background at 10–15% opacity on hero and section dividers. MA principle (negative space) throughout.

See `/docs/design-guidelines.md` for complete component patterns, shadows, spacing, and accessibility rules.

---

## Deployment & Environment

### Wrangler Configuration

`wrangler.toml`:
```toml
name = "sieyosakoi-shop"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
main = "dist/server/entry.mjs"              # After first build
assets = { directory = "dist/client" }

[[d1_databases]]
binding = "DB"
database_name = "sieyosakoi-db"
database_id = "{id-from-cf}"

[[kv_namespaces]]
binding = "KV"
id = "{id-from-cf}"

[[r2_buckets]]
binding = "R2"
bucket_name = "sieyosakoi-images"

[vars]
SITE_URL = "https://sieyosakoi.shop"       # Production URL
```

### Local Development

```bash
npm run dev
# Uses wrangler serve + platformProxy
# Mocks D1, KV, R2 locally
# Hot reload on file changes
```

### Secrets (Environment Variables)

Set via `wrangler secret put`:
```
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = "pbkdf2:100000:{salt}:{hash}"  # Generated by auth.ts
```

### Astro Config

`astro.config.mjs`:
```js
export default defineConfig({
  output: 'server',                          // SSR mode
  adapter: cloudflare({
    platformProxy: { enabled: true, persist: true }
  }),
});
```

### Build & Deploy

```bash
npm run build
# 1. Astro SSR compiles to dist/server/ (entry.mjs) + dist/client/
# 2. Uncomment main = "dist/server/entry.mjs" in wrangler.toml (if commented)
# 3. Ready for wrangler deploy

wrangler deploy
# Uploads to Cloudflare (CF account required, API token setup)
```

### First-Time Setup

1. Create D1 database, get ID
2. Create KV namespace, get ID  
3. Create R2 bucket
4. Update wrangler.toml with IDs
5. Run migrations: `wrangler d1 execute sieyosakoi-db --file migrations/0001_initial.sql`
6. Set secrets: `wrangler secret put ADMIN_USERNAME` etc.
7. Build & deploy

## Routes

### Public

| Route | Method | Purpose |
|---|---|---|
| `/` | GET | Landing page with current batch products, batch status card |
| `/checkout` | GET/POST | Order form (name, phone, delivery method, address if shipping), cart summary |
| `/payment?order={id}` | GET | Bank transfer instructions, VietQR code, payment deadline |
| `/order/[id]` | GET | Order status lookup (order_status, payment_status, items, total) |

### Admin (middleware session required, except /admin/login)

| Route | Method | Purpose |
|---|---|---|
| `/admin/login` | GET/POST | Username/password → PBKDF2 verify → session cookie |
| `/admin/logout` | POST | Delete session from KV → redirect to /admin/login |
| `/admin` | GET | Dashboard (stats card: orders, revenue, pending payments) |
| `/admin/batches` | GET | List all batches with status badges |
| `/admin/batches/[id]` | GET/POST | Edit batch details, list orders in batch, export CSV |
| `/admin/orders` | GET | All orders with filters (status, payment, batch, date range) |
| `/admin/orders/[id]` | GET/POST | Order detail, update status, verify payment, add notes |
| `/admin/products` | GET/POST/DELETE | Product CRUD, R2 image upload (multiple), variant config |
| `/admin/settings` | GET/POST | Bank info, shipping options, shop name, VietQR data |

All admin routes protected by `middleware.ts`; invalid/expired session redirects to `/admin/login`.

## Project Structure

```
/
├── src/
│   ├── pages/
│   │   ├── index.astro                 — Landing (current batch products)
│   │   ├── checkout.astro              — Order form (POST)
│   │   ├── payment.astro               — Bank transfer instructions + VietQR
│   │   ├── admin/
│   │   │   ├── login.astro             — Admin login
│   │   │   ├── logout.ts               — Session destruction
│   │   │   ├── index.astro             — Dashboard (stats, recent orders)
│   │   │   ├── batches/
│   │   │   │   ├── index.astro         — Batch list
│   │   │   │   └── [id].astro          — Batch detail + order mgmt + export
│   │   │   ├── orders/
│   │   │   │   ├── index.astro         — All orders with filters
│   │   │   │   └── [id].astro          — Order detail + payment verification
│   │   │   ├── products/
│   │   │   │   └── index.astro         — Product CRUD + R2 image upload
│   │   │   └── settings/
│   │   │       └── index.astro         — Bank info, shipping, shop config
│   │   └── img/[...key].ts             — R2 image proxy (product photos)
│   ├── middleware.ts                   — Session guard for /admin/* routes
│   ├── lib/
│   │   ├── auth.ts                     — PBKDF2 hash/verify, session mgmt
│   │   ├── db.ts                       — D1 query helpers (batches, products, orders)
│   │   └── r2.ts                       — R2 upload/delete helpers
│   ├── types.ts                        — Batch, Product, Order, DeliveryMethod
│   ├── styles/
│   │   ├── global.css                  — Public pages (koinobori palette)
│   │   └── admin.css                   — Admin dashboard styles
│   └── components/                     — Reusable UI components
├── migrations/
│   └── 0001_initial.sql                — D1 schema (batches, products, orders)
├── wrangler.toml                       — CF Workers config (D1, KV, R2 bindings)
├── astro.config.mjs                    — Astro SSR + Cloudflare adapter
└── package.json
```
