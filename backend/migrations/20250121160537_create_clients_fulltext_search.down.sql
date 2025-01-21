DROP TRIGGER IF EXISTS clients_search_vector_update ON clients;

DROP INDEX IF EXISTS idx_clients_search;

ALTER TABLE clients 
DROP COLUMN IF EXISTS search_vector;
