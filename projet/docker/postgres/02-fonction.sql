-- Create schema projet

CREATE OR REPLACE FUNCTION projet.log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO projet.logs (table_name, operation, changed_data, log_time)
        VALUES (TG_TABLE_NAME, 'INSERT', row_to_json(NEW), current_timestamp);
RETURN NEW;
ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO projet.logs (table_name, operation, changed_data, log_time)
        VALUES (TG_TABLE_NAME, 'UPDATE', row_to_json(NEW), current_timestamp);
RETURN NEW;
ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO projet.logs (table_name, operation, changed_data, log_time)
        VALUES (TG_TABLE_NAME, 'DELETE', row_to_json(OLD), current_timestamp);
RETURN OLD;
END IF;
RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql;

--Fonction pour faire les commandes








