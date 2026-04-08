-- 0009_add_tshirt_kids.sql
-- Thêm sản phẩm áo phông trẻ em, dùng chung ảnh với tshirt người lớn

-- Dịch chuyển sort_order của tenugui, standee, keychain lên 1 bậc
UPDATE products SET sort_order = 5 WHERE id = 'keychain';
UPDATE products SET sort_order = 4 WHERE id = 'standee';
UPDATE products SET sort_order = 3 WHERE id = 'tenugui';

-- Thêm sản phẩm áo phông trẻ em
INSERT OR IGNORE INTO products (id, batch_id, name, price, description, image_url, images, has_variants, variants_config, sort_order) VALUES
(
  'tshirt-kids',
  'batch-2026-03',
  'Áo phông Koinobori Bé',
  210000,
  'Cotton 100%, 2 chiều, oversize. Thông số thực tế có thể chênh lệch 0.5–1cm.',
  '/img/products/tshirt/blue-front.webp',
  '["products/tshirt/blue-front.webp","products/tshirt/blue-back.webp","products/tshirt/black-front.webp","products/tshirt/black-back.webp","products/tshirt/red-front.webp","products/tshirt/red-back.webp","products/tshirt/white-front.webp","products/tshirt/white-back.webp"]',
  1,
  '{"type":"color_size","colors":[{"name":"Xanh Cobalt","slug":"blue","label":"Royal Blue","images":["products/tshirt/blue-front.webp","products/tshirt/blue-back.webp"]},{"name":"Đen","slug":"black","label":"Black","images":["products/tshirt/black-front.webp","products/tshirt/black-back.webp"]},{"name":"Đỏ Mận","slug":"red","label":"Burgundy","images":["products/tshirt/red-front.webp","products/tshirt/red-back.webp"]},{"name":"Trắng","slug":"white","label":"White","images":["products/tshirt/white-front.webp","products/tshirt/white-back.webp"]}],"sizes":["1","2","3","4","5"],"base_price":210000,"size_chart_image":"products/tshirt-kids/size-chart.webp"}',
  2
);
