-- 0007_rename_standee_keychain.sql
-- Đổi tên standee và keychain, chuyển "Set 2" về cuối

UPDATE products SET name = 'Standee Chibi Cưỡi Cá (Set 2)' WHERE id = 'standee';
UPDATE products SET name = 'Móc Khóa Chibi Cán Hologram (Set 2)' WHERE id = 'keychain';
