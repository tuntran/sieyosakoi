-- 0008_remove_tshirt_color_chart.sql
-- Xóa color_chart_image khỏi variants_config của tshirt

UPDATE products SET
  variants_config = json_remove(variants_config, '$.color_chart_image')
WHERE id = 'tshirt';
