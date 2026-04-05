-- 0004_content_update.sql

-- T-shirt: rename, mô tả chuẩn, thứ tự màu (Xanh Bích→Đen→Trắng→Đỏ), color_chart_image
UPDATE products SET
  name = 'Áo phông Koinobori',
  description = 'Chất liệu: Cotton 100%, 2 chiều. Thông số thực tế có thể chênh lệch 0,5–1cm.',
  variants_config = json('{"type":"color_size","colors":[{"name":"Xanh Bích","slug":"blue","label":"Xanh Bích","images":["products/tshirt/blue-front.webp","products/tshirt/blue-back.webp"]},{"name":"Đen","slug":"black","label":"Đen","images":["products/tshirt/black-front.webp","products/tshirt/black-back.webp"]},{"name":"Trắng","slug":"white","label":"Trắng","images":["products/tshirt/white-front.webp","products/tshirt/white-back.webp"]},{"name":"Đỏ","slug":"red","label":"Đỏ","images":["products/tshirt/red-front.webp","products/tshirt/red-back.webp"]}],"sizes":["S","M","L","XL","XXL","3XL"],"base_price":220000,"price_overrides":{"3XL":250000},"size_chart_image":"products/tshirt/size-chart.webp","color_chart_image":"products/tshirt/color-chart-ct100.webp"}')
WHERE id = 'tshirt';

-- Tenugui: rename, giá 100k, mô tả chuẩn, ảnh mới
UPDATE products SET
  name = 'Tenugui Koinobori',
  price = 100000,
  description = 'Chất liệu: Cotton 100%. Kích thước: ~90cm × ~35cm',
  image_url = 'products/tenugui.webp',
  images = '["products/tenugui.webp"]'
WHERE id = 'tenugui';

-- Secret (dùng chung cho standee + keychain)
UPDATE products SET
  image_url = 'products/secret.webp',
  images = '["products/secret.webp"]'
WHERE image_url LIKE '%secret%';
