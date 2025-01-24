DROP TRIGGER IF EXISTS users_search_vector_update ON users;

DROP INDEX IF EXISTS idx_users_search;

ALTER TABLE users
DROP COLUMN IF EXISTS search_vector;
