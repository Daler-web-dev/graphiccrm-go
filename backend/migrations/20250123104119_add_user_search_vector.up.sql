ALTER TABLE users
ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX IF NOT EXISTS idx_users_search 
ON users 
USING GIN (search_vector);

DROP TRIGGER IF EXISTS users_search_vector_update ON users;

CREATE TRIGGER users_search_vector_update
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE tsvector_update_trigger(
    search_vector,
    'pg_catalog.russian',
    'username'
);

UPDATE users
SET search_vector = to_tsvector('pg_catalog.russian', username);
