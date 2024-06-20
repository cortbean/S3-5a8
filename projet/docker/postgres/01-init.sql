--
-- PostgreSQL database dump
--

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

--
-- TOC entry 6 (class 2615 OID 16385)
-- Name: app; Type: SCHEMA; Schema: -; Owner: postgres
--


-- Create schema projet
CREATE SCHEMA projet;
ALTER SCHEMA projet OWNER TO postgres;
SET default_tablespace = '';

SET default_table_access_method = heap;

-- Additional tables in schema projet

-- Create schema
CREATE SCHEMA IF NOT EXISTS projet;

CREATE SEQUENCE projet.commande_id_seq START 1;



-- Create tables within the schema
CREATE TABLE projet.Programme(
                                 Programme VARCHAR(50),
                                 faculte VARCHAR(50) NOT NULL,
                                 PRIMARY KEY(Programme)
);

CREATE TABLE projet.logs(
                            log_id SERIAL PRIMARY KEY,
                            table_name TEXT,
                            operation TEXT,
                            changed_data JSONB,
                            log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projet.Categorie(
                                 id_categorie VARCHAR(50),
                                 description VARCHAR(50),
                                 PRIMARY KEY(id_categorie)
);

CREATE TABLE projet.Utilisateur(
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

CREATE TABLE projet.Produit(
                               id_Produit INTEGER,
                               Nom VARCHAR(255) NOT NULL,
                               Prix NUMERIC(10,2) NOT NULL,
                               id_categorie VARCHAR(50),
                               image_url TEXT,
                               PRIMARY KEY(id_Produit),
                               FOREIGN KEY(id_categorie) REFERENCES projet.Categorie(id_categorie)
);

CREATE TABLE projet.commande(
                                id_commande VARCHAR(50),
                                date_commande TIMESTAMP,
                                cip VARCHAR(8),
                                PRIMARY KEY(id_commande),
                                FOREIGN KEY(cip) REFERENCES projet.Utilisateur(cip)
);

CREATE TABLE projet.plusieurs(
                                 id_Produit INTEGER,
                                 id_commande VARCHAR(50),
                                 quantite INTEGER,
                                 PRIMARY KEY(id_Produit, id_commande),
                                 FOREIGN KEY(id_Produit) REFERENCES projet.Produit(id_Produit),
                                 FOREIGN KEY(id_commande) REFERENCES projet.commande(id_commande)
);


ALTER TABLE projet.Utilisateur OWNER TO postgres;

CREATE VIEW projet.commande_produits AS
SELECT
    c.id_commande,
    p.Nom AS produit_nom,
    p.Prix AS produit_prix,
    pl.quantite
FROM
    projet.plusieurs pl
        JOIN
    projet.commande c ON pl.id_commande = c.id_commande
        JOIN
    projet.Produit p ON pl.id_Produit = p.id_Produit;


CREATE TABLE projet.CommandeVueAdmin (
                                         id_commande VARCHAR(50),
                                         produit_nom VARCHAR(100),
                                         produit_prix DECIMAL(10, 2),
                                         quantite INT
);


INSERT INTO projet.Programme (Programme, faculte) VALUES
                                                      ('Lettres et sciences humaines', 'Faculté des lettres et sciences humaines'),
                                                      ('Médecine', 'Faculté de médecine et des sciences de la santé'),
                                                      ('Biologie', 'Faculté des sciences'),
                                                      ('Chimie', 'Faculté des sciences'),
                                                      ('Physique', 'Faculté des sciences'),
                                                      ('Informatique', 'Faculté des sciences'),
                                                      ('Sciences de lactivité physique', 'Faculté des sciences de lactivité physique'),
                                                      ('Droit', 'Faculté de droit'),
                                                      ('Administration des affaires', 'Faculté dadministration'),
                                                      ('Certificat en administration', 'Faculté dadministration'),
                                                      ('Maîtrise en administration', 'Faculté dadministration'),
                                                      ('MBA', 'Faculté dadministration'),
                                                      ('Doctorat en administration', 'Faculté dadministration'),
                                                      ('Certificat en droit', 'Faculté de droit'),
                                                      ('Maîtrise en droit', 'Faculté de droit'),
                                                      ('Doctorat en droit', 'Faculté de droit'),
                                                      ('Enseignement au préscolaire et au primaire', 'Faculté déducation'),
                                                      ('Enseignement en adaptation scolaire et sociale', 'Faculté déducation'),
                                                      ('Enseignement secondaire', 'Faculté déducation'),
                                                      ('Certificat en éducation', 'Faculté déducation'),
                                                      ('Maîtrise en sciences de léducation', 'Faculté déducation'),
                                                      ('Doctorat en éducation', 'Faculté déducation'),
                                                      ('Génie biotechnologique', 'Faculté de génie'),
                                                      ('Génie chimique', 'Faculté de génie'),
                                                      ('Génie civil', 'Faculté de génie'),
                                                      ('Génie électrique', 'Faculté de génie'),
                                                      ('Génie informatique', 'Faculté de génie'),
                                                      ('Génie mécanique', 'Faculté de génie'),
                                                      ('Génie robotique', 'Faculté de génie'),
                                                      ('Maîtrise en génie', 'Faculté de génie'),
                                                      ('Doctorat en génie', 'Faculté de génie'),
                                                      ('Études littéraires et culturelles', 'Faculté des lettres et sciences humaines'),
                                                      ('Histoire', 'Faculté des lettres et sciences humaines'),
                                                      ('Philosophie', 'Faculté des lettres et sciences humaines'),
                                                      ('Certificat en lettres et sciences humaines', 'Faculté des lettres et sciences humaines'),
                                                      ('Maîtrise en lettres et sciences humaines', 'Faculté des lettres et sciences humaines'),
                                                      ('Doctorat en lettres et sciences humaines', 'Faculté des lettres et sciences humaines'),
                                                      ('Sciences infirmières', 'Faculté de médecine et des sciences de la santé'),
                                                      ('Physiothérapie', 'Faculté de médecine et des sciences de la santé'),
                                                      ('Maîtrise en sciences de la santé', 'Faculté de médecine et des sciences de la santé'),
                                                      ('Doctorat en sciences de la santé', 'Faculté de médecine et des sciences de la santé'),
                                                      ('Biochimie', 'Faculté des sciences'),
                                                      ('Mathématiques', 'Faculté des sciences'),
                                                      ('Maîtrise en sciences', 'Faculté des sciences'),
                                                      ('Doctorat en sciences', 'Faculté des sciences'),
                                                      ('Kinésiologie', 'Faculté des sciences de lactivité physique'),
                                                      ('Enseignement de léducation physique et à la santé', 'Faculté des sciences de lactivité physique'),
                                                      ('Maîtrise en sciences de lactivité physique', 'Faculté des sciences de lactivité physique'),
                                                      ('Doctorat en sciences de lactivité physique', 'Faculté des sciences de lactivité physique'),
                                                      ('Psychologie', 'Faculté des sciences sociales'),
                                                      ('Travail social', 'Faculté des sciences sociales'),
                                                      ('Maîtrise en sciences sociales', 'Faculté des sciences sociales'),
                                                      ('Doctorat en sciences sociales', 'Faculté des sciences sociales'),
                                                      ('Gestion des ressources humaines', 'École de gestion'),
                                                      ('Gestion internationale', 'École de gestion'),
                                                      ('Certificat en gestion', 'École de gestion'),
                                                      ('Maîtrise en gestion', 'École de gestion'),
                                                      ('Doctorat en gestion', 'École de gestion'),
                                                      ('Musique', 'École de musique'),
                                                      ('Certificat en musique', 'École de musique'),
                                                      ('Maîtrise en musique', 'École de musique'),
                                                      ('Doctorat en musique', 'École de musique');




INSERT INTO projet.Categorie(id_categorie, description) VALUES
                                                            ('Nourriture','Nourriture'),
                                                            ('Shooter','Shooter'),
                                                            ('Cocktails','Cocktails'),
                                                            ('Bieres','Bieres'),
                                                            ('Alcool fort', 'Alcool fort');




INSERT INTO projet.Produit(id_Produit, Nom, Prix, id_categorie, image_url) VALUES
                                                                               (1, 'Pizza vegetarien', 4.00, 'Nourriture', 'images/pizza_vegetarien.png'),
                                                                               (2, 'Pizza Poulet', 4.00, 'Nourriture', 'images/pizza_poulet.png'),
                                                                               (3, 'Pizza Pepperoni', 4.00, 'Nourriture', 'images/pizza_pepperoni.png'),
                                                                               (4, 'Pizza Margherita', 4.00, 'Nourriture', 'images/pizza_margherita.png'),
                                                                               (5, 'Sandwich au poulet', 3.00, 'Nourriture', 'images/sandwich_poulet.png'),
                                                                               (6, 'wrap au poulet', 3.00, 'Nourriture', 'images/wrap_poulet.png'),
                                                                               (7, 'Hot-Dog', 3.00, 'Nourriture', 'images/hot_dog.png'),
                                                                               (8, 'Pogo', 3.00, 'Nourriture', 'images/pogo.png'),
                                                                               (9, 'Tequila', 3.00, 'Shooter', 'images/tequila.png'),
                                                                               (10, 'Jagerbomb', 3.00, 'Shooter', 'images/jagerbomb.png'),
                                                                               (11, 'B-52', 3.00, 'Shooter', 'images/b52.png'),
                                                                               (12, 'Kamikaze', 3.00, 'Shooter', 'images/kamikaze.png'),
                                                                               (13, 'Lemon Drop', 3.00, 'Shooter', 'images/lemon_drop.png'),
                                                                               (14, 'Irish Car Bomb', 3.00, 'Shooter', 'images/irish_car_bomb.png'),
                                                                               (15, 'Sambuca', 3.00, 'Shooter', 'images/sambuca.png'),
                                                                               (16, 'Buttery Nipple', 3.00, 'Shooter', 'images/buttery_nipple.png'),
                                                                               (17, 'Margarita', 3.00, 'Cocktails', 'images/margarita.png'),
                                                                               (18, 'Mojito', 3.00, 'Cocktails', 'images/mojito.png'),
                                                                               (19, 'Martini', 3.00, 'Cocktails', 'images/martini.png'),
                                                                               (20, 'Old Fashioned', 3.00, 'Cocktails', 'images/old_fashioned.png'),
                                                                               (21, 'Cosmopolitan', 3.00, 'Cocktails', 'images/cosmopolitan.png'),
                                                                               (22, 'Pina Colada', 3.00, 'Cocktails', 'images/pina_colada.png'),
                                                                               (23, 'Bloody Mary', 3.00, 'Cocktails', 'images/bloody_mary.png'),
                                                                               (24, 'Negroni', 3.00, 'Cocktails', 'images/negroni.png'),
                                                                               (25, 'Pale Lager', 3.00, 'Bieres', 'images/pale_lager.png'),
                                                                               (26, 'Pilsner', 3.00, 'Bieres', 'images/pilsner.png'),
                                                                               (27, 'Amber Lager', 3.00, 'Bieres', 'images/amber_lager.png'),
                                                                               (28, 'Dark Lager', 3.00, 'Bieres', 'images/dark_lager.png'),
                                                                               (29, 'Pale Ale', 3.00, 'Bieres', 'images/pale_ale.png'),
                                                                               (30, 'Brown Ale', 3.00, 'Bieres', 'images/brown_ale.png'),
                                                                               (31, 'Hefeweizen', 3.00, 'Bieres', 'images/hefeweizen.png'),
                                                                               (32, 'Witbier', 3.00, 'Bieres', 'images/witbier.png'),
                                                                               (33, 'Vodka', 3.00, 'Alcool fort', 'images/vodka.png'),
                                                                               (34, 'Rhum', 3.00, 'Alcool fort', 'images/rhum.png'),
                                                                               (35, 'Whisky', 3.00, 'Alcool fort', 'images/whisky.png'),
                                                                               (36, 'Gin', 3.00, 'Alcool fort', 'images/gin.png'),
                                                                               (37, 'Tequila', 3.00, 'Alcool fort', 'images/tequila_2.png'),
                                                                               (38, 'Brandy', 3.00, 'Alcool fort', 'images/brandy.png'),
                                                                               (39, 'Absinthe', 3.00, 'Alcool fort', 'images/absinthe.png'),
                                                                               (40, 'Rhum épicé', 3.00, 'Alcool fort', 'images/rhum_epice.png');
