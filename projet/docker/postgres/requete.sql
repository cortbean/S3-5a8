CREATE SCHEMA projet;

insert into projet.utilisateur(cip, nom, prenom, courriel, role, promotion, programme) VALUES
('mahf0901', 'Maheux', 'Francois', 'mahf0901@usherbrooke.ca', 'client', '69', 'Génie électrique');

-- Insert a new commande
INSERT INTO projet.commande (id_commande, date_commande, cip)
VALUES ('CMD001', '2024-05-31 14:00:00', 'mahf0901');

-- Insert related entries into plusieurs
INSERT INTO projet.plusieurs (id_Produit, id_commande, quantite)
VALUES
    (1, 'CMD001', '3'),
    (2, 'CMD001', '5');


-- Query the view
SELECT * FROM projet.commande_produits WHERE id_commande = 'CMD001';