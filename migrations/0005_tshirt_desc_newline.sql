-- 0005_tshirt_desc_newline.sql
-- Tách dòng "Thông số thực tế..." xuống dòng mới trong mô tả áo phông

UPDATE products SET
  description = 'Chất liệu: Cotton 100%, 2 chiều.
Thông số thực tế có thể chênh lệch 0,5–1cm.'
WHERE id = 'tshirt';
