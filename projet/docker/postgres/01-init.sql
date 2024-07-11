-- PostgreSQL database dump

-- Dumped from database version 13.6 (Debian 13.6-1.pgdg110+1)
-- Dumped by pg_dump version 14.1

-- Started on 2022-05-25 18:13:12 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Create schema projet
CREATE SCHEMA projet;
ALTER SCHEMA projet OWNER TO postgres;
SET default_tablespace = '';
SET default_table_access_method = heap;

-- Tables
CREATE TABLE projet.Programme (
                                  Programme VARCHAR(50),
                                  faculte VARCHAR(50) NOT NULL,
                                  PRIMARY KEY(Programme)
);

CREATE TABLE projet.Categorie (
                                  id_categorie VARCHAR(50),
                                  description VARCHAR(50),
                                  PRIMARY KEY(id_categorie)
);

CREATE TABLE projet.Utilisateur (
                                    cip VARCHAR(8),
                                    Nom TEXT,
                                    Prenom TEXT,
                                    Courriel VARCHAR(255) NOT NULL,
                                    role VARCHAR(50),
                                    promotion VARCHAR(50),
                                    Programme VARCHAR(50),
                                    PRIMARY KEY(cip),
                                    FOREIGN KEY(Programme) REFERENCES projet.Programme(Programme)
);

CREATE TABLE projet.Produit (
                                id_Produit INTEGER,
                                Nom VARCHAR(255) NOT NULL,
                                Prix NUMERIC(10,2) NOT NULL,
                                id_categorie VARCHAR(50),
                                image_url TEXT,
                                PRIMARY KEY(id_Produit),
                                FOREIGN KEY(id_categorie) REFERENCES projet.Categorie(id_categorie)
);

CREATE TABLE projet.commande (
                                 id_commande VARCHAR(50),
                                 cip VARCHAR(8) NOT NULL,
                                 date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 status VARCHAR(50),
                                 Nom TEXT,
                                 Prenom TEXT,
                                 PRIMARY KEY (id_commande),
                                 FOREIGN KEY (cip) REFERENCES projet.Utilisateur (cip)
);

CREATE TABLE projet.plusieurs (
                                  id_Produit INTEGER,
                                  id_commande VARCHAR(50),
                                  quantite INTEGER,
                                  Nom VARCHAR(255) NOT NULL,
                                  Prix NUMERIC(10,2) NOT NULL,
                                  PRIMARY KEY(id_Produit, id_commande),
                                  FOREIGN KEY(id_Produit) REFERENCES projet.Produit(id_Produit),
                                  FOREIGN KEY(id_commande) REFERENCES projet.commande(id_commande)
);

CREATE TABLE projet.logs (
                             log_id SERIAL PRIMARY KEY,
                             table_name TEXT,
                             operation TEXT,
                             changed_data JSONB,
                             log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projet.produit_visible (
                                        id_produit INTEGER,
                                        PRIMARY KEY (id_produit),
                                        FOREIGN KEY (id_produit) REFERENCES projet.Produit (id_produit)
);

CREATE VIEW projet.commande_produits AS
SELECT
    c.id_commande,
    p.Nom AS produit_nom,
    p.Prix AS produit_prix,
    pl.quantite
FROM
    projet.plusieurs pl
        JOIN projet.commande c ON pl.id_commande = c.id_commande
        JOIN projet.Produit p ON pl.id_Produit = p.id_Produit;

CREATE TABLE projet.CommandeVueAdmin (
                                         id_commande VARCHAR(50),
                                         produit_nom VARCHAR(100),
                                         produit_prix DECIMAL(10, 2),
                                         quantite INT
);

-- Inserts
INSERT INTO projet.Programme (Programme, faculte) VALUES
        ('Droit', 'Faculté de droit'),
        ('Administration des affaires', 'École de gestion'),
        ('Éducation', 'Faculté déducation'),
        ('Génie civil', 'Faculté de génie'),
        ('Génie mécanique', 'Faculté de génie'),
        ('Génie électrique', 'Faculté de génie'),
        ('Lettres et sciences humaines', 'Faculté de lettres et sciences humaines'),
        ('Médecine', 'Faculté de médecine et des sciences de la santé'),
        ('Biologie', 'Faculté des sciences'),
        ('Chimie', 'Faculté des sciences'),
        ('Physique', 'Faculté des sciences'),
        ('Informatique', 'Faculté des sciences'),
        ('Sciences de lactivité physique', 'Faculté des sciences de lactivité physique');

-- Insertion des catégories initiales
INSERT INTO projet.Categorie(id_categorie, description) VALUES
        ('Alcool fort', 'Alcools forts'),
        ('Bieres', 'Bières'),
        ('Bières artisanales', 'Bières artis.'),
        ('Cocktails', 'Cocktails'),
        ('Eaux de vie', 'Eaux de vie'),
        ('Gin', 'Gin'),
        ('Liqueurs', 'Liq. & Crèmes'),
        ('Nourriture', 'Nourriture'),
        ('Rhum', 'Rhum'),
        ('Sans alcool', 'Sans alcool'),
        ('Shooter', 'Shooters'),
        ('Vin', 'Vins'),
        ('Whisky', 'Whiskys');

-- Insertion des produits initiaux classés selon l'ordre des catégories spécifiées
INSERT INTO projet.Produit(id_Produit, Nom, Prix, id_categorie, image_url) VALUES
        -- Alcool fort
        (2081, 'Bottle of Vodka', 15.00, 'Alcool fort', 'images/bottle_de_vodka.png'),
        (2082, 'Bottle of Rhum', 15.00, 'Alcool fort', 'images/bottle_de_rhum.png'),
        (2083, 'Bottle of Whisky', 15.00, 'Alcool fort', 'images/bottle_de_whisky.png'),
        (2084, 'Bottle of Gin', 15.00, 'Alcool fort', 'images/bottle_de_gin.png'),
        (2085, 'Bottle of Tequila', 15.00, 'Alcool fort', 'images/bottle_de_tequila_2.png'),
        (2086, 'Bottle of Brandy', 15.00, 'Alcool fort', 'images/bottle_de_brandy.png'),
        (2087, 'Absinthe', 20.00, 'Alcool fort', 'images/absinthe.png'),
        (2088, 'Rhum épicé', 18.00, 'Alcool fort', 'images/rhum_epice.png'),
        (2089, 'Rhum Blanc', 15.00, 'Alcool fort', 'images/rhum_blanc.png'),
        (2090, 'Tequila Silver', 15.00, 'Alcool fort', 'images/tequila_silver.png'),
        (2091, 'Cognac', 25.00, 'Alcool fort', 'images/cognac.png'),
        (2092, 'Armagnac', 25.00, 'Alcool fort', 'images/armagnac.png'),
        (2093, 'Calvados', 20.00, 'Alcool fort', 'images/calvados.png'),
        (2094, 'Raki', 20.00, 'Alcool fort', 'images/raki.png'),
        (2095, 'Grappa', 18.00, 'Alcool fort', 'images/grappa.png'),
        (2096, 'Pastis', 15.00, 'Alcool fort', 'images/pastis.png'),
        (2097, 'Schnapps', 18.00, 'Alcool fort', 'images/schnapps.png'),
        (2098, 'Bourbon', 20.00, 'Alcool fort', 'images/bourbon.png'),
        (2099, 'Rhum Vieilli', 18.00, 'Alcool fort', 'images/rhum_vieilli.png'),
        (2100, 'Mezcal', 22.00, 'Alcool fort', 'images/mezcal.png'),

        -- Bieres
        (2061, 'Pale Lager', 3.00, 'Bieres', 'images/pale_lager.png'),
        (2062, 'Pilsner', 3.00, 'Bieres', 'images/pilsner.png'),
        (2063, 'Amber Lager', 3.00, 'Bieres', 'images/amber_lager.png'),
        (2064, 'Dark Lager', 3.00, 'Bieres', 'images/dark_lager.png'),
        (2065, 'Pale Ale', 3.00, 'Bieres', 'images/pale_ale.png'),
        (2066, 'Brown Ale', 3.00, 'Bieres', 'images/brown_ale.png'),
        (2067, 'Hefeweizen', 3.00, 'Bieres', 'images/hefeweizen.png'),
        (2068, 'Witbier', 3.00, 'Bieres', 'images/witbier.png'),
        (2069, 'IPA', 3.00, 'Bieres', 'images/ipa.png'),
        (2070, 'Porter', 3.00, 'Bieres', 'images/porter.png'),
        (2071, 'Stout', 3.00, 'Bieres', 'images/stout.png'),
        (2072, 'Blonde Ale', 3.00, 'Bieres', 'images/blonde_ale.png'),
        (2073, 'Red Ale', 3.00, 'Bieres', 'images/red_ale.png'),
        (2074, 'Barleywine', 3.00, 'Bieres', 'images/barleywine.png'),
        (2075, 'Saison', 3.00, 'Bieres', 'images/saison.png'),
        (2076, 'Dubbel', 3.00, 'Bieres', 'images/dubbel.png'),
        (2077, 'Tripel', 3.00, 'Bieres', 'images/tripel.png'),
        (2078, 'Quadrupel', 3.00, 'Bieres', 'images/quadrupel.png'),
        (2079, 'Gose', 3.00, 'Bieres', 'images/gose.png'),
        (2080, 'Sour Ale', 3.00, 'Bieres', 'images/sour_ale.png'),

        -- Bières artisanales
        (2501, 'Pale Ale Légère', 5.00, 'Bières artisanales', 'images/pale_ale_legere.png'),
        (2502, 'IPA Tropicale', 5.50, 'Bières artisanales', 'images/ipa_tropicale.png'),
        (2503, 'Amber Ale Douce', 6.00, 'Bières artisanales', 'images/amber_ale_douce.png'),
        (2504, 'Stout Robuste', 6.50, 'Bières artisanales', 'images/stout_robuste.png'),
        (2505, 'Saison Épicée', 7.00, 'Bières artisanales', 'images/saison_epicee.png'),
        (2506, 'Hefeweizen Classique', 5.00, 'Bières artisanales', 'images/hefeweizen_classique.png'),
        (2507, 'Brown Ale Onctueuse', 5.50, 'Bières artisanales', 'images/brown_ale_onctueuse.png'),
        (2508, 'Witbier Fruitée', 6.00, 'Bières artisanales', 'images/witbier_fruitee.png'),
        (2509, 'Red Ale Corsée', 6.50, 'Bières artisanales', 'images/red_ale_corse.png'),
        (2510, 'Double IPA Puissante', 7.00, 'Bières artisanales', 'images/double_ipa_puissante.png'),
        (2511, 'IPA Canadienne', 7.50, 'Bières artisanales', 'images/ipa_canadienne.png'),
        (2512, 'Stout à Érable', 8.00, 'Bières artisanales', 'images/stout_erable.png'),
        (2513, 'Pale Ale des Rocheuses', 6.00, 'Bières artisanales', 'images/pale_ale_rocheuses.png'),
        (2514, 'Blonde de Montréal', 6.50, 'Bières artisanales', 'images/blonde_montreal.png'),
        (2515, 'Rouge de Québec', 7.00, 'Bières artisanales', 'images/rouge_quebec.png'),
        (2516, 'Saison de la Côte Ouest', 7.50, 'Bières artisanales', 'images/saison_cote_ouest.png'),
        (2517, 'Porter de Toronto', 8.00, 'Bières artisanales', 'images/porter_toronto.png'),
        (2518, 'Gose des Maritimes', 7.00, 'Bières artisanales', 'images/gose_maritimes.png'),
        (2519, 'Brune des Prairies', 7.50, 'Bières artisanales', 'images/brune_prairies.png'),
        (2520, 'Tripel du Yukon', 8.50, 'Bières artisanales', 'images/tripel_yukon.png'),

        -- Cocktails
        (2041, 'Margarita', 7.00, 'Cocktails', 'images/margarita.png'),
        (2042, 'Mojito', 7.00, 'Cocktails', 'images/mojito.png'),
        (2043, 'Martini', 7.00, 'Cocktails', 'images/martini.png'),
        (2044, 'Old Fashioned', 8.00, 'Cocktails', 'images/old_fashioned.png'),
        (2045, 'Cosmopolitan', 7.00, 'Cocktails', 'images/cosmopolitan.png'),
        (2046, 'Pina Colada', 7.00, 'Cocktails', 'images/pina_colada.png'),
        (2047, 'Bloody Mary', 8.00, 'Cocktails', 'images/bloody_mary.png'),
        (2048, 'Negroni', 8.00, 'Cocktails', 'images/negroni.png'),
        (2049, 'Blue Lagoon', 7.00, 'Cocktails', 'images/blue_lagoon.png'),
        (2050, 'Mai Tai', 8.00, 'Cocktails', 'images/mai_tai.png'),
        (2051, 'Pisco Sour', 8.00, 'Cocktails', 'images/pisco_sour.png'),
        (2052, 'Caipirinha', 7.00, 'Cocktails', 'images/caipirinha.png'),
        (2053, 'Daiquiri', 7.00, 'Cocktails', 'images/daiquiri.png'),
        (2054, 'Tom Collins', 7.00, 'Cocktails', 'images/tom_collins.png'),
        (2055, 'Paloma', 8.00, 'Cocktails', 'images/paloma.png'),
        (2056, 'Sex on the Beach', 7.00, 'Cocktails', 'images/sex_on_the_beach.png'),
        (2057, 'French 75', 8.00, 'Cocktails', 'images/french_75.png'),
        (2058, 'Manhattan', 8.00, 'Cocktails', 'images/manhattan.png'),
        (2059, 'Moscow Mule', 7.00, 'Cocktails', 'images/moscow_mule.png'),
        (2060, 'Mint Julep', 7.00, 'Cocktails', 'images/mint_julep.png'),

        -- Eaux de vie
        (2261, 'Poire Williams', 10.00, 'Eaux de vie', 'images/poire_williams.png'),
        (2262, 'Mirabelle Plum', 10.00, 'Eaux de vie', 'images/mirabelle_plum.png'),
        (2263, 'Kirsch', 12.00, 'Eaux de vie', 'images/kirsch.png'),
        (2264, 'Eaux Grappa', 10.00, 'Eaux de vie', 'images/eaux_grappa.png'),
        (2265, 'Eaux Calvados', 10.00, 'Eaux de vie', 'images/eaux_calvados.png'),
        (2266, 'Slivovitz', 10.00, 'Eaux de vie', 'images/slivovitz.png'),
        (2267, 'Rakia', 10.00, 'Eaux de vie', 'images/rakia.png'),
        (2268, 'Marc', 10.00, 'Eaux de vie', 'images/marc.png'),
        (2269, 'Eaux Armagnac', 15.00, 'Eaux de vie', 'images/eaux_armagnac.png'),
        (2270, 'Eaux Cognac', 20.00, 'Eaux de vie', 'images/eaux_cognac.png'),
        (2271, 'Apple Brandy', 12.00, 'Eaux de vie', 'images/apple_brandy.png'),
        (2272, 'Cherry Brandy', 12.00, 'Eaux de vie', 'images/cherry_brandy.png'),
        (2273, 'Apricot Brandy', 12.00, 'Eaux de vie', 'images/apricot_brandy.png'),
        (2274, 'Peach Brandy', 12.00, 'Eaux de vie', 'images/peach_brandy.png'),
        (2275, 'Pear Brandy', 11.00, 'Eaux de vie', 'images/pear_brandy.png'),
        (2276, 'Plum Brandy', 11.00, 'Eaux de vie', 'images/plum_brandy.png'),
        (2277, 'Blackberry Brandy', 11.00, 'Eaux de vie', 'images/blackberry_brandy.png'),
        (2278, 'Fig Brandy', 11.00, 'Eaux de vie', 'images/fig_brandy.png'),
        (2279, 'Grape Brandy', 11.00, 'Eaux de vie', 'images/grape_brandy.png'),
        (2280, 'Walnut Brandy', 11.00, 'Eaux de vie', 'images/walnut_brandy.png'),

        -- Gin
        (2241, 'London Dry Gin', 8.00, 'Gin', 'images/london_dry_gin.png'),
        (2242, 'Old Tom Gin', 8.00, 'Gin', 'images/old_tom_gin.png'),
        (2243, 'Herbal Gin', 8.50, 'Gin', 'images/herbal_gin.png'),
        (2244, 'Gin with Citrus', 8.00, 'Gin', 'images/gin_citrus.png'),
        (2245, 'Gin with Botanicals', 9.00, 'Gin', 'images/gin_botanicals.png'),
        (2246, 'Gin with Lavender', 8.50, 'Gin', 'images/gin_lavender.png'),
        (2247, 'Gin with Rose', 8.00, 'Gin', 'images/gin_rose.png'),
        (2248, 'Sloe Gin', 7.50, 'Gin', 'images/sloe_gin.png'),
        (2249, 'Plymouth Gin', 8.50, 'Gin', 'images/plymouth_gin.png'),
        (2250, 'Gin with Pepper', 8.50, 'Gin', 'images/gin_pepper.png'),
        (2251, 'Gin with Cucumber', 8.00, 'Gin', 'images/gin_cucumber.png'),
        (2252, 'Navy Strength Gin', 9.00, 'Gin', 'images/navy_strength_gin.png'),
        (2253, 'Gin with Elderflower', 8.50, 'Gin', 'images/gin_elderflower.png'),
        (2254, 'Pink Gin', 8.00, 'Gin', 'images/pink_gin.png'),
        (2255, 'Craft Gin', 10.00, 'Gin', 'images/craft_gin.png'),
        (2256, 'Gin with Mint', 8.50, 'Gin', 'images/gin_mint.png'),
        (2257, 'Barrel Aged Gin', 9.50, 'Gin', 'images/barrel_aged_gin.png'),
        (2258, 'Gin with Apple', 8.00, 'Gin', 'images/gin_apple.png'),
        (2259, 'Gin with Cherry', 8.00, 'Gin', 'images/gin_cherry.png'),
        (2260, 'Gin with Grape', 8.00, 'Gin', 'images/gin_grape.png'),

        -- Liqueurs & Crèmes
        (2401, 'Baileys Irish Cream', 12.00, 'Liqueurs', 'images/baileys_irish_cream.png'),
        (2402, 'Amaretto', 10.00, 'Liqueurs', 'images/amaretto.png'),
        (2403, 'Kahlua', 11.00, 'Liqueurs', 'images/kahlua.png'),
        (2404, 'Cointreau', 14.00, 'Liqueurs', 'images/cointreau.png'),
        (2405, 'Grand Marnier', 15.00, 'Liqueurs', 'images/grand_marnier.png'),
        (2406, 'Frangelico', 12.00, 'Liqueurs', 'images/frangelico.png'),
        (2407, 'Chambord', 13.00, 'Liqueurs', 'images/chambord.png'),
        (2408, 'Blue Curacao', 10.00, 'Liqueurs', 'images/blue_curacao.png'),
        (2409, 'Limoncello', 10.00, 'Liqueurs', 'images/limoncello.png'),
        (2410, 'Triple Sec', 10.00, 'Liqueurs', 'images/triple_sec.png'),
        (2411, 'Liq. Sambuca', 11.00, 'Liqueurs', 'images/liq_sambuca.png'),
        (2412, 'Drambuie', 14.00, 'Liqueurs', 'images/drambuie.png'),
        (2413, 'Midori', 12.00, 'Liqueurs', 'images/midori.png'),
        (2414, 'Jagermeister', 11.00, 'Liqueurs', 'images/jagermeister.png'),
        (2415, 'Campari', 10.00, 'Liqueurs', 'images/campari.png'),
        (2416, 'Aperol', 10.00, 'Liqueurs', 'images/aperol.png'),
        (2417, 'St. Germain', 13.00, 'Liqueurs', 'images/st_germain.png'),
        (2418, 'Crème de Cassis', 10.00, 'Liqueurs', 'images/creme_de_cassis.png'),
        (2419, 'Crème de Menthe', 10.00, 'Liqueurs', 'images/creme_de_menthe.png'),
        (2420, 'Crème de Cacao', 10.00, 'Liqueurs', 'images/creme_de_cacao.png'),

        -- Nourriture
        (2001, 'Pizza Végétarienne', 4.00, 'Nourriture', 'images/pizza_vegetarienne.png'),
        (2002, 'Pizza Poulet', 4.00, 'Nourriture', 'images/pizza_poulet.png'),
        (2003, 'Pizza Pepperoni', 4.00, 'Nourriture', 'images/pizza_pepperoni.png'),
        (2004, 'Pizza Margherita', 4.00, 'Nourriture', 'images/pizza_margherita.png'),
        (2005, 'Sandwich au Poulet', 3.00, 'Nourriture', 'images/sandwich_poulet.png'),
        (2006, 'Wrap au Poulet', 3.00, 'Nourriture', 'images/wrap_poulet.png'),
        (2007, 'Hot-Dog', 3.00, 'Nourriture', 'images/hot_dog.png'),
        (2008, 'Pogo', 3.00, 'Nourriture', 'images/pogo.png'),
        (2009, 'Pizza Fromages', 4.00, 'Nourriture', 'images/pizza_quatre_fromages.png'),
        (2010, 'Pizza Hawaïenne', 4.00, 'Nourriture', 'images/pizza_hawaienne.png'),
        (2011, 'Sandwich Végétarien', 3.00, 'Nourriture', 'images/sandwich_vegetarien.png'),
        (2012, 'Wrap au Bœuf', 3.00, 'Nourriture', 'images/wrap_boeuf.png'),
        (2013, 'Croissant au Jambon', 3.00, 'Nourriture', 'images/croissant_jambon.png'),
        (2014, 'Salade César', 3.00, 'Nourriture', 'images/salade_cesar.png'),
        (2015, 'Tacos au Poulet', 3.00, 'Nourriture', 'images/tacos_poulet.png'),
        (2016, 'Burrito Végétarien', 3.00, 'Nourriture', 'images/burrito_vegetarien.png'),
        (2017, 'Burger de Bœuf', 3.00, 'Nourriture', 'images/burger_boeuf.png'),
        (2018, 'Salade Grecque', 3.00, 'Nourriture', 'images/salade_grecque.png'),
        (2019, 'Sandwich BLT', 3.00, 'Nourriture', 'images/sandwich_blt.png'),
        (2020, 'Sushi Mixte', 3.00, 'Nourriture', 'images/sushi_mixte.png'),

        -- Rhum
        (2221, 'White Rum', 7.50, 'Rhum', 'images/white_rum.png'),
        (2222, 'Dark Rum', 8.00, 'Rhum', 'images/dark_rum.png'),
        (2223, 'Spiced Rum', 8.50, 'Rhum', 'images/spiced_rum.png'),
        (2224, 'Aged Rum', 9.00, 'Rhum', 'images/aged_rum.png'),
        (2225, 'Overproof Rum', 10.00, 'Rhum', 'images/overproof_rum.png'),
        (2226, 'Rhum Agricole', 8.00, 'Rhum', 'images/rhum_agricole.png'),
        (2227, 'Cachaça', 6.00, 'Rhum', 'images/cachaca.png'),
        (2228, 'Navy Rum', 9.00, 'Rhum', 'images/navy_rum.png'),
        (2229, 'Rhum de Mélasse', 7.50, 'Rhum', 'images/rhum_melasse.png'),
        (2230, 'Gold Rum', 8.00, 'Rhum', 'images/gold_rum.png'),
        (2231, 'Premium Rum', 12.00, 'Rhum', 'images/premium_rum.png'),
        (2232, 'Rum with Coconut', 7.50, 'Rhum', 'images/rum_coconut.png'),
        (2233, 'Rum with Vanilla', 7.50, 'Rhum', 'images/rum_vanilla.png'),
        (2234, 'Rum with Mango', 7.50, 'Rhum', 'images/rum_mango.png'),
        (2235, 'Honey Rum', 8.00, 'Rhum', 'images/honey_rum.png'),
        (2236, 'Rum with Cinnamon', 8.00, 'Rhum', 'images/rum_cinnamon.png'),
        (2237, 'Rum with Coffee', 8.50, 'Rhum', 'images/rum_coffee.png'),
        (2238, 'Rum with Lime', 8.00, 'Rhum', 'images/rum_lime.png'),
        (2239, 'Rum with Orange', 8.00, 'Rhum', 'images/rum_orange.png'),
        (2240, 'Rum Punch', 8.50, 'Rhum', 'images/rum_punch.png'),

        -- Sans alcool
        (2301, 'Coca-Cola', 2.00, 'Sans alcool', 'images/coca_cola.png'),
        (2302, 'Pepsi', 2.00, 'Sans alcool', 'images/pepsi.png'),
        (2303, 'Fanta', 2.00, 'Sans alcool', 'images/fanta.png'),
        (2304, 'Sprite', 2.00, 'Sans alcool', 'images/sprite.png'),
        (2305, 'Jus Orange', 2.50, 'Sans alcool', 'images/jus_orange.png'),
        (2306, 'Jus de Pomme', 2.50, 'Sans alcool', 'images/jus_pomme.png'),
        (2307, 'Eau Minérale', 1.50, 'Sans alcool', 'images/eau_minerale.png'),
        (2308, 'Eau Gazeuse', 1.50, 'Sans alcool', 'images/eau_gazeuse.png'),
        (2309, 'Thé Glacé', 2.00, 'Sans alcool', 'images/the_glace.png'),
        (2310, 'Limonade', 2.00, 'Sans alcool', 'images/limonade.png'),
        (2311, 'Jus de Raisin', 2.50, 'Sans alcool', 'images/jus_raisin.png'),
        (2312, 'Jus de Tomate', 2.50, 'Sans alcool', 'images/jus_tomate.png'),
        (2313, 'Jus de Carotte', 2.50, 'Sans alcool', 'images/jus_carotte.png'),
        (2314, 'Jus de Cranberry', 2.50, 'Sans alcool', 'images/jus_cranberry.png'),
        (2315, 'Jus Ananas', 2.50, 'Sans alcool', 'images/jus_ananas.png'),
        (2316, 'Jus de Mangue', 2.50, 'Sans alcool', 'images/jus_mangue.png'),
        (2317, 'Thé Chaud', 2.00, 'Sans alcool', 'images/the_chaud.png'),
        (2318, 'Café', 2.00, 'Sans alcool', 'images/cafe.png'),
        (2319, 'Chocolat Chaud', 2.50, 'Sans alcool', 'images/chocolat_chaud.png'),
        (2320, 'Smoothie', 3.00, 'Sans alcool', 'images/smoothie.png'),

        -- Shooter
        (2021, 'Tequila Shot', 3.00, 'Shooter', 'images/tequila_shot.png'),
        (2022, 'Jagerbomb', 3.00, 'Shooter', 'images/jagerbomb.png'),
        (2023, 'B-52', 3.00, 'Shooter', 'images/b52.png'),
        (2024, 'Kamikaze', 3.00, 'Shooter', 'images/kamikaze.png'),
        (2025, 'Lemon Drop', 3.00, 'Shooter', 'images/lemon_drop.png'),
        (2026, 'Irish Car Bomb', 3.00, 'Shooter', 'images/irish_car_bomb.png'),
        (2027, 'Sambuca', 3.00, 'Shooter', 'images/sambuca.png'),
        (2028, 'Buttery Nipple', 3.00, 'Shooter', 'images/buttery_nipple.png'),
        (2029, 'Vodka Shot', 3.00, 'Shooter', 'images/vodka_shot.png'),
        (2030, 'Rhum Shot', 3.00, 'Shooter', 'images/rhum_shot.png'),
        (2031, 'Whisky Shot', 3.00, 'Shooter', 'images/whisky_shot.png'),
        (2032, 'Gin Shot', 3.00, 'Shooter', 'images/gin_shot.png'),
        (2033, 'Tequila Shot', 3.00, 'Shooter', 'images/tequila_shot.png'),
        (2034, 'Brandy Shot', 3.00, 'Shooter', 'images/brandy_shot.png'),
        (2035, 'Absinthe Shot', 3.00, 'Shooter', 'images/absinthe_shot.png'),
        (2036, 'Sambuca Shot', 3.00, 'Shooter', 'images/sambuca_shot.png'),
        (2037, 'Limoncello Shot', 3.00, 'Shooter', 'images/limoncello_shot.png'),
        (2038, 'Menthe Shot', 3.00, 'Shooter', 'images/menthe_shot.png'),
        (2039, 'Framboise Shot', 3.00, 'Shooter', 'images/framboise_shot.png'),
        (2040, 'Pêche Shot', 3.00, 'Shooter', 'images/peche_shot.png'),

        -- Vin
        (2101, 'Cabernet Sauvignon', 5.00, 'Vin', 'images/cabernet_sauvignon.png'),
        (2102, 'Pinot Noir', 5.00, 'Vin', 'images/pinot_noir.png'),
        (2103, 'Merlot', 5.00, 'Vin', 'images/merlot.png'),
        (2104, 'Chardonnay', 5.00, 'Vin', 'images/chardonnay.png'),
        (2105, 'Sauvignon Blanc', 5.00, 'Vin', 'images/sauvignon_blanc.png'),
        (2106, 'Syrah', 5.00, 'Vin', 'images/syrah.png'),
        (2107, 'Grenache', 5.00, 'Vin', 'images/grenache.png'),
        (2108, 'Zinfandel', 5.00, 'Vin', 'images/zinfandel.png'),
        (2109, 'Sangiovese', 5.00, 'Vin', 'images/sangiovese.png'),
        (2110, 'Viognier', 5.00, 'Vin', 'images/viognier.png'),
        (2111, 'Malbec', 5.00, 'Vin', 'images/malbec.png'),
        (2112, 'Riesling', 5.00, 'Vin', 'images/riesling.png'),
        (2113, 'Moscato', 5.00, 'Vin', 'images/moscato.png'),
        (2114, 'Pinot Grigio', 5.00, 'Vin', 'images/pinot_grigio.png'),
        (2115, 'Cabernet Franc', 5.00, 'Vin', 'images/cabernet_franc.png'),
        (2116, 'Petit Verdot', 5.00, 'Vin', 'images/petit_verdot.png'),
        (2117, 'Carmenere', 5.00, 'Vin', 'images/carmenere.png'),
        (2118, 'Barbera', 5.00, 'Vin', 'images/barbera.png'),
        (2119, 'Chenin Blanc', 5.00, 'Vin', 'images/chenin_blanc.png'),
        (2120, 'Tempranillo', 5.00, 'Vin', 'images/tempranillo.png'),

        -- Whisky
        (2201, 'Single Malt Scotch', 10.00, 'Whisky', 'images/single_malt_scotch.png'),
        (2202, 'Double Malt Scotch', 12.00, 'Whisky', 'images/double_malt_scotch.png'),
        (2203, 'Triple Malt Scotch', 15.00, 'Whisky', 'images/triple_malt_scotch.png'),
        (2204, 'Peated Scotch', 12.50, 'Whisky', 'images/peated_scotch.png'),
        (2205, 'Bourbon Whiskey', 10.00, 'Whisky', 'images/bourbon_whiskey.png'),
        (2206, 'Rye Whiskey', 10.50, 'Whisky', 'images/rye_whiskey.png'),
        (2207, 'Irish Whiskey', 10.00, 'Whisky', 'images/irish_whiskey.png'),
        (2208, 'Japanese Whisky', 18.00, 'Whisky', 'images/japanese_whisky.png'),
        (2209, 'Canadian Whisky', 11.00, 'Whisky', 'images/canadian_whisky.png'),
        (2210, 'Blended Whisky', 8.00, 'Whisky', 'images/blended_whisky.png'),
        (2211, 'Cask Strength Whisky', 20.00, 'Whisky', 'images/cask_strength_whisky.png'),
        (2212, 'Sherry Cask Whisky', 15.00, 'Whisky', 'images/sherry_cask_whisky.png'),
        (2213, 'Port Cask Whisky', 18.00, 'Whisky', 'images/port_cask_whisky.png'),
        (2214, 'Single Cask Whisky', 25.00, 'Whisky', 'images/single_cask_whisky.png'),
        (2215, 'Old Whisky', 30.00, 'Whisky', 'images/old_whisky.png'),
        (2216, 'Rare Whisky', 40.00, 'Whisky', 'images/rare_whisky.png'),
        (2217, 'Limited Edition Whisky', 50.00, 'Whisky', 'images/limited_edition_whisky.png'),
        (2218, 'Vintage Whisky', 60.00, 'Whisky', 'images/vintage_whisky.png'),
        (2219, 'Craft Whisky', 12.00, 'Whisky', 'images/craft_whisky.png'),
        (2220, 'Smooth Whisky', 10.00, 'Whisky', 'images/smooth_whisky.png');
