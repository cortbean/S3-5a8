-- Mise à jour de la quantité pour les produits spécifiés
UPDATE projet.Produit
SET Quantitte_stock = CASE
                          WHEN id_Produit = 2081 THEN 100
                          WHEN id_Produit = 2082 THEN 200
                          WHEN id_Produit = 2083 THEN 150
                          WHEN id_Produit = 2084 THEN 50
                          ELSE Quantitte_stock
    END
WHERE id_Produit IN (2081, 2082, 2083, 2084);

CREATE DATABASE projet;