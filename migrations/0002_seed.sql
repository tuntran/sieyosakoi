-- SIE Yosakoi Shop — Seed Data (idempotent)

INSERT OR IGNORE INTO batches (id, name, status, close_at) VALUES
('batch-2026-03', 'Đợt Bán 03 — 2026', 'open', 1776185999);
-- 1776185999 = 2026-04-14 23:59:59 Asia/Ho_Chi_Minh

INSERT OR IGNORE INTO order_sequence (batch_id, next_seq) VALUES
('batch-2026-03', 1);

-- T-shirt (has variants: color x size)
INSERT OR IGNORE INTO products (id, batch_id, name, price, description, image_url, images, has_variants, variants_config, sort_order) VALUES
(
  'tshirt',
  'batch-2026-03',
  'Áo Phông Đội',
  220000,
  'Cotton 100%, 2 chiều, oversize. Thông số thực tế có thể chênh lệch 0.5–1cm.',
  '/img/products/tshirt/blue-front.webp',
  '["products/tshirt/blue-front.webp","products/tshirt/blue-back.webp","products/tshirt/black-front.webp","products/tshirt/black-back.webp","products/tshirt/red-front.webp","products/tshirt/red-back.webp","products/tshirt/white-front.webp","products/tshirt/white-back.webp"]',
  1,
  '{"type":"color_size","colors":[{"name":"Xanh Cobalt","slug":"blue","label":"Royal Blue","images":["products/tshirt/blue-front.webp","products/tshirt/blue-back.webp"]},{"name":"Đen","slug":"black","label":"Black","images":["products/tshirt/black-front.webp","products/tshirt/black-back.webp"]},{"name":"Đỏ Mận","slug":"red","label":"Burgundy","images":["products/tshirt/red-front.webp","products/tshirt/red-back.webp"]},{"name":"Trắng","slug":"white","label":"White","images":["products/tshirt/white-front.webp","products/tshirt/white-back.webp"]}],"sizes":["S","M","L","XL","XXL","3XL"],"base_price":220000,"price_overrides":{"3XL":250000},"size_chart_image":"products/tshirt/size-chart.webp"}',
  1
);

-- Tenugui (simple, no variants)
INSERT OR IGNORE INTO products (id, batch_id, name, price, description, image_url, images, has_variants, sort_order) VALUES
(
  'tenugui',
  'batch-2026-03',
  'Tenugui',
  120000,
  'Kích thước: ~90cm × ~35cm. Chất liệu: Cotton 100%.',
  '/img/products/tenugui.webp',
  '["products/tenugui.webp"]',
  0,
  2
);

-- Standee (secret product)
INSERT OR IGNORE INTO products (id, batch_id, name, price, description, image_url, images, has_variants, sort_order) VALUES
(
  'standee',
  'batch-2026-03',
  'Set Standee Chibi Bài Diễn 2026',
  0,
  'Kích thước: 3cm. Chất liệu: Mica. 🎀 Bí mật — sẽ tiết lộ khi nhận hàng!',
  '/img/products/secret.webp',
  '["products/secret.webp"]',
  0,
  3
);

-- Keychain (secret product)
INSERT OR IGNORE INTO products (id, batch_id, name, price, description, image_url, images, has_variants, sort_order) VALUES
(
  'keychain',
  'batch-2026-03',
  'Set Móc Khóa Chibi Bài Diễn 2026',
  0,
  'Kích thước: 4cm. Chất liệu: Mica, cán hologram. 🎀 Bí mật — sẽ tiết lộ khi nhận hàng!',
  '/img/products/secret.webp',
  '["products/secret.webp"]',
  0,
  4
);
