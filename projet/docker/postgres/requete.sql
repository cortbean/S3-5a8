

INSERT INTO projet.commande (id_commande, date_commande, cip) VALUES
                                                                  ('1', );


INSERT INTO projet.plusieurs (id_commande, id_Produit, quantite)
VALUES
    ('CMD123', 1, '2'),
    ('CMD123', 2, '3'),
    ('CMD123', 3, '1');

-- Query the view
SELECT * FROM projet.commande_produits WHERE id_commande = 'CMD123';