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

-- Function to insert into CommandeVueAdmin
CREATE OR REPLACE FUNCTION InsertIntoCommandeVueAdmin(order_id VARCHAR)
RETURNS void AS $$
BEGIN
INSERT INTO projet.CommandeVueAdmin (id_commande, produit_nom, produit_prix, quantite)
SELECT
    c.id_commande,
    p.Nom AS produit_nom,
    p.Prix AS produit_prix,
    pl.quantite
FROM
    projet.plusieurs pl
        JOIN projet.commande c ON pl.id_commande = c.id_commande
        JOIN projet.produit p ON pl.id_Produit = p.id_Produit
WHERE
    c.id_commande = order_id;
END;
$$ LANGUAGE plpgsql;


