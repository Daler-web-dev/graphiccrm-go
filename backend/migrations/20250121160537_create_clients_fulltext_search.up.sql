ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX IF NOT EXISTS idx_clients_search 
ON clients 
USING GIN (search_vector);

DROP TRIGGER IF EXISTS clients_search_vector_update ON clients;

CREATE TRIGGER clients_search_vector_update
BEFORE INSERT OR UPDATE ON clients
FOR EACH ROW
EXECUTE PROCEDURE tsvector_update_trigger(
    search_vector,
    'pg_catalog.russian',
    'name',
    'surname',
    'contact_info',
    'address',
    'note',
);

UPDATE clients 
SET search_vector = to_tsvector('pg_catalog.russian', name || ' ' || surname || ' ' || contact_info || ' ' || address || ' ' || note);
