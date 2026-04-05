-- SIE Yosakoi Shop — Initial Schema
-- D1 (SQLite) — no cross-statement transactions

CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | open | closed
  open_at INTEGER,
  close_at INTEGER, -- Unix timestamp (seconds). 2026-04-14 23:59:59 VN = 1744732799
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL REFERENCES batches(id),
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- VND
  description TEXT,
  image_url TEXT,
  images TEXT DEFAULT '[]', -- JSON array of R2 keys
  has_variants INTEGER NOT NULL DEFAULT 0, -- 0|1
  variants_config TEXT DEFAULT NULL, -- JSON, only when has_variants=1
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, -- SIE-2026-0001
  batch_id TEXT NOT NULL REFERENCES batches(id),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_method TEXT NOT NULL, -- pickup_practice | pickup_festival_sat | pickup_festival_sun | ship_after_27apr
  address TEXT,
  items TEXT NOT NULL, -- JSON array
  subtotal INTEGER NOT NULL,
  shipping_fee INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  notes TEXT,
  order_status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | shipping | done | cancelled
  payment_status TEXT NOT NULL DEFAULT 'awaiting', -- awaiting | verified | refunded
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS order_sequence (
  batch_id TEXT PRIMARY KEY,
  next_seq INTEGER NOT NULL DEFAULT 1
);
