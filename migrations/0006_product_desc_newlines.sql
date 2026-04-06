-- 0006_product_desc_newlines.sql
-- Tách mô tả các sản phẩm xuống dòng sau mỗi dấu chấm câu

UPDATE products SET description = 'Chất liệu: Cotton 100%.
Kích thước: ~90cm × ~35cm'
WHERE id = 'tenugui';

UPDATE products SET description = 'Kích thước: 3cm.
Chất liệu: Mica.
🎀 Bí mật — sẽ tiết lộ khi nhận hàng!'
WHERE id = 'standee';

UPDATE products SET description = 'Kích thước: 4cm.
Chất liệu: Mica, cán hologram.
🎀 Bí mật — sẽ tiết lộ khi nhận hàng!'
WHERE id = 'keychain';
