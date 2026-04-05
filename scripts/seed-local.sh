#!/bin/bash
# Seed local D1 + KV + R2 for development
# Usage: bash scripts/seed-local.sh <admin-password>
# Requires: wrangler, node 18+

set -e
PASSWORD="${1:-admin2026}"
DB_NAME="sieyosakoi-db"

echo "==> Applying D1 migrations locally..."
wrangler d1 execute "$DB_NAME" --local --file=migrations/0001_initial.sql
wrangler d1 execute "$DB_NAME" --local --file=migrations/0002_seed.sql

echo "==> Converting images to WebP..."
bash scripts/convert-images.sh

echo "==> Uploading images to R2 local..."
for f in $(find dist-images -name "*.webp"); do
  # Strip dist-images/ prefix to get R2 key
  key="${f#dist-images/}"
  wrangler r2 object put "sieyosakoi-images/$key" --file="$f" --local
done

echo "==> Seeding KV (admin credentials + config)..."
HASH=$(node scripts/generate-admin-hash.mjs "$PASSWORD")
wrangler kv key put --binding=KV "admin_username" "admin" --local
wrangler kv key put --binding=KV "admin_password" "$HASH" --local
wrangler kv key put --binding=KV "config:bank_info" \
  '{"bank":"Techcombank","account":"19040070626015","name":"Vũ Khánh Chi","account_name_ascii":"Vu Khanh Chi"}' \
  --local
wrangler kv key put --binding=KV "config:shop_info" \
  '{"name":"SIE Yosakoi Shop","batch_name":"Đợt Bán 03 — 2026","deadline":1744732799,"deadline_label":"23:59 ngày 14/4/2026"}' \
  --local

echo "==> Verifying..."
wrangler d1 execute "$DB_NAME" --local --command="SELECT id, name, status FROM batches"
wrangler d1 execute "$DB_NAME" --local --command="SELECT COUNT(*) as product_count FROM products"

echo ""
echo "Local seed complete! Admin password: $PASSWORD"
echo "Run: wrangler dev"
