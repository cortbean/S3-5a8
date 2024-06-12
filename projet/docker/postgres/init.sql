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

CREATE TABLE projet.Programme (
                                  Programme VARCHAR(50),
                                  faculte VARCHAR(50) NOT NULL,
                                  PRIMARY KEY(Programme)
);

CREATE TABLE projet.logs (
                             log_id INTEGER,
                             table_name TEXT,
                             operation TEXT,
                             changed_data JSONB,
                             log_time TIMESTAMP,
                             PRIMARY KEY(log_id)
);

CREATE TABLE projet.commande (
                                 id_commande VARCHAR(50),
                                 date_commande TIMESTAMP,
                                 PRIMARY KEY(id_commande)
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
                                    id_commande VARCHAR(50),
                                    Programme VARCHAR(50) NULL,
                                    PRIMARY KEY(cip),
                                    FOREIGN KEY(id_commande) REFERENCES projet.commande(id_commande),
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

CREATE TABLE projet.plusieurs (
                                  id_Produit INTEGER,
                                  id_commande VARCHAR(50),
                                  quantite VARCHAR(50),
                                  PRIMARY KEY(id_Produit, id_commande),
                                  FOREIGN KEY(id_Produit) REFERENCES projet.Produit(id_Produit),
                                  FOREIGN KEY(id_commande) REFERENCES projet.commande(id_commande)
);

ALTER TABLE projet.Utilisateur OWNER TO postgres;


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

INSERT INTO projet.Categorie(id_categorie, description) VALUES
                                                            ('Nourriture', 'Nourriture'),
                                                            ('Shooter', 'Shooter'),
                                                            ('Cocktails', 'Cocktails'),
                                                            ('Bieres', 'Bieres'),
                                                            ('Alcool fort', 'Alcool fort');

INSERT INTO projet.Produit(id_Produit, Nom, Prix, id_categorie, image_url) VALUES
                                                                               (1, 'Pizza vegetarien', 3.00, 'Nourriture', '/static/images/pizza_vegetarien.jpg'),
                                                                               (2, 'Pizza Poulet', 3.00, 'Nourriture', '/static/images/pizza_poulet.jpg'),
                                                                               (3, 'Pizza Pepperoni', 3.00, 'Nourriture', '/static/images/pizza_pepperoni.jpg'),
                                                                               (4, 'Pizza Margherita', 3.00, 'Nourriture', '/static/images/pizza_margherita.jpg'),
                                                                               (5, 'Sandwich au poulet', 3.00, 'Nourriture', '/static/images/sandwich_poulet.jpg'),
                                                                               (6, 'wrap au poulet', 3.00, 'Nourriture', '/static/images/wrap_poulet.jpg'),
                                                                               (7, 'Hot-Dog', 3.00, 'Nourriture', '/static/images/hot_dog.jpg'),
                                                                               (8, 'Pogo', 3.00, 'Nourriture', '/static/images/pogo.jpg'),
                                                                               (9, 'Tequila', 3.00, 'Shooter', '/static/images/tequila.jpg'),
                                                                               (10, 'Jagerbomb', 3.00, 'Shooter', '/static/images/jagerbomb.jpg'),
                                                                               (11, 'B-52', 3.00, 'Shooter', '/static/images/b52.jpg'),
                                                                               (12, 'Kamikaze', 3.00, 'Shooter', '/static/images/kamikaze.jpg'),
                                                                               (13, 'Lemon Drop', 3.00, 'Shooter', '/static/images/lemon_drop.jpg'),
                                                                               (14, 'Irish Car Bomb', 3.00, 'Shooter', '/static/images/irish_car_bomb.jpg'),
                                                                               (15, 'Sambuca', 3.00, 'Shooter', '/static/images/sambuca.jpg'),
                                                                               (16, 'Buttery Nipple', 3.00, 'Shooter', '/static/images/buttery_nipple.jpg'),
                                                                               (17, 'Margarita', 3.00, 'Cocktails', '/static/images/margarita.jpg'),
                                                                               (18, 'Mojito', 3.00, 'Cocktails', '/static/images/mojito.jpg'),
                                                                               (19, 'Martini', 3.00, 'Cocktails', '/static/images/martini.jpg'),
                                                                               (20, 'Old Fashioned', 3.00, 'Cocktails', '/static/images/old_fashioned.jpg'),
                                                                               (21, 'Cosmopolitan', 3.00, 'Cocktails', '/static/images/cosmopolitan.jpg'),
                                                                               (22, 'Pina Colada', 3.00, 'Cocktails', '/static/images/pina_colada.jpg'),
                                                                               (23, 'Bloody Mary', 3.00, 'Cocktails', '/static/images/bloody_mary.jpg'),
                                                                               (24, 'Negroni', 3.00, 'Cocktails', '/static/images/negroni.jpg'),
                                                                               (25, 'Pale Lager', 3.00, 'Bieres', '/static/images/pale_lager.jpg'),
                                                                               (26, 'Pilsner', 3.00, 'Bieres', '/static/images/pilsner.jpg'),
                                                                               (27, 'Amber Lager', 3.00, 'Bieres', '/static/images/amber_lager.jpg'),
                                                                               (28, 'Dark Lager', 3.00, 'Bieres', '/static/images/dark_lager.jpg'),
                                                                               (29, 'Pale Ale', 3.00, 'Bieres', '/static/images/pale_ale.jpg'),
                                                                               (30, 'Brown Ale', 3.00, 'Bieres', '/static/images/brown_ale.jpg'),
                                                                               (31, 'Hefeweizen', 3.00, 'Bieres', '/static/images/hefeweizen.jpg'),
                                                                               (32, 'Witbier', 3.00, 'Bieres', '/static/images/witbier.jpg'),
                                                                               (33, 'Vodka', 3.00, 'Alcool fort', '/static/images/vodka.jpg'),
                                                                               (34, 'Rhum', 3.00, 'Alcool fort', '/static/images/rhum.jpg'),
                                                                               (35, 'Whisky', 3.00, 'Alcool fort', '/static/images/whisky.jpg'),
                                                                               (36, 'Gin', 3.00, 'Alcool fort', '/static/images/gin.jpg'),
                                                                               (37, 'Tequila', 3.00, 'Alcool fort', '/static/images/tequila_2.jpg'),
                                                                               (38, 'Brandy', 3.00, 'Alcool fort', '/static/images/brandy.jpg'),
                                                                               (39, 'Absinthe', 3.00, 'Alcool fort', '/static/images/absinthe.jpg'),
                                                                               (40, 'Rhum épicé', 3.00, 'Alcool fort', '/static/images/rhum_epice.jpg');