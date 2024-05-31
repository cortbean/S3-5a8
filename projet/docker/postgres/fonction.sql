CREATE OR REPLACE FUNCTION projet.log_changes() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO projet.logs (table_name, operation, changed_data)
        VALUES (TG_TABLE_NAME, 'INSERT', row_to_json(NEW));
RETURN NEW;
ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO projet.logs (table_name, operation, changed_data)
        VALUES (TG_TABLE_NAME, 'UPDATE', row_to_json(NEW));
RETURN NEW;
ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO projet.logs (table_name, operation, changed_data)
        VALUES (TG_TABLE_NAME, 'DELETE', row_to_json(OLD));
RETURN OLD;
END IF;
END;
$$ LANGUAGE plpgsql;
